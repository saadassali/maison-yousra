import { z } from "zod";
import {
  cooperativeSchema,
  estMarqueur,
  photoSchema,
  produitSchema,
  realisationSchema,
  type Contenu,
  type ContenuBrut,
  type Cooperative,
  type Photo,
  type Produit,
  type Realisation,
} from "./schemas";

// Verrous de publication (prompt 0, règles 3 et 4). Toute violation lève une erreur : comme le
// contenu est validé pendant le build (app/layout.tsx et prebuild), le build échoue.

export class ErreurContenu extends Error {
  constructor(readonly problemes: string[]) {
    super(`Contenu refusé (${problemes.length}) :\n- ${problemes.join("\n- ")}`);
    this.name = "ErreurContenu";
  }
}

export const PREFIXE_EXEMPLE = "EXEMPLE-";
export const estExemple = (id: string) => id.startsWith(PREFIXE_EXEMPLE);

type Options = {
  /** Date du jour, pour l'expiration des certificats. */
  aujourdhui: Date;
  /** En production, les exemples « EXEMPLE- » sont retirés. */
  production: boolean;
};

const jourIso = (date: Date) => date.toISOString().slice(0, 10);

/** Raison pour laquelle la conformité d'un produit ne permet pas de le publier, ou null. */
export function problemeConformite(produit: Produit, aujourdhui: Date): string | null {
  const c = produit.conformite;
  if (estMarqueur(c)) return "conformité non saisie";
  if (produit.categorie === "accessoire") {
    return "un accessoire n'a ni enregistrement DMP ni autorisation ONSSA";
  }
  const attendu = produit.categorie === "cosmetique" ? "DMP" : "ONSSA";
  if (c.type !== attendu) return `conformité ${c.type} pour un produit ${produit.categorie} (attendu : ${attendu})`;
  if (c.dateExpiration < jourIso(aujourdhui)) return `certificat expiré le ${c.dateExpiration}`;
  return null;
}

/** Raison pour laquelle une coopérative ne peut pas être nommée, ou null. */
export function problemeCooperative(coop: Cooperative): string | null {
  if (coop.fournitSiteA) return "elle fournit le site A";
  if (!coop.dateAccordEcrit) return "pas d'accord écrit";
  return null;
}

/** Message lisible ; pour une union (valeur ou marqueur), les raisons de chaque branche. */
function message(issue: z.core.$ZodIssue): string {
  if (issue.code !== "invalid_union" || issue.errors.length === 0) return issue.message;
  const raisons = new Set(issue.errors.flat().map((i) => i.message));
  return [...raisons].join(" ; ");
}

function parser<T extends z.ZodType>(
  nom: string,
  schema: T,
  elements: unknown[],
  problemes: string[],
): z.infer<T>[] {
  const sortie: z.infer<T>[] = [];
  elements.forEach((element, i) => {
    const resultat = schema.safeParse(element);
    if (resultat.success) {
      sortie.push(resultat.data);
    } else {
      const id = (element as { id?: unknown })?.id ?? `n° ${i + 1}`;
      for (const issue of resultat.error.issues) {
        problemes.push(`${nom} ${String(id)} : ${issue.path.join(".") || "(racine)"} — ${message(issue)}`);
      }
    }
  });
  return sortie;
}

function verifierIdsUniques(nom: string, elements: { id: string }[], problemes: string[]) {
  const vus = new Set<string>();
  for (const { id } of elements) {
    if (vus.has(id)) problemes.push(`${nom} ${id} : identifiant en double`);
    vus.add(id);
  }
}

