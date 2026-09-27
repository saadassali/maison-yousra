# Twenty — le plan complet : modèle de données, relations, rôles et workflows

*26 septembre 2026 · **document de référence** pour tout ce que contient Twenty · reprend et complète `16-devis-transfert-instantane.md` (le circuit) et `18-prompt-agent-twenty-mcp.md` (la mise en place par un agent, qui construit ce qui est décrit ici) · e-mail : `../outils/22-zoho-mail-twenty.md` · qualité : `../produits/11-controle-qualite-avant-expedition.md` · sites : `../sites-web/19-prompts-site-a-p1.md` et `../sites-web/20-prompts-site-b-p1.md` · agent sur le vrac : `../annexes/B-agent-commissionne.md`*

> **En bref.** Twenty porte **toute la vie commerciale et qualité de la SARL** : les sociétés et les
> personnes, les produits et la grille de prix, les demandes de devis et leurs lignes, les
> consultations des fournisseurs, les devis et leurs lignes, les commandes, **les lots (le registre
> qualité)**, les échantillons, les certificats, les accords écrits et les dossiers d'agent. Quinze
> objets de données (plus les tâches et les notes), vingt-deux workflows, trois rôles, une boîte e-mail. Ce document décrit ce qu'il y aura
> dans Twenty ; il ne décrit pas l'installation, qui suit le fichier 18.

---

## 0. Les principes

1. **Twenty est la source unique** pour tout ce qui est commercial et qualité. Ce qui est dans Twenty ne se ressaisit pas ailleurs ; la facture reste chez le comptable (on garde seulement son numéro).
2. **L'anonymat se construit, il ne se promet pas.** Dans la base, une consultation fournisseur est reliée à une demande client ; ce sont **les workflows, les pages publiques et les rôles** qui garantissent que rien ne passe de l'un à l'autre. Chaque règle d'anonymat de ce document dit où elle est appliquée.
3. **L'automate prépare, un associé décide.** Aucun devis, aucun bon de commande, aucune divulgation d'acheteur ne part sans une action humaine.
4. **Tout est daté et relié à sa preuve** : un certificat à son document, un lot à son rapport de laboratoire, une citation de coopérative à l'accord écrit.
5. **Noms d'API en camelCase anglais** (exigence de Twenty), **libellés affichés en français**, options de sélection en MAJUSCULES.

---

## 1. La carte des objets

```
                           ┌──────────────┐
            ┌──────────────│   Société    │──────────────┬───────────────┬──────────────┐
            │              │  (company)   │              │               │              │
            │              └──┬────────┬──┘              │               │              │
            │ personnes       │        │ certificats     │ accords       │ offres       │ dossiers
            ▼                 │        ▼                 ▼ écrits        ▼ (grille)     ▼ d'agent
      ┌──────────┐            │  ┌─────────────┐  ┌──────────────┐ ┌──────────────┐ ┌─────────────┐
      │ Personne │            │  │ Certificat  │  │ Accord écrit │ │ Offre        │ │ Dossier     │
      └──────────┘            │  └─────────────┘  └──────────────┘ │ fournisseur  │ │ d'agent     │
                              │ client                             └──────┬───────┘ └─────────────┘
                              ▼                                           │ produit
                   ┌────────────────────┐   lignes   ┌──────────────────┐ ▼
                   │ Demande de devis   │───────────►│ Ligne de demande │──────► ┌──────────┐
                   └─────────┬──────────┘            └────────┬─────────┘        │ Produit  │
                             │ devis                          │ consultations    └──────────┘
                             ▼                                ▼                        ▲
                   ┌────────────────────┐            ┌──────────────────┐              │
                   │ Devis              │            │ Consultation     │──► Société   │
                   └──┬──────────────┬──┘            │ fournisseur      │   (fournisseur)
                      │ lignes       │ commande      └──────────────────┘              │
                      ▼              ▼                                                 │
              ┌──────────────┐ ┌────────────┐  lots   ┌────────┐                       │
              │ Ligne de     │ │ Commande   │────────►│  Lot   │───────────────────────┘
              │ devis        │ └────────────┘         └────────┘
              └──────────────┘
   Échantillon : relié à Société (client), Produit, et à la Demande de devis s'il en vient.
```

**Les objets en un tableau**

| # | Objet (nom d'API) | Libellé | Nature | Rôle |
|---|---|---|---|---|
| 1 | `company` | Société | Standard, complété | Clients, prospects, fournisseurs, conditionneurs, laboratoires, transitaires, exportateurs représentés |
| 2 | `person` | Personne | Standard, complété | Contacts, prospects de la prospection sortante, membres de coopératives cités |
| 3 | `product` | Produit | Personnalisé | Ce que la SARL vend, sur le site A, le site B ou les deux ; emballages du site B |
| 4 | `supplierOffer` | Offre fournisseur | Personnalisé | La grille de prix d'achat, confirmée chaque lundi |
| 5 | `quoteRequest` | Demande de devis | Personnalisé | Ce qui arrive des formulaires, des e-mails et des salons |
| 6 | `quoteRequestLine` | Ligne de demande | Personnalisé | Un produit demandé, avec sa quantité et sa personnalisation |
| 7 | `supplierConsultation` | Consultation fournisseur | Personnalisé | Une question envoyée à un fournisseur pour une ligne |
| 8 | `quote` | Devis | Personnalisé | L'offre de prix au client |
| 9 | `quoteLine` | Ligne de devis | Personnalisé | Prix de vente d'un produit, et ce qui le fonde |
| 10 | `salesOrder` | Commande | Personnalisé | Un devis accepté, de l'acompte à la clôture |
| 11 | `lot` | Lot | Personnalisé | **Le registre qualité** (fichier 11 §3 et §4) |
| 12 | `sampleRequest` | Échantillon | Personnalisé | Chaque échantillon envoyé, gratuit ou payant (plan §10) |
| 13 | `certificate` | Certificat | Personnalisé | Chaque certificat d'un fournisseur, avec sa date d'expiration |
| 14 | `writtenConsent` | Accord écrit | Personnalisé | Accords des fournisseurs, coopératives, personnes photographiées, clients cités |
| 15 | `agencyDeal` | Dossier d'agent | Personnalisé | Le vrac d'huile d'olive : antériorité, NCND, contrat, divulgation (annexe B §10) |
| — | `opportunity` | Opportunité | Standard | **Non utilisé** : la demande de devis joue ce rôle. À masquer du menu |
| — | `task`, `note` | Tâche, note | Standard | Relances, rappels, comptes rendus d'appel ; créés à la main ou par les workflows |

Soit quinze objets de données (dont treize personnalisés), plus les tâches et les notes.

---

## 2. Les conventions

