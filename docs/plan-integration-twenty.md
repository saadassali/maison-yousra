# Site B — Maison Yousra : intégration et connexion à Twenty

*29 septembre 2026 · site `~/maison-yousra` · Twenty v2.43 sur `https://algosoft-crm.com` (espace « Negoce »)*
*Références : `WEBHOOKS.md`, `DEPLOIEMENT.md`, `lib/SOURCE.md`, `docs/ventes-export/23-twenty-plan-complet.md`, `~/twenty-sassali/negoce/workflows-W1-W22.md`*

Ce plan dit ce qu'il faut régler **dans Twenty** et **dans le site** pour que le formulaire de
devis, la fourchette indicative, les verrous de publication et, plus tard, la page du devis
parlent à Twenty. L'état des lieux a été vérifié sur l'espace réel le 29 septembre 2026. Le site A
(`~/yasmina-botanicals/docs/plan/03-integration-twenty.md`) passe **en premier** : le site B
recopie ensuite son module `lib/twenty/`.

---

## 1. État des lieux (vérifié le 29/09/2026)

| Sujet | Côté site B | Côté Twenty | Écart |
|---|---|---|---|
| Formulaire → W1 | Codé (`app/devis/actions.ts`, `app/_devis/w1.ts`), repli SMTP si échec ou > 8 s | W1 commun aux deux sites, **brouillon inactif** | Aucun envoi réel tant que W1 n'est pas actif |
| Authentification | Secret dans `x-webhook-secret` et dans le corps (`secret`) | Déclencheur W1 en `API_KEY` : attend `Authorization: Bearer <clé>` | **Bloquant** : l'appel sera refusé |
| Clé d'API | `TWENTY_API_KEY` prévue, rôle « Sites » | Rôle « Sites » créé ; **aucune clé** à ce rôle | À créer (une clé propre au site B) |
| Produit d'une ligne | `produitTwentyId` + slug `produit` + `produitNom` | W1 lit **`productId`**, sinon le **nom exact** du produit Twenty | **Aucune ligne reconnue** : toutes les demandes partent en A_VERIFIER |
| Format | `format` (FLACON, RECHARGE_5L…, BOUTEILLE) | `quoteRequestLine.format` existe, mais **W1 ne l'enregistre pas** ; BOUTEILLE absent des sélections | Le format choisi par le client est perdu |
| Société, contact | `societe.nom`, `ville` ; `contact.nom` (nom complet), `fonction`, `telephone` | W1 accepte ces clés (découpe le nom au premier espace) | Conforme |
| Segment, source | HOTEL_RIAD, SPA_HAMMAM… ; QR_CODE, ETRADE_MA… | Mêmes valeurs dans `quoteRequest.segment` et `source` | Conforme |
| Champs propres au site B | `nombreChambres`, `nombreInvites`, `dateEvenement`, `villeLivraison`, `lienLogo`, `fourchetteAffichee`, `qrCodeId` | Tous présents dans `quoteRequest` et enregistrés par W1 | Conforme |
| Fourchette | `GET /rest/supplierOffers?filter=and(productId[eq]:"…",statut[eq]:"VALIDE")`, MATIERE **et** PACKAGING en MAD | Requête testée : syntaxe et format de réponse **conformes** | Renvoie **0 offre** : les 134 offres (96 MATIERE, 38 PACKAGING) sont A_CONFIRMER, **aucune n'a de prix** |
| Identifiants Twenty dans le contenu | `twentyId` prévu dans `content/produits.ts` | — | **Aucun** `twentyId` saisi |
| Conformité (DMP / ONSSA) | Saisie dans `content/produits.ts`, verrou au build (`app/_content/verrous.ts`) | `conformiteType`, `numeroEnregistrement`, `enregistrementExpireLe`, `publieSurSite` sur le produit ; W13 met `publieSurSite` à faux à l'expiration | Deux sources ; le site ne lit pas Twenty, donc W13 ne retire rien du site |
| Coopératives nommées | `content/cooperatives.ts` (`dateAccordEcrit`, `fournitSiteA`) | `writtenConsent` + W20 (`coBrandingAutorise`, tâche « retirer du site B ») | Même double saisie |
| `lib/twenty/` | Provisoire (`app/_devis/twenty.ts`, `envoi.ts`) | — | À remplacer par la copie du site A (`lib/SOURCE.md`) |

