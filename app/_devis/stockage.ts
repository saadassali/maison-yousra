import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, normalize } from "node:path";
import { AwsClient } from "aws4fetch";
import { configDevis } from "./config";

// Stockage privé des logos et des maquettes. En production : un espace compatible S3 (par
// exemple Cloudflare R2), jamais public. En développement sans S3 : le dossier .stockage/,
// hors du dépôt. Aucun fichier n'a d'URL publique : on y accède par /fichiers/ avec une
// signature (liens.ts).

export type Fichier = { contenu: Buffer; type: string };

export interface Stockage {
  deposer(cle: string, fichier: Fichier): Promise<void>;
  lire(cle: string): Promise<Fichier | null>;
}

const CLE_VALIDE = /^[a-z]+\/[A-Za-z0-9_-]{16,}\.(png|svg|jpg|webp)$/;

export function cleValide(cle: string): boolean {
  return CLE_VALIDE.test(cle);
}

class StockageLocal implements Stockage {
  private racine = join(process.cwd(), ".stockage");
  private chemin(cle: string) {
    if (!cleValide(cle)) throw new Error("Clé de fichier invalide.");
    const chemin = normalize(join(this.racine, cle));
    if (!chemin.startsWith(this.racine)) throw new Error("Clé de fichier invalide.");
    return chemin;
  }
  async deposer(cle: string, { contenu, type }: Fichier) {
    const chemin = this.chemin(cle);
    await mkdir(dirname(chemin), { recursive: true });
    await writeFile(chemin, contenu);
    await writeFile(`${chemin}.type`, type);
  }
  async lire(cle: string) {
    try {
      const chemin = this.chemin(cle);
      return { contenu: await readFile(chemin), type: await readFile(`${chemin}.type`, "utf8") };
    } catch {
      return null;
    }
  }
}

class StockageS3 implements Stockage {
  private client: AwsClient;
  constructor(
    private base: string,
    accessKeyId: string,
    secretAccessKey: string,
    region: string,
  ) {
    this.client = new AwsClient({ accessKeyId, secretAccessKey, region, service: "s3" });
  }
  private url(cle: string) {
    if (!cleValide(cle)) throw new Error("Clé de fichier invalide.");
    return `${this.base}/${cle}`;
  }
  async deposer(cle: string, { contenu, type }: Fichier) {
    const r = await this.client.fetch(this.url(cle), {
      method: "PUT",
      body: new Uint8Array(contenu),
      headers: { "content-type": type },
    });
    if (!r.ok) throw new Error(`Dépôt refusé par le stockage (${r.status}).`);
  }
  async lire(cle: string) {
    const r = await this.client.fetch(this.url(cle));
    if (r.status === 404) return null;
    if (!r.ok) throw new Error(`Lecture refusée par le stockage (${r.status}).`);
    return {
      contenu: Buffer.from(await r.arrayBuffer()),
      type: r.headers.get("content-type") ?? "application/octet-stream",
    };
  }
}

let instance: Stockage | undefined;

export function stockage(): Stockage {
  if (instance) return instance;
  const s3 = configDevis.s3();
  if (s3.endpoint && s3.bucket && s3.accessKeyId && s3.secretAccessKey) {
    instance = new StockageS3(`${s3.endpoint.replace(/\/$/, "")}/${s3.bucket}`, s3.accessKeyId, s3.secretAccessKey, s3.region);
  } else if (configDevis.production) {
    throw new Error("Stockage privé non configuré (UPLOADS_S3_*) : voir .env.example.");
  } else {
    instance = new StockageLocal();
  }
  return instance;
}
