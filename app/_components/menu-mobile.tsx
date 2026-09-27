"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Menu dépliant mobile (details/summary, utilisable sans JavaScript), refermé à chaque navigation. */
export function MenuMobile({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);
  return (
    <details ref={ref} className="group relative lg:hidden">
      <summary className="flex size-11 cursor-pointer list-none items-center justify-center rounded-full border border-cedre [&::-webkit-details-marker]:hidden">
        <span className="sr-only">Menu</span>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path className="group-open:hidden" d="M2 6h14M2 12h14" />
          <path className="hidden group-open:block" d="M4 4l10 10M14 4L4 14" />
        </svg>
      </summary>
      {children}
    </details>
  );
}
