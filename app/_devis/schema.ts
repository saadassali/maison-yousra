import { z } from "zod";
import { FORMATS } from "../_content/schemas";
import { SEGMENTS_DEVIS } from "../_site/config";

// Schéma du formulaire de devis (prompt 4), partagé par le navigateur et le serveur : la même
// validation des deux côtés. Le serveur ajoute ce que le navigateur ne peut pas vérifier
// (produits publiés, logo).
// Provisoire dans app/ : à remplacer par lib/forms/ quand il aura été recopié du site A.

export const PRODUIT_INCONNU = "inconnu";

export const LANGUES_ETIQUETTE = {
  fr: "Français",
  en: "Anglais",
  ar: "Arabe",
  es: "Espagnol",
  de: "Allemand",
} as const;

/** Sources acceptées par paramètre d'URL (?source=…) ; SEO par défaut. */
export const SOURCES = ["SEO", "QR_CODE", "ETRADE_MA", "SALON", "PROSPECTION"] as const;

export const LOGO_TAILLE_MAX = 5 * 1024 * 1024;
export const LOGO_TYPES = ["image/png", "image/svg+xml"] as const;
export const LIGNES_MAX = 20;

const texte = (max: number, message: string) =>
  z.string().trim().min(1, message).max(max, `${max} caractères au plus.`);
const facultatif = (max: number) => z.string().trim().max(max, `${max} caractères au plus.`).optional();
const entierFacultatif = (max: number) =>
  z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? Number(v) : undefined))
    .pipe(z.number().int("Nombre entier attendu.").min(1, "1 au minimum.").max(max, `${max} au plus.`).optional());

const aujourdhuiIso = () => new Date().toISOString().slice(0, 10);
const dateFuture = (message: string) =>
  z.iso
    .date(message)
    .refine((d) => d >= aujourdhuiIso(), "Choisissez une date à venir.");

export const ligneSchema = z.object({
  produit: z.string().min(1, "Choisissez un produit, ou « Je ne sais pas encore »."),
  format: z
    .union([z.enum(Object.keys(FORMATS) as [keyof typeof FORMATS]), z.literal("")])
    .optional(),
  quantite: z
    .string()
    .trim()
    .min(1, "Indiquez une quantité.")
    .transform(Number)
    .pipe(z.number().int("Nombre entier attendu.").min(1, "1 au minimum.").max(1_000_000, "Quantité trop grande.")),
});

export const demandeSchema = z
  .object({
    idEnvoi: z.uuid(),
    segment: z.enum(Object.keys(SEGMENTS_DEVIS) as [keyof typeof SEGMENTS_DEVIS], "Choisissez ce que vous êtes."),
    etablissement: texte(200, "Indiquez le nom de l’établissement ou de la société."),
    ville: texte(100, "Indiquez la ville."),
    nom: texte(120, "Indiquez votre nom."),
    fonction: texte(120, "Indiquez votre fonction."),
    email: z.string().trim().pipe(z.email("Adresse e-mail invalide.")),
    telephone: z
      .string()
      .trim()
      .regex(/^\+?[0-9 ().-]{6,25}$/, "Numéro de téléphone invalide."),
    nombreChambres: entierFacultatif(5000),
    dateEvenement: z.string().trim().optional(),
    nombreInvites: entierFacultatif(5000),
    lignes: z.array(ligneSchema).min(1, "Ajoutez au moins un produit.").max(LIGNES_MAX),
    couleurs: facultatif(300),
    langues: z.array(z.enum(Object.keys(LANGUES_ETIQUETTE) as [keyof typeof LANGUES_ETIQUETTE])),
    texteAImprimer: facultatif(500),
    boiteCadeau: z.boolean(),
    dateLivraison: dateFuture("Indiquez la date de livraison souhaitée."),
    message: facultatif(3000),
    consentement: z.literal(true, "Cochez la case pour envoyer votre demande."),
    // Champs cachés
    pageOrigine: z.string().max(300).regex(/^(\/[^\s]*)?$/).optional(),
    source: z.enum(SOURCES).catch("SEO"),
    qrCodeId: z.string().max(100).regex(/^[A-Za-z0-9_-]*$/).optional(),
    utm: z.partialRecord(z.enum(["source", "medium", "campaign", "term", "content"]), z.string().max(200)),
  })
  .superRefine((d, ctx) => {
    // Mariage : date de l'événement et nombre d'invités.
    if (d.segment === "mariage") {
      if (!d.dateEvenement || !/^\d{4}-\d{2}-\d{2}$/.test(d.dateEvenement)) {
        ctx.addIssue({ code: "custom", path: ["dateEvenement"], message: "Indiquez la date du mariage." });
      } else if (d.dateEvenement < aujourdhuiIso()) {
        ctx.addIssue({ code: "custom", path: ["dateEvenement"], message: "Choisissez une date à venir." });
      }
      if (!d.nombreInvites) {
        ctx.addIssue({ code: "custom", path: ["nombreInvites"], message: "Indiquez le nombre d’invités." });
      }
    }
  });

