import Link from "next/link";
import { BRAND, lienDevis, MAIN_NAV, ROUTES } from "../_site/config";
import { MenuMobile } from "./menu-mobile";
import { NavLink } from "./nav-link";

const lienMenu =
  "text-cedre no-underline decoration-1 underline-offset-[6px] hover:underline aria-[current=page]:underline";

export function SiteHeader() {
  return (
    <header className="cadre flex h-16 items-center justify-between gap-6 md:h-[88px]">
      <Link
        href={ROUTES.accueil.path}
        className="font-display text-[24px] text-cedre no-underline md:text-[30px]"
      >
        {BRAND}
      </Link>

      {/* Bureau */}
      <nav aria-label="Menu principal" className="hidden lg:block">
        <ul className="flex gap-8 text-[15px]">
          {MAIN_NAV.map((key) => (
            <li key={key}>
              <NavLink href={ROUTES[key].path} className={lienMenu}>
                {ROUTES[key].label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <Link href={lienDevis()} className="bouton hidden min-h-[46px] lg:inline-flex">
        Demander un devis
      </Link>

      {/* Mobile : menu dépliant sans JavaScript. */}
      <MenuMobile>
        <nav
          aria-label="Menu principal"
          className="absolute right-0 top-14 z-40 w-[min(20rem,calc(100vw-2rem))] rounded-[6px] border border-trait bg-lin p-5 shadow-[0_12px_32px_-12px_rgb(42_33_28/0.35)]"
        >
          <ul className="flex flex-col gap-1 text-[17px]">
            {MAIN_NAV.map((key) => (
              <li key={key}>
                <NavLink href={ROUTES[key].path} className={`block py-2 ${lienMenu}`}>
                  {ROUTES[key].label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Link href={lienDevis()} className="bouton mt-4 w-full">
            Demander un devis
          </Link>
        </nav>
      </MenuMobile>
    </header>
  );
}
