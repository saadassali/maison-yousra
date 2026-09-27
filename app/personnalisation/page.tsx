import Link from "next/link";
import { conditions } from "../../content/conditions";
import { Breadcrumb } from "../_components/breadcrumb";
import { EtapesPersonnalisation } from "../_components/sections";
import { lienDevis, ROUTES } from "../_site/config";
import { pageMetadata } from "../_site/metadata";

// Le conditionneur n'est jamais nommé (prompt 0, règle 3).

export const metadata = pageMetadata({
  path: ROUTES.personnalisation.path,
  title: "Personnalisation des produits : étapes, BAT | Maison Yousra",
  description:
    "Choix des produits, étiquette et boîte à votre nom, BAT, remplissage chez un conditionneur déclaré, contrôle par lot, livraison : minimums et délais.",
});

export default function PersonnalisationPage() {
  return (
    <>
      <Breadcrumb page="personnalisation" />

      <h1>Des flacons standards, une étiquette qui n’appartient qu’à vous.</h1>
      <p>
        Pas de moule sur mesure : ce qui change, c’est l’étiquette et la boîte. C’est ce qui rend
        les petites séries possibles.
      </p>

      <section aria-labelledby="etapes">
        <h2 id="etapes">La personnalisation en quatre étapes</h2>
        <EtapesPersonnalisation />
      </section>

      <section aria-labelledby="petites-series">
        <h2 id="petites-series">Ce qui rend les petites séries possibles</h2>
        <ul>
          <li>
            <strong>Des flacons et des pots standards</strong>, personnalisés seulement par
            l’étiquette et la boîte.
          </li>
          <li>
            <strong>L’impression numérique des étiquettes</strong> : quelques centaines suffisent,
            sans frais de plaque.
          </li>
          <li>
            <strong>Le co-branding</strong> « Votre établissement × Coopérative » : votre nom et
            celui de la coopérative qui fabrique le produit, lorsqu’elle l’accepte.
          </li>
        </ul>
      </section>

      <section aria-labelledby="personnalisable">
        <h2 id="personnalisable">Ce que vous personnalisez</h2>
        <table>
          <caption>Ce qui est personnalisable, et ce qui ne l’est pas</caption>
          <tbody>
            <tr>
              <th scope="row">Étiquette</th>
              <td>Logo, couleurs, langue ou langues, texte</td>
            </tr>
            <tr>
              <th scope="row">Boîte</th>
              <td>Coffret cadeau à votre nom</td>
            </tr>
            <tr>
              <th scope="row">Co-branding</th>
              <td>« Votre nom × Coopérative », si la coopérative l’accepte</td>
            </tr>
            <tr>
              <th scope="row">Mariages</th>
              <td>Prénoms et date sur chaque cadeau</td>
            </tr>
            <tr>
              <th scope="row">Non personnalisable</th>
              <td>La forme du flacon ou du pot : pas de moule sur mesure</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section aria-labelledby="conditions">
        <h2 id="conditions">Minimums, délais et paiement</h2>
        <dl>
          <dt>Minimum en unités</dt>
          <dd>{conditions.minimumUnites}</dd>
          <dt>Minimum en recharge</dt>
          <dd>{conditions.minimumRecharge}</dd>
          <dt>Délai, de la validation du BAT à la livraison</dt>
          <dd>{conditions.delai}</dd>
          <dt>Acompte</dt>
          <dd>Demandé pour les petites séries : {conditions.acompte}</dd>
        </dl>
      </section>

      <section aria-labelledby="devis">
        <h2 id="devis">Demander un devis</h2>
        <p>
          <Link href={lienDevis()}>Demander un devis avec vos options de personnalisation</Link>
        </p>
      </section>
    </>
  );
}
