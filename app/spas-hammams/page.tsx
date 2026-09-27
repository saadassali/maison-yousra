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
      <Breadcrumb page="spasHammams" />

      <h1>Un rituel de hammam à mettre à la carte : les produits, le protocole et la formation.</h1>
      <p>
        Un kit professionnel en grands formats, fabriqué par des coopératives marocaines et
        étiqueté au nom de votre spa, avec tout ce qu’il faut pour que vos thérapeutes le
        pratiquent de la même façon.
      </p>

      <section aria-labelledby="offre">
        <h2 id="offre">L’offre</h2>

        <h3>Le kit rituel en grands formats</h3>
        <p>Savon noir, ghassoul et huile d’argan en conditionnements professionnels de 1 à 5 kg, avec le gant de kessa.</p>

        <h3>Ce qui accompagne le kit</h3>
        <dl>
          <dt>Protocole écrit</dt>
          <dd>[À COMPLÉTER : protocole du rituel, étape par étape]</dd>
          <dt>Vidéo de formation pour les thérapeutes</dt>
          <dd>[À COMPLÉTER : vidéo de formation]</dd>
          <dt>Déroulé du rituel</dt>
          <dd>[À COMPLÉTER : déroulé du rituel (gestes, ordre, durée de chaque étape)]</dd>
          <dt>Fiches clients</dt>
          <dd>[À COMPLÉTER : fiches remises aux clients du spa]</dd>
        </dl>
      </section>

      <section aria-labelledby="preuves">
        <h2 id="preuves">Les preuves</h2>
        <EngagementEnregistrement />
        <ProduitsEnregistres segment="spas" />
        <Preuves segment="spas" />
      </section>

      <SectionCommentCaMarche />

      <SectionDevis segment="spa" libelle="Demander un devis pour un spa ou un hammam" />
    </>
  );
}
