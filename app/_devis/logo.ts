import "server-only";
import { randomBytes } from "node:crypto";
import sharp, { type OutputInfo } from "sharp";
import { LOGO_TAILLE_MAX } from "./schema";
import { stockage } from "./stockage";

// Logo déposé par le client : PNG ou SVG, taille limitée, métadonnées supprimées, rangé dans
// l'espace privé sous un nom aléatoire (prompt 4, traitement 2).

export class LogoRefuse extends Error {}

const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/** Motifs refusés dans un SVG : scripts, gestionnaires d'événements, contenu externe, entités. */
const SVG_DANGEREUX = [
  /<script/i,
  /\son[a-z]+\s*=/i,
  /javascript:/i,
  /<foreignObject/i,
  /<!ENTITY/i,
  /<!DOCTYPE/i,
  /(?:xlink:)?href\s*=\s*["']\s*(?!#)/i, // seuls les liens internes (#id) sont permis
  /<(?:iframe|embed|object|use)[\s>][^>]*(?:href|src)\s*=\s*["']\s*(?:https?:|\/\/)/i,
  /@import/i,
  /url\(\s*["']?\s*(?:https?:|\/\/|data:)/i,
];

/** Retire d'un SVG ce qui décrit l'auteur ou le logiciel : metadata, commentaires, titre, espaces de noms d'éditeur. */
export function nettoyerSvg(svg: string): string {
  return svg
    .replace(/^﻿/, "")
    .replace(/<\?xml[^>]*\?>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<metadata[\s\S]*?<\/metadata>/gi, "")
    .replace(/<(title|desc)[\s\S]*?<\/\1>/gi, "")
    .replace(/<(sodipodi|inkscape):[^>]*?(\/>|>[\s\S]*?<\/\1:[^>]*>)/gi, "")
    .replace(/\s(?:sodipodi|inkscape|xmlns:(?:sodipodi|inkscape|dc|cc|rdf|serif|sketch|figma|i|x|graph))(?::[\w-]+)?="[^"]*"/gi, "")
    .replace(/\sdata-name="[^"]*"/gi, "")
    .trim();
}

export function svgDangereux(svg: string): boolean {
  return SVG_DANGEREUX.some((motif) => motif.test(svg));
}

export type LogoDepose = { cle: string; type: "image/png" | "image/svg+xml"; largeur?: number; hauteur?: number };

/** Vérifie, nettoie et range le logo. Lève LogoRefuse avec un message pour le client. */
export async function deposerLogo(fichier: File): Promise<LogoDepose> {
  if (fichier.size > LOGO_TAILLE_MAX) throw new LogoRefuse("Le logo dépasse 5 Mo.");
  const brut = Buffer.from(await fichier.arrayBuffer());
  const nom = randomBytes(24).toString("base64url");

  // Le type est lu dans le fichier, pas dans ce que déclare le navigateur.
  if (brut.subarray(0, 8).equals(PNG)) {
    let png: Buffer;
    let info: OutputInfo;
    try {
      // Réencodage : sharp ne recopie aucune métadonnée (EXIF, XMP, textes PNG).
      ({ data: png, info } = await sharp(brut, { limitInputPixels: 50_000_000 }).png().toBuffer({ resolveWithObject: true }));
    } catch {
      throw new LogoRefuse("Le fichier PNG est illisible.");
    }
    const cle = `logos/${nom}.png`;
    await stockage().deposer(cle, { contenu: png, type: "image/png" });
    return { cle, type: "image/png", largeur: info.width, hauteur: info.height };
  }

  const texte = brut.toString("utf8");
  if (/^﻿?\s*(<\?xml[^>]*\?>\s*)?(<!--[\s\S]*?-->\s*)*<svg[\s>]/i.test(texte)) {
    if (svgDangereux(texte)) {
      throw new LogoRefuse("Ce SVG contient des scripts ou des liens externes : exportez-le à nouveau, ou envoyez un PNG.");
    }
    const propre = nettoyerSvg(texte);
    let largeur: number | undefined;
    let hauteur: number | undefined;
    try {
      // Vérifie que le SVG se dessine.
      ({ width: largeur, height: hauteur } = await sharp(Buffer.from(propre)).metadata());
    } catch {
      throw new LogoRefuse("Le fichier SVG est illisible.");
    }
    const cle = `logos/${nom}.svg`;
    await stockage().deposer(cle, { contenu: Buffer.from(propre), type: "image/svg+xml" });
    return { cle, type: "image/svg+xml", largeur, hauteur };
  }

  throw new LogoRefuse("Le logo doit être un fichier PNG ou SVG.");
}
