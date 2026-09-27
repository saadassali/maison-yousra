# Site B — produits finis (hôtels, spas, cadeaux) : plan de site

*25 septembre 2026 · construit sur `../produits/13-plan-produits-finis-hotels.md` · marque : **Maison Yousra** (retenue le 27 septembre 2026, à vérifier à l'OMPIC) · domaine à choisir · le site des ingrédients est décrit dans `04-plan-site-seo.md` (site A)*

> **En bref :** un second site, sous une marque distincte, pour vendre des produits finis de coopératives marocaines avec un packaging au nom du client. Français à la racine, anglais ensuite. Six pages en janvier 2027 pour les hôtels pilotes, puis les pages coopératives et les guides.

---

## 1. Pourquoi deux sites plutôt qu'un

| Raison | Site A — ingrédients | Site B — produits finis |
|---|---|---|
| **Qui achète** | Chimiste de R&D, acheteur de matières premières, parfumeur | Acheteur d'hôtel, directeur de spa, service achats d'une entreprise, futurs mariés |
| **Ce qu'il cherche** | INCI, n° CAS, norme ISO, MOQ, CoA | Produits d'accueil, recharges, personnalisation, délais, prix unitaire |
| **Les fournisseurs** | **Jamais nommés** : c'est ce qui protège la SARL du contournement | **Mis en avant** : l'histoire des coopératives fait vendre |
| **Premier marché** | International, anglais d'abord | Maroc, français d'abord |
| **Conversion** | Demande de devis filtrante, spécification | Devis avec options de personnalisation (segment, quantités, logo, date) |

Mélanger les deux sur un même domaine :
- ferait échouer le test de contenu du site A (« un chimiste de R&D trouverait-il cette phrase utile ou suspecte ? ») dès qu'une page de cadeaux de mariage côtoie une fiche GC-MS ;
- montrerait aux formulateurs les coopératives qui fournissent l'argan ou le ghassoul, et les inviterait à acheter en direct.

**Le coût de la séparation est faible.** Aucune page n'est encore positionnée, donc rien n'est perdu. Et l'autorité ne se transmet guère entre des sujets aussi différents : un domaine commun aiderait peu.

**L'huile d'olive se partage :** le **sourcing de vrac en agent** reste sur le site A ; le **verger de l'associé, l'huile en bouteille et « Adoptez un olivier »** vont sur le site B.

---

## 2. Marque, domaine et langues

- **Une marque commerciale distincte**, déposée à l'OMPIC, qui évoque le Maroc, le rituel et l'accueil, et ne cite aucun ingrédient (pour pouvoir élargir la gamme).
- **Un .com**, avec le **français à la racine** (x-default), `/en/` au printemps 2027 et, plus tard, `/ar/` pour le Golfe. Le .ma redirige en 301 vers le .com : le premier marché est le Maroc, mais un .ma serait rattaché au Maroc par Google et freinerait l'Europe ensuite.
- Mêmes règles internationales que le site A (`04` §1) : hreflang réciproque, slugs traduits, aucune redirection automatique selon la langue du navigateur.

---

## 3. L'arborescence

```
/                                P1  accueil : produits de coopératives marocaines, à votre nom
/hotels-riads/                   P1  produits d'accueil en recharge, distributeurs, contrat annuel
/spas-hammams/                   P1  kit rituel professionnel, protocole, formation
/cadeaux/                        P1  hub cadeaux
  entreprises/                   P2  coffrets au logo, fin d'année, séminaires
  mariages/                      P2  cadeaux d'invités personnalisés
  evenements/                    P3  congrès, délégations, coffret « Maroc 2030 »
/marque-blanche/                 P2  pour les marques : sourcing, fabrication, packaging
/produits/                       P2  catalogue
  huile-argan/                   P2
  savon-noir/                    P2
  ghassoul/                      P2
  eau-fleur-oranger/             P2
  eau-de-rose/                   P3
  savon-solide/                  P2
  huile-olive-du-verger/         P2
  coffrets-gourmands/            P3
/personnalisation/               P1  la chaîne en 4 étapes, BAT, minimums, délais
/cooperatives/                   P2  hub des coopératives partenaires
  [nom-de-la-cooperative]/       P2  page d'arrivée du QR code, avec l'accord de la coopérative
/adoptez-un-olivier/             P2
/engagements/                    P2  RSE, traçabilité, emballages rechargeables
/guides/                         P3  hub des guides
  interdiction-miniatures-2030/  P3  ce que le règlement européen change pour les hôtels
  choisir-produits-accueil/      P3
  rituel-hammam/                 P3
/devis/                          P1  formulaire avec options de personnalisation
/a-propos/                       P2
/mentions-legales/, /confidentialite/   P1
```

**Légende**

| Code | Signification |
|---|---|
| P1 | Janvier 2027, pour les hôtels pilotes (six pages, en français) |
| P2 | Avril à septembre 2027, avec l'anglais pour les pages P1 |
| P3 | 2028, avant l'échéance européenne de 2030 |

**Règle :** une page produit ne passe en ligne que si le produit est **enregistré auprès du ministère de la Santé** (cosmétiques) ou produit par un **conditionneur autorisé par l'ONSSA** (alimentaire), avec le certificat au dossier (doc 13 §5).

---

## 4. Les gabarits de page

### 4.1 La page segment (hôtels, spas, cadeaux, marque blanche)

1. **Le problème du client**, en une phrase (par exemple : « Vos clients veulent l'argan et la fleur d'oranger du Maroc, pas un gel douche importé »).
2. **L'offre** : produits, formats, personnalisation, contrat.
3. **Les preuves** : photos de réalisations, coopératives partenaires, enregistrement des produits, premiers clients (avec leur accord).
4. **Comment ça marche** : les 4 étapes de la personnalisation, le minimum de commande, le délai.
5. **Le devis**, avec le segment déjà sélectionné.

### 4.2 La fiche produit

Usage · formats (flacon, recharge de 5 L, grand format professionnel) · composition affichée comme sur l'étiquette · statut d'enregistrement · options de personnalisation · minimum de commande · délai · coopérative d'origine, si elle a accepté d'être citée.

### 4.3 La page coopérative (arrivée du QR code)

Histoire en quelques lignes · courte vidéo · membres et région · produits que vous vendez sous son nom. **Jamais** de volumes, de prix d'achat ni de coordonnées directes : le client passe par la SARL.

---

## 5. La direction du contenu

- **Concret et vérifiable** : formats, délais, minimums, numéros d'enregistrement. Pas d'adjectifs vides.
- **Aucune allégation santé ou thérapeutique**, y compris pour le hammam et le ghassoul.
- **Montrer les personnes** : les femmes des coopératives, avec leur accord écrit et en les citant.
- **Protéger le site A** :
  - ne jamais nommer une coopérative qui fournit aussi des ingrédients vendus sur le site A ;
  - ne nommer une coopérative que pour un produit fini co-brandé.
- **Parler au bon interlocuteur** : le directeur d'hébergement, la gouvernante générale et le directeur de spa, pas le consommateur final.

---

## 6. Mots-clés à valider

| Page | Requête principale |
|---|---|
| Hôtels et riads | produits d'accueil hôtel Maroc |
| Hôtels (EN) | hotel amenities refill Morocco |
| Produits d'accueil argan | amenities hôtel argan |
| Spas et hammams | kit hammam professionnel spa |
| Cadeaux entreprises | cadeaux d'entreprise Maroc |
| Mariages | cadeaux invités mariage marocain |
| Guide 2030 | interdiction miniatures hôtel 2030 / EU hotel miniature ban 2030 |

Même méthode que le site A : volume, difficulté, top 10 actuel, une requête principale par page (`04` §5).

---

## 7. Maillage et menu

- **Menu principal** : Hôtels & riads · Spas & hammams · Cadeaux · Marque blanche · Personnalisation · Devis.
- Chaque fiche produit renvoie aux segments qui l'utilisent ; chaque segment renvoie à ses produits et à `/personnalisation/`.
- Chaque page coopérative renvoie aux produits qu'elle fabrique, puis au devis.
- Les guides renvoient au segment concerné : le guide 2030 vers `/hotels-riads/`.
- **Vers le site A** : un seul lien en pied de page (« une marque de [SARL] »).

---

## 8. Technique et mesure

- **Même socle que le site A** (`04` §7 et §12) : Next.js, Cloudflare, dans un dépôt séparé (`yousra-botanicals`, privé sur GitHub), avec les modules `lib/` recopiés du site A (`yasmine-botanicals`, Yasmina Botanicals). Hébergement : le même que le site A, OpenNext pour Cloudflare.
- **Formulaire de devis** : segment, produits, quantités, personnalisation (logo, couleurs, langue), date souhaitée, ville ; champs cachés pour la page d'origine et la source (QR code, eTrade.ma, salon, recherche).
- **QR codes** : une URL par coopérative et par client, avec un paramètre de suivi, pour savoir quels distributeurs et quels coffrets font venir des visiteurs.
- **Mesure mensuelle** : devis par segment et par source ; taux de réassort des hôtels ; ventes de la boutique en dépôt-vente, s'il y en a.
- **Suivi séparé** du site A : sa propre propriété Search Console, sa mesure d'audience et son sitemap.

---

## 9. Déploiement

| Période | Contenu |
|---|---|
| **Janvier 2027** | Six pages P1 en français : accueil, hôtels et riads, spas et hammams, cadeaux, personnalisation, devis. Photos des premières réalisations pour les hôtels pilotes (doc 13 §7) |
| **Avril - juin 2027** | Fiches produits, pages coopératives et QR codes dès les premiers produits co-brandés ; anglais pour les pages P1 |
| **Juillet - décembre 2027** | Cadeaux d'entreprise avant la fin de l'année ; marque blanche ; « Adoptez un olivier » avant la récolte d'octobre |
| **2028** | Guides, dont celui sur l'interdiction européenne de 2030 ; version arabe si un distributeur du Golfe est signé |

---

## 10. Décisions à prendre

- [x] Le nom de la marque : **Maison Yousra** (27 septembre 2026)
- [ ] Vérifier le nom à l'OMPIC (classe 3) et choisir le domaine (.com + .ma)
- [ ] Qui des deux associés porte le site B et les ventes terrain
- [ ] Qui réalise les photos des produits et des coopératives, avec les autorisations écrites
- [ ] Le budget du site B : même socle technique, mais un design, des photos et des textes propres (plan §13)
