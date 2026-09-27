import { ROUTES } from "./_site/config";
import { pageMetadata } from "./_site/metadata";

export const metadata = pageMetadata({
  path: ROUTES.accueil.path,
  title: "Maison Yousra — produits marocains à votre nom",
  description:
    "Produits de coopératives marocaines avec un packaging à votre nom, pour les hôtels et riads, les spas et hammams, et les cadeaux.",
});

export default function HomePage() {
  return (
    <>
      <h1>Des produits de coopératives marocaines, à votre nom</h1>
      <p>[À COMPLÉTER : contenu de la page (prompt 3)]</p>
    </>
  );
}
