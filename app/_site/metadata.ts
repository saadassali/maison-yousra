import type { Metadata } from "next";
import { DEFAULT_LOCALE } from "./config";

// Provisoire : à remplacer par lib/seo/ quand il aura été recopié du site A (voir lib/SOURCE.md).

const TITLE_MAX = 60;

type PageMetadataInput = {
  /** Chemin de la page, avec slash final. */
  path: string;
  /** Title complet, 60 caractères au plus. */
  title: string;
  description: string;
  /** Pages à jeton et confirmation : noindex, hors sitemap. */
  noindex?: boolean;
};

/**
 * Métadonnées d'une page : title, description, canonical auto-référent et hreflang.
 * En P1, seule la version française existe : hreflang fr et x-default vers la page elle-même.
 */
export function pageMetadata({ path, title, description, noindex }: PageMetadataInput): Metadata {
  if (title.length > TITLE_MAX) {
    throw new Error(`Title trop long (${title.length} > ${TITLE_MAX}) pour ${path} : « ${title} »`);
  }
  if (!path.endsWith("/")) {
    throw new Error(`Le chemin doit finir par un slash : ${path}`);
  }
  return {
    title: { absolute: title },
    description,
    alternates: noindex
      ? undefined
      : {
          canonical: path,
          languages: { [DEFAULT_LOCALE]: path, "x-default": path },
        },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}
