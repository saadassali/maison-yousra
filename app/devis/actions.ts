"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { produitsPublies } from "../_content";
import { configDevis } from "../_devis/config";
import { calculerFourchette, type Fourchette } from "../_devis/fourchette";
import { cheminFichier, creerJeton } from "../_devis/liens";
import { deposerLogo, LogoRefuse } from "../_devis/logo";
import { PRODUIT_INCONNU, lireFormulaire, validerDemande, type Demande, type Erreurs } from "../_devis/schema";
import { transmettreDemande } from "../_devis/envoi";
import { verifierTurnstile } from "../_devis/turnstile";
import { lireOffresValides } from "../_devis/twenty";
import { construireChargeW1 } from "../_devis/w1";
import { FORMATS } from "../_content/schemas";
import { siteUrl } from "../_site/env";

export type EtatDevis = { erreurs: Erreurs; message?: string } | null;

export type Confirmation = {
  reference: string;
  provisoire: boolean;
  lignes: { libelle: string; fourchette: Fourchette | null }[];
  logo: boolean;
};

/** Envois déjà traités (double clic, renvoi) : même confirmation, pas de seconde demande. */
const envoisTraites = new Map<string, { url: string; expire: number }>();
const DUREE_ENVOI_MS = 60 * 60 * 1000;
/** Envois en cours de traitement : un second envoi simultané du même identifiant attend. */
const envoisEnCours = new Set<string>();

function dejaTraite(idEnvoi: unknown): string | null {
  const maintenant = Date.now();
  for (const [id, { expire }] of envoisTraites) if (expire < maintenant) envoisTraites.delete(id);
  return typeof idEnvoi === "string" ? (envoisTraites.get(idEnvoi)?.url ?? null) : null;
}

export async function envoyerDemande(_etat: EtatDevis, fd: FormData): Promise<EtatDevis> {
  // Champ piège rempli : un robot. On lui montre une confirmation sans rien envoyer.
  if (typeof fd.get("contact_b") === "string" && fd.get("contact_b") !== "") redirect("/devis/envoye/");

  const brut = lireFormulaire(fd);
  const idEnvoi = (brut as { idEnvoi?: unknown }).idEnvoi;
  const precedent = dejaTraite(idEnvoi);
  if (precedent) redirect(precedent);

  const lu = validerDemande(brut);
  if (!lu.ok) return { erreurs: lu.erreurs, message: "Certains champs sont à corriger." };
  const demande = lu.demande;
  if (envoisEnCours.has(demande.idEnvoi)) {
    return { erreurs: {}, message: "Votre demande est déjà en cours d’envoi. Patientez quelques secondes." };
  }
  envoisEnCours.add(demande.idEnvoi);
  try {
    return await traiter(demande, fd);
  } finally {
    envoisEnCours.delete(demande.idEnvoi);
  }
}

async function traiter(demande: Demande, fd: FormData): Promise<EtatDevis> {
  // Ce que seul le serveur sait vérifier : produits publiés et formats disponibles.
  const produits = produitsPublies();
  const erreurs: Erreurs = {};
  demande.lignes.forEach((ligne, i) => {
    if (ligne.produit === PRODUIT_INCONNU) return;
    const produit = produits.find((p) => p.id === ligne.produit);
    if (!produit) erreurs[`lignes.${i}.produit`] = "Ce produit n’est pas disponible.";
    else if (ligne.format && (!Array.isArray(produit.formats) || !produit.formats.includes(ligne.format))) {
      erreurs[`lignes.${i}.format`] = "Ce format n’existe pas pour ce produit.";
    }
  });
  if (Object.keys(erreurs).length) return { erreurs, message: "Certains champs sont à corriger." };

  const entetes = await headers();
  const ip = entetes.get("cf-connecting-ip") ?? entetes.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const jetonTurnstile = fd.get("cf-turnstile-response");
  if (!(await verifierTurnstile(typeof jetonTurnstile === "string" ? jetonTurnstile : null, ip))) {
    return { erreurs: { turnstile: "La vérification anti-robot a échoué. Réessayez." }, message: "La vérification anti-robot a échoué." };
  }

  let lienLogo: string | null = null;
  const logo = fd.get("logo");
  if (logo instanceof File && logo.size > 0) {
    try {
      const depose = await deposerLogo(logo);
      lienLogo = `${siteUrl()}${cheminFichier(depose.cle)}`;
    } catch (e) {
      if (e instanceof LogoRefuse) return { erreurs: { logo: e.message }, message: "Le logo n’a pas pu être accepté." };
      console.error(`[devis] Dépôt du logo en échec (envoi ${demande.idEnvoi}).`);
      return { erreurs: { logo: "Le logo n’a pas pu être enregistré. Réessayez, ou envoyez la demande sans logo." } };
    }
  }

  // Fourchette indicative, ligne par ligne ; masquée si une offre ou les frais de lot manquent.
  const fraisLot = configDevis.fraisLotMad();
  const aujourdhui = new Date().toISOString().slice(0, 10);
  const lignes: Confirmation["lignes"] = await Promise.all(
    demande.lignes.map(async (ligne) => {
      const produit = produits.find((p) => p.id === ligne.produit);
      const format = ligne.format ? FORMATS[ligne.format].toLowerCase() : null;
      const libelle = `${produit?.nom ?? "Produit à préciser"}${format ? `, ${format}` : ""} × ${ligne.quantite}`;
      if (!produit?.twentyId || fraisLot === undefined) return { libelle, fourchette: null };
      const offres = await lireOffresValides(produit.twentyId);
      return { libelle, fourchette: calculerFourchette({ offres, quantite: ligne.quantite, fraisLot, aujourdhui }) };
    }),
  );
  const fourchetteAffichee =
    lignes
      .filter((l) => l.fourchette)
      .map((l) => `${l.libelle} : ${l.fourchette?.min}–${l.fourchette?.max} MAD l’unité`)
      .join(" ; ") || null;

  const charge = construireChargeW1({
    demande,
    produits,
    lienLogo,
    lienMaquette: null, // prompt 5
    fourchetteAffichee,
    maintenant: new Date(),
  });
  const resultat = await transmettreDemande(charge);
  if (resultat.voie === "echec") {
    const adresse = configDevis.expediteur();
    return {
      erreurs: {},
      message: `Votre demande n’a pas pu être envoyée. Réessayez dans quelques minutes${adresse ? `, ou écrivez à ${adresse}` : ""}.`,
    };
  }

  const reference = resultat.voie === "webhook" && resultat.reference ? resultat.reference : demande.idEnvoi.slice(0, 8).toUpperCase();
  const confirmation: Confirmation = {
    reference,
    provisoire: !(resultat.voie === "webhook" && resultat.reference),
    lignes,
    logo: lienLogo !== null,
  };
  const url = `/devis/envoye/?c=${creerJeton(confirmation, 24 * 60 * 60)}`;
  envoisTraites.set(demande.idEnvoi, { url, expire: Date.now() + DUREE_ENVOI_MS });
  redirect(url);
}
