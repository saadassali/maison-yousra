import Link from "next/link";
import { conditions } from "../../content/conditions";
import { EnTete } from "../_components/en-tete";
import { Coffret, Flacon, Niche } from "../_components/illustrations";
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

const PERSONNALISABLE = [
  ["Étiquette", "Logo, couleurs, langue ou langues, texte"],
  ["Boîte", "Coffret cadeau à votre nom"],
  ["Co-branding", "« Votre nom × Coopérative », si la coopérative l’accepte"],
  ["Mariages", "Prénoms et date sur chaque cadeau"],
] as const;

export default function PersonnalisationPage() {
  return (
    <>
      <EnTete
        page="personnalisation"
        titre="Des flacons standards, une étiquette qui n’appartient qu’à vous."
        chapeau="Pas de moule sur mesure : ce qui change, c’est l’étiquette et la boîte. C’est ce qui rend les petites séries possibles."
      />

      <section aria-labelledby="etapes" className="cadre flex flex-col gap-10 pb-16 md:pb-24">
        <h2 id="etapes" className="sr-only">
          La personnalisation en quatre étapes
        </h2>
        <EtapesPersonnalisation variante="colonnes" />
      </section>

      <section aria-labelledby="personnalisable" className="bg-lin py-16 md:py-24">
        <div className="cadre grid items-center gap-10 md:grid-cols-12 md:gap-6">
          <Niche className="h-[340px] md:col-span-5 md:h-[380px]">
            <Flacon nom="Votre hôtel" petit />
            <Coffret nom="Votre coffret" />
          </Niche>
          <div className="flex flex-col gap-6 md:col-span-6 md:col-start-7">
            <h2 id="personnalisable" className="titre-section">
              Ce que vous personnalisez
            </h2>
            <table className="w-full border-collapse text-[15px]">
              <caption className="sr-only">Ce qui est personnalisable, et ce qui ne l’est pas</caption>
              <tbody>
                {PERSONNALISABLE.map(([quoi, comment]) => (
                  <tr key={quoi} className="border-t border-trait">
                    <th scope="row" className="w-2/5 py-3.5 pr-4 text-left align-top font-semibold">
                      {quoi}
                    </th>
                    <td className="py-3.5">{comment}</td>
                  </tr>
                ))}
                <tr className="border-y border-trait text-sourdine">
                  <th scope="row" className="py-3.5 pr-4 text-left align-top font-semibold">
                    Non personnalisable
                  </th>
                  <td className="py-3.5">La forme du flacon ou du pot : pas de moule sur mesure</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="petites-series" className="cadre grid gap-8 py-16 md:grid-cols-12 md:gap-6 md:py-24">
        <h2 id="petites-series" className="titre-section md:col-span-4">
          Ce qui rend les petites séries possibles
        </h2>
        <ul className="flex flex-col md:col-span-7 md:col-start-6">
          <li className="border-t border-cedre py-5">
            <strong className="font-semibold">Des flacons et des pots standards</strong>, personnalisés
            seulement par l’étiquette et la boîte.
          </li>
          <li className="border-t border-cedre py-5">
            <strong className="font-semibold">L’impression numérique des étiquettes</strong> :
            quelques centaines suffisent, sans frais de plaque.
          </li>
          <li className="border-y border-cedre py-5">
            <strong className="font-semibold">Le co-branding</strong> « Votre établissement ×
            Coopérative » : votre nom et celui de la coopérative qui fabrique le produit, lorsqu’elle
            l’accepte.
          </li>
        </ul>
      </section>

      <section aria-labelledby="conditions" className="cadre flex flex-col gap-8 pb-16 md:pb-24">
        <h2 id="conditions" className="titre-section">
          Minimums, délais et paiement
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {[
            ["Minimum en unités", conditions.minimumUnites, "bg-safran"],
            ["Minimum en recharge", conditions.minimumRecharge, "bg-lin"],
            ["Délai, du BAT à la livraison", conditions.delai, "bg-lin"],
            ["Acompte pour les petites séries", conditions.acompte, "bg-lin"],
          ].map(([libelle, valeur, fond]) => (
            <div key={libelle} className={`flex flex-col gap-3 rounded-[4px] p-6 ${fond}`}>
              <dt className={`etiquette ${fond === "bg-safran" ? "text-cedre" : ""}`}>{libelle}</dt>
              <dd className="text-[16px] leading-snug">{valeur}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="devis" className="cadre pb-16 md:pb-24">
        <div className="flex flex-col gap-6 rounded-[6px] bg-cedre p-8 text-enduit md:flex-row md:items-center md:justify-between md:p-14">
          <h2 id="devis" className="text-[32px] leading-tight md:text-[40px]">
            Demander un devis
          </h2>
          <Link href={lienDevis()} className="bouton-safran shrink-0">
            Demander un devis avec vos options
          </Link>
        </div>
      </section>
    </>
  );
}
