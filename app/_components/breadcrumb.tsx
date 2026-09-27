import Link from "next/link";
import { ROUTES, type RouteKey } from "../_site/config";
import { breadcrumbLd, JsonLd } from "../_site/json-ld";

/** Fil d'Ariane visible et son BreadcrumbList. Jamais sur l'accueil. */
export function Breadcrumb({ page }: { page: Exclude<RouteKey, "accueil"> }) {
  return (
    <nav aria-label="Fil d’Ariane" className="text-[13px] text-sourdine">
      <JsonLd data={breadcrumbLd(page)} />
      <ol className="flex flex-wrap gap-2">
        <li className="after:ml-2 after:content-['/']">
          <Link href={ROUTES.accueil.path} className="text-sourdine hover:text-cedre">
            {ROUTES.accueil.label}
          </Link>
        </li>
        <li aria-current="page">{ROUTES[page].label}</li>
      </ol>
    </nav>
  );
}
