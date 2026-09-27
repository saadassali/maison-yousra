import Image from "next/image";
import Link from "next/link";
import { conditions } from "../../content/conditions";
import {
  contenu,
  cooperativeDuProduit,
  produitsPublies,
  realisationPourAffichage,
} from "../_content";
import { estMarqueur, FORMATS, type Segment } from "../_content/schemas";
import type { ProduitAffiche } from "../_content/verrous";
import { lienDevis, ROUTES, type SegmentDevis } from "../_site/config";

// Blocs communs aux pages : la structure vient du fichier 14 §4.1 et du canevas de design.

const ETAPES = [
  {
    titre: "Vous choisissez les produits et les formats",
    texte: "Produits, formats (flacon, recharge de 5 L, pot, boîte) et quantités.",
  },
  {
    titre: "Nous créons l’étiquette et la boîte avec vous",
    texte:
      "Votre logo, vos couleurs, la ou les langues, le texte à imprimer. Nous préparons le bon à tirer (BAT) : rien n’est imprimé avant votre validation.",
  },
  {
    titre: "Remplissage, étiquetage et contrôle",
    texte:
      "Chez un conditionneur déclaré : auprès du ministère de la Santé pour les cosmétiques, autorisé par l’ONSSA pour l’alimentaire. Un échantillon de chaque lot est contrôlé.",
  },
  {
    titre: "Livraison et facturation",
    texte: "Nous livrons et facturons ; vous n’avez qu’un interlocuteur.",
  },
];

/**
 * La chaîne de personnalisation en 4 étapes, du point de vue du client (fichier 13 §4).
 * « grille » : 2 × 2 (accueil) ; « colonnes » : 4 colonnes (personnalisation) ; « lignes » :
 * une étape par ligne (pages segments).
 */
export function EtapesPersonnalisation({
  variante = "lignes",
}: {
  variante?: "grille" | "colonnes" | "lignes";
}) {
  if (variante === "lignes") {
    return (
      <ol className="border-b border-cedre">
        {ETAPES.map((etape, i) => (
          <li key={etape.titre} className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-cedre py-5">
            <span aria-hidden="true" className="font-display text-[28px] leading-none text-indigo">
              {i + 1}
            </span>
            <div>
              <h3 className="font-sans text-[17px] font-semibold">{etape.titre}</h3>
              <p className="mt-1 text-[15px] text-encre">{etape.texte}</p>
            </div>
          </li>
        ))}
      </ol>
    );
  }
  const grille =
    variante === "grille"
      ? "grid gap-4 sm:grid-cols-2 md:gap-6"
      : "grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6";
  return (
    <ol className={grille}>
      {ETAPES.map((etape, i) => (
        <li
          key={etape.titre}
          className={
            variante === "grille"
              ? "flex flex-col gap-2 rounded-[4px] bg-lin p-6"
              : "flex flex-col gap-3 border-t-2 border-cedre pt-6"
          }
        >
          <span
            aria-hidden="true"
            className={`font-display leading-none text-indigo ${variante === "grille" ? "text-[36px]" : "text-[56px]"}`}
          >
            {i + 1}
          </span>
          <h3 className="font-sans text-[17px] font-semibold md:text-[19px]">{etape.titre}</h3>
          <p className="text-[15px] leading-relaxed text-encre">{etape.texte}</p>
        </li>
      ))}
    </ol>
  );
}

/** Minimum de commande et délai. */
export function Conditions({ recharge = false }: { recharge?: boolean }) {
  return (
    <dl className="fiche">
      <dt>Minimum</dt>
      <dd>{conditions.minimumUnites}</dd>
      {recharge ? (
        <>
          <dt>En recharge</dt>
          <dd>{conditions.minimumRecharge}</dd>
        </>
      ) : null}
      <dt>Délai</dt>
      <dd>{conditions.delai}</dd>
    </dl>
  );
}

