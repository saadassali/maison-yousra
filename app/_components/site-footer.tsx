import Link from "next/link";
import { COMPANY_NAME, FOOTER_NAV, ROUTES } from "../_site/config";
import { siteAUrl } from "../_site/env";

export function SiteFooter() {
  const siteA = siteAUrl();
  return (
    <footer>
      <nav aria-label="Informations légales">
        <ul>
          {FOOTER_NAV.map((key) => (
            <li key={key}>
              <Link href={ROUTES[key].path}>{ROUTES[key].label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* Seul lien vers le site A (prompt 0, règle 6). */}
      <p>
        Une marque de{" "}
        {siteA ? <a href={`${siteA}/`}>{COMPANY_NAME}</a> : COMPANY_NAME}
        {siteA ? null : " [À COMPLÉTER : URL du site A (SITE_A_URL)]"}
      </p>
    </footer>
  );
}
