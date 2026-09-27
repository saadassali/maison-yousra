import type { Produit } from "../_content/schemas";
import { LANGUES_ETIQUETTE, PRODUIT_INCONNU, type Demande } from "./schema";

// Charge utile du webhook W1 pour le site B (fichier 23 §4.3, §4.4 et §9). Format documenté
// dans WEBHOOKS.md. Fonction pure : testée sans réseau.

export const SEGMENT_TWENTY = {
  hotel: "HOTEL_RIAD",
  spa: "SPA_HAMMAM",
  entreprise: "ENTREPRISE_CADEAUX",
  mariage: "MARIAGE",
  evenement: "EVENEMENT",
  autre: "AUTRE",
} as const;

/** Formats du site vers la sélection `format` de Twenty. BOUTEILLE n'existe pas encore dans Twenty. */
export const FORMAT_TWENTY = {
  flacon: "FLACON",
  "recharge-5l": "RECHARGE_5L",
  "grand-format-pro": "GRAND_FORMAT_PRO",
  pot: "POT",
  boite: "BOITE",
  bouteille: "BOUTEILLE",
} as const;

export type ChargeW1 = ReturnType<typeof construireChargeW1>;

/** Texte de personnalisation, repris sur chaque ligne (quoteRequestLine.personnalisation). */
export function textePersonnalisation(d: Demande, logo: boolean): string {
  const langues = d.langues.map((l) => LANGUES_ETIQUETTE[l]).join(", ");
  return [
    `Logo : ${logo ? "déposé (lienLogo)" : "non"}`,
    `Couleurs : ${d.couleurs || "—"}`,
    `Langue(s) de l’étiquette : ${langues || "—"}`,
    `Texte à imprimer : ${d.texteAImprimer || "—"}`,
    `Boîte cadeau : ${d.boiteCadeau ? "oui" : "non"}`,
  ].join("\n");
}

export function construireChargeW1({
  demande: d,
  produits,
  lienLogo,
  lienMaquette,
  fourchetteAffichee,
  maintenant,
}: {
  demande: Demande;
  produits: Produit[];
  lienLogo: string | null;
  lienMaquette: string | null;
  fourchetteAffichee: string | null;
  maintenant: Date;
}) {
  const personnalisation = textePersonnalisation(d, lienLogo !== null);
  const utm = new URLSearchParams(Object.entries(d.utm).map(([k, v]) => [`utm_${k}`, v])).toString();
  return {
    idEnvoi: d.idEnvoi,
    site: "SITE_B" as const,
    segment: SEGMENT_TWENTY[d.segment],
    societe: { nom: d.etablissement, ville: d.ville },
    contact: { nom: d.nom, fonction: d.fonction, email: d.email, telephone: d.telephone },
    nombreChambres: d.segment === "hotel" ? (d.nombreChambres ?? null) : null,
    dateEvenement: d.segment === "mariage" ? (d.dateEvenement ?? null) : null,
    nombreInvites: d.segment === "mariage" ? (d.nombreInvites ?? null) : null,
    villeLivraison: d.ville,
    delaiSouhaite: d.dateLivraison,
    lignes: d.lignes.map((l) => {
      const produit = l.produit === PRODUIT_INCONNU ? undefined : produits.find((p) => p.id === l.produit);
      return {
        // Vide si « je ne sais pas encore » : W1 envoie alors la demande en A_VERIFIER.
        produit: produit?.id ?? null,
        produitNom: produit?.nom ?? null,
        produitTwentyId: produit?.twentyId ?? null,
        quantite: l.quantite,
        unite: "UNITE" as const,
        format: l.format ? FORMAT_TWENTY[l.format] : null,
        personnalisation,
      };
    }),
    lienLogo,
    lienMaquette,
    demandeLibre: d.message || null,
    fourchetteAffichee,
    pageOrigine: d.pageOrigine ?? null,
    langue: "fr" as const,
    source: d.source,
    qrCodeId: d.qrCodeId ?? null,
    utm: utm || null,
    consentementLe: maintenant.toISOString(),
  };
}