/** Valide tout le contenu et applique les verrous. Lève ErreurContenu au premier lot de problèmes. */
export function validerContenu(brut: ContenuBrut, { aujourdhui, production }: Options): Contenu {
  const problemes: string[] = [];
  const garder = <T extends { id: string }>(liste: T[]) =>
    production ? liste.filter((e) => !estExemple(e.id)) : liste;

  const produits = garder(parser("produit", produitSchema, brut.produits, problemes));
  const cooperatives = garder(parser("coopérative", cooperativeSchema, brut.cooperatives, problemes));
  const realisations = garder(parser("réalisation", realisationSchema, brut.realisations, problemes));
  const photos = garder(parser("photo", photoSchema, brut.photos, problemes));

  verifierIdsUniques("produit", produits, problemes);
  verifierIdsUniques("coopérative", cooperatives, problemes);
  verifierIdsUniques("réalisation", realisations, problemes);
  verifierIdsUniques("photo", photos, problemes);

  const produitParId = new Map(produits.map((p) => [p.id, p]));
  const coopParId = new Map(cooperatives.map((c) => [c.id, c]));
  const photoParId = new Map(photos.map((p) => [p.id, p]));

  // Règle 4 : un produit publié a une conformité remplie, du bon type, non expirée.
  for (const produit of produits) {
    if (produit.statut === "publie") {
      const probleme = problemeConformite(produit, aujourdhui);
      if (probleme) problemes.push(`produit ${produit.id} publié sans conformité valable : ${probleme}`);
      // Un produit publié n'affiche aucun marqueur : tout doit être renseigné.
      for (const [champ, valeur] of Object.entries(produit)) {
        if (estMarqueur(valeur)) problemes.push(`produit ${produit.id} publié avec ${champ} à compléter`);
      }
    }
    if (produit.cooperative && !coopParId.has(produit.cooperative)) {
      problemes.push(`produit ${produit.id} : coopérative inconnue ${produit.cooperative}`);
    }
  }

  // Règle 3 : une coopérative co-brande seulement ses propres produits ; si l'un d'eux est
  // publié, elle est nommée sur le site, donc il lui faut un accord et ne pas fournir le site A.
  for (const coop of cooperatives) {
    for (const idProduit of coop.produitsCoBrandes) {
      const produit = produitParId.get(idProduit);
      if (!produit) {
        problemes.push(`coopérative ${coop.id} : produit co-brandé inconnu ${idProduit}`);
        continue;
      }
      if (produit.cooperative !== coop.id) {
        problemes.push(`coopérative ${coop.id} : le produit ${idProduit} ne vient pas d'elle`);
      }
      const probleme = problemeCooperative(coop);
      if (produit.statut === "publie" && probleme) {
        problemes.push(`coopérative ${coop.id} nommée par le produit publié ${idProduit} : ${probleme}`);
      }
    }
  }

  // Règle 3 : une personne photographiée seulement avec son accord écrit, et citée.
  for (const photo of photos) {
    if (photo.personnes.length > 0 && !photo.accordEcrit) {
      problemes.push(`photo ${photo.id} : personne(s) sans accord écrit`);
    }
  }

  for (const realisation of realisations) {
    for (const id of realisation.produits) {
      if (!produitParId.has(id)) problemes.push(`réalisation ${realisation.id} : produit inconnu ${id}`);
    }
    for (const id of realisation.photos) {
      if (!photoParId.has(id)) problemes.push(`réalisation ${realisation.id} : photo inconnue ${id}`);
    }
  }

  if (problemes.length) throw new ErreurContenu(problemes);
  return { produits, cooperatives, realisations, photos };
}

// --- Accès pour l'affichage : les pages ne lisent le contenu que par ces fonctions. ---

export type ProduitAffiche = Produit & { apercu: boolean };

/** Produits à afficher : publiés ; en aperçu (développement seulement), aussi les brouillons. */
export function produitsAffichables(
  contenu: Contenu,
  { apercu, aujourdhui }: { apercu: boolean; aujourdhui: Date },
): ProduitAffiche[] {
  return contenu.produits
    .filter((p) => apercu || (p.statut === "publie" && !problemeConformite(p, aujourdhui)))
    .map((p) => ({ ...p, apercu: p.statut !== "publie" }));
}

/** Coopérative à nommer sur une page. Lève une erreur (donc fait échouer le build) si c'est interdit. */
export function cooperativePourAffichage(contenu: Contenu, id: string): Cooperative {
  const coop = contenu.cooperatives.find((c) => c.id === id);
  if (!coop) throw new ErreurContenu([`coopérative inconnue : ${id}`]);
  const probleme = problemeCooperative(coop);
  if (probleme) throw new ErreurContenu([`coopérative ${id} affichée : ${probleme}`]);
  return coop;
}

/** Coopérative à citer pour un produit : seulement si le produit est co-brandé avec elle. */
export function cooperativeDuProduit(contenu: Contenu, produit: Produit): Cooperative | null {
  if (!produit.cooperative) return null;
  const coop = contenu.cooperatives.find((c) => c.id === produit.cooperative);
  if (!coop || !coop.produitsCoBrandes.includes(produit.id)) return null;
  return cooperativePourAffichage(contenu, coop.id);
}

/** Photo à afficher, avec les personnes à citer. Lève une erreur si une personne n'a pas donné son accord. */
export function photoPourAffichage(contenu: Contenu, id: string): Photo {
  const photo = contenu.photos.find((p) => p.id === id);
  if (!photo) throw new ErreurContenu([`photo inconnue : ${id}`]);
  if (photo.personnes.length > 0 && !photo.accordEcrit) {
    throw new ErreurContenu([`photo ${id} affichée : personne(s) sans accord écrit`]);
  }
  return photo;
}

export type RealisationAffichee = {
  id: string;
  /** Nom du client (avec accord) ou description anonyme. */
  titre: string;
  anonyme: boolean;
  segment: Realisation["segment"];
  produits: Produit[];
  photos: Photo[];
};

/** Réalisation à afficher : nom du client avec son accord, sinon anonyme, sinon rien (null). */
export function realisationPourAffichage(
  contenu: Contenu,
  realisation: Realisation,
  produitsAffiches: Produit[],
): RealisationAffichee | null {
  const anonyme = !realisation.dateAccordClient;
  const titre = anonyme ? realisation.descriptionAnonyme : realisation.client;
  if (!titre) return null;
  return {
    id: realisation.id,
    titre,
    anonyme,
    segment: realisation.segment,
    // Seuls les produits affichables apparaissent dans une réalisation.
    produits: produitsAffiches.filter((p) => realisation.produits.includes(p.id)),
    photos: realisation.photos.map((id) => photoPourAffichage(contenu, id)),
  };
}
