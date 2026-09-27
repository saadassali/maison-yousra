import type { MetadataRoute } from "next";
import { DEFAULT_LOCALE, ROUTES } from "./_site/config";
import { siteUrl } from "./_site/env";

// Sitemap propre au site B. Les pages à jeton (/devis/[jeton]/) et la confirmation du devis
// ne sont pas dans ROUTES : elles n'y figurent jamais.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return Object.values(ROUTES)
    .filter((route) => route.indexable)
    .map((route) => {
      const url = `${base}${route.path}`;
      return {
        url,
        alternates: { languages: { [DEFAULT_LOCALE]: url, "x-default": url } },
      };
    });
}