| Élément | Règle |
|---|---|
| Références | Demande `DV-AAMM-N` · consultation `CF-AAMM-N` · devis `DE-AAMM-N` (version `-v2`, `-v3` si révisé) · commande `CO-AAMM-N` · échantillon `EC-AAMM-N` · lot SARL `CODE-AAMM-N` (fichier 11, par exemple `FIG-2611-1`) · dossier d'agent `AG-AAMM-N` · acheteur protégé par un code (`HK-01`, annexe B §10) |
| Montants | Champ « montant » de Twenty (valeur + devise). Achats en **MAD** ; ventes en **EUR**, **USD** ou **MAD** |
| Dates | Date simple pour les échéances ; date et heure pour tout ce qui mesure un délai (réception, réponse, envoi) |
| Documents | Jamais dans Twenty : un **lien** vers le document rangé dans le stockage des documents (fichier 21 §0), nettoyé de ses métadonnées (`../outils/21-outils-open-source.md` §0.3) |
| Associés | Sélection `ASSOCIE_1`, `ASSOCIE_2` (à renommer avec les prénoms) pour « préparé par », « libéré par », « validé par » |
| Test | Tout enregistrement de test commence par `TEST-` ; un filtre l'exclut de toutes les vues de travail |

---

## 3. Les objets standards complétés

### 3.1 Société (`company`)

Champs standards utilisés : nom, domaine (site web), adresse, effectif, liens LinkedIn.

| Champ (API) | Libellé | Type | Valeurs, remarque |
|---|---|---|---|
| `typeSociete` | Type | Sélection | CLIENT, PROSPECT, FOURNISSEUR, CONDITIONNEUR, LABORATOIRE, TRANSITAIRE, EXPORTATEUR_REPRESENTE, ORGANISME_CERTIFICATEUR |
| `segment` | Segment | Sélection | FORMULATEUR, MARQUE_COSMETIQUE, PARFUMEUR, DISTRIBUTEUR_INGREDIENTS, IMPORTATEUR, HOTEL_RIAD, SPA_HAMMAM, ENTREPRISE_CADEAUX, MARIAGE, EVENEMENT, AUTRE — pour les clients et prospects |
| `site` | Site d'origine | Sélection | SITE_A, SITE_B, LES_DEUX |
| `pays` | Pays | Texte | |
| `ville` | Ville | Texte | Utile pour le site B (livraison au Maroc) |
| `langue` | Langue | Sélection | FR, EN, DE, ES, IT, AR |
| `canalPrefere` | Canal préféré | Sélection | EMAIL, TELEPHONE |
| `sourceAcquisition` | Source | Sélection | SEO, PROSPECTION, PLATEFORME_B2B, ETRADE_MA, SALON, QR_CODE, RECOMMANDATION, AUTRE |
| `premierContactLe` | Premier contact | Date et heure | **Preuve d'antériorité** : ne se modifie plus après saisie |
| `certifications` | Certifications (résumé) | Sélection multiple | BIO_UE, COSMOS, FAIR_FOR_LIFE, USDA, ONSSA, ENREGISTREMENT_DMP, IGP, AOP, NATRUE, ISO_22716 — résumé ; le détail est dans l'objet Certificat |
| `certificationsVerifiees` | Certifications vérifiées | Booléen | Vrai seulement quand **tous** ses certificats actifs sont vérifiés (tenu à jour par W12) |
| `scoreFournisseur` | Score fournisseur | Nombre 0–100 | Calculé par W21 (fichier 16 §5) |
| `delaiReponseMoyenHeures` | Délai de réponse moyen | Nombre | Calculé par W21 |
| `panelReponseRapide` | Panel réponse rapide | Booléen | Vrai si le délai moyen < 4 h (fichier 16 §6.6) |
| `fournitSiteA` | Fournit le site A | Booléen | **Verrou du site B** : une société à vrai n'est jamais nommée sur le site B (fichier 20, prompt 2) |
| `coBrandingAutorise` | Co-branding autorisé | Booléen | Vrai seulement si un accord écrit de type CITATION_COOPERATIVE est actif |
| `conditionsPaiement` | Conditions de paiement | Texte | Clients : acompte, solde ; fournisseurs : délais |
| `delaiPaiementJours` | Délai de paiement | Nombre | Hôtels : souvent 60 à 90 jours (fichier 13 §8) |
| `plafondCredit` | Plafond de crédit | Montant | Clients hôteliers |
| `ice` | ICE | Texte | Sociétés marocaines, pour la facturation |
| `notesQualite` | Notes qualité | Texte long | Incidents, réclamations, points d'attention |

### 3.2 Personne (`person`)

| Champ (API) | Libellé | Type | Valeurs, remarque |
|---|---|---|---|
| `roleContact` | Fonction | Texte | Gouvernante générale, acheteur matières premières, présidente de coopérative… |
| `langue` | Langue | Sélection | FR, EN, DE, ES, IT, AR |
| `statutProspection` | Prospection | Sélection | A_CONTACTER, CONTACTE, REPONDU, ECHANTILLON_DEMANDE, CLIENT, PAS_INTERESSE, NE_PLUS_CONTACTER — la prospection sortante du plan §9 |
| `dernierContactLe` | Dernier contact | Date | |
| `consentementBulletin` | Accepte le bulletin | Booléen | Bulletin de récolte (fichier 04 §8) : jamais sans ce consentement (RGPD) |
| `consentementBulletinLe` | Date du consentement | Date et heure | Preuve |
| `accordPhotoActif` | Accord photo | Booléen | Tenu à jour depuis l'objet Accord écrit ; une personne à faux n'apparaît sur aucun site |

---

## 4. Les objets personnalisés

Les champs **en gras** existent déjà dans le fichier 18 ; les autres sont ajoutés par ce plan.

### 4.1 Produit (`product`)

| Champ | Type | Valeurs, remarque |
|---|---|---|
| **`name`** | Texte | |
| **`inci`**, **`cas`** | Texte | Seulement quand ils sont sourcés (fichier 18, phase 3) |
| **`site`** | Sélection | SITE_A, SITE_B, LES_DEUX |
| **`categorie`** | Sélection | HUILE_VEGETALE, HUILE_ESSENTIELLE, HYDROLAT, ARGILE, SAVON, PLANTE_SECHEE, EPICE, POUDRE_EXFOLIANTE, ALIMENTAIRE, PRODUIT_FINI, **EMBALLAGE** (ajouté : flacons, étiquettes, boîtes du site B) |
| **`unite`** | Sélection | KG, L, UNITE |
| **`standard`** | Booléen | Vrai : prix calculé depuis la grille sans consulter (W3) |
| **`matiereDangereuse`** | Booléen | Transport des huiles essentielles (plan §6.3) |
| `numeroOnu` | Texte | Si matière dangereuse ; donné par le transitaire |
| `codeLot` | Texte | Préfixe des lots SARL (`FIG`, `NER`, `ROM`…) |
| `formatsDisponibles` | Sélection multiple | FLACON, RECHARGE_5L, GRAND_FORMAT_PRO, POT, BOITE, FUT, BIDON |
| `minimumCommande` | Nombre | Dans l'unité du produit |
| `delaiJours` | Nombre | Délai standard annoncé |
| `fraisLotDefaut` | Montant (MAD) | Frais fixes d'un lot (analyse, transport) pour la formule de prix |
| `conformiteType` | Sélection | DMP, ONSSA, AUCUNE — site B (fichier 13 §5) |
| `numeroEnregistrement` | Texte | N° DMP ou autorisation ONSSA |
| `enregistrementExpireLe` | Date | Certificat DMP valable 5 ans ; surveillé par W13 |
| `publieSurSite` | Booléen | Miroir de la règle de publication des sites (fichier 19, prompt 2 ; fichier 20, prompt 2) |
| `lienSpecification` | Lien | Spécification SARL (PDF nettoyé) |

