import { EnTete } from "../_components/en-tete";
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
      <EnTete page="devis" titre="Parlez-nous de votre projet" chapeau="Réponse sous 24 heures ouvrées." />
      <div className="cadre pb-20 md:pb-28">
        <p className="rounded-[4px] bg-lin p-6 text-encre">[À COMPLÉTER : formulaire de devis (prompt 4)]</p>
      </div>
    </>
  );
}
