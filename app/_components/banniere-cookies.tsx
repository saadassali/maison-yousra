"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

// Bannière de consentement pour la mesure d'audience. Elle n'est rendue que si un outil de
// mesure est configuré (NEXT_PUBLIC_MESURE_AUDIENCE) : aujourd'hui aucun, donc aucune bannière.
// Le choix est gardé 6 mois dans un cookie strictement nécessaire.

const COOKIE = "consentement_mesure";
const DUREE = 60 * 60 * 24 * 182;

function lireChoix(): string | null {
  const trouve = document.cookie.split("; ").find((c) => c.startsWith(`${COOKIE}=`));
  return trouve ? trouve.slice(COOKIE.length + 1) : null;
}

const abonnes = new Set<() => void>();
function sAbonner(rappel: () => void) {
  abonnes.add(rappel);
  return () => abonnes.delete(rappel);
}

function enregistrer(choix: "oui" | "non") {
  document.cookie = `${COOKIE}=${choix}; Max-Age=${DUREE}; Path=/; SameSite=Lax; Secure`;
  abonnes.forEach((rappel) => rappel());
}

export function BanniereCookies({ lienConfidentialite }: { lienConfidentialite: string }) {
  // Côté serveur, on suppose le choix déjà fait : la bannière n'apparaît qu'après hydratation.
  const choix = useSyncExternalStore(sAbonner, lireChoix, () => "serveur");
  if (choix !== null) return null;
  return (
    <section aria-labelledby="cookies-titre" role="region">
      <h2 id="cookies-titre">Mesure d’audience</h2>
      <p>
        Acceptez-vous que nous mesurions la fréquentation du site ? Vous pouvez refuser sans
        conséquence. <Link href={lienConfidentialite}>En savoir plus</Link>
      </p>
      <button type="button" onClick={() => enregistrer("oui")}>
        Accepter
      </button>
      <button type="button" onClick={() => enregistrer("non")}>
        Refuser
      </button>
    </section>
  );
}
