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

/** La chaîne de personnalisation en 4 étapes, du point de vue du client (fichier 13 §4). */
export function EtapesPersonnalisation() {
  return (
    <ol>
      <li>
        <h3>Vous choisissez les produits et les formats</h3>
        <p>Produits, formats (flacon, recharge de 5 L, pot, boîte) et quantités.</p>
      </li>
      <li>
        <h3>Nous créons l’étiquette et la boîte avec vous</h3>
        <p>
          Votre logo, vos couleurs, la ou les langues, le texte à imprimer. Nous préparons le bon à
          tirer (BAT) : rien n’est imprimé avant votre validation.
        </p>
      </li>
      <li>
        <h3>Remplissage, étiquetage et contrôle</h3>
        <p>
          Chez un conditionneur déclaré : auprès du ministère de la Santé pour les cosmétiques,
          autorisé par l’ONSSA pour l’alimentaire. Un échantillon de chaque lot est contrôlé.
        </p>
      </li>
      <li>
        <h3>Livraison et facturation</h3>
        <p>Nous livrons et facturons ; vous n’avez qu’un interlocuteur.</p>
      </li>
    </ol>
  );
}

/** Minimum de commande et délai. */
export function Conditions({ recharge = false }: { recharge?: boolean }) {
  return (
    <dl>
      <dt>Minimum de commande</dt>
      <dd>{conditions.minimumUnites}</dd>
      {recharge ? (
        <>
          <dt>Minimum en recharge</dt>
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
    <section aria-labelledby="comment">
      <h2 id="comment">Comment ça marche</h2>
      <EtapesPersonnalisation />
      <Conditions recharge={recharge} />
      <p>
        <Link href={ROUTES.personnalisation.path}>Le détail de la personnalisation, du BAT aux minimums</Link>
      </p>
    </section>
  );
}

/** Appel vers le devis, avec le segment présélectionné. */
export function SectionDevis({ segment, libelle }: { segment: SegmentDevis; libelle: string }) {
  return (
    <section aria-labelledby="devis">
      <h2 id="devis">Demander un devis</h2>
      <p>
        Indiquez vos produits, vos quantités et, si vous le souhaitez, déposez votre logo. Réponse
        sous 24 heures ouvrées.
      </p>
      <p>
        <Link href={lienDevis(segment)}>{libelle}</Link>
      </p>
    </section>
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

/** L'engagement de publication (prompt 0, règle 4), dit au client. */
export function EngagementEnregistrement() {
  return (
    <p>
      Nous ne vendons au Maroc que des cosmétiques enregistrés au ministère de la Santé et des
      produits alimentaires conditionnés par un établissement autorisé par l’ONSSA. Le numéro de
      chaque produit est indiqué ci-dessous.
    </p>
  );
}

/** Produits publiés d'un segment, avec leur numéro d'enregistrement. */
export function ProduitsEnregistres({ segment }: { segment?: Segment }) {
  const produits = produitsPublies().filter((p) => !segment || p.segments.includes(segment));
  if (produits.length === 0) {
    return <p>[À COMPLÉTER : produits publiés, avec leur numéro d’enregistrement (aucun certificat saisi)]</p>;
  }
  return (
    <ul>
      {produits.map((p) => (
        <li key={p.id}>
          <strong>{p.nom}</strong>
          {p.apercu ? " (aperçu : non publié)" : null}
          {Array.isArray(p.formats) ? ` · ${p.formats.map((f) => FORMATS[f]).join(", ")}` : null} ·{" "}
          <Enregistrement produit={p} />
        </li>
      ))}
    </ul>
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
    <>
      {realisations.length > 0 ? (
        <>
          <h3>Réalisations</h3>
          {realisations.map((r) => (
            <figure key={r.id}>
              {r.photos.map((photo) => (
                <Image key={photo.id} src={photo.fichier} alt={photo.alt} width={photo.largeur} height={photo.hauteur} />
              ))}
              <figcaption>
                {r.titre} : {r.produits.map((p) => p.nom).join(", ")}
                {r.photos.map((photo) => (
                  <span key={photo.id}>
                    {" "}
                    {photo.legende}
                    {photo.personnes.length > 0 ? ` (${photo.personnes.join(", ")})` : null}
                  </span>
                ))}
              </figcaption>
            </figure>
          ))}
        </>
      ) : null}
      {cooperatives.length > 0 ? (
        <>
          <h3>Coopératives partenaires</h3>
          <ul>
            {cooperatives.map((coop) => (
              <li key={coop.id}>
                <strong>{coop.nom}</strong>
                {estMarqueur(coop.region) ? null : `, ${coop.region}`}
                {typeof coop.nombreMembres === "number" ? ` · ${coop.nombreMembres} membres` : null}
                {estMarqueur(coop.histoire) ? null : <p>{coop.histoire}</p>}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </>
  );
  // Sur l'accueil, les preuves forment une section à part, avec les produits enregistrés.
  if (!titre) return blocs;
  return (
    <section aria-labelledby="preuves">
      <h2 id="preuves">{titre}</h2>
      {blocs}
      {produits.length > 0 ? (
        <>
          <EngagementEnregistrement />
          <ProduitsEnregistres />
        </>
      ) : null}
    </section>
  );
}
