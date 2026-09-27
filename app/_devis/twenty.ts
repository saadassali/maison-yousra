import "server-only";
import { z } from "zod";
import { configDevis } from "./config";
import type { Offre } from "./fourchette";

// Lecture des offres fournisseur dans Twenty, pour la fourchette (fichier 23 §6, rôle « Sites » :
// lecture seule des offres de statut VALIDE). Provisoire : à remplacer par lib/twenty/ quand il
// aura été recopié du site A. Non éprouvé sur un espace Twenty réel : noms de champs d'après le
// fichier 23 §4.2. Toute erreur renvoie une liste vide, et la fourchette est masquée.

const montant = z.object({ amountMicros: z.number().nullable(), currencyCode: z.string().nullable() });

const offreTwenty = z.object({
  supplierId: z.string().nullable(),
  typeOffre: z.enum(["MATIERE", "PACKAGING"]).nullable(),
  palierMinimum: z.number().nullable(),
  prixAchat: montant.nullable(),
  valableJusquau: z.string().nullable().optional(),
  statut: z.string().nullable(),
});

const reponse = z.object({ data: z.object({ supplierOffers: z.array(offreTwenty) }) });

export async function lireOffresValides(produitTwentyId: string): Promise<Offre[]> {
  const { url, cle } = configDevis.twenty();
  if (!url || !cle) return [];
  const filtre = `and(productId[eq]:"${produitTwentyId}",statut[eq]:"VALIDE")`;
  try {
    const r = await fetch(`${url.replace(/\/$/, "")}/rest/supplierOffers?limit=100&filter=${encodeURIComponent(filtre)}`, {
      headers: { authorization: `Bearer ${cle}` },
      signal: AbortSignal.timeout(4000),
      cache: "no-store",
    });
    if (!r.ok) {
      console.error(`[devis] Twenty : lecture des offres refusée (${r.status}).`);
      return [];
    }
    const lu = reponse.safeParse(await r.json());
    if (!lu.success) {
      console.error("[devis] Twenty : réponse des offres inattendue.");
      return [];
    }
    return lu.data.data.supplierOffers.flatMap((o) =>
      o.statut === "VALIDE" &&
      o.supplierId &&
      o.typeOffre &&
      o.palierMinimum !== null &&
      o.prixAchat?.amountMicros != null &&
      o.prixAchat.currencyCode === "MAD"
        ? [
            {
              fournisseur: o.supplierId,
              typeOffre: o.typeOffre,
              palierMinimum: o.palierMinimum,
              prixAchat: o.prixAchat.amountMicros / 1_000_000,
              valableJusquau: o.valableJusquau?.slice(0, 10) ?? undefined,
            },
          ]
        : [],
    );
  } catch {
    console.error("[devis] Twenty injoignable pour la fourchette.");
    return [];
  }
}
