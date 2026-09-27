"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Lien de menu qui signale la page courante (aria-current). */
export function NavLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <Link href={href} className={className} aria-current={pathname === href ? "page" : undefined}>
      {children}
    </Link>
  );
}
