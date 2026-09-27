# Prompts pour un agent de code — site A, pages P1 et circuit des devis

*26 septembre 2026 · construit le site A (Yasmina Botanicals) décrit dans `04-plan-site-seo.md` (pages P1, lancement en novembre 2026), dans son propre dépôt `yasmine-botanicals` · branche le site sur Twenty selon `../ventes-export/16-devis-transfert-instantane.md` · objets Twenty créés par `../ventes-export/18-prompt-agent-twenty-mcp.md` · aucune consigne de style : le design se fera à part, d'après le canevas [Site A — Design](https://claude.ai/artifact/1wfN5duV5ToeZzLbdtjDvn)*

> **Ce que couvrent ces prompts.** Les six pages P1 du site A (accueil, fiche figue de barbarie,
> qualité, conditions, à propos, demande de devis), en anglais et en français, plus les pages
> légales. Les trois pages publiques du circuit des devis : le formulaire (webhook W1), la page
> « Répondre » des fournisseurs (webhook W5, grille du lundi W10) et la page du devis client
> (webhook W8). Les pages P2 et P3 viendront plus tard, sur le même socle.

---

## Avant de lancer l'agent

1. **Prenez les décisions de `04` §11** : nom de domaine (.com + .ma), anglais à la racine
   (recommandé), qui rédige et qui relit les pages techniques. La marque est **Yasmina
   Botanicals** ; l'agent utilisera `[domaine]` tant que le domaine n'est pas choisi.
2. **Préparez un espace Twenty de test** configuré avec le fichier 18 : URL des webhooks W1, W5,
   W8 et W10, et une clé d'API **limitée en lecture** aux objets `supplierOffer`,
   `supplierConsultation` et `quote`. Tous les workflows restent inactifs jusqu'au prompt 7.
3. **Le projet existe déjà** : `~/yasmine-botanicals`, un projet Next.js 16 (App Router, TypeScript, Tailwind installé mais inutilisé). Les fichiers ci-dessous y sont copiés dans `docs/`, et `AGENTS.md` porte les bonnes pratiques. Le site B a **son propre dépôt** (`~/yousra-botanicals`) : il recopiera les modules de `lib/` construits ici.
4. **Joignez à l'agent** (déjà dans `docs/`) : `04-plan-site-seo.md`, `../plan/01-plan-operationnel.md` (§2.2, §3.5,
   §6, §7, §10), `../plan/02-guide-lancement.md` (§1.7), `../produits/10-produits-regions-prix.md`
   (§2.2), `../produits/11-controle-qualite-avant-expedition.md`,
   `../ventes-export/16-devis-transfert-instantane.md`, `../ventes-export/18-prompt-agent-twenty-mcp.md`
   et `../annexes/C-modeles-documents.md`.
5. **Lancez les prompts un par un, dans l'ordre**, et relisez le compte rendu de chacun avant le
   suivant. Chaque prompt suppose que les précédents sont terminés.