### 4.2 Offre fournisseur (`supplierOffer`) — la grille

| Champ | Type | Valeurs, remarque |
|---|---|---|
| **`supplier`** → Société | Relation | Type FOURNISSEUR ou CONDITIONNEUR |
| **`product`** → Produit | Relation | |
| `typeOffre` | Sélection | MATIERE, PACKAGING — le packaging vient du conditionneur (fichier 16 §5, site B) |
| **`palierMinimum`** | Nombre | Quantité à partir de laquelle ce prix vaut |
| **`prixAchat`** | Montant (MAD) | **Visible par les associés seulement** |
| **`quantiteMinimum`** | Nombre | |
| **`delaiJours`** | Nombre | |
| **`valableJusquau`** | Date | |
| **`derniereConfirmation`** | Date | Mise à jour par W10 |
| **`statut`** | Sélection | VALIDE, A_CONFIRMER, RUPTURE |
| `jetonGrille` | Texte | Jeton de la page « grille du lundi » (fichier 19, prompt 5), porté par l'offre ; le même pour toutes les offres d'un fournisseur une semaine donnée |

### 4.3 Demande de devis (`quoteRequest`)

| Champ | Type | Valeurs, remarque |
|---|---|---|
| **`reference`** | Texte | `DV-AAMM-N` |
| **`client`** → Société, **`contact`** → Personne | Relations | |
| **`site`** | Sélection | SITE_A, SITE_B |
| **`source`** | Sélection | SEO, PROSPECTION, PLATEFORME_B2B, ETRADE_MA, SALON, QR_CODE, EMAIL_DIRECT, AUTRE |
| `segment` | Sélection | Mêmes valeurs que Société |
| **`scoreQualification`** | Nombre | Calculé par W1 (§7.2) |
| **`statut`** | Sélection | NOUVELLE, NON_QUALIFIEE, A_VERIFIER, EN_CONSULTATION, DEVIS_A_VALIDER, DEVIS_ENVOYE, GAGNEE, PERDUE |
| `motifPerte` | Sélection | PRIX, DELAI, PAS_DE_REPONSE_CLIENT, PAS_DE_FOURNISSEUR, HORS_CIBLE, AUTRE |
| **`dateLimiteReponse`** | Date et heure | Réception + 24 h ouvrées |
| `recueLe` | Date et heure | |
| **`paysDestination`**, **`usageFinal`**, **`volumeAnnuel`**, **`certificationsDemandees`** | Texte | Site A (plan §10) |
| `delaiSouhaite` | Texte | |
| `nombreChambres`, `nombreInvites` | Nombre | Site B |
| `dateEvenement` | Date | Site B (mariages, événements) |
| `villeLivraison` | Texte | Site B |
| **`demandeLibre`** | Texte long | Message libre, ou e-mail reçu hors formulaire |
| `lienLogo`, `lienMaquette` | Lien | Site B : fichiers privés (fichier 20, prompts 4 et 5) |
| `pageOrigine`, `langue`, `qrCodeId`, `utm` | Texte | Champs cachés des formulaires |
| `fourchetteAffichee` | Texte | La fourchette indicative montrée au client (fichier 16 §6.1), pour mémoire |
| `consentementLe` | Date et heure | Case de consentement du formulaire (fichier 16 §8) |
| `idEnvoi` | Texte | Identifiant unique de l'envoi, contre les doublons (fichier 19, prompt 4) |

### 4.4 Ligne de demande (`quoteRequestLine`)

| Champ | Type | Valeurs, remarque |
|---|---|---|
| **`quoteRequest`** → Demande | Relation | |
| **`product`** → Produit | Relation | Vide si « je ne sais pas encore » : W1 envoie alors en A_VERIFIER |
| **`quantite`**, **`unite`** | Nombre, sélection | |
| `format` | Sélection | Mêmes valeurs que `formatsDisponibles` |
| **`specification`**, **`conditionnement`** | Texte long, texte | |
| **`personnalisation`** | Texte long | Site B : couleurs, langue(s) de l'étiquette, texte à imprimer, boîte oui/non |

### 4.5 Consultation fournisseur (`supplierConsultation`)

| Champ | Type | Valeurs, remarque |
|---|---|---|
| `reference` | Texte | `CF-AAMM-N` — c'est la seule référence que voit le fournisseur, avec celle de la demande |
| **`quoteRequestLine`** → Ligne | Relation | **Aucune relation directe vers le client** |
| **`supplier`** → Société | Relation | |
| `typeConsultation` | Sélection | MATIERE, PACKAGING |
| **`jetonReponse`** | Texte | Long, aléatoire ; identifie la consultation sur la page « Répondre » |
| `envoyeeLe` | Date et heure | |
| **`dateLimite`** | Date et heure | |
| `reponduLe` | Date et heure | Sert au délai de réponse (W21) |
| **`prixPropose`** | Montant (MAD) | **Associés seulement** |
| **`quantiteMinimum`**, **`delaiJours`**, **`validiteJours`** | Nombre | |
| **`lienPhotoLot`** | Lien | Photo nettoyée de ses métadonnées |
| **`nombreRelances`** | Nombre | |
| **`statut`** | Sélection | ENVOYEE, RELANCEE, REPONDUE, SANS_REPONSE, RETENUE, ECARTEE |
| `canalReponse` | Sélection | PAGE_REPONDRE, EMAIL, TELEPHONE — si la réponse arrive par e-mail, un associé la saisit (fichier 16 §4) |

### 4.6 Devis (`quote`)