**URL du webhook W1** (commune aux deux sites) :
`https://algosoft-crm.com/webhooks/workflows/016e77c6-b979-4b08-8b8f-cb4e9df29841/c2cdaa23-5e02-40e2-b939-be5efeb6942f`
(W8 : `…/d551c803-8cc2-40d0-a84f-3b3cbfc91957`). À confirmer dans le déclencheur une fois W1 activé.

**Réponse à la question ouverte de `DEPLOIEMENT.md`** (un secret par site) : avec l'authentification
par clé d'API, chaque site a **sa propre clé**, pour la même URL de webhook. On révoque la clé du
site B sans toucher au site A ; W1 n'a pas à connaître deux secrets.

---

## 2. Le catalogue : faire correspondre le site et Twenty

Le site B a 12 produits ; Twenty en a 26 visibles pour Maison Yousra (Maison Yousra + Les deux).
Correspondances trouvées :

| Produit du site (`id`) | Produit Twenty | `twentyId` | À faire |
|---|---|---|---|
| `savon-noir` | Savon noir | `52b02ced-9075-4b5e-8bfd-1d9b7fad5dde` | — |
| `ghassoul` | Ghassoul | `6c93671c-e1bd-48a0-ac7e-00df7a462bab` | — |
| `gant-kessa` | Gant de hammam (kessa) | `e0fb65a2-1ebc-4c47-937d-11755fed302d` | — |
| `huile-argan` | Huile d'argan | `62629114-5c3d-4789-8061-71f2f885cc94` | — |
| `shampoing-argan` | Shampooing à l'argan | `e3859c16-ee36-41a2-95b0-12fb738b0516` | Orthographe différente (« shampoing ») : le rattachement par nom échouerait, l'identifiant suffit |
| `eau-fleur-oranger` | Eau de fleur d'oranger | `99b0565d-e882-4d42-a61e-93926329f13a` | Produit LES_DEUX : mêmes offres que le site A |
| `huile-olive-du-verger` | Huile d'olive du verger (bouteille) | `25e067a6-c2f9-4dcb-a0be-a38cca6e74c4` | **Aucune offre fournisseur** dans Twenty |
| `gel-douche-argan` | — | — | **Créer** « Gel douche à l'argan » (ou le rattacher à « Gamme accueil hôtel ») |
| `savon-solide-argan`, `-ghassoul`, `-fleur-oranger` | Savon solide (un seul) | `1d5ebe08-0fca-4910-9657-bd37b98d83b4` | **Trancher** : trois produits Twenty (un devis et des offres par parfum), ou un seul avec le parfum en `specification` |
| `coffret-gourmand` | — (Amlou, Miel, Safran séparés) | — | **Créer** « Coffret gourmand » avec ses offres de composants et de boîte |

- [ ] Créer ou rattacher les produits manquants, puis saisir chaque `twentyId` dans `content/produits.ts`.
- [ ] Ajouter **BOUTEILLE** à `product.formatsDisponibles` et à `quoteRequestLine.format`.
- [ ] Sur chaque produit Twenty du site B, `minimumCommande` et `delaiJours` en **nombre de
      contenants** et en jours : le score de W1 compare `quantite` (contenants) à ce minimum.

## 3. Phase 1 — Préparer Twenty

Les points communs aux deux sites (désactiver le workflow de démonstration, W1 qui lit
`siteWeb || domainName`, `quoteRequest.devise`) sont dans le plan du site A. En plus, pour le site B :