6. **Placez le prompt 0 en tête de chaque session** : il porte les règles communes.
7. **Le design est dans le canevas [Site A — Design](https://claude.ai/artifact/1wfN5duV5ToeZzLbdtjDvn)** : direction de design, accueil, fiche figue de barbarie (desktop et mobile), demande de devis avec sa confirmation, page « Répondre » des fournisseurs. Les prompts n'en reprennent que la **structure** (ordre des sections, blocs, textes) ; couleurs, polices et formes seront appliquées dans une passe à part. Le canevas est privé : partagez-le (menu Partager) avant de le transmettre à l'agent ou à un designer.

---

## Prompt 0 — Règles communes (à coller en tête de chaque session)

````text
# Rôle
Tu es développeur web. Tu construis le site A d'une SARL marocaine de sourcing et de négoce
d'ingrédients végétaux (cosmétique, parfumerie), destiné à des acheteurs techniques
(formulateurs, acheteurs de matières premières). Les fichiers joints sont ta référence ; le
fichier 04 est le plan du site, le fichier 16 le circuit des devis.

# Règles absolues
1. AUCUN TRAVAIL DE STYLE. Pas de couleurs, de polices, de mise en page visuelle, d'animations,
   de bibliothèque de composants graphiques ni de framework CSS. Du HTML sémantique et
   accessible (titres hiérarchisés, listes, tableaux avec en-têtes, labels de formulaire),
   rien de plus. Le design sera fait séparément et doit pouvoir s'ajouter sans toucher au contenu.
   Le canevas de design (https://claude.ai/artifact/1wfN5duV5ToeZzLbdtjDvn) sert de référence
   pour la STRUCTURE seulement : ordre des sections, blocs et hiérarchie des titres de chaque
   page. N'en reprends ni les couleurs, ni les polices, ni les dimensions.
2. TU N'INVENTES AUCUNE DONNÉE : ni chiffre technique, ni prix, ni certification, ni
   coordonnée, ni témoignage. Ce qui manque dans les fichiers joints s'écrit [À COMPLÉTER : …]
   avec ce qu'il faut fournir. Tu tiens la liste de ces marqueurs.
3. ANONYMAT DES FOURNISSEURS. Aucun nom de coopérative, de distillateur, de producteur ou de
   fournisseur n'apparaît sur le site, dans le code livré au navigateur, dans les PDF ni dans
   les métadonnées. Un fournisseur ne voit jamais de donnée client ; un client ne voit jamais de
   nom de fournisseur.
4. RÈGLES DE RÉDACTION (fichier 04 §4) : des chiffres, des plages, des méthodes et des dates,
   pas d'adjectifs (« pure », « 100 % naturelle », « premium », « meilleure qualité » sont
   interdits) ; la SARL sélectionne, analyse et répond de chaque lot, elle ne produit ni ne
   distille, ne le laisse jamais entendre ; aucune allégation santé ou thérapeutique ; chaque
   affirmation technique a sa source ; la réponse dans les deux premières phrases.
5. LANGUES : anglais à la racine, français sous /fr/. Le texte français est rédigé, pas traduit
   mot à mot. Pas de traduction automatique brute.
6. SECRETS : clés d'API et secrets de webhook en variables d'environnement, jamais dans le code
   ni dans le navigateur. Les appels à Twenty se font uniquement côté serveur.
7. À la fin de chaque prompt, donne un compte rendu : ce qui est fait, les fichiers créés, les
   [À COMPLÉTER] ajoutés, les écarts avec les fichiers joints et leur raison.
````

---

## Prompt 1 — Le socle technique

````text
# Objectif
Créer le socle du site A, sans contenu définitif : structure, langues, SEO technique, pages vides.

# Tâches
1. Dépôt : le projet Next.js 16 existant de ce dossier (yasmine-botanicals). Pas de monorepo :
   le site B a son propre dépôt et rien ici ne dépend de lui. Le code que le site B reprendra
   va dans des modules indépendants de la marque : lib/twenty/, lib/seo/, lib/forms/, lib/legal/, lib/quote/.
   Ils ne lisent la marque, la langue, le domaine, la devise et les adresses e-mail que par
   paramètres, n'importent rien de app/ ni du contenu du site A, et se recopient tels quels
   dans l'autre dépôt. Tout le reste (pages, contenu, textes) reste dans app/. (fichier 04 §12)
   Lis la documentation de Next.js 16 dans node_modules/next/dist/docs/ avant d'écrire du code.
2. Rendu : génération statique pour les pages de contenu ; fonctions serveur seulement pour le
   formulaire et les pages à jeton (prompts 4 à 6). Hébergement prévu derrière Cloudflare :
   choisis un adaptateur compatible et documente-le.
3. Langues (fichier 04 §1) :
   - anglais à la racine (x-default), français sous /fr/, slugs traduits ;
   - table de correspondance des routes EN ↔ FR en un seul endroit ;
   - hreflang réciproque et auto-référent (en, fr, x-default, sans code pays) via
     alternates.languages, uniquement entre pages réellement traduites ;
   - canonical toujours vers la page elle-même ;
   - aucune redirection selon la langue du navigateur ; un sélecteur de langue qui mène à
     l'équivalent exact de la page courante.
4. Routes P1, avec leur équivalent français à proposer :
   /  ·  /cosmetic-ingredients/prickly-pear-seed-oil/  ·  /quality/  ·  /terms-moq-samples/
   ·  /about/  ·  /request-a-quote/  ·  pages légales (mentions légales, confidentialité).
   /cosmetic-ingredients/ n'existe pas encore (hub P2) : le fil d'Ariane de la fiche le cite
   sans lien, et aucune page ne renvoie vers une URL qui n'existe pas.
5. Une seule version d'URL : slash final partout, redirection 301 de l'autre forme ; www ou
   non selon [domaine], paramétrable.
6. Sitemap XML par langue et robots.txt. Les pages à jeton (prompts 5 et 6) et la page de
   confirmation du formulaire sont exclues du sitemap et en noindex.
7. Données structurées JSON-LD : Organization (nom, [domaine], coordonnées [À COMPLÉTER]) sur
   toutes les pages, BreadcrumbList sur toutes sauf l'accueil.
8. Gabarit commun : en-tête avec le menu (fichier 04 §6) limité aux pages P1 existantes
   (Quality, Request a quote, et la fiche figue en attendant le hub), sélecteur de langue ;
   pied de page avec mentions légales, confidentialité, et un seul lien discret vers le site B
   (« une marque de [SARL] », URL [À COMPLÉTER]).
9. Metadonnées par page : title (60 caractères au plus) et meta description, dans les deux
   langues, fournis par la page elle-même.
10. Variables d'environnement documentées dans un fichier d'exemple : URL du site, URL de
    l'API Twenty, clé d'API, URL et secret de chaque webhook (W1, W5, W8, W10), clés
    anti-spam, adresse e-mail de secours.

# Critères d'acceptation
- Le build passe ; chaque route P1 répond en EN et en FR avec un contenu provisoire.
- Chaque page porte un canonical vers elle-même et un hreflang complet et réciproque.
- Les sitemaps listent toutes les pages P1 et aucune autre.
- Aucune feuille de style n'a été ajoutée.
````

---

## Prompt 2 — Le modèle de contenu produit

````text
# Objectif
Séparer les données produit des gabarits, pour que chaque nouvelle fiche (P2 : néroli, eau de
fleur d'oranger, tanaisie, romarin) ne demande qu'un fichier de données.

# Tâches
1. Définis un schéma typé et validé au build pour une fiche produit, par langue :
   - slug, nom et origine (H1), nom INCI, n° CAS, méthode d'obtention ;
   - bloc décision : conditionnements, MOQ, délai, disponibilité de la campagne, documents
     disponibles (spécification, CoA type, FDS, déclaration d'allergènes, IFRA : oui ou non) ;
   - tableau de spécification : paramètre, unité, plage de la norme de référence, valeur du lot
     type, méthode d'analyse, source ;
   - « Pourquoi le Maroc », procédé et traçabilité (région, période, méthode, contrôles),
     qualité, réglementaire et transport (matière dangereuse ou non) ;
   - FAQ (question, réponse) ; produits liés (slugs) ;
   - campagne (« 2026-2027 ») et date de mise à jour ;
   - title, meta description ;
   - statut de publication : la fiche n'est publiée que si la checklist du plan §5 est cochée
     (deux fournisseurs, échantillons, CoA, contrat d'achat, documents réglementaires). Un champ
     booléen par élément ; une fiche incomplète n'est pas générée en production.
2. Remplis la fiche « huile de pépins de figue de barbarie » en EN et en FR avec UNIQUEMENT
   ce que donnent les fichiers joints :
   - INCI : Opuntia Ficus-Indica Seed Oil (fichier 18) ; CAS : [À COMPLÉTER] ;
   - régions et risque d'offre (cochenille, perte de plus de 120 000 ha selon l'INRA) :
     fichier 10 §2.2 et plan §3.5 — régions citées, jamais d'unité d'extraction nommée ;
   - authenticité : le profil en acides gras ne suffit pas (tournesol voisin), analyse des
     stérols et des tocophérols (plan §3.5) ;
   - transport : huile végétale, pas une matière dangereuse ;
   - toutes les valeurs de spécification, les conditionnements, le MOQ et le délai :
     [À COMPLÉTER], avec en commentaire la source attendue (CoA des fournisseurs qualifiés).
   - statut de publication : non publiée tant que la checklist n'est pas remplie ; prévois un
     mode aperçu qui l'affiche quand même en développement.
3. Un fichier de données « organisation » unique : nom de la SARL, RC, ICE, IF, adresse,
   e-mail, marque « Yasmina Botanicals », [domaine] — tout en [À COMPLÉTER] sauf ce qui est dans les fichiers.

# Critères d'acceptation
- Le build échoue si une fiche viole le schéma.
- Aucune valeur chiffrée n'apparaît sans source dans les fichiers joints.
````

---

## Prompt 3 — Les pages de contenu P1

````text
# Objectif
Rédiger et assembler les pages P1 de contenu, en EN et en FR, selon les règles du prompt 0.

# Tâches
1. Accueil / (fichier 04 §3.2)
   - Une phrase d'identité : une maison marocaine de sourcing et de négoce d'ingrédients
     végétaux, qui sélectionne, analyse et répond de chaque lot.
   - La gamme : la fiche figue de barbarie en lien ; les autres produits (néroli, eau de fleur
     d'oranger, tanaisie bleue, romarin) cités sans lien, avec « disponible sur demande ».
   - Trois preuves : un CoA réel anonymisé (lien vers /quality/, fichier [À COMPLÉTER]), les
     contrôles par lot, une réponse sous 24 h ouvrées.
   - Un appel vers /request-a-quote/.
   - Ne parle ni du verger, ni de l'huile en bouteille, ni des produits finis (site B).
2. Fiche /cosmetic-ingredients/prickly-pear-seed-oil/ — gabarit du fichier 04 §3.1, dans cet
   ordre, construit comme gabarit réutilisable depuis les données du prompt 2 :
   H1 et sous-titre INCI/CAS · bloc décision avec le bouton « Spécification et échantillon »
   (vers le formulaire, produit pré-rempli) · tableau de spécification · pourquoi le Maroc ·
   procédé et traçabilité · qualité (lien /quality/) · réglementaire et transport · FAQ ·
   lien vers /terms-moq-samples/ · formulaire court ou lien vers le formulaire.
   Données structurées : Product SANS prix, BreadcrumbList. Mention « Campagne 2026-2027,
   mis à jour le … ».
3. /quality/ (fichiers 11 et plan §6.1) — la page fusionne « comment nous travaillons »,
   « qualité et analyses » et « certifications » :
   - la procédure lot par lot, résumée pour un acheteur : spécification figée, prélèvement
     par la SARL dans le lot réel, analyse, décision, contre-échantillons conservés,
     documents, libération ;
   - le dossier documentaire (CoA par lot, FDS UE, déclaration d'allergènes 2023/1545, IFRA,
     spécification) et ce qui est disponible pour chaque produit ;
   - un CoA type anonymisé en téléchargement ([À COMPLÉTER] : fichier PDF) ;
   - certifications : n'affiche QUE celles que la SARL détient ; aujourd'hui aucune, donc
     explique la position sur le bio en négoce (plan §6.1) sans promettre de date.
   - Aucun nom de laboratoire lié à un fournisseur ; les laboratoires utilisés par la SARL :
     [À COMPLÉTER].
4. /terms-moq-samples/ (plan §10, guide §1.7, fichier 16 §5)
   - conditionnements et MOQ par produit (depuis les données produit) ;
   - principe des paliers (1 L, 5 L, 10 à 25 L, 50 L et plus) SANS prix affichés ; les prix
     sont donnés sur devis, sous 24 h ouvrées ;
   - validité des prix : 30 jours ; devises : EUR, USD ;
   - paiement : acompte et solde [À COMPLÉTER : conditions à valider par les associés] ;
   - échantillons : gratuits pour une demande qualifiée (formulaire complet, site web,
     e-mail professionnel), sinon payants et déduits de la première commande, ou expédiés sur
     le compte transporteur de l'acheteur ; formats 5 à 10 mL (huile essentielle), 50 à 100 mL
     (huile végétale) ; les échantillons d'huiles essentielles suivent les règles des
     matières dangereuses ;
   - délais indicatifs et incoterms : [À COMPLÉTER].
5. /about/ et page auteur
   - ce qu'est la SARL : négociant sur les ingrédients cosmétiques, agent sur le vrac d'huile
     d'olive (sans détailler ce métier, qui aura sa page P2) ;
   - pourquoi l'anonymat des fournisseurs protège l'acheteur (contrat avec la SARL, une
     seule responsabilité) ;
   - la page auteur : nom, parcours, domaine — [À COMPLÉTER] ; relecteur technique
     crédité quand il existera.
6. Pages légales (fichier 04 §7)
   - mentions légales : SARL, RC, ICE, IF, adresse, hébergeur — depuis le fichier
     organisation ;
   - politique de confidentialité conforme au RGPD et à la loi 09-08 : données du formulaire,
     finalité, transmission ANONYMISÉE à des producteurs partenaires (fichier 16 §8),
     outil de CRM hébergé [À COMPLÉTER : cloud ou auto-hébergé], durée de conservation
     [À COMPLÉTER], droits et contact ;
   - bannière de consentement aux cookies pour les visiteurs européens, fonctionnelle et
     sans style ; aucun traceur avant consentement.
7. Maillage (fichier 04 §6) : chaque fiche renvoie à /quality/ et /terms-moq-samples/ ;
   aucun lien vers une page qui n'existe pas encore.

# Critères d'acceptation
- Chaque page a un H1 unique, un title et une meta description dans les deux langues.
- Recherche dans le texte livré : aucun des mots interdits du prompt 0, aucune allégation
  santé, aucun nom de fournisseur.
- Liste complète des [À COMPLÉTER] par page.
````

---

## Prompt 4 — Le formulaire de demande de devis (webhook W1)

````text
# Objectif
Le formulaire /request-a-quote/ (EN et FR) qui filtre les demandes et les envoie à Twenty,
avec une fourchette de prix indicative immédiate. Référence : plan §10, fichier 16 §4 à §8,
objets Twenty du fichier 18.

# Champs
- Obligatoires (plan §10) : société, pays, site web, e-mail professionnel, nom du contact,
  volume annuel envisagé, usage final, certifications requises, marché de destination,
  délai souhaité.
- Une ou plusieurs lignes produit (fichier 16 §6.7 : un seul devis pour plusieurs produits) :
  produit (liste des produits du site A), quantité, unité, spécification, conditionnement.
- Facultatif : message libre (demandeLibre).
- Cachés : langue, page d'origine, produit pré-rempli, source (SEO par défaut ; paramètre
  d'URL pour prospection, plateforme B2B, eTrade.ma, salon), paramètres UTM.
- Case de consentement obligatoire, avec la mention : « Votre demande est transmise sans vos
  coordonnées à des producteurs partenaires. » + lien vers la confidentialité.
- Protection anti-spam : Cloudflare Turnstile, vérifié côté serveur, plus un champ piège.

# Traitement côté serveur
1. Validation complète (mêmes règles côté client et côté serveur) ; messages d'erreur
   accessibles, dans la langue de la page ; les données saisies ne sont jamais perdues.
2. Envoi au webhook W1 de Twenty (URL et secret en variables d'environnement) : un JSON dont
   les clés correspondent aux champs des objets quoteRequest et quoteRequestLine du fichier 18
   (site = SITE_A). Documente le format dans un fichier à part : il sert à construire W1.
3. Ne calcule PAS le score de qualification : c'est le rôle de W1 (fichier 16 §5).
4. Secours : si le webhook échoue ou dépasse le délai, envoie la demande complète par e-mail à
   l'adresse de secours et affiche quand même la confirmation. Journalise l'échec sans
   données personnelles.
5. Idempotence : un identifiant unique par envoi, pour qu'un double clic ne crée pas deux
   demandes.

# Page de confirmation (fichier 16 §6.1)
- Remerciement, délai : devis ferme sous 24 h ouvrées.
- Fourchette indicative par ligne, calculée côté serveur :
  - lire dans Twenty les supplierOffer de statut VALIDE pour le produit, dont le palier
    correspond à la quantité ;
  - prix = (prixAchat + frais de lot ÷ quantité) × 1,20 (guide §1.7, fichier 16 §5), frais de
    lot en variable de configuration [À COMPLÉTER] ;
  - afficher seulement le minimum et le maximum arrondis, dans la devise du visiteur (EUR ou
    USD), convertis au cours configuré moins 2 % ;
  - si aucune offre valide : pas de fourchette, seulement le délai ;
  - rien d'autre ne sort de Twenty : ni prix d'achat, ni nom, ni nombre de fournisseurs.
- noindex, hors sitemap.

# Critères d'acceptation
- Un envoi de test crée bien une demande dans le Twenty de test (workflow W1 activé sur
  l'espace de test seulement) ; webhook coupé : l'e-mail de secours part.
- La réponse envoyée au navigateur ne contient aucun prix d'achat ni nom de fournisseur
  (vérifié dans l'onglet réseau).
- Le bouton « Spécification et échantillon » d'une fiche pré-remplit le produit.
````

---

## Prompt 5 — La page « Répondre » des fournisseurs (webhooks W5 et W10)

````text
# Objectif
La page publique où un fournisseur répond à une consultation en une minute, sans compte, depuis
son téléphone (fichier 16 §4). Elle sert aussi à la confirmation de la grille du lundi (W10).

# Tâches
1. Route /supplier-reply/[jeton] (en français seulement ; une seule langue, pas de hreflang),
   noindex, nofollow, hors sitemap, sans lien depuis le reste du site, sans traceur.
2. Côté serveur, lire dans Twenty la supplierConsultation dont jetonReponse = jeton. Afficher
   UNIQUEMENT : référence de la demande, produit, quantité et unité, spécification,
   conditionnement, emballage neutre, délai de livraison souhaité à l'entrepôt de la SARL,
   date limite de réponse. Aucune donnée client : ne lis même pas la demande au-delà de ces
   champs.
3. Formulaire de cinq champs : prix proposé (MAD), quantité minimum, délai (jours), validité
   (jours), photo du lot (facultative). La photo : type et taille limités, métadonnées EXIF
   (dont GPS) supprimées côté serveur avant stockage, stockage [À COMPLÉTER : service à
   choisir], seul le lien est transmis.
4. Envoi au webhook W5 (jeton, valeurs, lien photo), avec secret partagé.
5. États à gérer : jeton inconnu, consultation déjà répondue (afficher la réponse, permettre
   une correction jusqu'à la date limite si W5 l'accepte), date limite dépassée, erreur de
   Twenty. Messages courts et clairs, en français.
6. Grille du lundi (W10) : route /supplier-reply/grid/[jeton] listant les lignes de grille du
   fournisseur (produit, palier, prix d'achat, minimum, délai) avec deux actions : « Prix
   inchangés » (un clic, envoi au webhook W10) et « Modifier » (mêmes champs, par ligne).
   Le jeton de grille identifie le fournisseur, pas une demande. Définis son format et
   documente-le pour W10.
7. Jetons : longs, aléatoires, non devinables ; aucune liste de jetons exposée ; limite de
   tentatives par IP.

# Critères d'acceptation
- Avec un jeton de test, la page n'affiche aucune donnée client, même dans le HTML source ou
  les réponses réseau.
- Une photo envoyée ressort sans métadonnées EXIF.
- Chaque état d'erreur est atteignable et testé.
````

---

## Prompt 6 — La page du devis client (webhook W8)

````text
# Objectif
Le devis sous forme de page web plutôt qu'en PDF (fichier 16 §6.2) : le client le lit,
l'accepte d'un clic, télécharge le PDF s'il le souhaite.

# Tâches
1. Route /quote/[jeton] dans la langue de la demande (EN ou FR), noindex, hors sitemap.
2. Côté serveur, lire dans Twenty le quote dont jetonPublic = jeton, seulement au statut
   ENVOYE, ACCEPTE ou EXPIRE. Afficher : référence, date, lignes (produit, quantité,
   spécification, conditionnement, prix unitaire, total), devise, validité (validiteJusquau),
   délai, conditions de paiement, incoterm, documents fournis, coordonnées de la SARL.
   JAMAIS le fournisseur retenu, le prix d'achat ni la marge : ne les lis pas.
3. Bouton « Accepter le devis » : confirmation explicite (nom et fonction de la personne qui
   accepte), puis envoi au webhook W8. Après acceptation : page de remerciement, prochaines
   étapes (facture pro forma et acompte par e-mail, fichier 16 W8).
4. Téléchargement PDF du devis, généré côté serveur à partir des mêmes données, sans
   métadonnées d'auteur ni de logiciel qui trahiraient une source ; trame de l'annexe C.
5. Suivi d'ouverture : première ouverture et nombre d'ouvertures renvoyés à Twenty (champ
   [À COMPLÉTER : à ajouter à l'objet quote, signale-le]).
6. États : devis inconnu, expiré (proposer de redemander un devis, lien vers le formulaire
   pré-rempli), déjà accepté (afficher le récapitulatif), brouillon ou à valider (répondre
   comme un devis inconnu).

# Critères d'acceptation
- Le HTML, les réponses réseau et le PDF ne contiennent aucun nom de fournisseur ni prix
  d'achat.
- Un double clic sur « Accepter » ne déclenche W8 qu'une fois.
````

---

## Prompt 7 — Vérification finale avant la mise en ligne

````text
# Objectif
Tout vérifier sur l'espace Twenty de test, puis produire la liste de ce qui reste à faire.

# Tâches
1. SEO technique : pour chaque page P1, contrôle automatique du canonical, du hreflang
   (réciproque, auto-référent, x-default), du title (≤ 60 caractères), de la meta
   description, d'un H1 unique ; sitemaps valides ; pages à jeton et confirmation en noindex
   et absentes des sitemaps ; aucun lien interne cassé ni vers une page P2.
2. Circuit des devis, sur le Twenty de test, avec les workflows activés sur cet espace
   seulement : 10 fausses demandes dont la société commence par « TEST- » :
   - 3 non qualifiées (e-mail Gmail, sans site) → W2 ;
   - 3 standard (figue, avec une offre valide dans la grille de test) → W3, fourchette
     affichée à la confirmation ;
   - 3 hors standard → W4, puis réponse via /supplier-reply/[jeton] → W5 → devis à valider
     → envoi manuel W7 → /quote/[jeton] → acceptation → W8 ;
   - 1 multi-produits → un seul devis.
   Vérifie à chaque étape les enregistrements créés dans Twenty.
3. Anonymat : recherche automatique, dans le build, les réponses de chaque route serveur et
   les PDF générés, des noms de sociétés présents dans Twenty (type FOURNISSEUR ou
   CONDITIONNEUR) et de leurs domaines. Zéro résultat attendu.
4. Sécurité : secrets absents du bundle navigateur ; webhooks refusés sans secret ; limite de
   tentatives sur les pages à jeton ; aucun traceur avant consentement.
5. Accessibilité et performance : navigation au clavier du formulaire, labels, messages
   d'erreur ; Core Web Vitals sur mobile (mesure seulement, sans travail de style).
6. Compte rendu final : résultats de chaque contrôle, liste consolidée de tous les
   [À COMPLÉTER] par page et par fichier, avec qui doit les fournir.
````

---

## Après l'agent : ce qui reste à faire à la main

- [ ] Remplir les `[À COMPLÉTER]` : données de la SARL, spécification de la figue tirée des CoA des deux fournisseurs qualifiés, CoA type anonymisé, conditions de paiement, incoterms, page auteur.
- [ ] Faire relire les pages techniques (`04` §4 : chimiste ou pharmacien), et relire le français et l'anglais.
- [ ] Passer la fiche figue en « publiée » seulement quand la checklist du plan §5 est complète.
- [ ] Supprimer les enregistrements « TEST- » de Twenty, puis activer les workflows sur l'espace réel (fichier 16 §9).
- [ ] Déployer derrière Cloudflare, rediriger le .ma en 301, déclarer le site dans Search Console (propriété de domaine) et Bing Webmaster Tools.
- [ ] Appliquer le design du canevas [Site A — Design](https://claude.ai/artifact/1wfN5duV5ToeZzLbdtjDvn) dans une passe à part : le balisage est prêt à recevoir une feuille de style.

---

## Avertissement

- Les noms d'objets et de champs Twenty sont ceux du fichier 18 : si l'agent de configuration en a changé, mettez les prompts 4 à 6 à jour avant de les lancer.
- Le fichier 04 annonce « 5 pages P1 » au calendrier (§9) mais en liste six à l'arborescence (§2) : ces prompts suivent l'arborescence, formulaire compris.
- Un agent de code peut se tromper sur les fonctions de Twenty, qui évoluent vite : chaque appel à l'API se vérifie sur l'espace de test avant la mise en ligne.
