<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Maison Yousra — site B

Site de la marque **Maison Yousra**, d'une SARL marocaine. Plan : `docs/sites-web/14-plan-site-produits-finis.md`. L'autre marque de la SARL est Yasmina Botanicals (`~/yasmina-botanicals`) : deux sites distincts, liés seulement en pied de page.

## Documents de référence (`docs/`)

| Fichier | Rôle |
|---|---|
| `docs/sites-web/20-prompts-site-b-p1.md` | **Les prompts à suivre, dans l'ordre.** Le prompt 0 contient les règles absolues |
| `docs/sites-web/14-plan-site-produits-finis.md` | Plan du site B et décisions |
| `docs/produits/13-plan-produits-finis-hotels.md` | L'offre (hôtels, spas, cadeaux) |
| `docs/sites-web/19-prompts-site-a-p1.md` | Socle technique et règles communes, pour référence |
| `docs/ventes-export/16-devis-transfert-instantane.md` | Circuit des devis, maquette automatique (§6.8) |
| `docs/ventes-export/18-prompt-agent-twenty-mcp.md`, `23-twenty-plan-complet.md` | Objets et workflows Twenty |
| `docs/produits/11-controle-qualite-avant-expedition.md` | Contrôle qualité |
| `docs/annexes/C-modeles-documents.md` | Modèles de documents |

`docs/` est une **copie** : la source est le dépôt `~/huiledolive-export`. Pour modifier un document, le modifier là-bas, puis recopier. Les liens vers des fichiers absents de `docs/` renvoient à ce dépôt.

## Méthode de travail

- Suivre les prompts **un par un, dans l'ordre**, avec le prompt 0 en tête de chaque session. Finir chaque prompt par son compte rendu (fait, fichiers, `[À COMPLÉTER]`, écarts).
- Les règles absolues du prompt 0 priment sur tout le reste de ce fichier.

## Règles propres à ce site

- **Coopératives** : nommées seulement avec leur accord écrit, pour un produit co-brandé, et **jamais** si elles fournissent aussi Yasmina Botanicals.
- **Le conditionneur n'est jamais nommé.**
- **Publication d'un produit** seulement s'il est enregistré au ministère de la Santé (DMP) ou conditionné par un établissement autorisé par l'ONSSA (plan §3).
- **Français à la racine**, anglais sous `/en/` en P2.
- `docs/sites-web/19-prompts-site-a-p1.md` est là pour référence (socle, règles communes) : on ne construit pas le site A ici.

## Deux dépôts séparés

Chaque site a son propre dépôt (`~/yasmina-botanicals`, `~/maison-yousra`), comme le prévoient les prompts.

- Le code commun vit dans `lib/twenty/`, `lib/seo/`, `lib/forms/`, `lib/legal/` et `lib/quote/`, **indépendant de la marque** : marque, langue, domaine, devise et adresses e-mail passent par paramètres. Ces modules n'importent rien de `app/`.
- **Le site A est la source** de ces modules. Le site B les recopie tels quels et note le commit d'origine dans `lib/SOURCE.md`. Un correctif se fait dans le site A, puis se recopie dans le site B.
- La page fournisseur « Répondre » n'existe que sur le site A.

## Qualité du code

- **Next.js 16** : avant d'utiliser une API (routage, métadonnées, cache, formulaires, `proxy.ts`), lire le guide correspondant dans `node_modules/next/dist/docs/`. Guides utiles ici : `01-app/02-guides/internationalization.md`, `json-ld.md`, `forms.md`, `environment-variables.md`, `data-security.md`, `content-security-policy.md`, et `01-app/01-getting-started/14-metadata-and-og-images.md`.
- **Composants serveur par défaut.** `"use client"` seulement pour ce qui a besoin d'interactivité (sélecteur de langue, formulaire), et le plus bas possible dans l'arbre.
- **TypeScript strict**, sans `any` ni `@ts-ignore`. Les données qui viennent de l'extérieur (formulaire, webhook, Twenty) sont validées côté serveur avec un schéma avant usage.
- **Secrets** : dans `.env.local` (jamais commité). Chaque variable nouvelle est ajoutée, sans valeur, à `.env.example`. Le client Twenty et tout code qui lit un secret importent `server-only`. Aucune variable secrète en `NEXT_PUBLIC_`.
- **Formulaires** : Server Actions ou route handlers, validation côté serveur, champ piège, messages d'erreur accessibles. Ne jamais faire confiance à la validation côté navigateur seule.
- **Style** : le design du canevas [Site B — Design](https://claude.ai/artifact/YXHCRxkacB3xRA8Zno5sQB) est appliqué depuis la passe de design (branche `design-passe-1`), ce qui lève la règle 1 du prompt 0 pour ce dépôt. Tailwind v4 ; jetons (couleurs, polices, arche) dans `app/globals.css`, un seul endroit. Le HTML reste sémantique et accessible.
- **Accessibilité** : un seul `h1` par page, titres hiérarchisés, `label` sur chaque champ, `alt` sur chaque image, navigation au clavier, attribut `lang` correct sur `<html>`.
- **SEO technique** : métadonnées via l'API `metadata` / `generateMetadata`, canonical auto-référent, `sitemap.ts` et `robots.ts` dans `app/`, JSON-LD rendu côté serveur, slash final partout.
- **Contenu** : aucune donnée inventée ; ce qui manque s'écrit `[À COMPLÉTER : …]` et reste listé.

## Avant chaque commit

1. `npm run lint` sans erreur.
2. `npm run build` réussit.
3. Aucune clé, aucun nom de fournisseur, aucun e-mail personnel dans le diff.
4. Un commit par étape, message en français à l'indicatif (« Ajoute la page qualité »), comme dans le dépôt de plan.

## Dépôt

- **Le dépôt GitHub doit rester privé** : `docs/` contient des prix, des marges et le fonctionnement interne de la SARL.
- Une branche par prompt (`prompt-1-socle`, `prompt-2-accueil`, …), fusionnée après relecture du compte rendu.