| Champ | Type | Valeurs, remarque |
|---|---|---|
| **`reference`** | Texte | `DE-AAMM-N`, `-v2` si révisé |
| **`quoteRequest`** → Demande | Relation | |
| **`selectedSupplier`** → Société | Relation | **Associés seulement** ; renseigné quand toutes les lignes viennent du même fournisseur, sinon voir les lignes |
| **`prixVenteTotal`** | Montant | Somme des lignes |
| **`margeTotale`** | Montant | **Associés seulement** |
| **`devise`** | Sélection | EUR, USD, MAD |
| `tauxChange` | Nombre | Cours bancaire − 2 % au jour du devis |
| **`validiteJusquau`** | Date | Émission + 30 jours |
| `incoterm` | Sélection | EXW, FCA, FOB, CPT, CIP, DAP, DDP — à fixer avec le transitaire |
| `conditionsPaiement` | Texte | Acompte et solde |
| `acomptePourcent` | Nombre | 100 % pour un lot d'essai (fichier 11), 30 à 50 % pour un réassort, acompte pour les petites séries du site B |
| **`jetonPublic`**, **`lienPublic`** | Texte, lien | Page `/quote/[jeton]` ou `/devis/[jeton]` |
| `lienPdf` | Lien | |
| `lienMaquette` | Lien | Site B |
| `valideParAssocie` | Sélection | ASSOCIE_1, ASSOCIE_2 — obligatoire avant W7 |
| `envoyeLe`, `premiereOuvertureLe` | Date et heure | |
| `nombreOuvertures` | Nombre | Renvoyé par la page publique |
| `acceptePar`, `accepteLe` | Texte, date et heure | Nom et fonction saisis par le client ; horodatage |
| **`statut`** | Sélection | BROUILLON, A_VALIDER, ENVOYE, ACCEPTE, REFUSE, EXPIRE |

### 4.7 Ligne de devis (`quoteLine`) — nouveau

Twenty n'a pas de lignes de devis en standard ; cet objet porte le prix de chaque produit et **ce qui le fonde** (fichier 16 §8, traçabilité).

| Champ | Type | Valeurs, remarque |
|---|---|---|
| `quote` → Devis | Relation | |
| `quoteRequestLine` → Ligne de demande | Relation | |
| `product` → Produit | Relation | |
| `quantite`, `unite`, `format` | Nombre, sélections | |
| `prixUnitaireVente` | Montant | Visible par tous |
| `totalLigne` | Montant | |
| `sourcePrix` | Sélection | GRILLE, CONSULTATION |
| `supplierOffer` → Offre | Relation | Si GRILLE — **associés seulement** |
| `supplierConsultation` → Consultation | Relation | Si CONSULTATION — **associés seulement** |
| `prixAchatUnitaire`, `coutPackagingUnitaire`, `fraisLot` | Montants (MAD) | **Associés seulement** |
| `margeLigne` | Montant | **Associés seulement** |

### 4.8 Commande (`salesOrder`)

| Champ | Type | Valeurs, remarque |
|---|---|---|
| `reference` | Texte | `CO-AAMM-N` |
| **`quote`** → Devis | Relation | |
| `client` → Société | Relation | Copiée du devis, pour les vues |
| **`acompteRecu`**, **`dateAcompte`** | Booléen, date | Coché à la main : déclenche W9 |
| `montantAcompte`, `soldeRecu` | Montant, booléen | Le solde conditionne la libération du lot (fiche de libération, ligne 11) |
| **`bonDeCommandeEnvoye`** | Booléen | |
| `numeroFacture` | Texte | La facture est chez le comptable ; on garde son numéro |
| `batValideLe` | Date | Site B : aucune impression avant cette date |
| `transitaire` → Société | Relation | Type TRANSITAIRE |
| `expedieeLe` | Date | |
| `numeroSuivi` | Texte | |
| `retourJ14` | Texte long | Retour du client 14 jours après la livraison (fichier 11, étape 10) |
| **`numeroLotSarl`** | Texte | Gardé pour compatibilité ; les lots sont désormais des enregistrements (§4.9) |
| **`statut`** | Sélection | EN_ATTENTE_ACOMPTE, COMMANDEE, BAT_EN_ATTENTE (site B), RECUE, CONTROLEE, EXPEDIEE, CLOTUREE, ANNULEE |

### 4.9 Lot (`lot`) — nouveau : le registre qualité

C'est le tableur du fichier 11 §4, en objet. Chaque ligne de la fiche de libération (fichier 11 §3) devient une case à cocher.

