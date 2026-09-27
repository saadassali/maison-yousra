import { Breadcrumb } from "../_components/breadcrumb";
import { BRAND, COMPANY_NAME, ROUTES } from "../_site/config";
import { pageMetadata } from "../_site/metadata";

// Loi 09-08 (Maroc) et RGPD (clients européens). Mention du fichier 16 §8 reprise mot pour mot.

export const metadata = pageMetadata({
  path: ROUTES.confidentialite.path,
  title: "Politique de confidentialité | Maison Yousra",
  description:
    "Comment Maison Yousra traite vos données et vos logos, selon la loi 09-08 et le RGPD : finalités, destinataires, durées de conservation, vos droits.",
});

export default function ConfidentialitePage() {
  return (
    <>
      <Breadcrumb page="confidentialite" />
      <h1>Politique de confidentialité</h1>
      <p>
        Cette politique s’applique au site {BRAND}. Elle suit la loi marocaine n° 09-08 relative à
        la protection des personnes physiques à l’égard du traitement des données à caractère
        personnel et, pour nos clients établis dans l’Union européenne, le règlement général sur la
        protection des données (RGPD).
      </p>

      <section aria-labelledby="responsable">
        <h2 id="responsable">Responsable du traitement</h2>
        <p>
          {COMPANY_NAME}, qui exploite le nom commercial {BRAND}. Contact pour vos données :
          [À COMPLÉTER : adresse e-mail dédiée aux données personnelles].
        </p>
        <p>Déclaration auprès de la CNDP : [À COMPLÉTER : numéro de récépissé de la CNDP].</p>
      </section>

      <section aria-labelledby="collecte">
        <h2 id="collecte">Les données que nous recueillons</h2>
        <p>Par le formulaire de demande de devis seulement :</p>
        <ul>
          <li>vos coordonnées : nom, fonction, e-mail, téléphone, établissement ou société, ville ;</li>
          <li>votre demande : segment, produits, formats, quantités, date de livraison souhaitée, message ;</li>
          <li>
            selon le cas : nombre de chambres ; pour un mariage, date de l’événement et nombre
            d’invités ;
          </li>
          <li>
            la personnalisation : logo, couleurs, langues de l’étiquette, texte à imprimer (par
            exemple les prénoms des mariés et la date) ;
          </li>
          <li>la page d’où vient la demande et la source de la visite (QR code, campagne, salon).</li>
        </ul>
      </section>

      <section aria-labelledby="finalites">
        <h2 id="finalites">Pourquoi</h2>
        <ul>
          <li>vous répondre et établir votre devis ;</li>
          <li>préparer la maquette de vos produits et le bon à tirer ;</li>
          <li>suivre votre commande et votre relation avec nous.</li>
        </ul>
        <p>
          Base légale : votre consentement, donné par la case du formulaire, et les mesures
          précontractuelles que vous demandez (article 6.1.b du RGPD).
        </p>
      </section>

      <section aria-labelledby="destinataires">
        <h2 id="destinataires">Qui reçoit vos données</h2>
        <p>
          <strong>Votre demande est transmise sans vos coordonnées à des producteurs partenaires.</strong>{" "}
          Ils reçoivent les produits, les quantités et la personnalisation, jamais votre nom, votre
          e-mail ni votre téléphone.
        </p>
        <p>Vos coordonnées ne sont lues que par les associés de {COMPANY_NAME} et nos prestataires techniques :</p>
        <ul>
          <li>gestion de la relation client : [À COMPLÉTER : prestataire et pays d’hébergement du logiciel de gestion des devis] ;</li>
          <li>hébergement du site et protection du formulaire contre les robots : Cloudflare ;</li>
          <li>stockage des logos et des maquettes : [À COMPLÉTER : prestataire et pays d’hébergement] ;</li>
          <li>envoi des e-mails : [À COMPLÉTER : prestataire].</li>
        </ul>
        <p>
          Transferts hors du Maroc : [À COMPLÉTER : pays concernés et autorisation de la CNDP pour
          ces transferts].
        </p>
      </section>

      <section aria-labelledby="logos">
        <h2 id="logos">Vos logos et vos maquettes</h2>
        <p>
          Le logo que vous déposez est conservé dans un espace privé, sous un nom aléatoire, sans
          ses métadonnées. Il sert seulement à la maquette, au bon à tirer et à la fabrication de
          vos produits. Il n’est accessible par aucune adresse publique.
        </p>
      </section>

      <section aria-labelledby="durees">
        <h2 id="durees">Combien de temps</h2>
        <dl>
          <dt>Demandes de devis sans suite</dt>
          <dd>[À COMPLÉTER : durée de conservation]</dd>
          <dt>Données des clients</dt>
          <dd>[À COMPLÉTER : durée de conservation après la dernière commande]</dd>
          <dt>Logos et maquettes</dt>
          <dd>[À COMPLÉTER : durée de conservation des logos et des maquettes]</dd>
        </dl>
      </section>

      <section aria-labelledby="droits">
        <h2 id="droits">Vos droits</h2>
        <p>
          Vous pouvez accéder à vos données, les faire rectifier ou effacer, et vous opposer à leur
          traitement. Si vous êtes dans l’Union européenne, vous pouvez aussi demander la
          limitation du traitement et la portabilité de vos données, et retirer votre consentement
          à tout moment.
        </p>
        <p>
          Écrivez-nous à l’adresse indiquée plus haut. Vous pouvez aussi saisir la CNDP au Maroc
          ou, dans l’Union européenne, l’autorité de protection des données de votre pays.
        </p>
      </section>

      <section aria-labelledby="cookies">
        <h2 id="cookies">Cookies</h2>
        <p>
          Le site ne dépose aucun cookie publicitaire. Le formulaire de devis est protégé par
          Cloudflare Turnstile, qui analyse des signaux techniques du navigateur pour distinguer
          les personnes des robots.
        </p>
        <p>
          Mesure d’audience : [À COMPLÉTER : outil retenu et cookies qu’il dépose]. Si elle dépose
          des cookies, une bannière vous demande votre accord avant tout dépôt, et vous pouvez
          refuser sans conséquence.
        </p>
      </section>
    </>
  );
}