- [ ] **Créer la clé d'API « Site B »**, rôle **Sites**, expiration notée dans l'agenda.
- [ ] **W1, étape « Qualifier la demande »** : lire `l.productId || l.produitTwentyId` et garder
      `l.format` dans les lignes ; **étape « Créer la ligne »** : enregistrer `format`.
- [ ] **Offres MATIERE et PACKAGING** des produits du site B : prix d'achat **par contenant du
      format** en MAD, `palierMinimum`, statut VALIDE une fois confirmées. La fourchette est masquée
      tant qu'il manque l'une ou l'autre (`app/_devis/fourchette.ts`).
- [ ] Confirmer les hypothèses de `WEBHOOKS.md` §Fourchette : offres PACKAGING rattachées au même
      `product` que la matière ; packaging ajouté sans marge. Elles décident aussi du calcul de W3.
- [ ] `fraisLotDefaut` des produits et `DEVIS_FRAIS_LOT_MAD` côté site (même valeur au départ).

## 4. Phase 2 — Aligner le code du site

- [ ] **Recopier `lib/twenty/`, `lib/forms/`, `lib/quote/`** du site A une fois sa phase 2 terminée
      (procédure de `lib/SOURCE.md`), puis supprimer les provisoires `app/_devis/twenty.ts` et
      l'envoi de `app/_devis/envoi.ts`. Noter le commit du site A dans `lib/SOURCE.md`.
- [ ] **Authentification** : `Authorization: Bearer <TWENTY_API_KEY>` ; retirer `secret` du corps
      et l'en-tête `x-webhook-secret` ; supprimer `TWENTY_W1_WEBHOOK_SECRET` et
      `TWENTY_W8_WEBHOOK_SECRET`.