/** Section « Comment ça marche » d'une page segment. */
export function SectionCommentCaMarche({ recharge = false }: { recharge?: boolean }) {
  return (
    <section aria-labelledby="comment" className="bg-argile py-16 md:py-24">
      <div className="cadre grid gap-10 md:grid-cols-12 md:gap-6">
        <div className="flex flex-col gap-6 md:col-span-4">
          <h2 id="comment" className="titre-section">
            Comment ça marche
          </h2>
          <Conditions recharge={recharge} />
          <p className="text-[15px] font-semibold">
            <Link href={ROUTES.personnalisation.path}>Le détail de la personnalisation, du BAT aux minimums</Link>
          </p>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <EtapesPersonnalisation />
        </div>
      </div>
    </section>
  );
}

/** Appel vers le devis, avec le segment présélectionné. */
export function SectionDevis({ segment, libelle }: { segment: SegmentDevis; libelle: string }) {
  return (
    <section aria-labelledby="devis" className="py-16 md:py-24">
      <div className="cadre grid items-center gap-8 md:grid-cols-12 md:gap-6">
        <h2 id="devis" className="titre-section md:col-span-6 md:text-[48px]">
          Demander un devis
        </h2>
        <div className="flex flex-col items-start gap-5 rounded-[6px] bg-lin p-6 md:col-span-5 md:col-start-8 md:p-8">
          <p className="text-[16px] text-encre">
            Indiquez vos produits, vos quantités et, si vous le souhaitez, déposez votre logo.
            Réponse sous 24 heures ouvrées.
          </p>
          <Link href={lienDevis(segment)} className="bouton w-full">
            {libelle}
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Barre fixée en bas de l'écran sur mobile, vers le devis (canevas, page segment mobile). */
export function BarreDevisMobile({ segment }: { segment: SegmentDevis }) {
  return (
    <>
      <div aria-hidden="true" className="h-20 md:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-trait bg-enduit/95 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <Link href={lienDevis(segment)} className="bouton w-full">
          Demander un devis
        </Link>
      </div>
    </>
  );
}

/** L'engagement de publication (prompt 0, règle 4), dit au client. */
export function EngagementEnregistrement() {
  return (
    <p className="font-display text-[24px] font-light leading-snug md:text-[28px]">
      Nous ne vendons au Maroc que des cosmétiques enregistrés au ministère de la Santé et des
      produits alimentaires conditionnés par un établissement autorisé par l’ONSSA.
    </p>
  );
}

function Enregistrement({ produit }: { produit: ProduitAffiche }) {
  const c = produit.conformite;
  if (estMarqueur(c)) return <>{c}</>;
  const date = new Date(`${c.dateExpiration}T00:00:00Z`).toLocaleDateString("fr-FR", { timeZone: "UTC" });
  return c.type === "DMP" ? (
    <>
      Enregistré au ministère de la Santé, n° {c.numero}, valable jusqu’au {date}
    </>
  ) : (
    <>
      Conditionné par un établissement autorisé par l’ONSSA, n° {c.numero}, valable jusqu’au {date}
    </>
  );
}

function Coche() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="mt-[3px] shrink-0">
      <path d="M3 8.5l3 3 7-7" />
    </svg>
  );
}