| Champ | Type | Valeurs, remarque |
|---|---|---|
| `numeroLotSarl` | Texte | `CODE-AAMM-N` — le seul numéro que voit le client |
| `numeroLotFournisseur` | Texte | **Associés seulement** ; n'apparaît sur aucun document client |
| `product` → Produit | Relation | |
| `supplier` → Société | Relation | **Associés seulement** |
| `salesOrder` → Commande | Relation | Un lot peut servir plusieurs commandes : dans ce cas, créer une note qui les liste (Twenty ne relie qu'une commande par ce champ) |
| `quantite`, `unite` | Nombre, sélection | |
| `datePrelevement` | Date | |
| `laboratoire` → Société | Relation | Type LABORATOIRE |
| `numeroRapport`, `lienRapport` | Texte, lien | |
| `resultatsCles` | Texte long | Valeurs clés du rapport (acides gras, stérols, GC…) |
| `controle01SpecIdentifiee` … `controle12PhotosAuDossier` | 12 booléens | Les douze lignes de la fiche de libération, dans l'ordre du fichier 11 §3 |
| `decision` | Sélection | EN_ATTENTE, LIBERE, REFUSE |
| `preparePar`, `liberePar` | Sélection | ASSOCIE_1, ASSOCIE_2 — **deux personnes différentes** (double contrôle, fichier 16 §1) |
| `libereLe` | Date | |
| `emplacementContreEchantillons` | Texte | |
| `conserverJusquau` | Date | Durée de conservation des contre-échantillons |
| `reclamation` | Booléen | |
| `causeReclamation` | Texte long | |

### 4.10 Échantillon (`sampleRequest`) — nouveau

Mesure demandée par le plan §9 : « les produits qui génèrent des demandes d'échantillons reçoivent les pages ».

| Champ | Type | Valeurs, remarque |
|---|---|---|
| `reference` | Texte | `EC-AAMM-N` |
| `client` → Société, `contact` → Personne | Relations | |
| `quoteRequest` → Demande | Relation | Si l'échantillon vient d'une demande |
| `product` → Produit | Relation | |
| `format` | Texte | 5–10 mL (huile essentielle), 50–100 mL (huile végétale) |
| `gratuit` | Booléen | Vrai si la demande est qualifiée (plan §10) |
| `montantFacture` | Montant | Si payant ; déduit de la première commande |
| `expedieParCompteClient` | Booléen | Envoi sur le compte transporteur du client |
| `lotSource` → Lot | Relation | |
| `envoyeLe`, `numeroSuivi` | Date, texte | |
| `retourClient` | Texte long | |
| `statut` | Sélection | DEMANDE, ENVOYE, RELANCE, EVALUE_POSITIF, EVALUE_NEGATIF, SANS_RETOUR, CONVERTI |

### 4.11 Certificat (`certificate`) — nouveau

Une société a souvent plusieurs certificats, chacun avec sa date d'expiration : un seul champ sur la société ne suffit pas.

| Champ | Type | Valeurs, remarque |
|---|---|---|
| `company` → Société | Relation | |
| `type` | Sélection | Mêmes valeurs que `certifications` |
| `organisme` | Texte | Ecocert, Bureau Veritas, ONSSA, ministère de la Santé… |
| `numero` | Texte | |
| `produitsCouverts` | Texte | Liste libre (un certificat couvre souvent plusieurs produits) |
| `emisLe`, `expireLe` | Date | |
| `verifie` | Booléen | Vérifié dans la base de l'organisme (fichier 15 §1) |
| `verifieLe`, `verifiePar` | Date, sélection | |
| `lienDocument`, `lienVerification` | Lien | Le PDF, et la page de la base publique qui le confirme |
| `statut` | Sélection | ACTIF, EXPIRE_BIENTOT, EXPIRE, RETIRE — tenu à jour par W12 |

### 4.12 Accord écrit (`writtenConsent`) — nouveau

Tous les accords que les fichiers 16 et 20 exigent, en un seul endroit, avec leur preuve.

| Champ | Type | Valeurs, remarque |
|---|---|---|
| `type` | Sélection | CONSULTATION_EMAIL (le fournisseur accepte de recevoir les consultations, fichier 16 §8) · CITATION_COOPERATIVE (co-branding, site B) · PHOTO_PERSONNE · REFERENCE_CLIENT (hôtel pilote cité) · BULLETIN (inscription au bulletin, si reçue hors formulaire) |
| `company` → Société, `person` → Personne | Relations | L'une, l'autre ou les deux |
| `portee` | Texte | Ce qui est autorisé : quels produits, quelles photos, quels sites |
| `signeLe` | Date | |
| `expireLe`, `retireLe` | Date | Un accord retiré désactive aussitôt le verrou correspondant |
| `lienDocument` | Lien | L'accord signé (DocuSeal ou scan) |
| `actif` | Booléen | Vrai si signé, non expiré, non retiré ; tenu à jour par W20 |

### 4.13 Dossier d'agent (`agencyDeal`) — nouveau

Le métier d'agent sur le vrac d'huile d'olive (plan §2.4). Le dossier suit la séquence de l'annexe B §10 ; le nom de l'acheteur n'est révélé qu'à la fin.

| Champ | Type | Valeurs, remarque |
|---|---|---|
| `reference` | Texte | `AG-AAMM-N` |
| `codeAcheteur` | Texte | `HK-01` : le seul nom utilisé dans les documents préliminaires |
| `acheteur` → Société | Relation | **Associés seulement** |
| `exportateur` → Société | Relation | Type EXPORTATEUR_REPRESENTE |
| `anterioriteDeposeeLe` | Date | Dépôt chez un notaire ou un huissier (étape 1) |
| `lienPreuveAnteriorite` | Lien | |
| `ncndSigneLe`, `contratAgenceSigneLe` | Date | Étape 3 |
| `divulgationLe` | Date | Étape 4 ; **refusée par W19** tant que les deux dates précédentes sont vides |
| `modeDivulgation` | Sélection | RECOMMANDE_AR, ECRIT_CONTRESIGNE |
| `tauxCommission` | Nombre (%) | |
| `volumeEnvisage` | Texte | Catégorie, acidité, flexitank, IBC, fûts |
| `commissionDue`, `commissionEncaissee` | Montant | |
| `statut` | Sélection | PROSPECTION, ANTERIORITE_DEPOSEE, NCND_SIGNE, CONTRAT_SIGNE, ACHETEUR_DIVULGUE, EXPEDITION, COMMISSION_ENCAISSEE, PERDU |

---

## 5. Les relations

| Depuis | Vers | Cardinalité | Remarque |
|---|---|---|---|
| Société | Personne | 1 → n | Standard |
| Société | Certificat, Accord écrit, Offre fournisseur | 1 → n | |
| Société (client) | Demande de devis, Échantillon | 1 → n | |
| Société (fournisseur) | Consultation, Lot | 1 → n | |
| Société (acheteur, exportateur) | Dossier d'agent | 1 → n | Deux relations distinctes |
| Personne | Demande de devis, Échantillon, Accord écrit | 1 → n | |
| Produit | Offre fournisseur, Ligne de demande, Ligne de devis, Lot, Échantillon | 1 → n | |
| Demande de devis | Ligne de demande | 1 → n | |
| Demande de devis | Devis | 1 → n | Plusieurs versions possibles |
| Ligne de demande | Consultation | 1 → n | 2 ou 3 fournisseurs par ligne |
| Devis | Ligne de devis | 1 → n | |
| Devis | Commande | 1 → 1 | Une commande par devis accepté |
| Commande | Lot | 1 → n | |
| Lot | Échantillon | 1 → n | L'échantillon vient d'un lot connu |

**Où l'anonymat est protégé :**

| Risque | Protection | Où |
|---|---|---|
| Un fournisseur voit le client | Les e-mails de consultation (W4, W6, W9) ne lisent que la ligne de demande, jamais la demande ni le client ; la page « Répondre » n'affiche que la consultation | Workflows §7 ; fichier 19, prompt 5 |
| Un client voit le fournisseur | Le devis, sa page et son PDF ne lisent ni `selectedSupplier` ni les champs d'achat des lignes | Fichier 19, prompt 6 ; fichier 20, prompt 6 |
| Un assistant voit les prix d'achat | Rôle Assistant sans accès aux champs d'achat, de marge et de fournisseur retenu | §6 |
| Un site public lit trop | Clé d'API des sites avec un rôle limité | §6 |
| Deux fils se mélangent | `achats@` pour les fournisseurs, `devis@` pour les clients | §8 ; fichier 22 |

---

## 6. Les rôles et les permissions

| Rôle | Qui | Accès |
|---|---|---|
| **Associé** | Les deux associés | Tout, y compris prix d'achat, marges, fournisseurs retenus, acheteurs des dossiers d'agent ; seuls à pouvoir passer un devis en ENVOYE et un lot en LIBERE |
| **Assistant** | Assistant(e), stagiaire, plus tard | Sociétés, personnes, demandes, échantillons, tâches ; devis **sans** `selectedSupplier`, `margeTotale` ni les champs d'achat des lignes ; **aucun** accès aux offres fournisseur, aux consultations (prix), aux lots (fournisseur) ni aux dossiers d'agent |
| **Sites (clé d'API)** | Les fonctions serveur des sites A et B | Lecture seule : offres de statut VALIDE (pour la fourchette, fichier 19 prompt 4), une consultation par son jeton, un devis par son jeton ; aucune écriture directe : les sites écrivent par les webhooks |

Les champs marqués « **Associés seulement** » au §4 se règlent par les permissions de champ de Twenty (fichier 16 §8). Si la version installée ne permet pas de donner un rôle à une clé d'API, les sites passent uniquement par des webhooks qui renvoient le strict nécessaire.

---

## 7. Les workflows

### 7.1 La liste

| # | Nom | Déclencheur | Objet principal | Adresse d'envoi | Phase |
|---|---|---|---|---|---|
| W1 | Réception d'une demande | Webhook (formulaires des sites) | Demande | — | Nov. 2026 |
| W2 | Réponse aux non-qualifiés | Branche de W1 | Demande | `devis@` | Nov. 2026 |
| W3 | Devis standard depuis la grille | Branche de W1 | Devis | — | Nov. 2026 |
| W4 | Consultation des fournisseurs | Branche de W1 | Consultation | `achats@` | Nov. 2026 |
| W5 | Réponse d'un fournisseur | Webhook (page « Répondre ») | Consultation | — | Nov. 2026 |
| W6 | Relances fournisseurs | Planifié, toutes les heures | Consultation | `achats@` | Nov. 2026 |
| W7 | Envoi du devis | Manuel (bouton sur le devis) | Devis | `devis@` | Déc. 2026 |
| W8 | Acceptation du devis | Webhook (page du devis) | Devis, Commande | `devis@` | Déc. 2026 |
| W9 | Commande au fournisseur | Modification : `acompteRecu` coché | Commande, Lot | `achats@` | Déc. 2026 |
| W10 | Grille du lundi | Planifié, lundi 8 h | Offre | `achats@` | Déc. 2026 |
| W11 | Péremption de la grille | Planifié, chaque jour | Offre | — | Déc. 2026 |
| W12 | Échéance des certificats | Planifié, chaque jour | Certificat | — | Oct. 2026 |
| W13 | Échéance des enregistrements DMP | Planifié, chaque semaine | Produit | — | Janv. 2027 |
| W14 | Verrou de libération | Modification : commande passée en EXPEDIEE | Commande, Lot | — | Déc. 2026 |
| W15 | Suivi des échantillons | Planifié, chaque jour | Échantillon | — | Nov. 2026 |
| W16 | Retour client J+14 | Planifié, chaque jour | Commande | — | Déc. 2026 |
| W17 | Expiration des devis | Planifié, chaque jour | Devis | — | Déc. 2026 |
| W18 | Devis ouvert, pas accepté | Planifié, chaque jour | Devis | — | Déc. 2026 |
| W19 | Garde de divulgation | Modification : `divulgationLe` renseignée | Dossier d'agent | — | Dès le premier dossier |
| W20 | État des accords écrits | Création ou modification d'un accord ; planifié chaque jour | Accord, Société, Personne | — | Nov. 2026 |
| W21 | Score des fournisseurs | Planifié, chaque lundi 7 h | Société | — | Déc. 2026 |
| W22 | Bilan hebdomadaire | Planifié, lundi 9 h | — | e-mail interne aux associés | Déc. 2026 |

### 7.2 Le détail

**W1 — Réception d'une demande** *(webhook)*
1. Refuse l'appel si le secret partagé est absent ou faux ; ignore un `idEnvoi` déjà reçu (doublon).
2. Cherche la société par domaine de l'e-mail, sinon par nom ; la crée sinon (`typeSociete` = PROSPECT, `premierContactLe` = maintenant, `site`, `sourceAcquisition`). Même chose pour la personne.
3. Crée la demande (`DV-AAMM-N`, `statut` = NOUVELLE, `recueLe`, `dateLimiteReponse` = + 24 h ouvrées) et ses lignes.
4. **Code : score de qualification**, selon le site :

   | Site A (fichier 16 §5) | Points | Site B (nouveau, à ajuster après les premiers mois) | Points |
   |---|---|---|---|
   | E-mail professionnel (pas Gmail, Hotmail…) | +2 | Établissement ou société identifiable (nom + ville) | +2 |
   | Site web renseigné | +2 | Quantité ≥ minimum de commande du produit | +2 |
   | Volume ≥ 1 lot par trimestre | +2 | Date souhaitée compatible avec le délai | +1 |
   | Usage final et destination précisés | +1 | Téléphone renseigné | +1 |
   | Certifications cohérentes avec le produit | +1 | Logo déposé ou personnalisation décrite | +1 |
   | Pays sous sanctions, formulaire incohérent | exclusion | Formulaire incohérent | exclusion |

   ≥ 5 : qualifiée · 3 à 4 : A_VERIFIER, tâche « regarder la demande » à un associé · < 3 : NON_QUALIFIEE.
   Le barème du site B existe parce qu'un riad ou des futurs mariés écrivent souvent depuis une adresse Gmail, sans site web (fichier 20, avertissement).
5. **Branche** : non qualifiée → W2 ; qualifiée et **toutes** les lignes sur des produits `standard` avec une offre VALIDE → W3 ; sinon → W4 (statut EN_CONSULTATION). Ligne sans produit → A_VERIFIER.

**W2 — Réponse aux non-qualifiés** : e-mail depuis `devis@` dans la langue de la demande : fiche technique, fourchette de prix, échantillon payant ou sur compte transporteur (plan §10), invitation à compléter la demande. Tâche à J+7 si le prospect répond.

**W3 — Devis standard** : pour chaque ligne, cherche l'offre VALIDE du bon palier ; **Code : prix de vente** = (prix d'achat + frais de lot ÷ quantité) × 1,20, plus le packaging pour le site B, avec les paliers du guide §1.7 ; conversion au cours bancaire − 2 % ; crée le devis (`A_VALIDER`, validité + 30 jours) et ses lignes (`sourcePrix` = GRILLE) ; statut de la demande DEVIS_A_VALIDER ; tâche « valider le devis » aux associés, échéance dans l'heure.

**W4 — Consultation des fournisseurs** : pour chaque ligne, **itérateur** sur les 2 ou 3 fournisseurs du produit les mieux notés, **filtrés** sur : `typeSociete` FOURNISSEUR ou CONDITIONNEUR, un accord écrit CONSULTATION_EMAIL **actif**, et pas de certificat expiré requis par la demande. Pour chacun : crée la consultation (`CF-AAMM-N`, jeton, date limite), envoie l'e-mail depuis `achats@`. **Le modèle d'e-mail ne contient que** : référence, produit, quantité, spécification, conditionnement, emballage neutre, délai, lien « Répondre », date limite. Pour le site B, une consultation PACKAGING part aussi au conditionneur.

**W5 — Réponse d'un fournisseur** *(webhook)* : retrouve la consultation par le jeton ; enregistre prix, minimum, délai, validité, photo, `reponduLe`, statut REPONDUE. Quand toutes les consultations d'une ligne ont répondu, ou à la date limite : **Code** choisit la meilleure (prix, puis score, puis délai), passe les autres en ECARTEE, crée le devis et ses lignes (`sourcePrix` = CONSULTATION) en A_VALIDER, tâche aux associés.

**W6 — Relances** *(chaque heure)* : consultation ENVOYEE dont la date limite approche ou est passée → 1re relance par e-mail (`achats@`), `nombreRelances` + 1, statut RELANCEE ; toujours sans réponse une heure après la date limite → SANS_REPONSE et tâche « appeler le fournisseur ».

**W7 — Envoi du devis** *(bouton)* : refuse si `valideParAssocie` est vide ; génère le jeton et le lien public ; envoie l'e-mail depuis `devis@` (lien, validité, rien d'autre) ; `envoyeLe`, statut ENVOYE ; demande en DEVIS_ENVOYE.

