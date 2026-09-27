# Le transfert instantané des demandes de devis — avec Twenty CRM au centre

*25 septembre 2026 · pour les formulaires des sites A et B (`04`, `14`) · respecte les règles du plan : réponse sous 24 h (§10), fournisseur jamais divulgué (§2.2, §10), négoce après commande ferme (§2.3) · pas de WhatsApp : e-mail et pages web uniquement*

> **L'idée.** **Twenty CRM** est le messager central. Tout y entre, tout en sort : demandes des clients, grille de prix, consultations des fournisseurs, devis, commandes. Un client demande un devis sur votre site : Twenty le reçoit, le qualifie, et soit calcule le prix tout de suite à partir de la grille, soit consulte **par e-mail** deux ou trois coopératives, **sans révéler le client**. Les coopératives répondent sur une page de votre site, le devis se prépare, vous validez d'un clic, le client reçoit un lien.
>
> **Le principe qui accélère tout :** pour les produits courants, **ne consulter personne**. La grille de prix, confirmée chaque semaine par les fournisseurs, permet de répondre au client en quelques minutes.

---

## 1. Les quatre règles qui ne se négocient pas

1. **Anonymat dans les deux sens.** Le fournisseur ne voit jamais le nom, le pays précis ni le contact du client ; le client ne voit jamais le nom du fournisseur (plan §2.2).
2. **Pas de consultation pour une demande non qualifiée.** Sinon les coopératives reçoivent des demandes de curieux, et cessent de répondre.
3. **Un humain valide chaque devis avant l'envoi.** L'automate prépare, l'associé approuve : le double contrôle du fichier 11.
4. **Pas de robot qui remplit les formulaires des sites des coopératives** : c'est fragile, souvent contraire à leurs conditions d'utilisation, et perçu comme du spam. Chaque fournisseur est intégré **une fois** dans Twenty, avec son adresse e-mail et son téléphone.

---

## 2. Ce que Twenty sait faire, et ce qu'il faut ajouter

| Besoin | Dans Twenty | Source |
|---|---|---|
| Modéliser vos propres données (demandes, grille, consultations, devis) | **Objets et champs personnalisés**, relations entre objets | [1][2] |
| Réagir à une demande du site | Workflow déclenché par un **webhook** | [1] |
| Réagir à un changement (statut, acompte reçu) | Workflow déclenché par la **création ou la modification d'un enregistrement** | [1] |
| Tâches planifiées (grille du lundi, relances) | Workflow **planifié** (quotidien, hebdomadaire…) | [1] |
| Bouton « Envoyer le devis » | Workflow à **déclenchement manuel** sur un enregistrement | [1] |
| Envoyer des e-mails | Action **Envoyer un e-mail**, depuis un compte e-mail connecté ; alias d'envoi vérifiés depuis la version 2.35 (août 2026) | [1][2] |
| Calculs (score, prix de vente) | Action **Code** (JavaScript) | [1] |
| Parcourir plusieurs fournisseurs | Action **Itérateur** (depuis la version 1.8), **filtres** et **branches** | [1][2] |
| Attendre, relancer | Action **Délai** | [1] |
| Appeler un service externe (PDF, traduction) | Action **Requête HTTP** | [1] |
| Recevoir les réponses par e-mail | **Synchronisation des e-mails** (IMAP, SMTP) rattachée aux contacts | [2] |
| Droits de l'équipe | Rôles personnalisés et permissions par champ | [2] |
| IA | Agents IA depuis la version 2.0 (avril 2026) | [2] |

**Deux limites à contourner :**
- **Les formulaires de Twenty servent aux utilisateurs connectés**, pas aux fournisseurs ni aux clients [1]. → Les pages publiques (demande de devis, réponse fournisseur, devis en ligne) sont **sur vos sites**, et parlent à Twenty par webhook et par l'API.
- **Les workflows sont récents** et évoluent vite [3]. → Testez chaque workflow sur de fausses demandes avant de l'ouvrir aux clients, et gardez une procédure manuelle de secours.

---

## 3. Le modèle de données dans Twenty