export type Demande = z.output<typeof demandeSchema>;
export type Erreurs = Record<string, string>;

/** Construit l'objet à valider depuis le FormData du formulaire (noms de champs du formulaire). */
export function lireFormulaire(fd: FormData): unknown {
  const texteDe = (nom: string) => {
    const v = fd.get(nom);
    return typeof v === "string" ? v : undefined;
  };
  const produits = fd.getAll("ligne-produit");
  const formats = fd.getAll("ligne-format");
  const quantites = fd.getAll("ligne-quantite");
  const utm: Record<string, string> = {};
  for (const cle of ["source", "medium", "campaign", "term", "content"]) {
    const v = texteDe(`utm_${cle}`);
    if (v) utm[cle] = v;
  }
  return {
    idEnvoi: texteDe("idEnvoi"),
    segment: texteDe("segment"),
    etablissement: texteDe("etablissement") ?? "",
    ville: texteDe("ville") ?? "",
    nom: texteDe("nom") ?? "",
    fonction: texteDe("fonction") ?? "",
    email: texteDe("email") ?? "",
    telephone: texteDe("telephone") ?? "",
    nombreChambres: texteDe("nombreChambres"),
    dateEvenement: texteDe("dateEvenement"),
    nombreInvites: texteDe("nombreInvites"),
    lignes: produits.map((p, i) => ({
      produit: typeof p === "string" ? p : "",
      format: typeof formats[i] === "string" ? formats[i] : "",
      quantite: typeof quantites[i] === "string" ? quantites[i] : "",
    })),
    couleurs: texteDe("couleurs"),
    langues: fd.getAll("langues").filter((v): v is string => typeof v === "string"),
    texteAImprimer: texteDe("texteAImprimer"),
    boiteCadeau: fd.get("boiteCadeau") === "oui",
    dateLivraison: texteDe("dateLivraison") ?? "",
    message: texteDe("message"),
    consentement: fd.get("consentement") === "oui",
    pageOrigine: texteDe("pageOrigine") || undefined,
    source: texteDe("source"),
    qrCodeId: texteDe("qrCodeId") || undefined,
    utm,
  };
}

/** Valide et renvoie soit la demande, soit les erreurs par champ (« lignes.0.quantite »). */
export function validerDemande(brut: unknown): { ok: true; demande: Demande } | { ok: false; erreurs: Erreurs } {
  const r = demandeSchema.safeParse(brut);
  if (r.success) return { ok: true, demande: r.data };
  const erreurs: Erreurs = {};
  for (const issue of r.error.issues) {
    const cle = issue.path.join(".") || "formulaire";
    erreurs[cle] ??= issue.message;
  }
  return { ok: false, erreurs };
}
