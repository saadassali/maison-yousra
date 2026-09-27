import type { Metadata } from "next";
import Link from "next/link";
import { z } from "zod";
import { configDevis } from "../../_devis/config";
import { lireJeton } from "../../_devis/liens";
import { BRAND, ROUTES } from "../../_site/config";

// Confirmation de la demande (prompt 4). Hors sitemap, noindex. Les données viennent d'un jeton
// signé par le serveur : elles ne contiennent que ce que le client peut voir (référence,
// libellés, fourchette arrondie), jamais un prix d'achat ni un fournisseur.

export const metadata: Metadata = {
  title: { absolute: `Demande envoyée | ${BRAND}` },
  robots: { index: false, follow: false },
};

const confirmationSchema = z.object({
  reference: z.string(),
  provisoire: z.boolean(),
  lignes: z.array(z.object({ libelle: z.string(), fourchette: z.object({ min: z.number(), max: z.number() }).nullable() })),
  logo: z.boolean(),
});

const mad = (n: number) => new Intl.NumberFormat("fr-MA", { maximumFractionDigits: 0 }).format(n);

export default async function DemandeEnvoyeePage({ searchParams }: PageProps<"/devis/envoye">) {
  const { c } = await searchParams;
  const lu = confirmationSchema.safeParse(lireJeton(typeof c === "string" ? c : undefined));
  const confirmation = lu.success ? lu.data : null;
  const adresse = configDevis.expediteur() ?? "[À COMPLÉTER : adresse devis@ du domaine B (QUOTE_FROM_EMAIL)]";
  const avecFourchette = confirmation?.lignes.filter((l) => l.fourchette) ?? [];

  return (
    <section className="cadre grid gap-10 pt-10 pb-20 md:grid-cols-12 md:gap-6 md:pt-16 md:pb-28">
      <div className="flex flex-col gap-6 md:col-span-7">
        <h1 className="titre-page">Demande reçue, merci.</h1>
        {confirmation ? (
          <p className="chapeau">
            {confirmation.provisoire ? "Référence d’envoi" : "Référence"} :{" "}
            <strong className="font-semibold text-cedre">{confirmation.reference}</strong>. Votre devis
            ferme arrive sous 24 heures ouvrées, depuis <strong className="font-semibold text-cedre">{adresse}</strong>.
          </p>
        ) : (
          <p className="chapeau">
            Votre devis ferme arrive sous 24 heures ouvrées, depuis{" "}
            <strong className="font-semibold text-cedre">{adresse}</strong>.
          </p>
        )}
        {confirmation?.logo ? (
          <p className="text-[15px] text-encre">
            Nous avons bien reçu votre logo. Il reste privé et ne sert qu’à votre maquette et à votre
            étiquette.
          </p>
        ) : null}
        <p>
          <Link href={ROUTES.personnalisation.path}>Comment se passe la suite : BAT, fabrication, livraison</Link>
        </p>
      </div>

      {avecFourchette.length > 0 ? (
        <div className="flex flex-col gap-4 self-start rounded-[4px] bg-safran p-6 md:col-span-5">
          <h2 className="etiquette font-sans text-cedre">Prix indicatif</h2>
          <ul className="flex flex-col gap-3">
            {avecFourchette.map((l) => (
              <li key={l.libelle}>
                <p className="text-[15px]">{l.libelle}</p>
                <p className="font-display text-[28px] font-normal">
                  {mad(l.fourchette!.min)} à {mad(l.fourchette!.max)} MAD l’unité
                </p>
              </li>
            ))}
          </ul>
          <p className="text-[13px]">Packaging personnalisé compris. Ce n’est pas un devis.</p>
        </div>
      ) : null}
    </section>
  );
}