| Objet | Champs principaux | Relié à |
|---|---|---|
| **Société** (standard) | Type : client / fournisseur / conditionneur ; pays ; score fournisseur ; certifications et date d'expiration | Personnes, offres, demandes |
| **Personne** (standard) | Rôle, langue préférée | Société |
| **Produit** | Nom, INCI, CAS, site (A ou B), standard oui ou non | Offres |
| **Offre fournisseur** (la grille) | Fournisseur, produit, palier, prix d'achat, minimum, délai, **valable jusqu'au**, dernière confirmation, statut (valide / à confirmer / rupture) | Société, produit |
| **Demande de devis** | Référence (DV-AAMM-N), client, site, source, **score de qualification**, statut, date limite de réponse (24 h) | Lignes, consultations, devis |
| **Ligne de demande** | Produit, quantité, spécification, conditionnement, personnalisation (site B) | Demande, produit |
| **Consultation fournisseur** | Ligne, fournisseur, **jeton de réponse**, date limite, prix proposé, minimum, délai, validité, photo du lot, statut | Ligne, société |
| **Devis** | Référence, lignes, prix de vente, marge, fournisseur retenu, validité, **lien public**, statut (brouillon / à valider / envoyé / accepté / refusé) | Demande |
| **Commande** | Devis, acompte reçu (oui ou non), bon de commande fournisseur, lot (fichier 11) | Devis |

---

## 4. Le circuit

```
 CLIENT                       VOS SITES (A et B)              TWENTY CRM (le messager)                 FOURNISSEURS
 ──────                       ──────────────────              ────────────────────────                 ────────────
 Formulaire ────────────────► envoi en webhook ───────────► W1 Demande créée, score calculé
                                                                │ non qualifiée ─► W2 e-mail auto : catalogue, fourchette
                                                                │ standard ──────► W3 grille ─► prix ─► devis « à valider »
                                                                │ hors standard ─► W4 consultations ─────────────────────►  e-mail anonymisé
                                                                │                                                          (depuis achats@)
                              page « Répondre » ◄──────────────────────────────────────────────────────────────  clic sur le lien
                              (sans mot de passe) ─ webhook ──► W5 réponse enregistrée ─► choix ─► devis « à valider »
                                                               W6 relances si pas de réponse ─► tâche « appeler »
                                                                ▼
                                                  associé : bouton [Envoyer le devis] ─► W7
 Page devis ◄──────────────── page publique du devis ◄───────── e-mail au client (depuis devis@)
 [Accepter] ────────────────► webhook ─────────────────────────► W8 pro forma envoyée ; tâche « vérifier l'acompte »
                                                  associé coche « acompte reçu » ─► W9 bon de commande ──────────────────►  emballage neutre
```

### Les workflows

