"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useRef, useState, startTransition } from "react";
import { FORMATS } from "../_content/schemas";
import {
  LANGUES_ETIQUETTE,
  LIGNES_MAX,
  LOGO_TAILLE_MAX,
  PRODUIT_INCONNU,
  SOURCES,
  lireFormulaire,
  validerDemande,
  type Erreurs,
} from "../_devis/schema";
import { SEGMENTS_DEVIS, type SegmentDevis } from "../_site/config";
import { envoyerDemande, type EtatDevis } from "./actions";

export type ProduitOption = { id: string; nom: string; formats: (keyof typeof FORMATS)[] | null };

type Ligne = { cle: number; produit: string; format: string; quantite: string };

const champ =
  "h-12 w-full rounded-[4px] border border-sourdine bg-lin px-3 text-[15px] text-cedre aria-invalid:border-2 aria-invalid:border-[#a3261c]";
const libelle = "flex flex-col gap-1.5 text-[14px] font-medium";
const legende = "etiquette pb-4";

/** Chemin de la page du site qui a mené au formulaire, s'il y en a une. */
function pageOrigine(): string {
  try {
    const ref = document.referrer ? new URL(document.referrer) : null;
    return ref && ref.origin === window.location.origin && ref.pathname !== "/devis/" ? ref.pathname : "";
  } catch {
    return "";
  }
}

function Erreur({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <span id={id} className="text-[13px] font-medium text-[#a3261c]">
      {message}
    </span>
  );
}

/** Paramètres d'URL lus par la page (côté serveur) : segment, source, QR code, UTM. */
export type ParametresDevis = {
  segment: SegmentDevis;
  source: (typeof SOURCES)[number];
  qrCodeId: string;
  utm: Partial<Record<"source" | "medium" | "campaign" | "term" | "content", string>>;
};

