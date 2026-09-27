import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";
import { BRAND, DEFAULT_LOCALE, ROUTES } from "./_site/config";
import { siteUrl } from "./_site/env";
import { JsonLd, organizationLd } from "./_site/json-ld";
import { SiteHeader } from "./_components/site-header";
import { SiteFooter } from "./_components/site-footer";
import { BanniereCookies } from "./_components/banniere-cookies";
import { contenu } from "./_content";

// Polices servies depuis le site (next/font), sans appel à Google depuis le navigateur.
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  weight: "variable",
  variable: "--font-fraunces",
  display: "swap",
});
const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-work-sans",
  display: "swap",
});

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
    <html lang={DEFAULT_LOCALE} className={`${fraunces.variable} ${workSans.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <JsonLd data={organizationLd()} />
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-lin focus:px-4 focus:py-2"
        >
          Aller au contenu
        </a>
        <SiteHeader />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        {process.env.NEXT_PUBLIC_MESURE_AUDIENCE ? (
          <BanniereCookies lienConfidentialite={ROUTES.confidentialite.path} />
        ) : null}
      </body>
    </html>
  );
}
