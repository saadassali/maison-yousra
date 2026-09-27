import Link from "next/link";
import { BRAND, lienDevis, MAIN_NAV, ROUTES } from "../_site/config";
import { NavLink } from "./nav-link";

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
              <NavLink href={ROUTES[key].path}>{ROUTES[key].label}</NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <p>
        <NavLink href={lienDevis()}>Demander un devis</NavLink>
      </p>
    </header>
  );
}
