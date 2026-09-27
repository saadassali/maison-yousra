import { BlocOffre, EnTete, SectionOffre } from "../_components/en-tete";
import { Pot } from "../_components/illustrations";
import {
  BarreDevisMobile,
  SectionCommentCaMarche,
  SectionDevis,
  SectionPreuves,
} from "../_components/sections";
import { ROUTES } from "../_site/config";
import { pageMetadata } from "../_site/metadata";

// Aucune allégation santé (prompt 0, règle 5) : on décrit les gestes et les produits, pas des effets.

export const metadata = pageMetadata({
  path: ROUTES.spasHammams.path,
  title: "Kit hammam professionnel pour spas | Maison Yousra",
  description:
    "Kit rituel en grands formats de 1 à 5 kg : savon noir, ghassoul, gant de kessa, huile d’argan, avec protocole écrit et formation de vos thérapeutes.",
});

export default function SpasHammamsPage() {
  return (
    <>
      <EnTete
        page="spasHammams"
        titre="Un rituel de hammam à mettre à la carte : les produits, le protocole et la formation."
        chapeau="Un kit professionnel en grands formats, fabriqué par des coopératives marocaines et étiqueté au nom de votre spa, avec tout ce qu’il faut pour que vos thérapeutes le pratiquent de la même façon."
        dessin={<Pot />}
      />

      <SectionOffre>
        <BlocOffre titre="Le kit rituel en grands formats">
          <p>
            Savon noir, ghassoul et huile d’argan en conditionnements professionnels de 1 à 5 kg,
            avec le gant de kessa.
          </p>
        </BlocOffre>
        <BlocOffre titre="Le protocole et la formation">
          <dl className="fiche">
            <dt>Protocole</dt>
            <dd>[À COMPLÉTER : protocole du rituel, étape par étape]</dd>
            <dt>Vidéo</dt>
            <dd>[À COMPLÉTER : vidéo de formation pour les thérapeutes]</dd>
          </dl>
        </BlocOffre>
        <BlocOffre titre="Le déroulé et les fiches clients">
          <dl className="fiche">
            <dt>Déroulé</dt>
            <dd>[À COMPLÉTER : déroulé du rituel (gestes, ordre, durée de chaque étape)]</dd>
            <dt>Fiches</dt>
            <dd>[À COMPLÉTER : fiches remises aux clients du spa]</dd>
          </dl>
        </BlocOffre>
      </SectionOffre>

      <SectionPreuves segment="spas" />
      <SectionCommentCaMarche />
      <SectionDevis segment="spa" libelle="Demander un devis pour un spa ou un hammam" />
      <BarreDevisMobile segment="spa" />
    </>
  );
}
