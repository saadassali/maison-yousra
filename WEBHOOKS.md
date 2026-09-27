# Webhooks du site B vers Twenty

Format des appels que le site B fait aux workflows de Twenty (fichier 23 §9). Il sert à
construire les workflows ; le code qui les produit est dans `app/_devis/`.

## W1 — Demande de devis (`/devis/`)

`POST` sur `TWENTY_W1_WEBHOOK_URL`, en JSON, délai de 8 secondes.

### Le secret partagé

Le secret (`TWENTY_W1_WEBHOOK_SECRET`) part **deux fois** :

- dans l'en-tête `x-webhook-secret` ;
- dans le champ `secret` du corps, parce que le déclencheur webhook de Twenty ne transmet que
  le corps au workflow, où l'étape 1 de W1 le vérifie (fichier 23 §7.2).

Conséquence : le secret apparaît dans l'historique des exécutions du workflow. Si la version
de Twenty installée permet de lire les en-têtes, retirez le champ `secret` du corps
(`app/_devis/envoi.ts`) et vérifiez l'en-tête seulement.

### Le corps

```json
{
  "secret": "…",
  "idEnvoi": "3f9c2a7e-1b2c-4d5e-8f90-123456789abc",
  "site": "SITE_B",
  "segment": "HOTEL_RIAD",
  "societe": { "nom": "TEST- Riad", "ville": "Fès" },
  "contact": {
    "nom": "Prénom Nom",
    "fonction": "Gouvernante générale",
    "email": "contact@exemple.ma",
    "telephone": "+212 600 000 000"
  },
  "nombreChambres": 18,
  "dateEvenement": null,
  "nombreInvites": null,
  "villeLivraison": "Fès",
  "delaiSouhaite": "2027-03-15",
  "lignes": [
    {
      "produit": "gel-douche-argan",
      "produitNom": "Gel douche à l’argan",
      "produitTwentyId": "…uuid de l'objet product…",
      "quantite": 10,
      "unite": "UNITE",
      "format": "RECHARGE_5L",
      "personnalisation": "Logo : déposé (lienLogo)\nCouleurs : vert sauge\nLangue(s) de l’étiquette : Français, Anglais\nTexte à imprimer : —\nBoîte cadeau : non"
    }
  ],
  "lienLogo": "https://[domaine B]/fichiers/logos/<nom aléatoire>.png/?s=<signature>",
  "lienMaquette": null,
  "demandeLibre": "Message libre, ou null",
  "fourchetteAffichee": "Gel douche à l’argan, recharge de 5 l × 10 : 110–160 MAD l’unité",
  "pageOrigine": "/hotels-riads/",
  "langue": "fr",
  "source": "QR_CODE",
  "qrCodeId": "riad-fes-01",
  "utm": "utm_source=distributeur&utm_medium=qr",
  "consentementLe": "2027-01-15T10:00:00.000Z"
}
```

### Correspondance avec Twenty

| Clé | Objet et champ (fichier 23) | Remarque |
|---|---|---|
| `idEnvoi` | `quoteRequest.idEnvoi` | W1 ignore un `idEnvoi` déjà reçu (doublon) |
| `site` | `quoteRequest.site` | Toujours `SITE_B` |
| `segment` | `quoteRequest.segment`, `company.segment` | HOTEL_RIAD, SPA_HAMMAM, ENTREPRISE_CADEAUX, MARIAGE, EVENEMENT, AUTRE |
| `societe.nom`, `societe.ville` | `company.name`, `company.ville` | Pas de site web ni de pays sur le site B |
| `contact.*` | `person` | |
| `nombreChambres`, `nombreInvites`, `dateEvenement`, `villeLivraison` | `quoteRequest` | Champs du site B |
| `delaiSouhaite` | `quoteRequest.delaiSouhaite` | Date de livraison souhaitée, au format AAAA-MM-JJ |
| `lignes[].produitTwentyId` | `quoteRequestLine.product` | Vide si « je ne sais pas encore », ou si l'identifiant Twenty n'est pas saisi dans `content/produits.ts` : W1 envoie alors en A_VERIFIER |
| `lignes[].produit`, `produitNom` | — | Pour lecture humaine et rattachement manuel |
| `lignes[].quantite`, `unite`, `format` | `quoteRequestLine` | Quantité = nombre de contenants du format ; `unite` toujours UNITE |
| `lignes[].personnalisation` | `quoteRequestLine.personnalisation` | La même pour toutes les lignes d'une demande |
| `lienLogo`, `lienMaquette` | `quoteRequest.lienLogo`, `lienMaquette` | Liens privés signés (voir plus bas) ; maquette au prompt 5 |
| `demandeLibre` | `quoteRequest.demandeLibre` | |
| `fourchetteAffichee` | `quoteRequest.fourchetteAffichee` | Ce que le client a vu, pour mémoire |
| `pageOrigine`, `langue`, `qrCodeId`, `utm` | `quoteRequest` | |
| `source` | `quoteRequest.source` | SEO par défaut ; QR_CODE, ETRADE_MA, SALON, PROSPECTION par `?source=` |
| `consentementLe` | `quoteRequest.consentementLe` | |

### Ce qui manque dans Twenty

- La valeur `BOUTEILLE` dans la sélection `format` (huile d'olive du verger) : à ajouter à
  `formatsDisponibles` et `format`, sinon W1 doit l'ignorer.
- Le score du site B (fichier 23 §7.2) : « quantité ≥ minimum de commande » suppose que
  `product.minimumCommande` est dans la même unité que `quantite` (nombre de contenants).

### La réponse attendue

`200` avec la référence `DV-AAMM-N` quelque part dans le corps (texte ou JSON). Le site
l'affiche au client. Sans référence, le site affiche une « référence d'envoi » tirée de
`idEnvoi`.

### En cas d'échec

Réponse autre que 2xx, ou pas de réponse en 8 secondes : la demande complète part par e-mail
(`SMTP_URL`, de `QUOTE_FROM_EMAIL` vers `QUOTE_FALLBACK_EMAIL`) et le client voit quand même la
confirmation. Si l'e-mail échoue aussi, le client voit un message d'erreur, ses données restent
dans le formulaire. Le journal ne contient que `idEnvoi`, jamais de donnée personnelle.

## Liens privés (logos, maquettes)

`/fichiers/<clé>/?s=<signature>` : la clé est un nom aléatoire de 32 caractères, la signature
un HMAC-SHA256 avec `LIENS_SECRET`. Sans signature valable : 404. Le fichier est servi en
téléchargement (`content-disposition: attachment`), jamais affiché dans une page, avec
`noindex`, `no-store` et un CSP `sandbox`.

## Fourchette indicative

Lue côté serveur, dans Twenty, par la clé d'API au rôle « Sites » (`TWENTY_API_URL`,
`TWENTY_API_KEY`) : offres `supplierOffer` de statut VALIDE du produit (`produitTwentyId`).
Formule (fichier 16 §5) : (prix d'achat + frais de lot ÷ quantité) × 1,20, plus le packaging
du conditionneur ; minimum et maximum arrondis à deux chiffres significatifs. Masquée si
l'identifiant Twenty du produit, les frais de lot (`DEVIS_FRAIS_LOT_MAD`), une offre MATIERE ou
une offre PACKAGING manquent. Hypothèses à confirmer :

- les offres PACKAGING du conditionneur sont rattachées au même `product` que la matière ;
- le prix d'achat des deux est exprimé par contenant du format demandé ;
- le packaging est ajouté sans marge (« plus le packaging », fichier 23 §7.2, W3).
