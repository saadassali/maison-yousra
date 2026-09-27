import { Breadcrumb } from "../_components/breadcrumb";
import { ROUTES } from "../_site/config";
import { pageMetadata } from "../_site/metadata";

export const metadata = pageMetadata({
  path: ROUTES.mentionsLegales.path,
  title: "Mentions légales | Maison Yousra",
  description:
    "Mentions légales du site Maison Yousra : éditeur, immatriculation, hébergeur.",
});

export default function MentionsLegalesPage() {
  return (
    <>
      <Breadcrumb page="mentionsLegales" />
      <h1>Mentions légales</h1>
      <p>[À COMPLÉTER : contenu de la page (prompt 3)]</p>
    </>
  );
}
