// Configuration propre au site B (Maison Yousra). Rien ici ne vient du site A.

export const BRAND = "Maison Yousra";

/** Langue par défaut, servie à la racine (x-default). L'anglais viendra sous /en/ en P2. */
export const DEFAULT_LOCALE = "fr";

/** Raison sociale : n'apparaît que dans les mentions légales et le lien de pied de page. */
export const COMPANY_NAME = "[À COMPLÉTER : raison sociale de la SARL]";

export type RouteKey =
  | "accueil"
  | "hotelsRiads"
  | "spasHammams"
  | "cadeaux"
  | "personnalisation"
  | "devis"
  | "mentionsLegales"
  | "confidentialite";

type Route = {
  /** Chemin avec slash final. */
  path: string;
  /** Libellé court (menu, fil d'Ariane). */
  label: string;
  /** Présente dans le sitemap et indexable. */
  indexable: boolean;
};

/** Toutes les routes P1, en un seul endroit. */
export const ROUTES: Record<RouteKey, Route> = {
  accueil: { path: "/", label: "Accueil", indexable: true },
  hotelsRiads: { path: "/hotels-riads/", label: "Hôtels & riads", indexable: true },
  spasHammams: { path: "/spas-hammams/", label: "Spas & hammams", indexable: true },
  cadeaux: { path: "/cadeaux/", label: "Cadeaux", indexable: true },
  personnalisation: { path: "/personnalisation/", label: "Personnalisation", indexable: true },
  devis: { path: "/devis/", label: "Devis", indexable: true },
  mentionsLegales: { path: "/mentions-legales/", label: "Mentions légales", indexable: true },
  confidentialite: { path: "/confidentialite/", label: "Confidentialité", indexable: true },
};

/** Menu principal (fichier 14 §7), limité aux pages P1. « Marque blanche » viendra en P2. */
export const MAIN_NAV: RouteKey[] = [
  "hotelsRiads",
  "spasHammams",
  "cadeaux",
  "personnalisation",
  "devis",
];

export const FOOTER_NAV: RouteKey[] = ["mentionsLegales", "confidentialite"];
