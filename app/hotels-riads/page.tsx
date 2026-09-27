import { conditions } from "../../content/conditions";
import { Breadcrumb } from "../_components/breadcrumb";
import {
  EngagementEnregistrement,
  Preuves,
  ProduitsEnregistres,
  SectionCommentCaMarche,
  SectionDevis,
} from "../_components/sections";
import { ROUTES } from "../_site/config";
import { pageMetadata } from "../_site/metadata";

export const metadata = pageMetadata({
  path: ROUTES.hotelsRiads.path,
  title: "Produits d’accueil pour hôtels et riads | Maison Yousra",
  description:
    "Gel douche et shampoing à l’argan en recharge de 5 L, distributeurs à votre nom, savon solide : des produits de coopératives marocaines enregistrés.",
});

export default function HotelsRiadsPage() {
  return (
    <>
      <Breadcrumb page="hotelsRiads" />

      <h1>Vos clients veulent l’argan et la fleur d’oranger du Maroc, pas un gel douche importé.</h1>
      <p>
        Des produits d’accueil fabriqués par des coopératives marocaines, en recharge, dans des
        distributeurs au nom de votre établissement.
      </p>

      <section aria-labelledby="offre">
        <h2 id="offre">L’offre</h2>

        <h3>Recharges de 5 L</h3>
        <p>
          Gel douche et shampoing à l’argan, livrés en recharge de 5 L pour remplir vos
          distributeurs.
        </p>

        <h3>Distributeurs à votre nom</h3>
        <p>
          Des flacons standards, avec une étiquette imprimée au nom de votre établissement. Si la
          coopérative l’accepte, son nom figure à côté du vôtre. Vous validez le bon à tirer avant
          toute impression.
        </p>

        <h3>Le contrat « station de recharge »</h3>
        <p>
          Un contrat annuel : les recharges vous sont livrées chaque mois et les distributeurs vous
          sont prêtés.
        </p>
        <dl>
          <dt>Conditions</dt>
          <dd>{conditions.stationRecharge}</dd>
        </dl>

        <h3>Le savon solide, sans emballage individuel</h3>
        <p>
          Savon solide à l’argan, au ghassoul ou à la fleur d’oranger : il se pose en chambre sans
          flacon ni emballage individuel.
        </p>

        <h3>Le QR code de la coopérative</h3>
        <p>
          Bientôt, un QR code sur chaque distributeur mènera vos clients à l’histoire de la
          coopérative qui a fabriqué le produit, lorsqu’elle a accepté d’être citée.
        </p>
      </section>

      <section aria-labelledby="preuves">
        <h2 id="preuves">Les preuves</h2>
        <EngagementEnregistrement />
        <ProduitsEnregistres segment="hotels" />
        <Preuves segment="hotels" />
      </section>

      <SectionCommentCaMarche recharge />

      <SectionDevis segment="hotel" libelle="Demander un devis pour un hôtel ou un riad" />
    </>
  );
}
