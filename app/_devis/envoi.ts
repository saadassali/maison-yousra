import "server-only";
import nodemailer from "nodemailer";
import { configDevis } from "./config";
import type { ChargeW1 } from "./w1";

// Envoi au webhook W1, avec secours par e-mail (prompt 4, traitements 3 et 4).

const DELAI_WEBHOOK_MS = 8000;

export type ResultatEnvoi = { voie: "webhook"; reference: string | null } | { voie: "email" } | { voie: "echec" };

/** Référence DV-AAMM-N renvoyée par W1, si elle est dans la réponse. */
function lireReference(corps: string): string | null {
  return corps.match(/DV-\d{4}-\d+/)?.[0] ?? null;
}

async function envoyerWebhook(charge: ChargeW1): Promise<string | null | false> {
  const { url, secret } = configDevis.w1();
  if (!url || !secret) {
    console.error(`[devis] W1 non configuré (envoi ${charge.idEnvoi}).`);
    return false;
  }
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", "x-webhook-secret": secret },
      // Le secret est aussi dans le corps : le déclencheur webhook de Twenty ne transmet que le
      // corps au workflow, où W1 le vérifie (fichier 23 §7.2, étape 1). Voir WEBHOOKS.md.
      body: JSON.stringify({ ...charge, secret }),
      signal: AbortSignal.timeout(DELAI_WEBHOOK_MS),
      cache: "no-store",
    });
    if (!r.ok) {
      console.error(`[devis] W1 a répondu ${r.status} (envoi ${charge.idEnvoi}).`);
      return false;
    }
    return lireReference(await r.text());
  } catch (e) {
    const cause = e instanceof Error && e.name === "TimeoutError" ? "délai dépassé" : "injoignable";
    // Journal sans données personnelles : seulement l'identifiant d'envoi.
    console.error(`[devis] W1 ${cause} (envoi ${charge.idEnvoi}).`);
    return false;
  }
}

function texteEmail(charge: ChargeW1): string {
  return [
    "Le webhook W1 n'a pas répondu. Demande complète ci-dessous, à saisir dans Twenty.",
    "",
    JSON.stringify(charge, null, 2),
  ].join("\n");
}

async function envoyerEmailSecours(charge: ChargeW1): Promise<boolean> {
  const smtp = configDevis.smtp();
  const de = configDevis.expediteur();
  const a = configDevis.secours();
  if (!smtp || !de || !a) {
    console.error(`[devis] Secours par e-mail non configuré (envoi ${charge.idEnvoi}).`);
    return false;
  }
  try {
    await nodemailer
      .createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.port === 465, // 465 : TLS implicite ; 587 : STARTTLS
        auth: { user: smtp.user, pass: smtp.pass },
      })
      .sendMail({
        from: de,
        to: a,
        subject: `[Secours W1] Demande de devis ${charge.idEnvoi} — ${charge.segment}`,
        text: texteEmail(charge),
      });
    return true;
  } catch {
    console.error(`[devis] Secours par e-mail en échec (envoi ${charge.idEnvoi}).`);
    return false;
  }
}

export async function transmettreDemande(charge: ChargeW1): Promise<ResultatEnvoi> {
  const reference = await envoyerWebhook(charge);
  if (reference !== false) return { voie: "webhook", reference };
  if (await envoyerEmailSecours(charge)) return { voie: "email" };
  return { voie: "echec" };
}