- [ ] **Noms des variables** alignés sur le site A : `TWENTY_WEBHOOK_W1_URL`, `TWENTY_WEBHOOK_W8_URL`
      (aujourd'hui `TWENTY_W1_WEBHOOK_URL`…), dans `.env.example`, `config.ts` et `DEPLOIEMENT.md`.
- [ ] **`w1.ts`** : envoyer `productId` (au lieu de `produitTwentyId`, qu'on peut garder le temps
      de la transition).
- [ ] **`WEBHOOKS.md`** : authentification par clé, réponse sans référence (le site affiche déjà
      une « référence d'envoi » tirée d'`idEnvoi` : c'est le cas normal), BOUTEILLE ajouté.
- [ ] `npm run lint && npm run build && npm test` (`tests/devis.test.ts` couvre la charge W1).

## 5. Phase 3 — Tester de bout en bout (enregistrements `TEST-`)

W1 est activé seul (W2 à W4 inactifs), comme pour le site A.

- [ ] Demande `TEST- Riad` (segment hôtel, 18 chambres, Fès, téléphone, logo déposé) :
      gel douche en recharge 5 L × 10 → vérifier dans Twenty : société (`site` = Maison Yousra,
      `ville`, `segment` HOTEL_RIAD), personne (nom découpé, fonction, téléphone), demande avec
      `nombreChambres`, `villeLivraison`, `lienLogo`, `fourchetteAffichee`, ligne avec produit **et
      format**, score attendu (établissement +2, quantité ≥ minimum +2, téléphone +1, logo +1).
- [ ] Le `lienLogo` enregistré dans Twenty s'ouvre (lien signé `/fichiers/…`) et le fichier n'a
      aucune URL publique.
- [ ] Mariage avec `dateEvenement` trop proche → pas de point « date compatible ».
- [ ] `?source=qr&qr=riad-fes-01` → `source` QR_CODE et `qrCodeId` enregistrés.
- [ ] Même `idEnvoi` deux fois → une seule demande ; ligne « je ne sais pas encore » → A_VERIFIER.
- [ ] Mauvaise URL de webhook → e-mail de secours (SMTP Zoho) reçu, confirmation affichée.
- [ ] Supprimer tous les enregistrements `TEST-`.

## 6. Phase 4 — Verrous de publication reliés à Twenty

C'est le point propre au site B : un produit sans enregistrement DMP ou autorisation ONSSA
valable ne doit **jamais** apparaître (fichier 20, prompt 0, règle 4). Aujourd'hui, le site le
vérifie sur son propre contenu ; W13 le vérifie dans Twenty. Il faut qu'ils disent la même chose.

- [ ] **Au build**, un script lit dans Twenty (clé « Site B ») `publieSurSite`, `conformiteType`,
      `numeroEnregistrement` et `enregistrementExpireLe` des produits qui ont un `twentyId`, et
      **fait échouer le build** si un produit publié dans `content/produits.ts` est à
      `publieSurSite` = faux, expiré, ou d'une conformité différente. Twenty injoignable au build :
      le build échoue aussi (sur le site B, publier sans vérifier est le risque à éviter).
- [ ] **Reconstruction automatique** quand W13 retire un produit : ajouter à W13 une étape
      « requête HTTP » vers le *deploy hook* Cloudflare du site B. À défaut, une reconstruction
      planifiée chaque nuit.
- [ ] **Coopératives** : même contrôle au build entre `content/cooperatives.ts` et les accords
      écrits de Twenty (`coBrandingAutorise`, `accordPhotoActif`) ; W20 déclenche aussi la
      reconstruction quand un accord devient inactif.
- [ ] Ajouter les droits de lecture nécessaires au rôle « Sites » : `writtenConsent` (champs
      d'état seulement), en plus de `product`.

## 7. Phase 5 — Page du devis et BAT (prompt 5 du fichier 20)

| Page du site | Lit dans Twenty (clé « Site B ») | Écrit par | Lien construit par |
|---|---|---|---|
| `/devis/[jeton]` | `quote` où `jetonPublic` = jeton, statut ENVOYE, + ses lignes | webhook **W8** (Accepter) → commande BAT_EN_ATTENTE | W7 |

- [ ] Dans W7, remplacer `https://A-RENSEIGNER-site-B/devis/` par l'URL de production du site B.
- [ ] Rôle « Sites » : lecture de `quoteLine` avec les champs d'achat et de marge masqués (voir le
      plan du site A, phase 4) ; `lienMaquette` lisible pour afficher la maquette.
- [ ] **Pages fournisseur** : W4 ajoute pour le site B une consultation PACKAGING au
      conditionneur. **À trancher** : son lien « Répondre » pointe vers le site A
      (`/supplier-reply/…`, seule page fournisseur prévue) ou vers une page du site B. Un lien vers
      le site A montre au conditionneur que les deux marques vont ensemble ; si c'est à éviter,
      il faut une page de réponse sous le domaine B.
- [ ] Ouverture du devis (W18) : même question que pour le site A (clé en lecture seule).

## 8. Phase 6 — Mise en production

- [ ] Variables Cloudflare : `SITE_URL`, `SITE_A_URL`, `TWENTY_API_URL=https://algosoft-crm.com`,
      `TWENTY_API_KEY` (clé « Site B »), URL W1 et W8, `DEVIS_FRAIS_LOT_MAD`, Turnstile (widget du
      domaine B), `LIENS_SECRET`, stockage R2 privé, SMTP Zoho (`devis@maisonyousra.com`).
- [ ] Activer les workflows avec le site A (fichier 23 §11), après le branchement de la boîte
      Zoho et le test des alias `devis@maisonyousra.com` et `contact@maisonyousra.com`.
- [ ] **Surveillance** : Twenty répond 200 avant d'exécuter W1, donc un échec du workflow ne
      déclenche pas l'e-mail de secours. Chaque lundi, lister les exécutions en échec de W1 et W8.
- [ ] `scripts/check-build.mjs` : ajouter au fichier privé `SITE_B_FORBIDDEN_TERMS_FILE` les noms
      des fournisseurs et conditionneurs lus dans Twenty (export des sociétés FOURNISSEUR et
      CONDITIONNEUR), pour qu'aucun n'apparaisse sur le site B.
