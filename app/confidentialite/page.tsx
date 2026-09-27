import { Breadcrumb } from "../_components/breadcrumb";
import { ROUTES } from "../_site/config";
import { pageMetadata } from "../_site/metadata";

export const metadata = pageMetadata({
  path: ROUTES.confidentialite.path,
  title: "Politique de confidentialité | Maison Yousra",
  description:
    "Comment Maison Yousra traite vos données personnelles, selon la loi 09-08 et le RGPD.",
});

export default function ConfidentialitePage() {
  return (
    <>
      <Breadcrumb page="confidentialite" />
      <h1>Politique de confidentialité</h1>
      <p>[À COMPLÉTER : contenu de la page (prompt 3)]</p>
    </>
  );
}
