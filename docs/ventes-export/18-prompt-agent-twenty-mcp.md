# Prompt pour un agent IA connecté à Twenty (MCP) — mise en place du CRM

*25 septembre 2026, mis à jour le 26 septembre · construit dans Twenty le plan complet de `23-twenty-plan-complet.md` (modèle de données, relations, rôles, workflows) · circuit : `16-devis-transfert-instantane.md` · données de départ : fichiers 10, 12, 13 et 15*

> **Le modèle de données ne se décrit plus ici.** Il est dans le fichier 23, document de référence ;
> ce prompt demande à l'agent de le construire, phase par phase. Si les deux divergent, le fichier 23 prévaut.

## Avant de lancer l'agent

1. **Travaillez d'abord sur un espace Twenty de test**, pas sur l'espace réel. Quand tout est validé, relancez le prompt sur l'espace réel.
2. **Connectez un serveur MCP pour Twenty** à votre agent, avec une clé d'API d'un compte administrateur. Les serveurs existants savent lire, créer et modifier des enregistrements, y compris des objets personnalisés, et lire le modèle de données [1][2]. Twenty dispose aussi d'une API de métadonnées pour créer des objets et des champs (`/rest/metadata/`, `/metadata/`) [3].
3. **Limite connue :** aucun serveur trouvé ne sait **créer** des workflows. Ils savent seulement déclencher ceux qui ont un déclencheur webhook [1]. Le prompt demande donc à l'agent de produire des **fiches de construction** des workflows, que vous créerez dans l'interface de Twenty.
4. **Joignez à l'agent** le fichier **23** (le plan à construire), et les fichiers 10, 11, 12, 13, 15, 16 et 22 : il y trouve le contexte et les données de départ.
5. **Aucun e-mail ne doit partir pendant la mise en place** : tous les workflows restent inactifs jusqu'à la fin des tests.

---

## Le prompt (à copier tel quel)

````text
# Rôle
Tu es un intégrateur CRM. Tu configures l'espace Twenty d'une SARL marocaine de négoce
d'ingrédients végétaux et de produits finis de coopératives, à travers les outils MCP de Twenty
auxquels tu as accès. Tu travailles avec méthode, par phases, et tu n'inventes aucune donnée.

# Contexte métier (résumé ; le plan à construire est le fichier 23, le circuit le fichier 16)
- Deux sites : site A (ingrédients B2B, international) et site B (produits finis pour hôtels,
  spas, cadeaux, marque blanche ; Maroc d'abord).
- Un client demande un devis sur un site ; Twenty est le centre : il qualifie la demande, calcule
  le prix depuis une grille de prix fournisseurs, ou consulte 2 à 3 fournisseurs par e-mail, puis
  un associé valide le devis avant envoi.
- RÈGLE D'ANONYMAT ABSOLUE : un fournisseur ne doit jamais voir le nom, le pays précis, l'adresse
  ou le contact d'un client ; un client ne doit jamais voir le nom d'un fournisseur. Aucun objet,
  champ ou modèle d'e-mail destiné aux fournisseurs ne doit contenir de donnée client.
- Pas de WhatsApp. Canaux : e-mail (alias achats@ pour les fournisseurs, devis@ pour les clients)
  et pages publiques des sites, qui appellent Twenty par webhook et par l'API.

# Règles de travail
1. Ne supprime jamais un objet, un champ ou un enregistrement existant, sauf les enregistrements
   de test que tu as créées toi-même et dont le nom commence par « TEST- ».
2. Avant toute création, vérifie si l'élément existe déjà (même nom d'API) : si oui, ne le
   recrée pas, signale-le. Le travail doit pouvoir être relancé sans créer de doublons.
3. N'active aucun workflow et n'envoie aucun e-mail.
4. N'invente aucune donnée : pas de prix, pas de numéro INCI ou CAS, pas de contact, pas de
   certification qui ne figurent pas dans les fichiers joints. Un champ inconnu reste vide.
5. À la fin de chaque phase, donne un compte rendu court (créé / déjà présent / impossible, et
   pourquoi) et attends mon « OK » avant la phase suivante.
