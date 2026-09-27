import Link from "next/link";
import { BRAND, MAIN_NAV, ROUTES } from "../_site/config";

export function SiteHeader() {
  return (
    <header>
      <p>
        <Link href={ROUTES.accueil.path}>{BRAND}</Link>
      </p>
      <nav aria-label="Menu principal">
        <ul>
          {MAIN_NAV.map((key) => (
            <li key={key}>
              <Link href={ROUTES[key].path}>{ROUTES[key].label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
