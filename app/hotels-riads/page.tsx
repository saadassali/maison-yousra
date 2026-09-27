import { conditions } from "../../content/conditions";
import { BlocOffre, EnTete, SectionOffre } from "../_components/en-tete";
import { Flacon, Recharge } from "../_components/illustrations";
import {
  BarreDevisMobile,
  SectionCommentCaMarche,
  SectionDevis,
  SectionPreuves,
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
      <EnTete
        page="hotelsRiads"
        titre="Vos clients veulent l’argan et la fleur d’oranger du Maroc, pas un gel douche importé."
        chapeau="Des produits d’accueil fabriqués par des coopératives marocaines, en recharge, dans des distributeurs au nom de votre établissement."
        dessin={
          <>
            <Flacon nom="Votre riad" />
            <Recharge />
          </>
        }
      />

      <SectionOffre>
        <BlocOffre titre="Recharges de 5 L">
          <p>Gel douche et shampoing à l’argan, livrés en recharge de 5 L pour remplir vos distributeurs.</p>
        </BlocOffre>
        <BlocOffre titre="Distributeurs à votre nom">
          <p>
            Des flacons standards, avec une étiquette imprimée au nom de votre établissement. Si la
            coopérative l’accepte, son nom figure à côté du vôtre. Vous validez le bon à tirer
            avant toute impression.
          </p>
        </BlocOffre>
        <BlocOffre titre="Le contrat « station de recharge »">
          <p>
            Un contrat annuel : les recharges vous sont livrées chaque mois et les distributeurs
            vous sont prêtés.
          </p>
          <dl className="fiche">
            <dt>Conditions</dt>
            <dd>{conditions.stationRecharge}</dd>
          </dl>
        </BlocOffre>
        <BlocOffre titre="Le savon solide, sans emballage individuel">
          <p>
            Savon solide à l’argan, au ghassoul ou à la fleur d’oranger : il se pose en chambre
            sans flacon ni emballage individuel.
          </p>
        </BlocOffre>
        <BlocOffre titre="Le QR code de la coopérative">
          <p>
            Bientôt, un QR code sur chaque distributeur mènera vos clients à l’histoire de la
            coopérative qui a fabriqué le produit, lorsqu’elle a accepté d’être citée.
          </p>
        </BlocOffre>
      </SectionOffre>

      <SectionPreuves segment="hotels" />
      <SectionCommentCaMarche recharge />
      <SectionDevis segment="hotel" libelle="Demander un devis pour un hôtel ou un riad" />
      <BarreDevisMobile segment="hotel" />
    </>
  );
}
