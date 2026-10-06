# Origine des modules de `lib/`

Les modules `lib/twenty/`, `lib/seo/`, `lib/forms/`, `lib/legal/` et `lib/quote/` sont **recopiés
tels quels** depuis le dépôt du site A (`~/yasmina-botanicals`). On ne les modifie jamais ici :
un correctif se fait dans le site A, puis se recopie.

| Module | Commit du site A | Date de la copie |
|---|---|---|
| `lib/twenty/` | pas encore copié | — |
| `lib/seo/` | pas encore copié | — |
| `lib/forms/` | pas encore copié | — |
| `lib/legal/` | pas encore copié | — |
| `lib/quote/` | pas encore copié | — |

## État au 27 septembre 2026

Le dépôt du site A (commit `70b4633`) ne contient pas encore ces modules : ils seront créés par
les prompts 1, 4 et 6 du fichier 19. En attendant, le site B utilise des équivalents
**provisoires** propres à lui, à remplacer à la copie :

| Provisoire (site B) | Remplacé par |
|---|---|
| `app/_site/metadata.ts`, `app/_site/json-ld.tsx` | `lib/seo/` |
| `app/_devis/schema.ts`, `envoi.ts` (W1, secours par e-mail) | `lib/forms/` |
| `app/_devis/twenty.ts` (lecture des offres) | `lib/twenty/` |
| `app/_devis/fourchette.ts` (formule de prix) | `lib/quote/` ou `lib/twenty/`, selon le site A |

À la copie, comparer : le site A doit accepter en paramètres ce que le site B fixe ici (site
SITE_B, devise MAD, segment, personnalisation, liens du logo et de la maquette).

## Recopier

```bash
SITE_A=~/yasmina-botanicals
for m in twenty seo forms legal quote; do
  rm -rf lib/$m && cp -R "$SITE_A/lib/$m" lib/$m
done
git -C "$SITE_A" rev-parse --short HEAD   # à noter dans le tableau ci-dessus
diff -r "$SITE_A/lib" lib -x SOURCE.md     # aucune différence attendue
```