6. Si un outil te manque pour une action, ne contourne pas : écris l'instruction précise que
   je dois suivre dans l'interface de Twenty (menu, champ, valeur).
7. Noms d'API en camelCase anglais (exigence de Twenty) ; libellés affichés en français.

# Phase 0 — Découverte (ne rien créer)
- Liste les outils MCP disponibles et ce que chacun permet.
- Lis le modèle de données actuel (objets standards et personnalisés, champs).
- Dis-moi précisément ce que tu peux faire : créer des objets ? des champs ? des relations ?
  des champs de sélection avec options ? des enregistrements ? des vues ? des workflows ?
- Propose le plan d'exécution des phases 1 à 6 en tenant compte de ces capacités.

# Phase 1 — Champs ajoutés aux objets standards
Crée sur Société (company) et Personne (person) EXACTEMENT les champs du fichier 23 §3,
avec leurs noms d'API, types et options. Ne crée pas de champ qui n'y figure pas.

# Phase 2 — Objets personnalisés, champs et relations
Crée EXACTEMENT les treize objets personnalisés du fichier 23 §4 (product, supplierOffer,
quoteRequest, quoteRequestLine, supplierConsultation, quote, quoteLine, salesOrder, lot,
sampleRequest, certificate, writtenConsent, agencyDeal), avec tous leurs champs, puis les
relations du fichier 23 §5. Ordre conseillé : les objets sans relation d'abord, puis les
relations. Deux règles sont absolues :
- supplierConsultation n'a AUCUNE relation directe vers le client (règle d'anonymat) ;
- les champs marqués « Associés seulement » au §4 ne sont visibles que par le rôle Associé
  (fichier 23 §6). Si tu ne peux pas régler les rôles et les permissions de champ, écris-moi
  la marche à suivre dans l'interface, champ par champ.
Masque l'objet standard « Opportunité » du menu : il n'est pas utilisé (fichier 23 §1).

# Phase 3 — Données de départ (uniquement ce qui est dans les fichiers joints)
Produits (fichiers 10, 12, 13, 17) — renseigne INCI et CAS SEULEMENT pour ceux-ci :
- Huile de pépins de figue de barbarie — INCI Opuntia Ficus-Indica Seed Oil — SITE_A — HUILE_VEGETALE — L
- Néroli — INCI Citrus Aurantium Amara Flower Oil — CAS 8016-38-4 — SITE_A — HUILE_ESSENTIELLE — KG — matière dangereuse
- Eau de fleur d'oranger — INCI Citrus Aurantium Amara Flower Water — LES_DEUX — HYDROLAT — L
- Huile essentielle de romarin — CAS 8000-25-7 — SITE_A — HUILE_ESSENTIELLE — KG — matière dangereuse
Sans INCI ni CAS (à compléter plus tard) :
- Feuilles de romarin cultivé (SITE_A, PLANTE_SECHEE, KG) ; Tanaisie bleue (SITE_A,
  HUILE_ESSENTIELLE, KG, matière dangereuse) ; Thymus satureioides (SITE_A, HUILE_ESSENTIELLE,
  KG, matière dangereuse) ; Petitgrain bigarade (SITE_A, HUILE_ESSENTIELLE, KG, matière
  dangereuse) ; Huile d'argan (LES_DEUX, HUILE_VEGETALE, L) ; Ghassoul (LES_DEUX, ARGILE, KG) ;
  Savon noir (SITE_B, SAVON, KG) ; Eau de rose (SITE_B, HYDROLAT, L) ; Boutons de rose séchés
  (LES_DEUX, PLANTE_SECHEE, KG) ; Safran de Taliouine (SITE_B, EPICE, KG) ; Huile d'olive en
  vrac, agent (SITE_A, ALIMENTAIRE, KG) ; Huile d'olive du verger, bouteille (SITE_B,
  ALIMENTAIRE, UNITE) ; Poudre de noyaux d'olive (SITE_A, POUDRE_EXFOLIANTE, KG) ; Poudre de
  coques d'argan (SITE_A, POUDRE_EXFOLIANTE, KG) ; Savon solide (SITE_B, PRODUIT_FINI, UNITE)
