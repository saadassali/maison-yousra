import type { RouteKey } from "../_site/config";
import { Breadcrumb } from "./breadcrumb";
import { Niche } from "./illustrations";

/** En-tête d'une page intérieure : fil d'Ariane, H1, chapeau, et une arche à droite. */
export function EnTete({
  page,
  titre,
  chapeau,
  dessin,
}: {
  page: Exclude<RouteKey, "accueil">;
  titre: string;
  chapeau?: React.ReactNode;
  dessin?: React.ReactNode;
}) {
  return (
    <section className="cadre grid items-end gap-10 pt-4 pb-16 md:grid-cols-12 md:gap-6 md:pt-10 md:pb-24">
      <div className={`flex flex-col gap-6 ${dessin ? "md:col-span-7" : "md:col-span-9"}`}>
        <Breadcrumb page={page} />
        <h1 className="titre-page">{titre}</h1>
        {chapeau ? <p className="chapeau">{chapeau}</p> : null}
      </div>
      {dessin ? (
        <Niche className="h-[320px] md:col-span-4 md:col-start-9 md:h-[420px]">{dessin}</Niche>
      ) : null}
    </section>
  );
}

/** Un bloc de l'offre : filet épais au-dessus, titre, texte, fiche éventuelle. */
export function BlocOffre({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-t-2 border-cedre pt-5">
      <h3 className="titre-bloc">{titre}</h3>
      <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-encre">{children}</div>
    </div>
  );
}

/** Section de l'offre, sur fond lin. */
export function SectionOffre({ children }: { children: React.ReactNode }) {
  return (
    <section aria-labelledby="offre" className="bg-lin py-16 md:py-24">
      <div className="cadre flex flex-col gap-10">
        <h2 id="offre" className="titre-section">
          L’offre
        </h2>
        <div className="grid gap-10 md:grid-cols-3 md:gap-x-6 md:gap-y-12">{children}</div>
      </div>
    </section>
  );
}
