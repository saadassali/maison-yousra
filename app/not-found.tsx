import Link from "next/link";
import { ROUTES } from "./_site/config";

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