- standard = vrai pour la figue, le ghassoul et l'argan ; faux pour tous les autres.

Fournisseurs (fichier 15) — typeSociete = FOURNISSEUR sauf mention ; certifications = celles
AFFICHÉES dans le fichier ; certificationsVerifiees = faux pour tous SAUF GIE Targanine :
- GIE Targanine (Agadir) : BIO_UE, COSMOS, FAIR_FOR_LIFE — vérifiée. Contact publié :
  info@targanine.com, +212 5 28 21 16 55.
- Coopérative Tamaynoute : BIO_UE, USDA, IGP, ONSSA
- Coopérative Tamounte (Imintlit) : IGP, BIO_UE
- Arganams : BIO_UE, IGP, ONSSA
- Atlas Pure : BIO_UE, COSMOS, FAIR_FOR_LIFE (note : coopérative d'origine non nommée)
- Coopérative Aachab Naama : aucune certification citée
- Biolandes (Khémisset) : BIO_UE (note : aussi concurrent)
- Landema : BIO_UE, COSMOS, FAIR_FOR_LIFE (note : aussi concurrent)
- Coopérative Souktana (Taliouine) : AOP
- GIE Dar Azaafarane (Taliouine) : BIO_UE (six coopératives membres)
- Maroc Artiza : grossiste, revendeur — typeSociete = FOURNISSEUR, note « demander le producteur »
Marque blanche (fichier 15 §2.8) — typeSociete = CONDITIONNEUR, sans certification :
- Assil Ouargane, Arganisme Organics (Essaouira), Jood Cosmetic (Aït Melloul), Organica Group,
  Bulk Moroccan Oil, BioProGreen, Be Artisan, Nila Cosmetic, Moroccan Cosmetic
Pour chaque société : mets l'adresse du site web indiquée dans le fichier 15 dans le champ
domaine ; aucun autre contact que ceux cités ci-dessus.
Certificats : pour chaque certification AFFICHÉE ci-dessus, crée un enregistrement certificate
(fichier 23 §4.11) relié à la société, type = la certification, statut ACTIF, verifie = faux
sauf pour GIE Targanine ; organisme, numéro et dates restent vides s'ils ne sont pas dans le
fichier 15.
N'ajoute AUCUNE offre fournisseur : aucun prix n'est connu.
N'ajoute AUCUN accord écrit : ils n'existent pas encore ; je les saisirai quand ils seront signés.

# Phase 4 — Vues (si tes outils le permettent, sinon instructions pour l'interface)
Crée les vues du fichier 23 §10, objet par objet. Chaque vue de travail exclut les
enregistrements dont le nom ou la référence commence par « TEST- ».

# Phase 5 — Fiches de construction des workflows W1 à W22
Tu ne peux probablement pas créer de workflows. Pour chacun des 22 workflows du fichier 23 §7,
écris une fiche prête à suivre dans l'interface de Twenty :
- nom, déclencheur exact (webhook / création ou modification d'un enregistrement / planifié /
  manuel) et ses réglages ;
- chaque étape dans l'ordre (Créer, Mettre à jour, Chercher, Itérateur, Filtre ou branche,
  Délai, Envoyer un e-mail, Code, Requête HTTP), avec les champs et les valeurs ;
