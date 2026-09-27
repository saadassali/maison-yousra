# Origine des modules de `lib/`

Les modules `lib/twenty/`, `lib/seo/`, `lib/forms/`, `lib/legal/` et `lib/quote/` sont **recopiés
tels quels** depuis le dépôt du site A (`~/yasmine-botanicals`). On ne les modifie jamais ici :
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
**provisoires** propres à lui, dans `app/_site/` (`metadata.ts`, `json-ld.tsx`). Ils seront
remplacés par `lib/seo/` à la copie.

## Recopier

```bash
SITE_A=~/yasmine-botanicals
for m in twenty seo forms legal quote; do
  rm -rf lib/$m && cp -R "$SITE_A/lib/$m" lib/$m
done
git -C "$SITE_A" rev-parse --short HEAD   # à noter dans le tableau ci-dessus
diff -r "$SITE_A/lib" lib -x SOURCE.md     # aucune différence attendue
```
