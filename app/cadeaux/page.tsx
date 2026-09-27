import { Breadcrumb } from "../_components/breadcrumb";
import { ROUTES } from "../_site/config";
import { pageMetadata } from "../_site/metadata";

export const metadata = pageMetadata({
  path: ROUTES.cadeaux.path,
  title: "Cadeaux d’entreprise et de mariage | Maison Yousra",
  description:
    "Coffrets et cadeaux d’invités à votre nom, avec des produits de coopératives marocaines : entreprises, mariages, événements.",
});

export default function CadeauxPage() {
  return (
    <>
      <Breadcrumb page="cadeaux" />
      <h1>Cadeaux d’entreprise, de mariage et d’événement</h1>
      <p>[À COMPLÉTER : contenu de la page (prompt 3)]</p>
    </>
  );
}
