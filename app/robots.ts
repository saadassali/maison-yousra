import type { MetadataRoute } from "next";
import { siteUrl } from "./_site/env";

// Les pages à jeton et la confirmation restent accessibles aux robots pour qu'ils y lisent le
// noindex : on ne les bloque pas ici.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
