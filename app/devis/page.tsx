import { produitsPublies } from "../_content";
import { Breadcrumb } from "../_components/breadcrumb";
import { SOURCES } from "../_devis/schema";
import { ROUTES, SEGMENTS_DEVIS, type SegmentDevis } from "../_site/config";
import { pageMetadata } from "../_site/metadata";
import { FormulaireDevis, type ParametresDevis, type ProduitOption } from "./formulaire-devis";

export const metadata = pageMetadata({
  path: ROUTES.devis.path,
  title: "Demande de devis | Maison Yousra",
  description:
    "Demandez un devis pour des produits personnalisés à votre nom : produits, quantités, logo, date de livraison. Réponse sous 24 heures ouvrées.",
});

const UTM = ["source", "medium", "campaign", "term", "content"] as const;

/** Lit les paramètres d'URL (non fiables) : seules les valeurs connues sont gardées. */
function lireParametres(p: Record<string, string | string[] | undefined>): ParametresDevis {
  const un = (cle: string) => {
    const v = p[cle];
    return typeof v === "string" ? v : undefined;
  };
  const segment = un("segment");
  const source = un("source")?.toUpperCase();
  const qr = un("qr") ?? "";
  const utm: ParametresDevis["utm"] = {};
  for (const c of UTM) {
    const v = un(`utm_${c}`);
    if (v) utm[c] = v.slice(0, 200);
  }
  return {
    segment: segment && segment in SEGMENTS_DEVIS ? (segment as SegmentDevis) : "hotel",
    source: SOURCES.find((s) => s === source) ?? "SEO",
    qrCodeId: /^[A-Za-z0-9_-]{1,100}$/.test(qr) ? qr : "",
    utm,
  };
}

export default async function DevisPage({ searchParams }: PageProps<"/devis">) {
  const parametres = lireParametres(await searchParams);
  // Liste des produits publiés seulement (prompt 0, règle 4), plus « je ne sais pas encore ».
  const produits: ProduitOption[] = produitsPublies().map((p) => ({
    id: p.id,
    nom: p.apercu ? `${p.nom} (aperçu)` : p.nom,
    formats: Array.isArray(p.formats) ? p.formats : null,
  }));
  return (
    <div className="cadre grid gap-12 pt-4 pb-20 md:grid-cols-12 md:gap-6 md:pt-10 md:pb-28">
      <div className="flex flex-col gap-10 md:col-span-8">
        <div className="flex flex-col gap-6">
          <Breadcrumb page="devis" />
          <h1 className="titre-page md:text-[56px]">Parlez-nous de votre projet</h1>
        </div>
        <FormulaireDevis
          produits={produits}
          parametres={parametres}
          // Clé de site Turnstile : publique par conception, lue à chaque requête.
          cleTurnstile={process.env.TURNSTILE_SITE_KEY?.trim() || undefined}
          confidentialite={ROUTES.confidentialite.path}
        />
      </div>
      <aside aria-labelledby="ensuite" className="flex flex-col gap-6 md:col-span-3 md:col-start-10 md:pt-36">
        <div className="flex flex-col gap-3.5 rounded-[4px] bg-argile p-6">
          <h2 id="ensuite" className="etiquette font-sans text-cedre">
            Ensuite
          </h2>
          <ol className="flex list-decimal flex-col gap-2.5 pl-5 text-[14px] leading-relaxed">
            <li>Votre devis sous 24 heures ouvrées, par e-mail.</li>
            <li>Vous l’acceptez en ligne.</li>
            <li>Acompte pour les petites séries, puis le BAT de votre étiquette à valider.</li>
          </ol>
        </div>
        <p className="text-[14px] leading-relaxed text-encre">
          Vos coordonnées ne sont jamais transmises aux producteurs.
        </p>
      </aside>
    </div>
  );
}
