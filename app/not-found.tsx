import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, ROUTES } from "./_site/config";

export const metadata: Metadata = {
  title: { absolute: `Page introuvable | ${BRAND}` },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <h1>Page introuvable</h1>
      <p>
        Cette page n’existe pas. <Link href={ROUTES.accueil.path}>Retour à l’accueil</Link>
      </p>
    </>
  );
}
