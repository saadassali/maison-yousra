import Link from "next/link";
import { Coffret, Flacon, Niche, Pot, Savon } from "./_components/illustrations";
import { EtapesPersonnalisation, Preuves } from "./_components/sections";
import { lienDevis, ROUTES } from "./_site/config";
import { pageMetadata } from "./_site/metadata";

// Rien sur les ingrédients en vrac ni sur le métier d'agent : c'est le site A.

export const metadata = pageMetadata({
  path: ROUTES.accueil.path,
  title: "Maison Yousra — produits marocains à votre nom",
  description:
    "Produits de coopératives marocaines avec un packaging à votre nom, pour les hôtels et riads, les spas et hammams, et les cadeaux.",
});

const SEGMENTS = [
  {
    route: ROUTES.hotelsRiads,
    titre: "Hôtels et riads",
    texte: "Produits d’accueil en recharge de 5 L, distributeurs à votre nom.",
    dessin: <Flacon nom="Votre riad" petit />,
  },
  {
    route: ROUTES.spasHammams,
    titre: "Spas et hammams",
    texte: "Un kit rituel en grands formats, avec un protocole écrit et la formation de vos équipes.",
    dessin: <Pot />,
  },
  {
    route: ROUTES.cadeaux,
    titre: "Cadeaux",
    texte: "Coffrets au logo de votre entreprise, cadeaux d’invités aux prénoms des mariés, événements.",
    dessin: <Coffret nom="Votre coffret" />,
  },
];

export default function HomePage() {
  return (
    <>
      <section className="cadre grid items-center gap-10 pt-6 pb-16 md:grid-cols-12 md:gap-6 md:pt-14 md:pb-24">
        <div className="flex flex-col gap-7 md:col-span-6">
          <h1 className="text-[44px] leading-[0.98] tracking-[-0.02em] sm:text-[56px] lg:text-[76px]">
            Des produits de coopératives marocaines, à votre nom.
          </h1>
          <p className="chapeau">
            Produits d’accueil en recharge, kits de hammam et coffrets cadeaux : fabriqués par des
            coopératives marocaines, étiquetés à votre nom, livrés au Maroc.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href={lienDevis()} className="bouton min-h-[54px] px-7 text-[16px]">
              Demander un devis
            </Link>
            <Link href={ROUTES.personnalisation.path} className="bouton-contour min-h-[54px] px-7 text-[16px]">
              Comment nous personnalisons
            </Link>
          </div>
        </div>
        <Niche className="h-[420px] md:col-span-5 md:col-start-8 md:h-[600px]">
          <Flacon />
          <Savon />
        </Niche>
      </section>

      <section aria-labelledby="pour-qui" className="cadre flex flex-col gap-10 pb-20 md:pb-28">
        <h2 id="pour-qui" className="titre-section">
          Pour qui
        </h2>
        <ul className="grid gap-10 md:grid-cols-3 md:gap-6">
          {SEGMENTS.map((s) => (
            <li key={s.titre} className="group relative flex flex-col gap-4">
              <Niche className="h-[230px] md:h-[300px]">{s.dessin}</Niche>
              <h3 className="text-[28px] md:text-[30px]">
                {/* Le lien couvre toute la carte. */}
                <Link href={s.route.path} className="text-cedre no-underline after:absolute after:inset-0 group-hover:underline">
                  {s.titre}
                </Link>
              </h3>
              <p className="text-[15px] text-encre">{s.texte}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="personnalisation" className="bg-argile py-16 md:py-24">
        <div className="cadre grid gap-10 md:grid-cols-12 md:gap-6">
          <div className="flex flex-col gap-5 md:col-span-4">
            <h2 id="personnalisation" className="titre-section">
              Votre nom, leur savoir-faire, en quatre étapes
            </h2>
            <p className="text-[15px] font-semibold">
              <Link href={ROUTES.personnalisation.path}>Minimums, délais et BAT</Link>
            </p>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <EtapesPersonnalisation variante="grille" />
          </div>
        </div>
      </section>

      <Preuves titre="Nos preuves" />

      <section aria-labelledby="devis" className="cadre py-16 md:py-24">
        <div className="flex flex-col gap-8 rounded-[6px] bg-cedre p-8 text-enduit md:flex-row md:items-center md:justify-between md:p-14">
          <div className="flex flex-col gap-3">
            <h2 id="devis" className="text-[32px] leading-tight md:text-[40px]">
              Parlons de votre projet
            </h2>
            <p className="text-[16px] text-sable">
              Indiquez vos produits et vos quantités : réponse sous 24 heures ouvrées.
            </p>
          </div>
          <Link href={lienDevis()} className="bouton-safran shrink-0">
            Demander un devis
          </Link>
        </div>
      </section>
    </>
  );
}