> Les onze workflows ci-dessous forment le circuit des devis. Le plan complet de Twenty
> (`23-twenty-plan-complet.md` §7) en ajoute onze autres (certificats, lots, échantillons,
> relances, dossiers d'agent…) et détaille chacun ; le modèle de données complet est au §3 et §4 du même fichier.

| # | Nom | Déclencheur | Ce qu'il fait |
|---|---|---|---|
| W1 | Réception d'une demande | Webhook (formulaire du site) | Crée la société, la personne, la demande et ses lignes ; calcule le score (action Code) ; oriente vers W2, W3 ou W4 |
| W2 | Réponse aux non qualifiés | Branche de W1 | E-mail automatique : fiche technique, fourchette de prix, échantillon payant (plan §10) |
| W3 | Devis standard | Branche de W1 | Cherche les offres valides ; calcule le prix de vente ; crée le devis « à valider » ; prévient l'associé |
| W4 | Consultation des fournisseurs | Branche de W1 | Pour chaque ligne, parcourt les 2 ou 3 fournisseurs les mieux notés (itérateur) ; crée une consultation avec un jeton ; envoie l'e-mail anonymisé |
| W5 | Réponse d'un fournisseur | Webhook (page « Répondre ») | Met à jour la consultation ; quand toutes les réponses sont là, ou à la date limite, choisit la meilleure et crée le devis « à valider » |
| W6 | Relances | Planifié, toutes les heures | Consultation en retard : 1re relance par e-mail, puis tâche « appeler le fournisseur » pour l'associé |
| W7 | Envoi du devis | Manuel, bouton sur le devis | Génère le lien public ; e-mail au client ; statut « envoyé » |
| W8 | Acceptation | Webhook (page du devis) | Statut « accepté » ; e-mail avec la facture pro forma et le RIB en devises ; tâche « vérifier l'acompte » |
| W9 | Commande | Modification : « acompte reçu » coché | Crée la commande ; e-mail du bon de commande au fournisseur (emballage neutre) ; renvoie au contrôle qualité (fichier 11) |
| W10 | Grille du lundi | Planifié, chaque lundi à 8 h | E-mail à chaque fournisseur : ses lignes de grille, avec deux liens « prix inchangés » et « modifier » |
| W11 | Péremption de la grille | Planifié, chaque jour | Toute offre non confirmée depuis 14 jours passe en « à confirmer » |

### L'e-mail que reçoit le fournisseur

> **Objet :** Demande DV-2611-07 — Huile de pépins de figue de barbarie, 25 L
>
> Bonjour,
> Nous cherchons **25 L** d'huile de pépins de figue de barbarie pressée à froid, en bidons de 5 L, **emballage neutre**, livrés à notre entrepôt sous 3 semaines. Spécification jointe.
>
> 👉 **Répondre en 1 minute :** [lien personnel, sans mot de passe]
> Merci de répondre avant **aujourd'hui 17 h**.

**Il ne voit jamais** le nom du client, son pays précis, son adresse ni votre prix de vente.

### La page « Répondre » (sur votre site)

Cinq champs sur mobile : prix, minimum, délai, validité, photo du lot. Le jeton de l'URL identifie la consultation : pas de compte à créer. Si le fournisseur préfère répondre à l'e-mail directement, sa réponse arrive dans Twenty grâce à la synchronisation des e-mails, rattachée à sa fiche ; vous saisissez alors le prix, ou vous faites extraire les chiffres par un agent IA, avec vérification.

### Deux adresses d'envoi, pour l'anonymat

- **achats@[domaine]** : pour tous les échanges avec les fournisseurs.
- **devis@[domaine]** : pour les clients ; sur le site B, avec le domaine de la marque B (Maison Yousra).

Deux alias du même compte connecté à Twenty (alias d'envoi disponibles depuis la version 2.35 [2]) : un fournisseur et un client ne reçoivent jamais un e-mail qui montrerait l'autre en copie ou dans l'historique.

---

## 5. Les calculs (actions Code)

**Score de qualification** (plan §10) :

| Signal | Points |
|---|---|
| E-mail professionnel (pas Gmail ni Hotmail) | +2 |
| Site web de la société renseigné | +2 |
| Volume annuel envisagé ≥ 1 lot par trimestre | +2 |
| Usage final et marché de destination précisés | +1 |
| Certifications demandées cohérentes avec le produit | +1 |
| Pays sous sanctions, ou formulaire incohérent | exclusion |

≥ 5 : qualifié · 3 à 4 : l'associé regarde · < 3 : W2.

**Score fournisseur :** prix 35 % · qualité mesurée (fichier 11) 30 % · délai de réponse et respect des délais 20 % · documents et certifications à jour 15 %.

**Prix de vente** (guide §1.7) : (prix d'achat + frais de lot ÷ quantité) × 1,20, avec les paliers du guide ; conversion au cours de la banque moins 2 % ; validité de 30 jours. Pour le site B, on ajoute le coût du packaging personnalisé, tiré de la grille du conditionneur.

---

## 6. Idées « hors cadre », sans WhatsApp

1. **La fourchette instantanée.** Dès l'envoi du formulaire, la page de confirmation affiche « Prix indicatif : 2 700 à 3 000 DH/L pour 25 L — devis ferme sous 24 h », calculée à partir de la grille.
2. **Le devis en page web plutôt qu'en PDF.** Le client voit son devis, l'accepte d'un clic, télécharge le PDF s'il veut. Vous savez s'il l'a ouvert.
3. **La grille qui se confirme d'un clic.** Le lundi, le fournisseur n'a rien à écrire : il clique sur « prix inchangés ».
4. **Une IA qui comprend les demandes libres.** Un e-mail flou (« une huile sèche marocaine pour un sérum ») : un agent IA propose le produit probable, la quantité et l'usage, et prépare la demande.
5. **La traduction automatique, relue.** Le client écrit en allemand, la coopérative reçoit en français ; les réponses repartent traduites, relues avant l'envoi au client.
6. **Un panel « réponse rapide ».** Les fournisseurs qui répondent en moins de 4 heures montent dans le score, donc reçoivent plus de demandes.
7. **Les demandes multi-produits regroupées.** Figue, ghassoul et argan : trois consultations, **un seul devis, un seul envoi**. C'est votre vraie valeur de négociant.
8. **La maquette automatique pour le site B.** Le client dépose son logo, et le site génère une maquette du flacon et de la boîte, jointe au devis.

---

## 7. Hébergement et coût

- **Twenty en ligne (offre cloud) ou auto-hébergé** (logiciel libre, sur un petit serveur). L'auto-hébergement garde les données chez vous, mais demande des mises à jour et des sauvegardes. Tarifs de l'offre cloud à vérifier au moment du choix.
- **Pages publiques** (formulaire, « Répondre », devis) : dans le socle Next.js et Cloudflare des sites (`04` §12), qui appellent Twenty par webhook et par l'API.
- **E-mail** : une boîte professionnelle avec deux alias, connectée à Twenty.
- **Rien d'autre à payer** pour démarrer : ni WhatsApp, ni outil d'automatisation externe.

---

## 8. Juridique et confiance

- **Données personnelles** : case de consentement sur le formulaire (RGPD pour les clients européens, loi 09-08 au Maroc), avec cette mention : « Votre demande est transmise sans vos coordonnées à des producteurs partenaires. »
- **Fournisseurs** : accord écrit pour recevoir les consultations par e-mail ; confidentialité et non-sollicitation dans le contrat d'achat (guide §1.6).
- **Accès à Twenty** : rôles distincts pour chaque associé et pour l'assistant(e) ; les prix d'achat et les marges visibles seulement par les associés (permissions par champ [2]).
- **Traçabilité** : chaque devis garde la consultation et la réponse fournisseur qui le fondent.

---

## 9. Mise en place

| Quand | Quoi |
|---|---|
| **Octobre 2026** | Installer Twenty ; créer les objets du §3 ; connecter la boîte e-mail et les deux alias ; saisir les fournisseurs et la grille |
| **Novembre 2026** | Brancher le formulaire du site A (W1 à W3) ; page « Répondre » et W4 à W6 ; tester avec 10 fausses demandes ; intégrer les 2 fournisseurs de figue et de ghassoul, avec leur accord |
| **Décembre 2026** | Premières vraies demandes ; W7 à W9 ; grille du lundi (W10, W11) |
| **Janvier 2027** | Brancher le formulaire du site B, avec la grille packaging et la maquette automatique |
| **Juin 2027** | Bilan : délai moyen de réponse, taux de transformation devis → commande, fournisseurs les plus fiables |

**Objectif mesurable :** 80 % des demandes qualifiées reçoivent leur devis en moins de 24 h ouvrées, et les produits standard en moins d'une heure.

---

## Sources

Consultées le 25 septembre 2026.

1. Twenty — documentation des workflows (déclencheurs et actions) : https://docs.twenty.com/user-guide/workflows/overview
2. Twenty — notes de version (itérateur, branches, IMAP/SMTP, alias d'envoi, agents IA, objets et permissions) : https://twenty.com/releases
3. Avis sur Twenty CRM en 2026 (fonctions récentes en développement actif) : https://www.taskrhino.ca/blog/twenty-crm-review/ ; https://coldiq.com/tools/twenty

---

## Avertissement

- Les fonctions de Twenty évoluent vite : vérifiez dans votre version que chaque déclencheur et chaque action existe, avant de construire un workflow.
- Les pondérations des scores et les seuils sont des points de départ, à ajuster après les premières demandes.
- La procédure manuelle (e-mail et tableur) reste le plan de secours tant que les workflows n'ont pas fait leurs preuves.