**W8 — Acceptation** *(webhook)* : une seule fois par devis ; enregistre `acceptePar`, `accepteLe`, statut ACCEPTE ; demande GAGNEE ; société passée de PROSPECT à CLIENT ; crée la commande (`CO-AAMM-N`, EN_ATTENTE_ACOMPTE, ou BAT_EN_ATTENTE pour le site B) ; e-mail depuis `devis@` avec la facture pro forma et le RIB en devises ; tâche « vérifier l'acompte ».

**W9 — Commande au fournisseur** *(acompte coché)* : pour chaque ligne de devis, bon de commande au fournisseur retenu depuis `achats@` (quantité, spécification, **emballage neutre**, délai ; aucune donnée client) ; crée le lot (`CODE-AAMM-N`, décision EN_ATTENTE) relié à la commande ; statut COMMANDEE ; tâche « prélèvement » (fichier 11, étape 2). Site B : attend `batValideLe` avant le bon de commande au conditionneur.

**W10 — Grille du lundi** : pour chaque fournisseur ayant des offres, un e-mail depuis `achats@` avec ses lignes et deux liens : « prix inchangés » (met à jour `derniereConfirmation` de toutes ses offres) et « modifier ».

**W11 — Péremption de la grille** : toute offre non confirmée depuis 14 jours, ou dont `valableJusquau` est passée → A_CONFIRMER. Une offre A_CONFIRMER n'est plus utilisée par W3.

