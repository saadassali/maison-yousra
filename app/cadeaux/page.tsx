import Link from "next/link";
import { Breadcrumb } from "../_components/breadcrumb";
import {
  Conditions,
  EngagementEnregistrement,
  Preuves,
  ProduitsEnregistres,
} from "../_components/sections";
import { lienDevis, ROUTES } from "../_site/config";
import { pageMetadata } from "../_site/metadata";

// Hub des cadeaux. Les pages entreprises, mariages et événements viendront en P2 et P3 :
// aucun lien vers elles ici.

export const metadata = pageMetadata({
  path: ROUTES.cadeaux.path,
  title: "Cadeaux d’entreprise et de mariage | Maison Yousra",
  description:
    "Coffrets au logo de votre entreprise, cadeaux d’invités aux prénoms des mariés, coffrets pour les événements : des produits de coopératives marocaines.",
});

export default function CadeauxPage() {
  return (
    <>
      <Breadcrumb page="cadeaux" />

      <h1>Des cadeaux qui portent votre nom et viennent des coopératives marocaines.</h1>
      <p>
        Coffrets d’entreprise, cadeaux d’invités, coffrets d’événement : les produits, la boîte et
        l’étiquette sont à votre nom.
      </p>

      <section aria-labelledby="entreprises">
        <h2 id="entreprises">Cadeaux d’entreprise</h2>
        <p>
          Des coffrets au logo de votre entreprise pour la fin d’année ou vos séminaires : huile
          d’olive du verger en bouteille, safran, huile d’argan.
        </p>
        <p>
          <Link href={lienDevis("entreprise")}>Demander un devis pour des cadeaux d’entreprise</Link>
        </p>
      </section>

      <section aria-labelledby="mariages">
        <h2 id="mariages">Mariages</h2>
        <p>
          Des cadeaux d’invités aux prénoms des mariés et à la date du mariage, en petites séries.
        </p>
        <p>
          <Link href={lienDevis("mariage")}>Demander un devis pour un mariage</Link>
        </p>
      </section>

      <section aria-labelledby="evenements">
        <h2 id="evenements">Événements</h2>
        <p>
          Des coffrets pour les congrès et les délégations, et un coffret « Maroc 2030 » en série
          limitée.
        </p>
        <p>
          <Link href={lienDevis("evenement")}>Demander un devis pour un événement</Link>
        </p>
      </section>

      <section aria-labelledby="preuves">
        <h2 id="preuves">Les preuves</h2>
        <EngagementEnregistrement />
        <ProduitsEnregistres segment="cadeaux" />
        <Preuves segment="cadeaux" />
      </section>

      <section aria-labelledby="comment">
        <h2 id="comment">Comment ça marche</h2>
        <p>
          Vous choisissez les produits et la boîte, nous créons l’étiquette avec vous et vous
          validez le bon à tirer avant toute impression.
        </p>
        <Conditions />
        <p>
          <Link href={ROUTES.personnalisation.path}>Le détail de la personnalisation, du BAT aux minimums</Link>
        </p>
      </section>
    </>
  );
}