- pour les actions Code : le JavaScript complet, commenté, pour
  (a) le score de qualification, avec les DEUX barèmes du fichier 23 §7.2 (W1) : site A
      (e-mail professionnel +2, site web +2, volume ≥ 1 lot par trimestre +2, usage et
      destination +1, certifications cohérentes +1) et site B (établissement identifiable +2,
      quantité ≥ minimum +2, date compatible +1, téléphone +1, logo ou personnalisation +1) ;
      ≥ 5 qualifié, 3 à 4 à vérifier, < 3 non qualifié,
  (b) le score fournisseur (prix 35 %, qualité 30 %, délais 20 %, documents 15 %),
  (c) le prix de vente : (prix d'achat + frais de lot ÷ quantité) × 1,20, conversion au cours
      bancaire moins 2 %, validité 30 jours ;
- les modèles d'e-mail (objet et corps) : pour les fournisseurs, uniquement référence, produit,
  quantité, spécification, conditionnement, délai et lien — AUCUNE donnée client ;
- un exemple de charge utile JSON pour chaque webhook (W1 formulaire, W5 réponse fournisseur,
  W8 acceptation du devis, W10 grille du lundi), d'après le fichier 23 §9 ;
- l'adresse d'envoi de chaque workflow, d'après le tableau du fichier 23 §7.1 : achats@ pour
  les fournisseurs, devis@ pour les clients (boîte Zoho, fichier 22) ;
- pour W14 et W19 : comment le workflow annule la modification interdite et crée la tâche.
Rends ces fiches dans un seul document Markdown, un titre par workflow.

# Phase 6 — Test (données fictives uniquement)
- Crée 3 demandes fictives préfixées « TEST- » :
  1. qualifiée, produit standard (25 L de figue) ;
  2. qualifiée, hors standard (ghassoul personnalisé pour un hôtel, site B) ;
  3. non qualifiée (adresse Gmail, sans site ni volume).
- Crée pour chacune ses lignes, et pour la n° 2 deux consultations fictives vers deux sociétés
  « TEST-Fournisseur-1 » et « TEST-Fournisseur-2 » que tu crées aussi.
- Vérifie que toutes les relations s'affichent, et qu'aucune consultation ne donne accès aux
  données du client.
- Crée aussi un lot TEST- relié à une commande TEST-, et vérifie que ses douze contrôles et sa
  décision s'affichent ; un échantillon TEST- ; un certificat TEST- qui expire dans 30 jours.
- Pour les tests des workflows, donne-moi la liste d'acceptation du fichier 23 §12 à dérouler
  moi-même quand les workflows seront construits.
- Rends-moi le résultat, puis, sur mon « OK », supprime uniquement les enregistrements « TEST- ».

# Compte rendu final
Un tableau : élément, statut (créé / déjà présent / à faire dans l'interface), remarque. Puis
la liste des actions manuelles qui me restent, dans l'ordre.
````

---

## Après l'agent : ce qui reste à faire à la main

1. Construire les workflows W1 à W22 dans l'interface, à partir des fiches de la phase 5, dans l'ordre des étapes du fichier 23 §11, et les tester **inactifs**, puis avec des demandes « TEST- ».
2. Connecter la boîte Zoho et passer le test des alias **achats@** et **devis@** (fichier 22 §5) avant d'activer un workflow qui envoie un e-mail.
3. Régler les permissions des champs de prix et de marge, si l'agent n'a pas pu le faire.
4. Créer les pages publiques des sites A et B (formulaire, « Répondre », devis) qui appellent les webhooks (`04` §12, `14` §8).
5. Vérifier les certificats des fournisseurs (fichier 15 §1) et cocher `certificationsVerifiees` au fur et à mesure.

---

## Sources

Consultées le 25 septembre 2026.

1. Twenty CRM MCP (0xfabrica) — outils génériques, objets personnalisés, déclenchement des workflows à webhook : https://glama.ai/mcp/servers/0xfabrica/twentycrm-mcp
2. Twenty CRM MCP Server (mhenry3164) — opérations sur les enregistrements, découverte dynamique du schéma : https://github.com/mhenry3164/twenty-crm-mcp-server
3. Twenty — APIs (API de métadonnées pour les objets, champs et relations) : https://docs.twenty.com/developers/extend/api.md
4. Twenty — documentation des workflows : https://docs.twenty.com/user-guide/workflows/overview

---

## Avertissement

- Les serveurs MCP pour Twenty sont développés par des tiers et évoluent vite : la phase 0 du prompt sert précisément à vérifier ce que le vôtre sait faire.
- Relisez chaque compte rendu de phase avant de répondre « OK ».
