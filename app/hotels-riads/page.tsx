import { Breadcrumb } from "../_components/breadcrumb";
import { ROUTES } from "../_site/config";
import { pageMetadata } from "../_site/metadata";

export const metadata = pageMetadata({
  path: ROUTES.hotelsRiads.path,
  title: "Produits d’accueil pour hôtels et riads | Maison Yousra",
  description:
    "Produits d’accueil de coopératives marocaines en recharge de 5 L, distributeurs au nom de votre établissement.",
});

export default function HotelsRiadsPage() {
  return (
    <>
      <Breadcrumb page="hotelsRiads" />
      <h1>Produits d’accueil pour hôtels et riads</h1>
      <p>[À COMPLÉTER : contenu de la page (prompt 3)]</p>
    </>
  );
}
