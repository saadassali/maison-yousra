import { z } from "zod";

// Schémas du contenu du site B, validés au build (prompt 2).
// Une valeur inconnue s'écrit « [À COMPLÉTER : …] » : jamais de valeur inventée.

export const MARQUEUR = /^\[À COMPLÉTER : .+\]$/;
export const aCompleter = z.string().regex(MARQUEUR, "marqueur attendu : [À COMPLÉTER : …]");

/** Une valeur connue, ou un marqueur [À COMPLÉTER : …]. */
const ouACompleter = <T extends z.ZodType>(schema: T) => z.union([schema, aCompleter]);

const identifiant = z
  .string()
  .regex(/^(EXEMPLE-)?[a-z0-9]+(-[a-z0-9]+)*$/, "identifiant en minuscules et tirets");
const texte = z
  .string()
  .trim()
  .min(1)
  .refine((t) => MARQUEUR.test(t) || !/^\[.*compl[ée]ter/i.test(t), "marqueur mal formé : [À COMPLÉTER : …]");
const dateIso = z.iso.date();

export const SEGMENTS = ["hotels", "spas", "cadeaux"] as const;
export const segment = z.enum(SEGMENTS);

export const FORMATS = {
  flacon: "Flacon",
  "recharge-5l": "Recharge de 5 L",
  "grand-format-pro": "Grand format professionnel (1 à 5 kg)",
  pot: "Pot",
  boite: "Boîte",
  bouteille: "Bouteille",
} as const;
export const format = z.enum(Object.keys(FORMATS) as [keyof typeof FORMATS]);

export const PERSONNALISATIONS = {
  etiquette: "Étiquette",
  boite: "Boîte",
  couleurs: "Couleurs",
  langue: "Langue de l’étiquette",
  "texte-libre": "Texte libre (prénoms, date, message)",
} as const;
export const personnalisation = z.enum(
  Object.keys(PERSONNALISATIONS) as [keyof typeof PERSONNALISATIONS],
);

/**
 * Cosmétique : enregistrement au ministère de la Santé (DMP).
 * Alimentaire : conditionneur autorisé par l'ONSSA.
 * Accessoire (gant de kessa) : ni l'un ni l'autre, donc jamais publiable en l'état.
 */
export const CATEGORIES = ["cosmetique", "alimentaire", "accessoire"] as const;

export const conformite = z.object({
  type: z.enum(["DMP", "ONSSA"]),
  numero: texte,
  dateExpiration: dateIso,
});

export const produitSchema = z.object({
  id: identifiant,
  nom: texte,
  categorie: z.enum(CATEGORIES),
  usage: ouACompleter(texte),
  segments: z.array(segment).min(1),
  formats: ouACompleter(z.array(format).min(1)),
  /** Telle qu'elle figure sur l'étiquette. */
  composition: ouACompleter(texte),
  conformite: ouACompleter(conformite),
  personnalisations: ouACompleter(z.array(personnalisation).min(1)),
  minimumCommande: ouACompleter(texte),
  delai: ouACompleter(texte),
  /** Référence interne facultative : n'est affichée que pour un produit co-brandé autorisé. */
  cooperative: identifiant.optional(),
  /** « publie » n'est accepté que si la conformité est remplie et non expirée. */
  statut: z.enum(["brouillon", "publie"]),
});

export const cooperativeSchema = z.object({
  id: identifiant,
  nom: texte,
  region: ouACompleter(texte),
  nombreMembres: ouACompleter(z.number().int().positive()),
  histoire: ouACompleter(texte),
  /** Date de l'accord écrit pour être nommée. null : pas d'accord, jamais affichée. */
  dateAccordEcrit: dateIso.nullable(),
  produitsCoBrandes: z.array(identifiant),
  /** Vrai si elle fournit un ingrédient vendu sur le site A : jamais affichée. */
  fournitSiteA: z.boolean(),
});

export const realisationSchema = z.object({
  id: identifiant,
  /** Nom réel du client : affiché seulement avec son accord écrit. */
  client: texte,
  /** Affichage sans accord (« un riad de la médina de Fès ») ; null : rien n'est affiché. */
  descriptionAnonyme: texte.nullable(),
  segment,
  produits: z.array(identifiant).min(1),
  photos: z.array(identifiant),
  dateAccordClient: dateIso.nullable(),
});

export const photoSchema = z.object({
  id: identifiant,
  /** Chemin sous public/, commençant par « / ». */
  fichier: z.string().regex(/^\/[^\s]+\.(jpg|jpeg|png|webp|avif)$/),
  legende: texte,
  /** Texte alternatif (accessibilité). */
  alt: texte,
  /** Dimensions en pixels, pour réserver la place de l'image. */
  largeur: z.number().int().positive(),
  hauteur: z.number().int().positive(),
  /** Noms des personnes présentes, pour les citer. Vide : aucune personne sur la photo. */
  personnes: z.array(texte),
  accordEcrit: z.boolean(),
});

export type Produit = z.infer<typeof produitSchema>;
export type Cooperative = z.infer<typeof cooperativeSchema>;
export type Realisation = z.infer<typeof realisationSchema>;
export type Photo = z.infer<typeof photoSchema>;
export type Conformite = z.infer<typeof conformite>;
export type Segment = z.infer<typeof segment>;

export type ContenuBrut = {
  produits: z.input<typeof produitSchema>[];
  cooperatives: z.input<typeof cooperativeSchema>[];
  realisations: z.input<typeof realisationSchema>[];
  photos: z.input<typeof photoSchema>[];
};

export type Contenu = {
  produits: Produit[];
  cooperatives: Cooperative[];
  realisations: Realisation[];
  photos: Photo[];
};

export function estMarqueur(valeur: unknown): valeur is string {
  return typeof valeur === "string" && MARQUEUR.test(valeur);
}
