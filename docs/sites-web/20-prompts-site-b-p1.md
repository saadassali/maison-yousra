# Prompts pour un agent de code — site B, pages P1 et circuit des devis

*26 septembre 2026 · construit le site B décrit dans `14-plan-site-produits-finis.md` (pages P1, lancement en janvier 2027 pour les hôtels pilotes) · offre tirée de `../produits/13-plan-produits-finis-hotels.md` · branché sur Twenty selon `../ventes-export/16-devis-transfert-instantane.md` · dans son propre dépôt `yousra-botanicals`, reprend les modules `lib/` construits avec `19-prompts-site-a-p1.md` · aucune consigne de style : le design se fera à part, d'après le canevas [Site B — Design](https://claude.ai/artifact/YXHCRxkacB3xRA8Zno5sQB)*

> **Ce que couvrent ces prompts.** Les six pages P1 du site B, en français (accueil, hôtels et
> riads, spas et hammams, cadeaux, personnalisation, devis), plus les pages légales. Le
> formulaire de devis avec les options de personnalisation (webhook W1), la maquette automatique
> à partir du logo du client (fichier 16 §6.8) et la page du devis client (webhook W8) sous le
> domaine de Maison Yousra. Les fiches produits, les pages coopératives, les QR codes, la marque
> blanche et l'anglais viendront en P2, dans le même dépôt.

> **État au 27 septembre 2026** (`~/yousra-botanicals`, GitHub privé
> `saadassali/yousra-botanicals`) : prompts 1 à 4 et passe de design faits et fusionnés. Prochain :
> prompt 5. Les modules `lib/` du site A ne sont pas encore recopiés : le site B utilise des
> équivalents provisoires, listés dans son `lib/SOURCE.md`. Points à aligner avec le site A :
> `../README.md`, « Les deux sites ».

---

## Ce qui change par rapport au site A

| | Site A | Site B |
|---|---|---|
| Lecteur | Formulateur, acheteur de matières premières | Directeur d'hébergement, gouvernante générale, directeur de spa, service achats, futurs mariés |
| Langue | Anglais à la racine, `/fr/` | **Français à la racine**, `/en/` en P2 |
| Fournisseurs | Jamais nommés | Coopératives **mises en avant**, avec leur accord écrit, seulement pour un produit fini co-brandé et **jamais** si elles fournissent le site A |
| Conditionneur | — | **Jamais nommé** : c'est le savoir-faire de la SARL |
| Condition de publication | Checklist du plan §5 | Produit **enregistré au ministère de la Santé** (DMP) ou conditionné par un établissement **autorisé par l'ONSSA** (14 §3) |
| Dépôt de code | `yasmine-botanicals` | `yousra-botanicals`, séparé ; modules `lib/` recopiés du site A |
| Demande de devis | Spécification, volume, usage | Segment, produits, quantités, **personnalisation** (logo, couleurs, langue, texte), date, ville |

---

## Avant de lancer l'agent

