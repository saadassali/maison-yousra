import type { Metadata } from "next";
import { BRAND, DEFAULT_LOCALE } from "./_site/config";
import { siteUrl } from "./_site/env";
import { JsonLd, organizationLd } from "./_site/json-ld";
import { SiteHeader } from "./_components/site-header";
import { SiteFooter } from "./_components/site-footer";
import { contenu } from "./_content";

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(siteUrl()),
    applicationName: BRAND,
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  // Valide tout le contenu à chaque rendu statique : un verrou violé fait échouer le build.
  contenu();
  return (
    <html lang={DEFAULT_LOCALE}>
      <body>
        <JsonLd data={organizationLd()} />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
