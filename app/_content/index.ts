import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cooperatives } from "../../content/cooperatives";
import { photos } from "../../content/photos";
import { produits } from "../../content/produits";
import { realisations } from "../../content/realisations";
import type { Contenu, ContenuBrut } from "./schemas";
import { produitsAffichables, validerContenu, type ProduitAffiche } from "./verrous";

// Point d'entrée du contenu pour les pages. Le contenu est validé une fois par processus.

const production = process.env.NODE_ENV === "production";

const VIDE: ContenuBrut = { produits: [], cooperatives: [], realisations: [], photos: [] };

/**
 * Exemples fictifs « EXEMPLE- » : lus sur le disque, hors production seulement, pour qu'ils ne
 * soient jamais inclus dans le build (scripts/check-build.mjs le vérifie). Validés comme le reste.
 */
function exemples(): ContenuBrut {
  if (production) return VIDE;
  const brut: unknown = JSON.parse(readFileSync(join(process.cwd(), "content/exemples.json"), "utf8"));
  return brut as ContenuBrut;
}

let cache: Contenu | undefined;

export function contenu(): Contenu {
  if (cache) return cache;
  const ex = exemples();
  cache = validerContenu(
    {
      produits: [...produits, ...ex.produits],
      cooperatives: [...cooperatives, ...ex.cooperatives],
      realisations: [...realisations, ...ex.realisations],
      photos: [...photos, ...ex.photos],
    },
    { aujourdhui: new Date(), production },
  );
  return cache;
}

/** Mode aperçu : brouillons visibles, en développement seulement (CONTENT_PREVIEW=1). */
export function apercuActif(): boolean {
  return process.env.NODE_ENV === "development" && process.env.CONTENT_PREVIEW === "1";
}

export function produitsPublies(): ProduitAffiche[] {
  return produitsAffichables(contenu(), { apercu: apercuActif(), aujourdhui: new Date() });
}

export {
  cooperativeDuProduit,
  cooperativePourAffichage,
  photoPourAffichage,
  realisationPourAffichage,
} from "./verrous";