**W12 — Échéance des certificats** : expiration dans moins de 60 jours → EXPIRE_BIENTOT et tâche « demander le nouveau certificat » ; expirée → EXPIRE ; recalcule `certificationsVerifiees` de la société.

**W13 — Échéance des enregistrements DMP** : `enregistrementExpireLe` dans moins de 6 mois → tâche ; expirée → `publieSurSite` à faux et tâche urgente (la fiche doit sortir du site B).

**W14 — Verrou de libération** : une commande passe en EXPEDIEE alors qu'un de ses lots n'est pas LIBERE, que ses douze contrôles ne sont pas cochés, ou que `preparePar` = `liberePar` → remet le statut précédent et crée une tâche urgente. C'est le double contrôle du fichier 11 appliqué par la machine.

**W15 — Suivi des échantillons** : ENVOYE depuis 10 jours sans retour → RELANCE et tâche « demander l'avis du client » ; 30 jours → SANS_RETOUR.

**W16 — Retour client J+14** : 14 jours après `expedieeLe` → tâche « appeler le client » (fichier 11, étape 10) ; le compte rendu va dans `retourJ14`.

**W17 — Expiration des devis** : ENVOYE et `validiteJusquau` passée → EXPIRE ; tâche « relancer ou refaire un devis ».

**W18 — Devis ouvert, pas accepté** : ouvert (`premiereOuvertureLe` renseignée) depuis 3 jours sans acceptation → tâche « appeler le client ». Jamais d'e-mail automatique au client ici : l'appel est plus utile.

**W19 — Garde de divulgation** : `divulgationLe` renseignée alors que `anterioriteDeposeeLe`, `ncndSigneLe` ou `contratAgenceSigneLe` est vide → efface `divulgationLe` et crée une tâche urgente « séquence de l'annexe B §10 incomplète ». Twenty ne sait pas refuser une saisie : le workflow l'annule juste après.

**W20 — État des accords écrits** : calcule `actif` (signé, non expiré, non retiré) ; met à jour `coBrandingAutorise` de la société et `accordPhotoActif` de la personne. Un accord qui devient inactif crée une tâche « retirer du site B ».

**W21 — Score des fournisseurs** : **Code** = prix 35 % (rang de ses prix proposés) · qualité 30 % (lots LIBERE / lots, réclamations) · délais 20 % (délai moyen de réponse, retards de livraison) · documents 15 % (certificats actifs et vérifiés) ; met à jour `scoreFournisseur`, `delaiReponseMoyenHeures`, `panelReponseRapide`.

**W22 — Bilan hebdomadaire** : e-mail aux deux associés (adresses personnelles, pas `devis@`) : demandes reçues par source et par site, délai médian de réponse, part des devis sous 24 h, devis envoyés et acceptés, consultations sans réponse, certificats qui expirent, lots en attente, échantillons sans retour.

### 7.3 Ce qu'aucun workflow ne fait

- Envoyer un devis sans validation d'un associé (W7 le refuse).
- Envoyer au client un e-mail qui cite un fournisseur, ou à un fournisseur un e-mail qui cite un client.
- Libérer un lot (seul un associé passe `decision` à LIBERE).
- Remplir les formulaires des sites des coopératives (fichier 16 §1, règle 4).

---

## 8. L'e-mail

Une boîte Zoho Mail, connectée à Twenty en IMAP/SMTP, avec les alias `achats@` et `devis@` (fichier 22). Chaque workflow du §7.1 indique l'alias qu'il utilise. Les réponses reçues sont rattachées automatiquement aux sociétés et aux personnes. **Avant d'activer un workflow qui envoie un e-mail, le test du fichier 22 §5 doit être passé.**

Réglages Twenty : e-mails visibles en entier par le rôle Associé, sujet et expéditeur seulement pour le rôle Assistant ; liste de blocage pour les lettres d'information et notifications.

---

## 9. Les webhooks et les appels des sites

| Webhook | Appelé par | Contenu (champs principaux) | Réponse attendue |
|---|---|---|---|
| W1 | Formulaires `/request-a-quote/` (A) et `/devis/` (B) | `idEnvoi`, `site`, société, pays ou ville, site web, contact (nom, fonction, e-mail, téléphone), `segment`, champs du plan §10 (A) ou du fichier 14 §8 (B), lignes (produit, quantité, unité, format, spécification, conditionnement, personnalisation), `lienLogo`, `lienMaquette`, `pageOrigine`, `langue`, `source`, `qrCodeId`, `utm`, `consentementLe` | Référence `DV-…` |
| W5 | Page « Répondre » | `jeton`, `prixPropose`, `quantiteMinimum`, `delaiJours`, `validiteJours`, `lienPhotoLot` | OK ou « jeton expiré » |
| W8 | Page du devis | `jeton`, `acceptePar` (nom, fonction), horodatage | OK ou « déjà accepté / expiré » |
| W10 | Page « grille du lundi » | `jetonGrille`, action (INCHANGES ou MODIFIER + lignes) | OK |
| Ouverture du devis | Page du devis | `jeton`, horodatage | — (met à jour `premiereOuvertureLe`, `nombreOuvertures`) |

Chaque webhook exige un **secret partagé** ; chaque jeton est long, aléatoire et à usage limité. Les lectures des sites (fourchette, consultation, devis) passent par la clé d'API au rôle « Sites » (§6).

