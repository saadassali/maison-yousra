import Link from "next/link";
import { EnTete } from "../_components/en-tete";
import { Coffret, Flacon, Niche, Savon } from "../_components/illustrations";
import { Conditions, SectionPreuves } from "../_components/sections";
import { lienDevis, ROUTES, type SegmentDevis } from "../_site/config";
import { pageMetadata } from "../_site/metadata";

// Hub des cadeaux. Les pages entreprises, mariages et événements viendront en P2 et P3 :
// aucun lien vers elles ici.

export const metadata = pageMetadata({
  path: ROUTES.cadeaux.path,
  title: "Cadeaux d’entreprise et de mariage | Maison Yousra",
  description:
    "Coffrets au logo de votre entreprise, cadeaux d’invités aux prénoms des mariés, coffrets pour les événements : des produits de coopératives marocaines.",
});

const OCCASIONS: {
  id: string;
  titre: string;
  texte: string;
  segment: SegmentDevis;
  lien: string;
  dessin: React.ReactNode;
}[] = [
  {
    id: "entreprises",
    titre: "Cadeaux d’entreprise",
    texte:
      "Des coffrets au logo de votre entreprise pour la fin d’année ou vos séminaires : huile d’olive du verger en bouteille, safran, huile d’argan.",
    segment: "entreprise",
    lien: "Demander un devis pour des cadeaux d’entreprise",
    dessin: <Coffret nom="Votre société" />,
  },
  {
    id: "mariages",
    titre: "Mariages",
    texte: "Des cadeaux d’invités aux prénoms des mariés et à la date du mariage, en petites séries.",
    segment: "mariage",
    lien: "Demander un devis pour un mariage",
    dessin: (
      <>
        <Flacon nom="Vos prénoms" mention="Votre date" petit />
        <Savon />
      </>
    ),
  },
  {
    id: "evenements",
    titre: "Événements",
    texte:
      "Des coffrets pour les congrès et les délégations, et un coffret « Maroc 2030 » en série limitée.",
    segment: "evenement",
    lien: "Demander un devis pour un événement",
    dessin: <Coffret nom="Votre congrès" />,
  },
];

export default function CadeauxPage() {
  return (
    <>
      <EnTete
        page="cadeaux"
        titre="Des cadeaux qui portent votre nom et viennent des coopératives marocaines."
        chapeau="Coffrets d’entreprise, cadeaux d’invités, coffrets d’événement : les produits, la boîte et l’étiquette sont à votre nom."
      />

      {OCCASIONS.map((o, i) => (
        <section
          key={o.id}
          aria-labelledby={o.id}
          className={i % 2 === 0 ? "bg-lin py-16 md:py-20" : "py-16 md:py-20"}
        >
          <div className="cadre grid items-center gap-8 md:grid-cols-12 md:gap-6">
            <Niche className={`h-[260px] md:col-span-4 ${i % 2 === 1 ? "md:order-2 md:col-start-9" : ""}`}>
              {o.dessin}
            </Niche>
            <div className={`flex flex-col items-start gap-5 md:col-span-6 ${i % 2 === 1 ? "md:col-start-2" : "md:col-start-6"}`}>
              <h2 id={o.id} className="titre-section">
                {o.titre}
              </h2>
              <p className="chapeau">{o.texte}</p>
              <Link href={lienDevis(o.segment)} className="bouton">
                {o.lien}
              </Link>
            </div>
          </div>
        </section>
      ))}

      <SectionPreuves segment="cadeaux" />

      <section aria-labelledby="comment" className="bg-argile py-16 md:py-24">
        <div className="cadre grid gap-8 md:grid-cols-12 md:gap-6">
          <h2 id="comment" className="titre-section md:col-span-4">
            Comment ça marche
          </h2>
          <div className="flex flex-col gap-6 md:col-span-7 md:col-start-6">
            <p className="chapeau">
              Vous choisissez les produits et la boîte, nous créons l’étiquette avec vous et vous
              validez le bon à tirer avant toute impression.
            </p>
            <Conditions />
            <p className="text-[15px] font-semibold">
              <Link href={ROUTES.personnalisation.path}>Le détail de la personnalisation, du BAT aux minimums</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
