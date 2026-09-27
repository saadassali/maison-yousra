import "server-only";

// Variables publiques de configuration lues au rendu serveur. Les secrets (webhooks, Turnstile,
// stockage) seront lus par les modules qui en ont besoin, jamais ici.

function readUrl(name: string): string | undefined {
  const value = process.env[name]?.trim();
  if (!value) return undefined;
  const url = new URL(value);
  if (url.pathname !== "/" || url.search || url.hash) {
    throw new Error(`${name} doit être une origine seule (ex. https://exemple.com), reçu : ${value}`);
  }
  return url.origin;
}

/** Origine du site B, sans slash final. Obligatoire en production. */
export function siteUrl(): string {
  const url = readUrl("SITE_URL");
  if (url) return url;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SITE_URL manque : voir .env.example.");
  }
  return "http://localhost:3000";
}

/** Origine du site A, pour l'unique lien de pied de page. Absente : pas de lien. */
export function siteAUrl(): string | undefined {
  return readUrl("SITE_A_URL");
}
