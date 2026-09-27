import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { configDevis } from "./config";

// Liens privés signés (HMAC-SHA256) : impossibles à deviner ou à fabriquer sans le secret.

function signer(message: string): string {
  return createHmac("sha256", configDevis.secretLiens()).update(message).digest("base64url");
}

function egal(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Chemin d'un fichier privé (logo, maquette) : /fichiers/<clé>/?s=<signature>. */
export function cheminFichier(cle: string): string {
  return `/fichiers/${encodeURIComponent(cle)}/?s=${signer(`fichier:${cle}`)}`;
}

export function signatureFichierValide(cle: string, signature: string | null): boolean {
  return signature !== null && egal(signer(`fichier:${cle}`), signature);
}

/** Jeton signé et daté pour transmettre un petit objet à la page de confirmation. */
export function creerJeton(donnees: unknown, dureeSecondes: number): string {
  const charge = Buffer.from(JSON.stringify({ d: donnees, e: Date.now() + dureeSecondes * 1000 })).toString("base64url");
  return `${charge}.${signer(`jeton:${charge}`)}`;
}

/** Contenu du jeton s'il est intact et non expiré, sinon null. */
export function lireJeton(jeton: string | undefined): unknown {
  if (!jeton) return null;
  const [charge, signature] = jeton.split(".");
  if (!charge || !signature || !egal(signer(`jeton:${charge}`), signature)) return null;
  try {
    const { d, e } = JSON.parse(Buffer.from(charge, "base64url").toString("utf8")) as { d: unknown; e: number };
    return typeof e === "number" && e > Date.now() ? d : null;
  } catch {
    return null;
  }
}
