import Link from "next/link";
import { ROUTES, type RouteKey } from "../_site/config";
import { breadcrumbLd, JsonLd } from "../_site/json-ld";

/** Fil d’Ariane visible et son BreadcrumbList. Jamais sur l’accueil. */
export function Breadcrumb({ page }: { page: Exclude<RouteKey, "accueil"> }) {
  return (
    <nav aria-label="Fil d’Ariane">
      <JsonLd data={breadcrumbLd(page)} />
      <ol>
        <li>
          <Link href={ROUTES.accueil.path}>{ROUTES.accueil.label}</Link>
        </li>
        <li aria-current="page">{ROUTES[page].label}</li>
      </ol>
    </nav>
  );
}