export function FormulaireDevis({
  produits,
  parametres,
  confidentialite,
}: {
  produits: ProduitOption[];
  parametres: ParametresDevis;
  confidentialite: string;
}) {
  const [segment, setSegment] = useState<SegmentDevis>(parametres.segment);
  // Identifiant d'envoi, créé au premier envoi et gardé : un second clic renvoie le même.
  const idEnvoi = useRef<string | null>(null);
  const [lignes, setLignes] = useState<Ligne[]>([{ cle: 0, produit: "", format: "", quantite: "" }]);
  const [erreursClient, setErreursClient] = useState<Erreurs>({});
  const [etat, formAction, enCours] = useActionState<EtatDevis, FormData>(envoyerDemande, null);
  const resume = useRef<HTMLDivElement>(null);
  const prefixe = useId();

  const erreurs: Erreurs = { ...erreursClient, ...(etat?.erreurs ?? {}) };
  const message = Object.keys(erreursClient).length ? "Certains champs sont à corriger." : etat?.message;

  useEffect(() => {
    if (message) resume.current?.focus();
  }, [message, etat]);

  const idChamp = (nom: string) => `${prefixe}-${nom.replace(/\./g, "-")}`;
  const aria = (nom: string) =>
    erreurs[nom] ? { "aria-invalid": true as const, "aria-describedby": `${idChamp(nom)}-erreur` } : {};

  function soumettre(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    idEnvoi.current ??= crypto.randomUUID();
    fd.set("idEnvoi", idEnvoi.current);
    fd.set("pageOrigine", pageOrigine());
    const verif = validerDemande(lireFormulaire(fd));
    const locales: Erreurs = verif.ok ? {} : { ...verif.erreurs };
    const logo = fd.get("logo");
    if (logo instanceof File && logo.size > LOGO_TAILLE_MAX) locales.logo = "Le logo dépasse 5 Mo.";
    setErreursClient(locales);
    if (Object.keys(locales).length) {
      resume.current?.focus();
      return;
    }
    startTransition(() => formAction(fd));
  }

  const maj = (cle: number, modif: Partial<Ligne>) =>
    setLignes((ls) => ls.map((l) => (l.cle === cle ? { ...l, ...modif } : l)));

  return (
    <form action={formAction} onSubmit={soumettre} noValidate className="flex flex-col gap-10">
      <div ref={resume} tabIndex={-1} role={message ? "alert" : undefined} className="outline-none">
        {message ? (
          <div className="rounded-[4px] border-2 border-[#a3261c] bg-lin p-4 text-[15px]">
            <p className="font-semibold">{message}</p>
            {Object.keys(erreurs).length ? (
              <ul className="mt-2 list-disc pl-5">
                {Object.entries(erreurs).map(([nom, texte]) => (
                  <li key={nom}>
                    <a href={`#${idChamp(nom)}`}>{texte}</a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Champs cachés */}
      <input type="hidden" name="source" value={parametres.source} />
      <input type="hidden" name="qrCodeId" value={parametres.qrCodeId} />
      {Object.entries(parametres.utm).map(([c, v]) => (
        <input key={c} type="hidden" name={`utm_${c}`} value={v} />
      ))}
      {/* Champ piège : invisible pour les personnes, rempli par les robots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Ne pas remplir
          <input type="text" name="contact_b" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <fieldset className="flex flex-col gap-4">
        <legend className={legende}>1 · Vous êtes</legend>
        <div id={idChamp("segment")} className="flex flex-wrap gap-2.5">
          {Object.entries(SEGMENTS_DEVIS).map(([cle, nom]) => (
            <label
              key={cle}
              className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-cedre px-4 text-[14px] font-medium has-checked:bg-cedre has-checked:text-enduit has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-indigo"
            >
              <input
                type="radio"
                name="segment"
                value={cle}
                checked={segment === cle}
                onChange={() => setSegment(cle as SegmentDevis)}
                className="sr-only"
              />
              {nom}
            </label>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={libelle}>
            {segment === "hotel" || segment === "spa" ? "Établissement" : "Société ou nom"}
            <input id={idChamp("etablissement")} name="etablissement" autoComplete="organization" className={champ} {...aria("etablissement")} />
            <Erreur id={`${idChamp("etablissement")}-erreur`} message={erreurs.etablissement} />
          </label>
          <label className={libelle}>
            Ville
            <input id={idChamp("ville")} name="ville" autoComplete="address-level2" className={champ} {...aria("ville")} />
            <Erreur id={`${idChamp("ville")}-erreur`} message={erreurs.ville} />
          </label>
          <label className={libelle}>
            Votre nom
            <input id={idChamp("nom")} name="nom" autoComplete="name" className={champ} {...aria("nom")} />
            <Erreur id={`${idChamp("nom")}-erreur`} message={erreurs.nom} />
          </label>
          <label className={libelle}>
            Votre fonction
            <input id={idChamp("fonction")} name="fonction" autoComplete="organization-title" placeholder="ex. gouvernante générale" className={champ} {...aria("fonction")} />
            <Erreur id={`${idChamp("fonction")}-erreur`} message={erreurs.fonction} />
          </label>
          <label className={libelle}>
            E-mail
            <input id={idChamp("email")} name="email" type="email" autoComplete="email" className={champ} {...aria("email")} />
            <Erreur id={`${idChamp("email")}-erreur`} message={erreurs.email} />
          </label>
          <label className={libelle}>
            Téléphone
            <input id={idChamp("telephone")} name="telephone" type="tel" autoComplete="tel" className={champ} {...aria("telephone")} />
            <Erreur id={`${idChamp("telephone")}-erreur`} message={erreurs.telephone} />
          </label>
          {segment === "hotel" ? (
            <label className={libelle}>
              Nombre de chambres (facultatif)
              <input id={idChamp("nombreChambres")} name="nombreChambres" inputMode="numeric" className={champ} {...aria("nombreChambres")} />
              <Erreur id={`${idChamp("nombreChambres")}-erreur`} message={erreurs.nombreChambres} />
            </label>
          ) : null}
          {segment === "mariage" ? (
            <>
              <label className={libelle}>
                Date du mariage
                <input id={idChamp("dateEvenement")} name="dateEvenement" type="date" className={champ} {...aria("dateEvenement")} />
                <Erreur id={`${idChamp("dateEvenement")}-erreur`} message={erreurs.dateEvenement} />
              </label>
              <label className={libelle}>
                Nombre d’invités
                <input id={idChamp("nombreInvites")} name="nombreInvites" inputMode="numeric" className={champ} {...aria("nombreInvites")} />
                <Erreur id={`${idChamp("nombreInvites")}-erreur`} message={erreurs.nombreInvites} />
              </label>
            </>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border-t border-cedre pt-6">
        <legend className={`${legende} float-left w-full`}>2 · Produits</legend>
        {produits.length === 0 ? (
          <p className="text-[14px] text-encre">
            Aucun produit n’est encore publié : choisissez « Je ne sais pas encore » et décrivez votre
            besoin dans le message.
          </p>
        ) : null}
        {lignes.map((ligne, i) => {
          const produit = produits.find((p) => p.id === ligne.produit);
          const formats = produit?.formats ?? (Object.keys(FORMATS) as (keyof typeof FORMATS)[]);
          return (
            <div key={ligne.cle} className="grid gap-3.5 rounded-[4px] bg-lin p-4 sm:grid-cols-[2fr_1.3fr_1fr_auto] sm:items-start">
              <label className={libelle}>
                Produit
                <select
                  id={idChamp(`lignes.${i}.produit`)}
                  name="ligne-produit"
                  value={ligne.produit}
                  onChange={(e) => maj(ligne.cle, { produit: e.target.value, format: "" })}
                  className={champ}
                  {...aria(`lignes.${i}.produit`)}
                >
                  <option value="">Choisir…</option>
                  {produits.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nom}
                    </option>
                  ))}
                  <option value={PRODUIT_INCONNU}>Je ne sais pas encore</option>
                </select>
                <Erreur id={`${idChamp(`lignes.${i}.produit`)}-erreur`} message={erreurs[`lignes.${i}.produit`]} />
              </label>
              <label className={libelle}>
                Format
                <select
                  id={idChamp(`lignes.${i}.format`)}
                  name="ligne-format"
                  value={ligne.format}
                  onChange={(e) => maj(ligne.cle, { format: e.target.value })}
                  className={champ}
                  {...aria(`lignes.${i}.format`)}
                >
                  <option value="">À conseiller</option>
                  {formats.map((f) => (
                    <option key={f} value={f}>
                      {FORMATS[f]}
                    </option>
                  ))}
                </select>
                <Erreur id={`${idChamp(`lignes.${i}.format`)}-erreur`} message={erreurs[`lignes.${i}.format`]} />
              </label>
              <label className={libelle}>
                Quantité
                <input
                  id={idChamp(`lignes.${i}.quantite`)}
                  name="ligne-quantite"
                  inputMode="numeric"
                  value={ligne.quantite}
                  onChange={(e) => maj(ligne.cle, { quantite: e.target.value })}
                  className={champ}
                  {...aria(`lignes.${i}.quantite`)}
                />
                <Erreur id={`${idChamp(`lignes.${i}.quantite`)}-erreur`} message={erreurs[`lignes.${i}.quantite`]} />
              </label>
              {lignes.length > 1 ? (
                <button
                  type="button"
                  onClick={() => setLignes((ls) => ls.filter((l) => l.cle !== ligne.cle))}
                  className="min-h-11 self-end rounded-full px-3 text-[14px] underline underline-offset-4 sm:mb-0.5"
                >
                  Retirer<span className="sr-only"> la ligne {i + 1}</span>
                </button>
              ) : null}
            </div>
          );
        })}
        {lignes.length < LIGNES_MAX ? (
          <button
            type="button"
            onClick={() =>
              setLignes((ls) => [...ls, { cle: Math.max(...ls.map((l) => l.cle)) + 1, produit: "", format: "", quantite: "" }])
            }
            className="min-h-11 self-start rounded-full border border-dashed border-cedre px-5 text-[14px] font-medium"
          >
            Ajouter un produit
          </button>
        ) : null}
      </fieldset>

      <fieldset className="grid gap-4 border-t border-cedre pt-6 sm:grid-cols-2">
        <legend className={`${legende} float-left w-full`}>3 · Personnalisation</legend>
        <label className={`${libelle} sm:col-span-2`}>
          Votre logo (PNG ou SVG, 5 Mo au plus, facultatif)
          <input
            id={idChamp("logo")}
            name="logo"
            type="file"
            accept="image/png,image/svg+xml,.png,.svg"
            className="rounded-[4px] border border-dashed border-cedre bg-lin p-4 text-[14px] file:mr-4 file:min-h-11 file:rounded-full file:border-0 file:bg-cedre file:px-4 file:text-enduit"
            {...aria("logo")}
          />
          <span className="text-[13px] font-normal text-sourdine">Il reste privé : il ne sert qu’à votre maquette et à votre étiquette.</span>
          <Erreur id={`${idChamp("logo")}-erreur`} message={erreurs.logo} />
        </label>
        <label className={libelle}>
          Couleurs (facultatif)
          <input id={idChamp("couleurs")} name="couleurs" placeholder="ex. vert sauge, #6B7F5E" className={champ} {...aria("couleurs")} />
          <Erreur id={`${idChamp("couleurs")}-erreur`} message={erreurs.couleurs} />
        </label>
        <fieldset className="flex flex-col gap-1.5">
          <legend className="text-[14px] font-medium">Langue(s) de l’étiquette</legend>
          <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 text-[14px]">
            {Object.entries(LANGUES_ETIQUETTE).map(([code, nom]) => (
              <label key={code} className="inline-flex min-h-8 items-center gap-2">
                <input type="checkbox" name="langues" value={code} className="size-5 accent-indigo" defaultChecked={code === "fr"} />
                {nom}
              </label>
            ))}
          </div>
        </fieldset>
        <label className={libelle}>
          Texte à imprimer (facultatif)
          <input id={idChamp("texteAImprimer")} name="texteAImprimer" placeholder="ex. prénoms et date pour un mariage" className={champ} {...aria("texteAImprimer")} />
          <Erreur id={`${idChamp("texteAImprimer")}-erreur`} message={erreurs.texteAImprimer} />
        </label>
        <label className={libelle}>
          Livraison souhaitée
          <input id={idChamp("dateLivraison")} name="dateLivraison" type="date" className={champ} {...aria("dateLivraison")} />
          <Erreur id={`${idChamp("dateLivraison")}-erreur`} message={erreurs.dateLivraison} />
        </label>
        <label className="inline-flex min-h-8 items-center gap-2 text-[14px] sm:col-span-2">
          <input type="checkbox" name="boiteCadeau" value="oui" className="size-5 accent-indigo" />
          Avec une boîte cadeau à votre nom
        </label>
        <label className={`${libelle} sm:col-span-2`}>
          Message (facultatif)
          <textarea id={idChamp("message")} name="message" rows={4} className={`${champ} h-auto py-2`} {...aria("message")} />
          <Erreur id={`${idChamp("message")}-erreur`} message={erreurs.message} />
        </label>
      </fieldset>

      <div className="flex flex-col gap-5 border-t border-cedre pt-6">
        <label className="flex items-start gap-3 text-[14px] leading-relaxed">
          <input
            id={idChamp("consentement")}
            type="checkbox"
            name="consentement"
            value="oui"
            className="mt-0.5 size-5 shrink-0 accent-indigo"
            {...aria("consentement")}
          />
          <span>
            J’accepte le traitement de ma demande. Votre demande est transmise sans vos coordonnées à
            des producteurs partenaires. <Link href={confidentialite}>Confidentialité</Link>
          </span>
        </label>
        <Erreur id={`${idChamp("consentement")}-erreur`} message={erreurs.consentement} />
        <button type="submit" disabled={enCours} className="bouton min-h-14 self-start px-8 text-[16px] disabled:opacity-60">
          {enCours ? "Envoi en cours…" : "Envoyer ma demande"}
        </button>
      </div>
    </form>
  );
}
