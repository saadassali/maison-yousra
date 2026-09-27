"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Lien de menu qui signale la page courante (aria-current). */
export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <Link href={href} aria-current={pathname === href ? "page" : undefined}>
      {children}
    </Link>
  );
}
