# Déploiement du site B — Maison Yousra

## Une seule version d'URL

- **Slash final** : géré par Next.js (`trailingSlash: true`) ; `/hotels-riads` redirige vers
  `/hotels-riads/` (code 308, redirection permanente, traitée comme une 301 par Google et Bing).
- **www ou non** : à fixer avec [domaine B]. La forme retenue est celle de `SITE_URL` ; l'autre
  redirige dans Cloudflare.
- **Le .ma vers le .com** (fichier 14 §2) : règle Cloudflare, jamais dans le code.

### Règles Cloudflare (Rules → Redirect Rules), une fois le domaine choisi

| Règle | Condition | Cible | Code |
|---|---|---|---|
| .ma → .com | `http.host in {"[domaine B].ma" "www.[domaine B].ma"}` | `concat("https://[forme retenue].com", http.request.uri.path)`, chaîne de requête conservée | 301 |
| www ↔ sans www | hôte = forme non retenue du .com | même chemin sur la forme retenue, chaîne de requête conservée | 301 |
| HTTP → HTTPS | « Always Use HTTPS » activé | — | 301 |

Le chemin est conservé tel quel : Next.js ajoute ensuite le slash final si besoin. Vérifier
qu'il n'y a qu'un seul saut de redirection par forme d'URL, sauf pour le slash final.

## Hébergement

[À COMPLÉTER : adaptateur Next.js pour Cloudflare, à aligner sur le choix du site A (fichier 19,
prompt 1, tâche 2).]

## Variables d'environnement

Voir `.env.example`. Points à retenir :

- `SITE_URL` est obligatoire au build de production.
- **Webhooks W1 et W8** : les workflows Twenty sont communs aux deux sites, le champ
  `site = SITE_B` les distingue. Les URL peuvent donc être celles du site A. Les **secrets**
  sont propres à chaque site, pour révoquer l'un sans couper l'autre : cela demande que le
  workflow accepte deux secrets, ou un webhook par site. [À COMPLÉTER : à trancher avec la
  configuration de W1 et W8 dans Twenty (fichier 18).]
- Stockage des logos et des maquettes : un espace privé propre au site B, jamais public.

## Séparation d'avec le site A

Propriétés Search Console et Bing Webmaster Tools, mesure d'audience et sitemap propres au
site B. Le seul lien vers le site A est en pied de page.

## Vérification du build

`npm run build` lance `scripts/check-build.mjs` après la compilation. Il échoue si le build
contient un terme du site A (`scripts/site-a-terms.json`, plus un fichier privé facultatif
désigné par `SITE_B_FORBIDDEN_TERMS_FILE`), une feuille de style, ou plus d'un lien vers le
site A par page. Si `SITE_A_DIR` désigne le dossier du site A, il vérifie aussi qu'aucune image
n'est identique ; le build ne dépend pas de ce dossier.