1. **Prenez les décisions de `14` §10** : domaine de Maison Yousra (nom à vérifier à l'OMPIC et en .com), l'associé qui porte le site B, qui fait les photos (avec autorisations écrites). L'agent utilisera `[domaine B]` en attendant.
2. **Les modules du site A doivent exister** dans `~/yasmine-botanicals` : prompts 1, 4 et 6 du fichier 19 (`lib/twenty/`, `lib/seo/`, `lib/forms/`, `lib/legal/`, `lib/quote/`). Le site B est un dépôt séparé (`~/yousra-botanicals`, Next.js 16, documents dans `docs/`, bonnes pratiques dans `AGENTS.md`) : ces modules y sont **recopiés**, pas partagés. La page fournisseur « Répondre » (fichier 19, prompt 5) reste **sur le site A seulement** : les coopératives et le conditionneur y répondent depuis les e-mails envoyés par `achats@`, qui est déjà une adresse de la SARL. Il n'y a rien à refaire pour elle dans ce dépôt.
3. **Dans Twenty** (fichier 18) : le conditionneur saisi comme société de type CONDITIONNEUR, avec sa grille de prix packaging ; les produits du site B (SITE_B ou LES_DEUX) ; l'alias `devis@[domaine B]` connecté. Tous les workflows restent inactifs jusqu'au prompt 7.
4. **Préparez les gabarits de la maquette automatique** : une image de face, sans marque, de chaque contenant standard (flacon, recharge de 5 L, pot, boîte cadeau), avec la zone de l'étiquette. Sans eux, le prompt 5 livre le mécanisme avec des gabarits provisoires.
5. **Joignez à l'agent** (déjà dans `docs/`) : `14-plan-site-produits-finis.md`, `../produits/13-plan-produits-finis-hotels.md`, `../ventes-export/16-devis-transfert-instantane.md`, `../ventes-export/18-prompt-agent-twenty-mcp.md`, `19-prompts-site-a-p1.md`, `../produits/11-controle-qualite-avant-expedition.md` et `../annexes/C-modeles-documents.md`.
6. **Lancez les prompts un par un, dans l'ordre**, et placez le prompt 0 en tête de chaque session.
7. **Le design est dans le canevas [Site B — Design](https://claude.ai/artifact/YXHCRxkacB3xRA8Zno5sQB)** : direction de design, accueil, hôtels et riads (desktop et mobile, gabarit des pages segments), personnalisation, devis avec la confirmation et la maquette. Les prompts n'en reprennent que la **structure** ; couleurs, polices et formes seront appliquées dans une passe à part. Le design du site A est dans un autre canevas ([Site A — Design](https://claude.ai/artifact/1wfN5duV5ToeZzLbdtjDvn)) : ne mélangez pas les deux. Les canevas sont privés : partagez-les (menu Partager) avant de les transmettre.

---

## Prompt 0 — Règles communes du site B (à coller en tête de chaque session)

````text
# Rôle
Tu es développeur web. Tu construis le site B d'une SARL marocaine : une marque distincte,
Maison Yousra, qui vend des produits finis de coopératives marocaines avec un packaging au nom du
client (hôtels et riads, spas et hammams, cadeaux d'entreprise et de mariage). Le site A de la
même SARL (ingrédients B2B) est dans un autre dépôt (yasmine-botanicals) : tu n'y touches
pas, tu en recopies seulement les modules de lib/. Les fichiers joints sont ta
référence : le fichier 14 est le plan du site, le fichier 13 l'offre, le fichier 16 le circuit
des devis, le fichier 19 les prompts du site A.

# Règles absolues
1. AUCUN TRAVAIL DE STYLE. Pas de couleurs, de polices, de mise en page visuelle, d'animations,
   de bibliothèque graphique ni de framework CSS. Du HTML sémantique et accessible, rien de
   plus. Le design du site B sera fait séparément, et il sera différent de celui du site A.
   Le canevas de design du site B (https://claude.ai/artifact/YXHCRxkacB3xRA8Zno5sQB) sert de
   référence pour la STRUCTURE seulement : ordre des sections, blocs et hiérarchie des titres.
   Les pages spas et hammams et cadeaux suivent la structure de la page hôtels et riads. N'en
   reprends ni les couleurs, ni les polices, ni les formes.
2. TU N'INVENTES AUCUNE DONNÉE : ni prix, ni minimum, ni délai, ni numéro d'enregistrement, ni
   nom de coopérative, ni client, ni témoignage, ni photo. Ce qui manque s'écrit
   [À COMPLÉTER : …]. Tu tiens la liste de ces marqueurs.
3. QUI PEUT ÊTRE NOMMÉ :
   - une coopérative seulement si son accord écrit est enregistré, pour un produit fini
     co-brandé, et si elle ne fournit AUCUN ingrédient vendu sur le site A ;
   - le conditionneur ou le laboratoire partenaire : jamais ;
   - un client (hôtel pilote, entreprise) : seulement avec son accord écrit enregistré ;
   - une personne photographiée : seulement avec son accord écrit, et citée.
   Ces règles sont vérifiées par le code au build (prompt 2), pas seulement par la relecture.
4. PUBLICATION : un produit n'apparaît sur une page que s'il a un enregistrement au ministère
   de la Santé (cosmétique) ou un conditionneur autorisé par l'ONSSA (alimentaire), avec le
   numéro et la date d'expiration au dossier (fichier 14 §3, fichier 13 §5).
5. RÉDACTION (fichier 14 §5) : concret et vérifiable (formats, délais, minimums, numéros
   d'enregistrement), pas d'adjectifs vides ; AUCUNE allégation santé ou thérapeutique, y
   compris pour le hammam et le ghassoul (« détoxifie », « purifie la peau », « soigne »,
   « anti-âge » sont interdits) ; on écrit pour l'acheteur professionnel, pas pour le
   consommateur final ; aucun nom de fournisseur du site A.
6. SÉPARATION DES SITES : le site B n'importe aucun contenu du site A ; un seul lien vers le
   site A, en pied de page (« une marque de [SARL] ») ; mesure d'audience, sitemap et
   propriété Search Console séparés.
7. SECRETS : clés d'API et secrets de webhook en variables d'environnement, appels à Twenty
   uniquement côté serveur.
8. À la fin de chaque prompt, donne un compte rendu : ce qui est fait, les fichiers créés, les
   [À COMPLÉTER] ajoutés, les écarts avec les fichiers joints et leur raison.
````

---

## Prompt 1 — Le socle du site B dans son propre dépôt

````text
# Objectif
Créer le socle du site B dans le projet Next.js 16 de ce dossier (yousra-botanicals), en
recopiant les modules du site A, sans contenu définitif.

# Tâches
1. Recopie depuis ../yasmine-botanicals les modules lib/twenty/, lib/seo/, lib/forms/,
   lib/legal/ et lib/quote/, sans les modifier, et note dans lib/SOURCE.md le commit du
   site A d'où ils viennent. Ce qui est propre au site B reste dans app/. Si un module
   suppose le site A (langue par défaut, marque, adresse e-mail), ne le modifie pas ici :
   signale-le dans le compte rendu, pour qu'il soit rendu paramétrable dans le dépôt du
   site A puis recopié. Tu ne modifies jamais le dépôt du site A.
   Lis la documentation de Next.js 16 dans node_modules/next/dist/docs/ avant d'écrire du code.
2. Langues (fichier 14 §2) : français à la racine (x-default), anglais prévu sous /en/ mais
   non publié en P1. Canonical sur soi-même ; hreflang seulement quand une traduction
   existera (en P1 : fr et x-default sur chaque page) ; aucune redirection selon la langue du
   navigateur.
3. Routes P1 : /  ·  /hotels-riads/  ·  /spas-hammams/  ·  /cadeaux/  ·  /personnalisation/
   ·  /devis/  ·  /mentions-legales/  ·  /confidentialite/.
4. Une seule version d'URL (slash final, www ou non selon [domaine B]). Le .ma redirigera
   en 301 vers le .com : documente-le pour la configuration Cloudflare.
5. Sitemap et robots.txt propres au site B. La confirmation du devis et les pages à jeton
   sont en noindex et hors sitemap.
6. Données structurées : Organization pour Maison Yousra ; BreadcrumbList sauf sur l'accueil.
   La SARL n'apparaît que dans les mentions légales et le lien de pied de page.
7. Gabarit commun : menu du fichier 14 §7 limité aux pages P1 (Hôtels & riads · Spas &
   hammams · Cadeaux · Personnalisation · Devis) ; « Marque blanche » viendra en P2 ; pied
   de page avec mentions légales, confidentialité et le lien vers le site A.
8. Title (60 caractères au plus) et meta description fournis par chaque page.
9. Variables d'environnement propres au site B : URL du site, adresse d'envoi
   devis@[domaine B], URL et secrets des webhooks W1 et W8 (identiques à ceux du site A ou
   non : documente), clés anti-spam, stockage des logos et des maquettes.

# Critères d'acceptation
- Le site B se construit seul, sans dépendre du dossier du site A ; les modules de lib/
  sont identiques à ceux du commit noté dans lib/SOURCE.md.
- Le build du site B ne contient aucun texte, aucune image ni aucune donnée du site A
  (vérification automatique sur le dossier de sortie).
- Aucune feuille de style n'a été ajoutée.
````

---

## Prompt 2 — Le modèle de contenu et les verrous de publication

````text
# Objectif
Des données séparées des gabarits, et des règles de publication vérifiées par le code.

# Tâches
1. Schéma « produit fini » (validé au build) :
   - nom, usage, segments concernés (hôtels, spas, cadeaux) ;
   - formats (flacon, recharge de 5 L, grand format professionnel de 1 à 5 kg, pot, boîte) ;
   - composition telle qu'elle figure sur l'étiquette ;
   - conformité : type (DMP ou ONSSA), numéro, date d'expiration du certificat ;
   - options de personnalisation (étiquette, boîte, couleurs, langue, texte libre) ;
   - minimum de commande, délai ;
   - coopérative d'origine (référence facultative) ;
   - statut de publication : publié seulement si la conformité est remplie et non expirée.
2. Schéma « coopérative » : nom, région, nombre de membres, histoire courte, date de l'accord
   écrit, produits co-brandés, et un booléen « fournit le site A ». Le build ÉCHOUE si une
   page affiche une coopérative sans accord écrit ou avec « fournit le site A » à vrai.
3. Schéma « réalisation » (preuve pour les segments) : client, segment, produits, photos,
   date de l'accord écrit du client. Sans accord : affichage anonyme (« un riad de la médina
   de Fès ») ou rien.
4. Schéma « photo » : fichier, légende, personnes présentes, accord écrit oui ou non ; le
   build refuse une photo de personne sans accord.
5. Remplis les produits du fichier 13 §2 pour le Maroc, sans aucune valeur inventée :
   savon noir (pot, recharge), ghassoul (poudre), gant de kessa, huile d'argan, gel douche et
   shampoing à l'argan en recharge, eau de fleur d'oranger, savon solide (argan, ghassoul,
   fleur d'oranger), huile d'olive du verger en bouteille, coffrets gourmands (safran, amlou,
   miel, thé). Conformité, minimum et délai : [À COMPLÉTER] ; aucun n'est donc publié
   tant que les certificats ne sont pas saisis. Prévois un mode aperçu en développement.
6. Aucune coopérative ni réalisation réelle : crée seulement des exemples marqués
   « EXEMPLE- », exclus du build de production.

# Critères d'acceptation
- Un test montre que le build échoue pour : une coopérative sans accord, une coopérative qui
  fournit le site A, une photo de personne sans accord, un produit sans conformité.
````

---

## Prompt 3 — Les pages P1

````text
# Objectif
Rédiger et assembler les pages P1 en français, selon les règles du prompt 0. Les segments
suivent le gabarit du fichier 14 §4.1 : le problème du client en une phrase, l'offre, les
preuves, comment ça marche (4 étapes, minimum, délai), le devis avec le segment présélectionné.

# Tâches
1. Accueil / : une phrase qui dit l'offre (des produits de coopératives marocaines, à votre
   nom) ; les trois segments en entrée ; la chaîne de personnalisation résumée ; les preuves
   disponibles (réalisations, coopératives, enregistrement des produits) — seulement celles
   qui passent les verrous du prompt 2 ; un appel vers /devis/. Rien sur les ingrédients en
   vrac ni sur le métier d'agent (site A).
2. /hotels-riads/ (fichier 13 §3.1, idées §6) :
   - produits d'accueil en recharge de 5 L, distributeurs au nom de l'établissement ;
   - le contrat annuel « station de recharge » : recharges livrées chaque mois, distributeurs
     prêtés — conditions [À COMPLÉTER] ;
   - le QR code de la coopérative sur le distributeur (annoncé, les pages viendront en P2) ;
   - le savon solide comme format sans emballage individuel ;
   - produits vendus au Maroc : tous enregistrés, numéro affiché.
3. /spas-hammams/ (fichier 13 §3.2) : le kit rituel professionnel en grands formats (1 à
   5 kg : savon noir, ghassoul, gant de kessa, huile d'argan) ; ce qui le distingue : un
   protocole écrit, une vidéo de formation pour les thérapeutes, le déroulé du rituel, des
   fiches clients — contenus [À COMPLÉTER]. Aucune allégation santé : on décrit les gestes et
   les produits, pas des effets.
4. /cadeaux/ (hub, fichier 13 §3.4) : trois sections sans lien vers des pages qui n'existent
   pas encore — entreprises (coffrets au logo, fin d'année, séminaires, huile d'olive du
   verger, safran, argan), mariages (cadeaux d'invités aux prénoms et à la date, petites
   séries), événements (congrès, délégations, coffret « Maroc 2030 »). Chaque section mène
   au devis avec le segment présélectionné.
5. /personnalisation/ (fichier 13 §4) :
   - la chaîne en 4 étapes, du point de vue du client : 1) choix des produits et des formats,
     2) création de l'étiquette et de la boîte avec vous, BAT à valider, 3) remplissage et
     étiquetage chez un conditionneur déclaré, contrôle d'un échantillon par lot, 4) livraison
     et facturation ;
   - ce qui rend les petites séries possibles : flacons et pots standards, impression
     numérique des étiquettes, co-branding « Établissement × Coopérative » ;
   - minimums (par exemple 500 unités ou 50 L de recharge dans le fichier 13, à confirmer :
     [À COMPLÉTER]), délais [À COMPLÉTER], acompte pour les petites séries ;
   - ce qui est personnalisable et ce qui ne l'est pas (pas de moule sur mesure).
   Le conditionneur n'est jamais nommé.
6. Pages légales : mentions légales (SARL, RC, ICE, IF, Maison Yousra comme nom commercial,
   hébergeur) ; confidentialité (loi 09-08 et RGPD) avec la mention du fichier 16 §8, les
   logos déposés, leur durée de conservation [À COMPLÉTER] ; bannière cookies.
7. Maillage (fichier 14 §7) : chaque segment renvoie à /personnalisation/ et au devis ;
   aucun lien vers une page P2.

# Critères d'acceptation
- Chaque page a un H1 unique, un title et une meta description.
- Recherche automatique dans le texte livré : aucun mot de la liste d'allégations interdites
  du prompt 0, aucun nom de conditionneur, aucun nom de fournisseur du site A.
- Liste complète des [À COMPLÉTER] par page.
````

---

## Prompt 4 — Le formulaire de devis avec personnalisation (webhook W1)

````text
# Objectif
Le formulaire /devis/ qui recueille une demande complète, personnalisation comprise, et
l'envoie à Twenty. Référence : fichier 14 §8, fichier 16 §4 à §8, objets du fichier 18.

# Champs
- Segment (hôtel ou riad, spa ou hammam, cadeaux d'entreprise, mariage, événement, autre),
  présélectionné par la page d'origine.
- L'établissement ou la société, la ville, le nom et la fonction du contact, l'e-mail, le
  téléphone.
- Pour un hôtel : nombre de chambres (facultatif) ; pour un mariage : date de l'événement et
  nombre d'invités.
- Une ou plusieurs lignes : produit (liste des produits publiés, plus « je ne sais pas encore »),
  format, quantité.
- Personnalisation : logo (dépôt de fichier : PNG ou SVG, taille limitée), couleurs
  (texte libre ou codes), langue(s) de l'étiquette, texte à imprimer (prénoms, date,
  message), boîte cadeau oui ou non.
- Date de livraison souhaitée.
- Message libre (facultatif).
- Cachés : page d'origine, segment, source (SEO par défaut ; QR_CODE, ETRADE_MA, SALON,
  PROSPECTION par paramètre d'URL), identifiant de QR code, paramètres UTM.
- Case de consentement : « Votre demande est transmise sans vos coordonnées à des producteurs
  partenaires. » + lien vers la confidentialité. Anti-spam : Turnstile et champ piège.

# Traitement côté serveur
1. Validation identique côté client et côté serveur ; messages accessibles ; rien n'est perdu
   en cas d'erreur.
2. Le logo est stocké dans un espace privé (jamais public), sous un nom aléatoire ; ses
   métadonnées sont supprimées.
3. Envoi au webhook W1 : site = SITE_B ; la personnalisation de chaque ligne va dans
   quoteRequestLine.personnalisation (fichier 18), avec le lien privé du logo et, s'il existe,
   de la maquette (prompt 5). Documente le format JSON dans un fichier à part. Si l'objet
   Twenty n'a pas de champ adapté pour un lien, signale-le au lieu de détourner un champ.
4. Secours par e-mail si le webhook échoue, comme sur le site A ; identifiant unique par envoi
   contre les doublons.
5. Le score de qualification reste le rôle de W1.

# Page de confirmation
- Référence, délai de réponse (24 h ouvrées), adresse d'envoi devis@[domaine B].
- Fourchette indicative par ligne (fichier 16 §5 et §6.1), en MAD : prix d'achat du produit
  + coût du packaging personnalisé tiré de la grille du conditionneur, selon la quantité ;
  seulement un minimum et un maximum arrondis ; masquée si une offre manque ; aucun nom de
  coopérative ni de conditionneur, aucun prix d'achat dans la réponse envoyée au navigateur.
- La maquette automatique si le client a déposé un logo (prompt 5).
- noindex, hors sitemap.

# Critères d'acceptation
- Une demande de test avec logo crée la demande et ses lignes dans le Twenty de test, avec la
  personnalisation et le lien du logo.
- Le logo n'est accessible par aucune URL publique devinable.
````

---

## Prompt 5 — La maquette automatique (fichier 16 §6.8)

````text
# Objectif
Le client dépose son logo ; le site génère une maquette de ses produits (flacon, recharge,
boîte) à son nom, affichée à la confirmation et jointe à la demande.

# Tâches
1. Gabarits : un fichier de configuration par contenant standard (image de face, zone de
   l'étiquette en pixels, fond de l'étiquette). Les images fournies sont dans
   [À COMPLÉTER : dossier des gabarits] ; en attendant, utilise des gabarits provisoires
   neutres clairement marqués « PROVISOIRE ».
2. Génération côté serveur : le logo est redimensionné pour tenir dans la zone de l'étiquette
   en gardant ses proportions, avec le texte à imprimer (prénoms, date) s'il y en a, puis
   composé sur chaque gabarit correspondant aux produits demandés.
3. Chaque maquette porte la mention « Maquette indicative, non contractuelle — le BAT suivra ».
4. Stockage privé, comme le logo ; le lien est transmis à Twenty avec la demande.
5. Échecs gérés : logo illisible, trop petit, fond non transparent (la maquette est générée
   quand même, avec un avertissement), génération trop longue (la demande part sans
   maquette, et l'associé est prévenu).
6. La génération ne bloque jamais l'envoi de la demande.

# Critères d'acceptation
- Un logo PNG transparent, un logo SVG et un logo JPEG sur fond blanc produisent chacun une
  maquette lisible sur chaque gabarit.
- Une demande sans logo fonctionne exactement comme avant.
````

---

## Prompt 6 — La page du devis client sous la marque Maison Yousra (webhook W8)

````text
# Objectif
La page publique du devis, sous le domaine de Maison Yousra, à partir du module lib/quote/
recopié du site A (fichier 19, prompt 6).

# Tâches
1. Route /devis/[jeton] sur le site B, en français, noindex, hors sitemap. Réutilise le
   module lib/quote/ ; ce qui change passe par des paramètres : marque, langue, devise (MAD
   par défaut), adresse d'expéditeur, mentions.
2. Contenu propre au site B : lignes avec format et quantité, récapitulatif de la
   personnalisation, maquette jointe, étape du BAT à venir, délai de fabrication, acompte
   demandé pour les petites séries (fichier 13 §8), validité.
3. Ne lis jamais le conditionneur, le prix d'achat ni la marge. Une coopérative peut
   apparaître seulement pour un produit co-brandé qui passe les verrous du prompt 2.
4. « Accepter le devis » : confirmation explicite (nom et fonction), envoi au webhook W8, une
   seule fois même en cas de double clic ; page de remerciement avec les prochaines étapes
   (facture pro forma et acompte, puis BAT).
5. PDF téléchargeable, sans métadonnées d'auteur ni de logiciel ; trame de l'annexe C.
6. États : inconnu, expiré (proposer un nouveau devis pré-rempli), déjà accepté.

# Critères d'acceptation
- Le site B affiche son devis de test avec sa marque, avec lib/quote/ inchangé par rapport
  au site A : seuls les paramètres diffèrent.
- Le HTML, les réponses réseau et le PDF ne contiennent ni conditionneur ni prix d'achat.
````

---

## Prompt 7 — Vérification finale avant la mise en ligne

````text
# Objectif
Tout vérifier sur l'espace Twenty de test, puis produire la liste de ce qui reste à faire.

# Tâches
1. SEO technique : canonical, hreflang (fr et x-default), title, meta description, H1 unique
   sur chaque page P1 ; sitemap du site B valide et distinct de celui du site A ; pages à
   jeton et confirmation en noindex ; aucun lien interne cassé ni vers une page P2.
2. Circuit des devis sur le Twenty de test, workflows activés sur cet espace seulement :
   8 fausses demandes dont la société commence par « TEST- » :
   - 2 hôtels (recharges de 5 L), dont un avec logo ;
   - 1 spa (kit rituel grands formats) ;
   - 2 cadeaux d'entreprise avec logo, dont un avec boîte ;
   - 1 mariage avec prénoms et date ;
   - 1 demande incomplète ou sans produit identifié ;
   - 1 venue d'un QR code (source QR_CODE et identifiant).
   Pour les demandes avec logo : maquette générée et liée. Pour une demande : consultation de
   la coopérative et du conditionneur via la page « Répondre » du site A, devis envoyé,
   ouvert sur /devis/[jeton] du site B, accepté → W8.
3. Verrous : tests du prompt 2 rejoués ; recherche automatique, dans le build, les réponses
   serveur et les PDF, des noms de toutes les sociétés de type CONDITIONNEUR et de tous les
   fournisseurs du site A : zéro résultat attendu.
4. Allégations : recherche des mots interdits du prompt 0 dans tout le texte livré.
5. Séparation : un seul lien vers le site A, en pied de page ; aucun script de mesure ni
   cookie partagé entre les deux sites.
6. Sécurité : secrets absents du navigateur ; logos et maquettes inaccessibles sans lien
   privé ; webhooks refusés sans secret.
7. Accessibilité (formulaire au clavier, labels, erreurs) et Core Web Vitals sur mobile,
   mesurés sans travail de style.
8. Compte rendu final : résultats, liste consolidée des [À COMPLÉTER] par page, avec qui doit
   les fournir.
````

---

## Après l'agent : ce qui reste à faire à la main

- [ ] Saisir les certificats d'enregistrement (DMP) ou les autorisations ONSSA de chaque produit, sinon rien ne s'affiche.
- [ ] Recueillir les accords écrits : coopératives co-brandées, hôtels pilotes cités, personnes photographiées.
- [ ] Faire les photos des premières réalisations pour les hôtels pilotes (fichier 13 §7), et fournir les gabarits de la maquette.
- [ ] Fixer les minimums, les délais, l'acompte et les conditions du contrat « station de recharge ».
- [ ] Rédiger le protocole et la vidéo de formation du kit hammam.
- [ ] Supprimer les enregistrements « TEST- » de Twenty, puis brancher le formulaire du site B sur l'espace réel (fichier 16 §9, janvier 2027).
- [ ] Déployer derrière Cloudflare, rediriger le .ma en 301, déclarer le site dans Search Console et Bing Webmaster Tools, dans des propriétés distinctes de celles du site A.
- [ ] Appliquer le design du canevas [Site B — Design](https://claude.ai/artifact/YXHCRxkacB3xRA8Zno5sQB) dans une passe à part, avec une identité distincte de celle du site A.

---

## Avertissement

- **Le score de qualification de W1 a été pensé pour le site A** (e-mail professionnel, site web, volume annuel : fichier 16 §5). Un riad ou des futurs mariés écrivent souvent depuis une adresse Gmail, sans site web. Prévoyez dans Twenty une règle de score propre au site B avant de brancher le formulaire, sinon W1 enverra ces demandes vers la réponse automatique W2.
- Les noms d'objets et de champs Twenty sont ceux du fichier 18 : les liens du logo et de la maquette n'y ont pas de champ dédié ; ajoutez-en un plutôt que de les glisser dans un champ texte.
- Le fichier 14 compte « six pages P1 » (accueil, trois segments, personnalisation, devis) ; les pages légales s'y ajoutent, comme sur le site A.
- Les pages coopératives et les QR codes sont en P2 : le formulaire enregistre déjà la source QR_CODE, pour que la mesure commence dès les premiers distributeurs.
