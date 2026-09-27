import "server-only";
import { configDevis } from "./config";

// Vérification de Cloudflare Turnstile côté serveur.
// https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

const URL_VERIFICATION = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifierTurnstile(jeton: string | null, ip: string | null): Promise<boolean> {
  const secret = configDevis.turnstileSecret();
  if (!secret) {
    // Développement sans clé : on laisse passer, en le signalant.
    console.warn("[devis] TURNSTILE_SECRET_KEY absent : vérification anti-spam ignorée (développement).");
    return true;
  }
  if (!jeton) return false;
  const corps = new FormData();
  corps.append("secret", secret);
  corps.append("response", jeton);
  if (ip) corps.append("remoteip", ip);
  try {
    const reponse = await fetch(URL_VERIFICATION, { method: "POST", body: corps, signal: AbortSignal.timeout(5000) });
    const resultat: unknown = await reponse.json();
    return typeof resultat === "object" && resultat !== null && (resultat as { success?: unknown }).success === true;
  } catch {
    console.error("[devis] Turnstile injoignable.");
    return false;
  }
}
