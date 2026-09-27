// Vérifie le dossier de sortie du build du site B (lancé par « postbuild »).
// 1. Aucun terme propre au site A (scripts/site-a-terms.json, plus un fichier privé facultatif
//    désigné par SITE_B_FORBIDDEN_TERMS_FILE, pour les noms qui ne doivent pas être commités).
// 2. Aucun exemple « EXEMPLE- » (prompt 2).
// 3. Au plus un lien vers le site A par page.
// 5. Allégations santé (scripts/allegations-interdites.json) ; un h1, un title et une meta
//    description par page.
// 4. Facultatif : aucune image identique à une image du site A, si SITE_A_DIR est défini.
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import nextEnv from "@next/env";

const root = process.cwd();
nextEnv.loadEnvConfig(root);

const TEXT_EXT = new Set([".html", ".rsc", ".body", ".meta", ".txt", ".xml", ".js", ".json", ".css", ".map"]);
const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".svg", ".ico"]);
const scanDirs = [".next/server", ".next/static", "public"].map((d) => join(root, d)).filter(existsSync);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const files = scanDirs.flatMap(walk);
const errors = [];

// 1. Termes du site A.
const terms = JSON.parse(readFileSync(join(root, "scripts/site-a-terms.json"), "utf8")).terms;
const privateTermsFile = process.env.SITE_B_FORBIDDEN_TERMS_FILE;
if (privateTermsFile) {
  terms.push(...readFileSync(privateTermsFile, "utf8").split("\n").map((t) => t.trim()).filter(Boolean));
}
const lowered = terms.map((t) => t.toLowerCase());
for (const file of files) {
  if (!TEXT_EXT.has(extname(file))) continue;
  const content = readFileSync(file, "utf8").toLowerCase();
  lowered.forEach((term, i) => {
    if (content.includes(term)) errors.push(`terme du site A « ${terms[i]} » dans ${relative(root, file)}`);
  });
}

// 1 bis. Aucun exemple « EXEMPLE- » (prompt 2) dans le build de production.
for (const file of files) {
  // Données d'exemple (« EXEMPLE-riad », « EXEMPLE- Coopérative ») ; le préfixe seul, dans le
  // code qui les filtre, est permis.
  if (TEXT_EXT.has(extname(file)) && /EXEMPLE-(?:[a-z0-9]| [a-z0-9À-ÿ])/i.test(readFileSync(file, "utf8"))) {
    errors.push(`exemple « EXEMPLE- » dans ${relative(root, file)}`);
  }
}

// 1 ter. Allégations santé interdites, dans le texte des pages livrées (sans balises ni scripts).
const racines = JSON.parse(readFileSync(join(root, "scripts/allegations-interdites.json"), "utf8")).racines;
const pages = files.filter((f) => f.startsWith(join(root, ".next/server/app")) && extname(f) === ".html");
const texteDe = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .toLowerCase();
for (const file of pages) {
  const texte = texteDe(readFileSync(file, "utf8"));
  for (const racine of racines) {
    if (texte.includes(racine.toLowerCase())) errors.push(`allégation interdite « ${racine} » dans ${relative(root, file)}`);
  }
}

// 1 quater. Chaque page : un seul h1, un title, une meta description (prompt 3).
for (const file of pages) {
  const nom = relative(join(root, ".next/server/app"), file);
  if (nom.startsWith("_global-error")) continue;
  const html = readFileSync(file, "utf8");
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) errors.push(`${h1} h1 dans ${nom}`);
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`pas de title dans ${nom}`);
  if (!nom.startsWith("_not-found") && !/<meta name="description" content="[^"]+"/.test(html)) {
    errors.push(`pas de meta description dans ${nom}`);
  }
}

// 3. Liens vers le site A.
const siteA = process.env.SITE_A_URL?.trim().replace(/\/$/, "");
if (siteA) {
  for (const file of files.filter((f) => extname(f) === ".html")) {
    const count = readFileSync(file, "utf8").split(`href="${siteA}`).length - 1;
    if (count > 1) errors.push(`${count} liens vers le site A dans ${relative(root, file)}`);
  }
}

// 4. Images du site A (le build ne dépend pas de ce dossier : vérification seulement s'il est donné).
const siteADir = process.env.SITE_A_DIR;
if (siteADir && existsSync(siteADir)) {
  const hash = (f) => createHash("sha256").update(readFileSync(f)).digest("hex");
  const siteAImages = new Set(
    walk(siteADir)
      .filter((f) => !f.includes("node_modules") && !f.includes(".next") && IMAGE_EXT.has(extname(f)))
      .map(hash),
  );
  for (const file of files.filter((f) => IMAGE_EXT.has(extname(f)))) {
    if (siteAImages.has(hash(file))) errors.push(`image identique au site A : ${relative(root, file)}`);
  }
}

if (errors.length) {
  console.error(`Vérification du build : ${errors.length} erreur(s)\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log(
  `Vérification du build : ${files.length} fichiers, aucun contenu du site A, aucune allégation interdite, un h1 par page.`,
);
