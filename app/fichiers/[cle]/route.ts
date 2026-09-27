import { signatureFichierValide } from "../../_devis/liens";
import { cleValide, stockage } from "../../_devis/stockage";

// Fichiers privés (logos, maquettes) : servis seulement avec une signature valable, jamais
// affichés dans la page (téléchargement), jamais indexés ni mis en cache partagé.

const ENTETES_PRIVES = {
  "cache-control": "private, no-store",
  "x-robots-tag": "noindex, nofollow",
  "x-content-type-options": "nosniff",
  "content-security-policy": "default-src 'none'; sandbox",
  "referrer-policy": "no-referrer",
};

export async function GET(requete: Request, { params }: RouteContext<"/fichiers/[cle]">) {
  const cle = decodeURIComponent((await params).cle);
  const signature = new URL(requete.url).searchParams.get("s");
  if (!cleValide(cle) || !signatureFichierValide(cle, signature)) {
    return new Response("Introuvable.", { status: 404, headers: ENTETES_PRIVES });
  }
  const fichier = await stockage().lire(cle);
  if (!fichier) return new Response("Introuvable.", { status: 404, headers: ENTETES_PRIVES });
  return new Response(new Uint8Array(fichier.contenu), {
    headers: {
      ...ENTETES_PRIVES,
      "content-type": fichier.type,
      "content-disposition": `attachment; filename="${cle.split("/").pop()}"`,
    },
  });
}
