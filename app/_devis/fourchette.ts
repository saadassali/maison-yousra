// Fourchette indicative par ligne (fichier 16 §5 et §6.1), en MAD, calculée côté serveur.
// Seuls le minimum et le maximum arrondis sortent d'ici : ni prix d'achat, ni fournisseur,
// ni nombre d'offres.

export type Offre = {
  /** Fournisseur ou conditionneur : sert seulement à regrouper, jamais renvoyé. */
  fournisseur: string;
  typeOffre: "MATIERE" | "PACKAGING";
  palierMinimum: number;
  /** Prix d'achat unitaire, en MAD. */
  prixAchat: number;
  /** Date ISO ; offre ignorée après cette date. */
  valableJusquau?: string;
};

export type Fourchette = { min: number; max: number };

export const MARGE = 1.2;

/** Pour chaque fournisseur, l'offre du palier applicable : le plus haut palier ≤ quantité. */
function offresApplicables(offres: Offre[], type: Offre["typeOffre"], quantite: number, aujourdhui: string): Offre[] {
  const parFournisseur = new Map<string, Offre>();
  for (const o of offres) {
    if (o.typeOffre !== type || o.palierMinimum > quantite) continue;
    if (o.valableJusquau && o.valableJusquau < aujourdhui) continue;
    const actuelle = parFournisseur.get(o.fournisseur);
    if (!actuelle || o.palierMinimum > actuelle.palierMinimum) parFournisseur.set(o.fournisseur, o);
  }
  return [...parFournisseur.values()];
}

/** Arrondi à deux chiffres significatifs : vers le bas pour le minimum, vers le haut pour le maximum. */
export function arrondir(valeur: number, sens: "bas" | "haut"): number {
  if (valeur <= 0) return 0;
  const pas = 10 ** Math.max(0, Math.floor(Math.log10(valeur)) - 1);
  return (sens === "bas" ? Math.floor(valeur / pas) : Math.ceil(valeur / pas)) * pas;
}

/**
 * Prix de vente unitaire = (prix d'achat + frais de lot ÷ quantité) × 1,20, plus le coût du
 * packaging personnalisé tiré de la grille du conditionneur (fichier 16 §5 ; fichier 23 §7.2, W3).
 * Renvoie null si une offre manque (matière ou packaging) : la fourchette est alors masquée.
 */
export function calculerFourchette({
  offres,
  quantite,
  fraisLot,
  aujourdhui,
}: {
  offres: Offre[];
  quantite: number;
  fraisLot: number;
  aujourdhui: string;
}): Fourchette | null {
  if (!(quantite > 0)) return null;
  const matiere = offresApplicables(offres, "MATIERE", quantite, aujourdhui);
  const packaging = offresApplicables(offres, "PACKAGING", quantite, aujourdhui);
  if (matiere.length === 0 || packaging.length === 0) return null;

  const vente = (o: Offre) => (o.prixAchat + fraisLot / quantite) * MARGE;
  const ventes = matiere.map(vente);
  const emballages = packaging.map((o) => o.prixAchat);
  const min = Math.min(...ventes) + Math.min(...emballages);
  const max = Math.max(...ventes) + Math.max(...emballages);
  return { min: arrondir(min, "bas"), max: arrondir(max, "haut") };
}
