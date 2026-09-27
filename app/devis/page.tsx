import { Breadcrumb } from "../_components/breadcrumb";
import { ROUTES } from "../_site/config";
import { pageMetadata } from "../_site/metadata";

export const metadata = pageMetadata({
  path: ROUTES.devis.path,
  title: "Demande de devis | Maison Yousra",
  description:
    "Demandez un devis pour des produits personnalisés à votre nom : produits, quantités, logo, date de livraison.",
});

export default function DevisPage() {
  return (
    <>
      <Breadcrumb page="devis" />
      <h1>Demander un devis</h1>
      <p>[À COMPLÉTER : contenu de la page (prompt 4)]</p>
    </>
  );
}