/** Produits publiés d'un segment, avec leur numéro d'enregistrement. */
export function ProduitsEnregistres({ segment }: { segment?: Segment }) {
  const produits = produitsPublies().filter((p) => !segment || p.segments.includes(segment));
  if (produits.length === 0) {
    return (
      <p className="text-[14px] text-sable">
        [À COMPLÉTER : produits publiés, avec leur numéro d’enregistrement (aucun certificat saisi)]
      </p>
    );
  }
  return (
    <ul className="flex flex-col gap-2">
      {produits.map((p) => (
        <li key={p.id} className="flex gap-2 text-[14px]">
          <Coche />
          <span>
            <strong className="font-semibold">{p.nom}</strong>
            {p.apercu ? " (aperçu : non publié)" : null}
            {Array.isArray(p.formats) ? `, ${p.formats.map((f) => FORMATS[f].toLowerCase()).join(", ")}` : null}.{" "}
            <Enregistrement produit={p} />
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Les preuves d'une page segment : engagement, produits enregistrés, réalisations, coopératives. */
export function SectionPreuves({ segment }: { segment: Segment }) {
  return (
    <section aria-labelledby="preuves" className="py-16 md:py-24">
      <div className="cadre flex flex-col gap-10">
        <h2 id="preuves" className="titre-section">
          Les preuves
        </h2>
        <div className="grid gap-6 md:grid-cols-12">
          <div className="flex flex-col gap-6 rounded-[4px] bg-cedre p-6 text-enduit md:col-span-6 md:p-8">
            <EngagementEnregistrement />
            <ProduitsEnregistres segment={segment} />
          </div>
          <div className="md:col-span-6">
            <Preuves segment={segment} />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Preuves disponibles : réalisations, coopératives co-brandées, produits enregistrés. Seules
 * celles qui passent les verrous du prompt 2 sont lues. Rien à montrer : rien n'est rendu.
 */
export function Preuves({ segment, titre }: { segment?: Segment; titre?: string }) {
  const c = contenu();
  const produits = produitsPublies().filter((p) => !segment || p.segments.includes(segment));
  const realisations = c.realisations
    .filter((r) => !segment || r.segment === segment)
    .map((r) => realisationPourAffichage(c, r, produits))
    .filter((r) => r !== null);
  const cooperatives = [
    ...new Map(
      produits
        .map((p) => cooperativeDuProduit(c, p))
        .filter((coop) => coop !== null)
        .map((coop) => [coop.id, coop]),
    ).values(),
  ];

  if (realisations.length === 0 && cooperatives.length === 0 && (!titre || produits.length === 0)) {
    return null;
  }
  const blocs = (
    <div className="flex flex-col gap-10">
      {realisations.length > 0 ? (
        <div className="flex flex-col gap-4">
          <h3 className="titre-bloc">Réalisations</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            {realisations.map((r) => (
              <figure key={r.id} className="flex flex-col gap-3">
                {r.photos.length > 0 ? (
                  r.photos.map((photo) => (
                    <Image
                      key={photo.id}
                      src={photo.fichier}
                      alt={photo.alt}
                      width={photo.largeur}
                      height={photo.hauteur}
                      className="h-auto w-full rounded-[4px]"
                    />
                  ))
                ) : (
                  <div aria-hidden="true" className="arche h-40" />
                )}
                <figcaption className="text-[15px] leading-snug">
                  <span className="font-semibold">{r.titre}</span>
                  <br />
                  <span className="text-sourdine">{r.produits.map((p) => p.nom).join(", ")}</span>
                  {r.photos.map((photo) => (
                    <span key={photo.id} className="block text-[13px] text-sourdine">
                      {photo.legende}
                      {photo.personnes.length > 0 ? ` (${photo.personnes.join(", ")})` : null}
                    </span>
                  ))}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      ) : null}
      {cooperatives.length > 0 ? (
        <div className="flex flex-col gap-4">
          <h3 className="titre-bloc">Coopératives partenaires</h3>
          <ul className="flex flex-col gap-4">
            {cooperatives.map((coop) => (
              <li key={coop.id} className="border-t border-trait pt-4">
                <p className="font-display text-[22px]">{coop.nom}</p>
                <p className="text-[14px] text-sourdine">
                  {[
                    estMarqueur(coop.region) ? null : coop.region,
                    typeof coop.nombreMembres === "number" ? `${coop.nombreMembres} membres` : null,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                {estMarqueur(coop.histoire) ? null : <p className="mt-2 text-[15px] text-encre">{coop.histoire}</p>}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
  // Sur l'accueil, les preuves forment une section à part, avec les produits enregistrés.
  if (!titre) return blocs;
  return (
    <section aria-labelledby="preuves" className="py-16 md:py-24">
      <div className="cadre flex flex-col gap-10">
        <h2 id="preuves" className="titre-section">
          {titre}
        </h2>
        {blocs}
        {produits.length > 0 ? (
          <div className="flex flex-col gap-6 rounded-[4px] bg-cedre p-6 text-enduit md:p-8">
            <EngagementEnregistrement />
            <ProduitsEnregistres />
          </div>
        ) : null}
      </div>
    </section>
  );
}
