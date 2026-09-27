import { Breadcrumb } from "../_components/breadcrumb";
import { ROUTES } from "../_site/config";
import { pageMetadata } from "../_site/metadata";

export const metadata = pageMetadata({
  path: ROUTES.spasHammams.path,
  title: "Kit hammam professionnel pour spas | Maison Yousra",
  description:
    "Kit rituel professionnel en grands formats pour spas et hammams : savon noir, ghassoul, gant de kessa, huile d’argan.",
});

export default function SpasHammamsPage() {
  return (
    <>
      <Breadcrumb page="spasHammams" />
      <h1>Kit rituel pour spas et hammams</h1>
      <p>[À COMPLÉTER : contenu de la page (prompt 3)]</p>
    </>
  );
}
