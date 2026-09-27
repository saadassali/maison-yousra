import { Breadcrumb } from "../_components/breadcrumb";
import { ROUTES } from "../_site/config";
import { pageMetadata } from "../_site/metadata";

export const metadata = pageMetadata({
  path: ROUTES.personnalisation.path,
  title: "Personnalisation des produits : étapes, BAT | Maison Yousra",
  description:
    "Comment vos produits sont personnalisés : choix des formats, étiquette et boîte, BAT, remplissage, contrôle et livraison.",
});

export default function PersonnalisationPage() {
  return (
    <>
      <Breadcrumb page="personnalisation" />
      <h1>La personnalisation en 4 étapes</h1>
      <p>[À COMPLÉTER : contenu de la page (prompt 3)]</p>
    </>
  );
}
