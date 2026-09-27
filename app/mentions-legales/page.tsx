import Link from "next/link";
import { EnTete } from "../_components/en-tete";
import { BRAND, COMPANY_NAME, ROUTES } from "../_site/config";
import { pageMetadata } from "../_site/metadata";

export const metadata = pageMetadata({
  path: ROUTES.mentionsLegales.path,
  title: "Mentions légales | Maison Yousra",
  description: "Mentions légales du site Maison Yousra : éditeur, immatriculation, hébergeur.",
});

export default function MentionsLegalesPage() {
  return (
    <>
      <EnTete page="mentionsLegales" titre="Mentions légales" />
      <div className="cadre pb-20 md:pb-28">
        <div className="texte-long">

      <section aria-labelledby="editeur">
        <h2 id="editeur">Éditeur du site</h2>
        <p>
          {BRAND} est un nom commercial de {COMPANY_NAME}, société à responsabilité limitée de
          droit marocain.
        </p>
        <dl>
          <dt>Siège social</dt>
          <dd>[À COMPLÉTER : adresse du siège social]</dd>
          <dt>Capital social</dt>
          <dd>[À COMPLÉTER : capital social en dirhams]</dd>
          <dt>Registre du commerce (RC)</dt>
          <dd>[À COMPLÉTER : ville et numéro du RC]</dd>
          <dt>Identifiant commun de l’entreprise (ICE)</dt>
          <dd>[À COMPLÉTER : ICE]</dd>
          <dt>Identifiant fiscal (IF)</dt>
          <dd>[À COMPLÉTER : IF]</dd>
          <dt>Directeur de la publication</dt>
          <dd>[À COMPLÉTER : nom et fonction du gérant ou de l’associé qui porte le site]</dd>
          <dt>Contact</dt>
          <dd>[À COMPLÉTER : adresse e-mail et téléphone de contact]</dd>
        </dl>
      </section>

      <section aria-labelledby="hebergeur">
        <h2 id="hebergeur">Hébergeur</h2>
        <p>[À COMPLÉTER : nom, adresse et téléphone de l’hébergeur]</p>
      </section>

      <section aria-labelledby="propriete">
        <h2 id="propriete">Propriété intellectuelle</h2>
        <p>
          Les textes, photos et marques de ce site appartiennent à {COMPANY_NAME} ou sont utilisés
          avec l’accord de leurs auteurs et des personnes photographiées. Toute reproduction
          demande notre accord écrit.
        </p>
      </section>

      <section aria-labelledby="donnees">
        <h2 id="donnees">Données personnelles</h2>
        <p>
          Le traitement de vos données est décrit dans la{" "}
          <Link href={ROUTES.confidentialite.path}>politique de confidentialité</Link>.
        </p>
      </section>
        </div>
      </div>
    </>
  );
}
