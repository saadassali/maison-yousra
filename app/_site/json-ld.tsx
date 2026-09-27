import { BRAND, ROUTES, type RouteKey } from "./config";
import { siteUrl } from "./env";

// Provisoire : à remplacer par lib/seo/ quand il aura été recopié du site A (voir lib/SOURCE.md).

type JsonLdObject = Record<string, unknown>;

export function JsonLd({ data }: { data: JsonLdObject }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/** Organization pour la marque. Logo et coordonnées seront ajoutés quand ils existeront. */
export function organizationLd(): JsonLdObject {
  const url = `${siteUrl()}/`;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}#organization`,
    name: BRAND,
    url,
  };
}

/** BreadcrumbList : l'accueil, puis la page. Pas sur l'accueil lui-même. */
export function breadcrumbLd(page: RouteKey): JsonLdObject {
  const base = siteUrl();
  const trail = [ROUTES.accueil, ROUTES[page]];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((route, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: route.label,
      item: `${base}${route.path}`,
    })),
  };
}
