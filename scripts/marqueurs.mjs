// Liste les marqueurs [À COMPLÉTER : …] du site B, par fichier (prompt 0, règle 2).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const dossiers = ["app", "content", "lib"];
const fichiers = [".env.example", "DEPLOIEMENT.md"];
const MARQUEUR = /\[À COMPLÉTER : [^\]]+\]/g;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const liste = [
  ...dossiers.map((d) => join(root, d)).flatMap((d) => { try { return walk(d); } catch { return []; } }),
  ...fichiers.map((f) => join(root, f)),
];

let total = 0;
for (const fichier of liste) {
  let texte;
  try { texte = readFileSync(fichier, "utf8"); } catch { continue; }
  // Les définitions du motif (schemas.ts) ne sont pas des marqueurs.
  const trouves = [...new Set(texte.match(MARQUEUR) ?? [])].filter((m) => !m.includes("…") && !m.includes(".+"));
  if (!trouves.length) continue;
  total += trouves.length;
  console.log(`\n${relative(root, fichier)}`);
  for (const m of trouves) console.log(`  ${m}`);
}
console.log(`\n${total} marqueur(s) distinct(s) par fichier.`);
