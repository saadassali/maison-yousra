import "server-only";

// Configuration serveur du circuit des devis. Aucune de ces variables n'est exposée au navigateur.

const lire = (nom: string) => process.env[nom]?.trim() || undefined;
const production = process.env.NODE_ENV === "production";

function obligatoireEnProduction(nom: string): string | undefined {
  const v = lire(nom);
  if (!v && production) throw new Error(`${nom} manque : voir .env.example.`);
  return v;
}

export const configDevis = {
  /** Secret des liens privés (fichiers, confirmation). Obligatoire en production. */
  secretLiens: () => {
    const v = obligatoireEnProduction("LIENS_SECRET");
    if (v && v.length < 32) throw new Error("LIENS_SECRET doit faire au moins 32 caractères.");
    return v ?? "developpement-seulement-ne-pas-utiliser-en-production";
  },
  w1: () => ({ url: lire("TWENTY_W1_WEBHOOK_URL"), secret: lire("TWENTY_W1_WEBHOOK_SECRET") }),
  expediteur: () => lire("QUOTE_FROM_EMAIL"),
  secours: () => lire("QUOTE_FALLBACK_EMAIL"),
  /** Serveur SMTP d'AWS SES pour le secours par e-mail. Absent : pas de secours. */
  smtp: () => {
    const host = lire("SES_SAAD_MAIL_HOST");
    const user = lire("SES_SAAD_MAIL_ACCES_KEY");
    const pass = lire("SES_SAAD_MAIL_SECRET_ACCES_KEY");
    if (!host || !user || !pass) return undefined;
    const port = Number(lire("SES_SAAD_MAIL_PORT") ?? 587);
    return { host, port, user, pass };
  },
  twenty: () => ({ url: lire("TWENTY_API_URL"), cle: lire("TWENTY_API_KEY") }),
  /** Frais fixes d'un lot, en MAD, pour la formule de prix (fichier 16 §5). Absent : pas de fourchette. */
  fraisLotMad: () => {
    const v = lire("DEVIS_FRAIS_LOT_MAD");
    const n = v === undefined ? NaN : Number(v);
    return Number.isFinite(n) && n >= 0 ? n : undefined;
  },
  s3: () => ({
    endpoint: lire("UPLOADS_S3_ENDPOINT"),
    region: lire("UPLOADS_S3_REGION") ?? "auto",
    bucket: lire("UPLOADS_S3_BUCKET"),
    accessKeyId: lire("UPLOADS_S3_ACCESS_KEY_ID"),
    secretAccessKey: lire("UPLOADS_S3_SECRET_ACCESS_KEY"),
  }),
  production,
};
