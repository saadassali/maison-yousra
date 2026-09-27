import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, ROUTES } from "./_site/config";

export const metadata: Metadata = {
  title: { absolute: `Page introuvable | ${BRAND}` },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="cadre flex flex-col items-start gap-6 py-20 md:py-32">
      <h1 className="titre-page">Page introuvable</h1>
      <p className="chapeau">Cette page n’existe pas ou a changé d’adresse.</p>
      <Link href={ROUTES.accueil.path} className="bouton">
        Retour à l’accueil
      </Link>
    </section>
  );
}