Exemple de charge utile W1 (site A, abrégé) :

```json
{
  "idEnvoi": "3f9c2a7e-…",
  "site": "SITE_A",
  "societe": { "nom": "Laboratoire Exemple", "pays": "France", "siteWeb": "https://exemple.fr" },
  "contact": { "nom": "Prénom Nom", "fonction": "Acheteuse", "email": "p.nom@exemple.fr" },
  "volumeAnnuel": "1 lot par trimestre",
  "usageFinal": "sérum visage",
  "marcheDestination": "UE",
  "certificationsDemandees": "COSMOS",
  "delaiSouhaite": "1 mois",
  "lignes": [ { "produit": "prickly-pear-seed-oil", "quantite": 25, "unite": "L", "conditionnement": "bidons de 5 L" } ],
  "langue": "fr", "pageOrigine": "/fr/…", "source": "SEO",
  "consentementLe": "2026-11-14T10:32:00Z"
}
```

---

## 10. Les vues et le tableau de bord

| Objet | Vues |
|---|---|
| Demandes | Kanban par statut · « En retard » (`dateLimiteReponse` passée, pas de devis envoyé) · « À vérifier » · par site · par source |
| Consultations | Kanban par statut · « Sans réponse depuis 4 h » |
| Devis | Kanban par statut · « À valider » · « Ouverts, pas acceptés » · « Expirent dans 7 jours » |
| Commandes | Kanban par statut · « Acompte attendu » · « BAT en attente » (site B) |
| Lots | « En attente de libération » · « Réclamations » · par produit (le registre qualité) |
| Offres fournisseur | « À confirmer » · par produit (la grille) |
| Sociétés | « Fournisseurs à vérifier » · « Clients site B » · « Panel réponse rapide » · « Prospects à relancer » |
| Personnes | Prospection sortante, kanban par `statutProspection` |
| Certificats | « Expirent dans 60 jours » · « Non vérifiés » |
| Échantillons | Par produit (c'est la mesure du plan §9) · « Sans retour » |
| Accords écrits | « Actifs » · « Expirent bientôt » |
| Dossiers d'agent | Kanban par statut |

**Les chiffres à suivre** (plan §14, fichier 16 §9) : délai moyen de réponse · part des demandes qualifiées avec un devis sous 24 h ouvrées (objectif 80 %) et des produits standard sous une heure · taux devis → commande · demandes et échantillons par produit, par source et par site · fournisseurs les plus fiables · lots refusés et réclamations. Si le tableau de bord de votre version de Twenty ne suffit pas, W22 les envoie chaque lundi, et un export CSV mensuel sert au bilan de juin 2027.

---

## 11. La mise en place, par étapes

| Quand | Objets | Workflows | Condition pour passer à la suite |
|---|---|---|---|
| **Octobre 2026** | Société, Personne, Produit, Offre fournisseur, Certificat, Accord écrit | W12, W20 | Fournisseurs et certificats saisis (fichier 18, phase 3) ; accords CONSULTATION_EMAIL des premiers fournisseurs ; e-mail connecté et test du fichier 22 §5 passé |
| **Novembre 2026** (site A en ligne) | Demande, Ligne de demande, Consultation, Échantillon | W1 à W6, W15 | 10 fausses demandes `TEST-` passées de bout en bout |
| **Décembre 2026** (premières commandes) | Devis, Ligne de devis, Commande, Lot | W7 à W11, W14, W16 à W18, W21, W22 | Premier lot libéré avec la fiche complète |
| **Janvier 2027** (site B en ligne) | Champs du site B (segment, logo, maquette, BAT, DMP) | W13 ; barème site B dans W1 ; consultations PACKAGING dans W4 | 8 fausses demandes du fichier 20, prompt 7 |
| **Au premier acheteur de vrac** | Dossier d'agent | W19 | Preuve d'antériorité déposée avant tout contact |

---

## 12. Les tests d'acceptation

1. **Anonymat fournisseur** : un e-mail de consultation, la page « Répondre » et un bon de commande de test ne contiennent ni nom, ni pays précis, ni contact du client.
2. **Anonymat client** : un devis de test, sa page et son PDF ne contiennent ni fournisseur, ni prix d'achat, ni marge ; un compte au rôle Assistant ne voit aucun de ces champs.
3. **Alias** : les tests du fichier 22 §5 passés, et refaits après chaque mise à jour importante de Twenty.
4. **Verrous** : W14 bloque une expédition avec un lot non libéré ; W19 annule une divulgation prématurée ; W4 n'écrit à aucun fournisseur sans accord CONSULTATION_EMAIL actif ; W7 refuse un devis non validé.
5. **Doublons** : le même `idEnvoi` envoyé deux fois ne crée qu'une demande ; deux clics sur « Accepter » ne créent qu'une commande.
6. **Délais** : sur les 10 demandes de test, les produits standard ont un devis « à valider » en moins de 5 minutes.
7. **Nettoyage** : tous les enregistrements `TEST-` supprimés avant l'ouverture aux vrais clients.

---

## 13. Ce qu'il faut décider

- [ ] Twenty en ligne ou auto-hébergé (fichier 16 §7, fichier 21 §0) ; la réponse change la manière de faire les tableaux de bord (§10)
- [ ] Les prénoms qui remplacent ASSOCIE_1 et ASSOCIE_2 ; qui valide les devis, qui libère les lots (jamais la même personne pour un lot)
- [ ] Le barème du site B (§7.2, W1), à revoir après trois mois
- [ ] Les frais de lot par défaut de chaque produit, pour la formule de prix
- [ ] La durée de conservation des contre-échantillons et des données des demandes non abouties (RGPD, loi 09-08)

---

## Sources

- Fichiers du dossier : 11 (contrôle qualité), 13 (produits finis), 16 (circuit des devis), 18 (mise en place par un agent), 19 et 20 (sites), 22 (e-mail), annexe B (agent) et plan opérationnel (§2, §9, §10, §14).
- Twenty — documentation des workflows (déclencheurs, actions, itérateur, branches, délais, code, requêtes HTTP) : https://docs.twenty.com/user-guide/workflows/overview
- Twenty — notes de version (objets personnalisés, permissions de champ, IMAP/SMTP, alias d'envoi, agents IA) : https://twenty.com/releases

---

## Avertissement

- Twenty évolue vite : vérifiez dans votre version que chaque type de champ, chaque déclencheur et chaque action existe avant de construire (fichier 16, avertissement). Deux points en particulier : les rôles attribuables à une clé d'API, et le blocage d'une saisie, que ce plan remplace par des workflows qui annulent juste après (W14, W19).
- Les barèmes (scores, seuils, délais de relance) sont des points de départ, à ajuster sur les premiers mois.
- Ce plan décrit un outil ; il ne remplace ni le contrat d'agence et le NCND rédigés par l'avocat (annexe B), ni la fiche de libération signée (fichier 11).
