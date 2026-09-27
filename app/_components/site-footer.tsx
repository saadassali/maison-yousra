import Link from "next/link";
import { COMPANY_NAME, FOOTER_NAV, ROUTES } from "../_site/config";
import { siteAUrl } from "../_site/env";

export function SiteFooter() {
  const siteA = siteAUrl();
  return (
    <footer className="border-t border-trait">
      <div className="cadre flex flex-col gap-4 py-10 text-[13px] text-sourdine md:flex-row md:items-center md:justify-between">
        <nav aria-label="Informations légales">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER_NAV.map((key) => (
              <li key={key}>
                <Link href={ROUTES[key].path} className="text-sourdine hover:text-cedre">
                  {ROUTES[key].label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Seul lien vers le site A (prompt 0, règle 6). */}
        <p>
          Une marque de{" "}
          {siteA ? (
            <a href={`${siteA}/`} className="text-sourdine hover:text-cedre">
              {COMPANY_NAME}
            </a>
          ) : (
            COMPANY_NAME
          )}
          {siteA ? null : " [À COMPLÉTER : URL du site A (SITE_A_URL)]"}
        </p>
      </div>
    </footer>
  );
}
