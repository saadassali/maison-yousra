import Link from "next/link";
import { EtapesPersonnalisation, Preuves } from "./_components/sections";
import { lienDevis, ROUTES } from "./_site/config";
import { pageMetadata } from "./_site/metadata";

// Rien sur les ingrédients en vrac ni sur le métier d'agent : c'est le site A.

export const metadata = pageMetadata({
  path: ROUTES.accueil.path,
  title: "Maison Yousra — produits marocains à votre nom",
  description:
    "Produits de coopératives marocaines avec un packaging à votre nom, pour les hôtels et riads, les spas et hammams, et les cadeaux.",
});

export default function HomePage() {
  return (
    <>
      <h1>Des produits de coopératives marocaines, à votre nom.</h1>
      <p>
        Produits d’accueil en recharge, kits de hammam et coffrets cadeaux : fabriqués par des
        coopératives marocaines, étiquetés à votre nom, livrés au Maroc.
      </p>
      <p>
        <Link href={lienDevis()}>Demander un devis</Link> ·{" "}
        <Link href={ROUTES.personnalisation.path}>Comment nous personnalisons</Link>
      </p>

      <section aria-labelledby="pour-qui">
        <h2 id="pour-qui">Pour qui</h2>
        <ul>
          <li>
            <h3>
              <Link href={ROUTES.hotelsRiads.path}>Hôtels et riads</Link>
            </h3>
            <p>Produits d’accueil en recharge de 5 L, distributeurs à votre nom.</p>
          </li>
          <li>
            <h3>
              <Link href={ROUTES.spasHammams.path}>Spas et hammams</Link>
            </h3>
            <p>Un kit rituel en grands formats, avec un protocole écrit et la formation de vos équipes.</p>
          </li>
          <li>
            <h3>
              <Link href={ROUTES.cadeaux.path}>Cadeaux</Link>
            </h3>
            <p>Coffrets au logo de votre entreprise, cadeaux d’invités aux prénoms des mariés, événements.</p>
          </li>
        </ul>
      </section>

      <section aria-labelledby="personnalisation">
        <h2 id="personnalisation">Votre nom, leur savoir-faire, en quatre étapes</h2>
        <EtapesPersonnalisation />
        <p>
          <Link href={ROUTES.personnalisation.path}>Minimums, délais et BAT</Link>
        </p>
      </section>

      <Preuves titre="Nos preuves" />

      <section aria-labelledby="devis">
        <h2 id="devis">Parlons de votre projet</h2>
        <p>Indiquez vos produits et vos quantités : réponse sous 24 heures ouvrées.</p>
        <p>
          <Link href={lienDevis()}>Demander un devis</Link>
        </p>
      </section>
    </>
  );
}
