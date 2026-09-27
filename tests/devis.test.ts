import { rm } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { afterAll, describe, expect, it } from "vitest";
import { arrondir, calculerFourchette, type Offre } from "../app/_devis/fourchette";
import { cheminFichier, creerJeton, lireJeton, signatureFichierValide } from "../app/_devis/liens";
import { deposerLogo, LogoRefuse, nettoyerSvg, svgDangereux } from "../app/_devis/logo";
import { lireFormulaire, validerDemande, type Demande } from "../app/_devis/schema";
import { stockage } from "../app/_devis/stockage";
import { construireChargeW1 } from "../app/_devis/w1";
import type { Produit } from "../app/_content/schemas";

const demain = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);

function formulaire(modif: Record<string, string | string[]> = {}): FormData {
  const champs: Record<string, string | string[]> = {
    idEnvoi: "3f9c2a7e-1b2c-4d5e-8f90-123456789abc",
    segment: "hotel",
    etablissement: "TEST- Riad",
    ville: "Fès",
    nom: "Prénom Nom",
    fonction: "Gouvernante générale",
    email: "contact@exemple.ma",
    telephone: "+212 600 000 000",
    nombreChambres: "18",
    "ligne-produit": ["inconnu"],
    "ligne-format": ["recharge-5l"],
    "ligne-quantite": ["10"],
    langues: ["fr", "en"],
    couleurs: "vert sauge",
    dateLivraison: demain,
    consentement: "oui",
    source: "QR_CODE",
    qrCodeId: "riad-fes-01",
    utm_source: "distributeur",
    ...modif,
  };
  const fd = new FormData();
  for (const [k, v] of Object.entries(champs)) for (const x of [v].flat()) fd.append(k, x);
  return fd;
}

describe("validation du formulaire (même schéma côté navigateur et serveur)", () => {
  it("accepte une demande complète", () => {
    const r = validerDemande(lireFormulaire(formulaire()));
    expect(r.ok).toBe(true);
  });

  it("refuse sans consentement, avec un e-mail invalide ou sans quantité", () => {
    const r = validerDemande(lireFormulaire(formulaire({ consentement: "", email: "pas-un-email", "ligne-quantite": [""] })));
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(Object.keys(r.erreurs)).toEqual(expect.arrayContaining(["consentement", "email", "lignes.0.quantite"]));
    }
  });

  it("demande la date et le nombre d'invités pour un mariage", () => {
    const r = validerDemande(lireFormulaire(formulaire({ segment: "mariage" })));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.erreurs)).toEqual(expect.arrayContaining(["dateEvenement", "nombreInvites"]));
  });

  it("refuse une date de livraison passée", () => {
    const r = validerDemande(lireFormulaire(formulaire({ dateLivraison: "2020-01-01" })));
    expect(r.ok).toBe(false);
  });

  it("ramène une source inconnue à SEO", () => {
    const r = validerDemande(lireFormulaire(formulaire({ source: "PIRATE" })));
    expect(r.ok && r.demande.source).toBe("SEO");
  });
});

describe("charge utile W1 (fichier 23 §9)", () => {
  it("porte site B, le segment Twenty, la personnalisation par ligne et les liens", () => {
    const r = validerDemande(lireFormulaire(formulaire()));
    if (!r.ok) throw new Error("demande invalide");
    const charge = construireChargeW1({
      demande: r.demande as Demande,
      produits: [] as Produit[],
      lienLogo: "https://exemple.ma/fichiers/logos/x/?s=y",
      lienMaquette: null,
      fourchetteAffichee: null,
      maintenant: new Date("2027-01-15T10:00:00Z"),
    });
    expect(charge.site).toBe("SITE_B");
    expect(charge.segment).toBe("HOTEL_RIAD");
    expect(charge.source).toBe("QR_CODE");
    expect(charge.qrCodeId).toBe("riad-fes-01");
    expect(charge.utm).toBe("utm_source=distributeur");
    expect(charge.lignes[0]).toMatchObject({ produit: null, quantite: 10, format: "RECHARGE_5L", unite: "UNITE" });
    expect(charge.lignes[0].personnalisation).toContain("Logo : déposé");
    expect(charge.lignes[0].personnalisation).toContain("Français, Anglais");
    expect(charge.lienLogo).toContain("/fichiers/");
    expect(JSON.stringify(charge)).not.toMatch(/secret/i);
  });
});

describe("fourchette indicative (fichier 16 §5 et §6.1)", () => {
  const offres: Offre[] = [
    { fournisseur: "a", typeOffre: "MATIERE", palierMinimum: 1, prixAchat: 100 },
    { fournisseur: "a", typeOffre: "MATIERE", palierMinimum: 50, prixAchat: 80 },
    { fournisseur: "b", typeOffre: "MATIERE", palierMinimum: 1, prixAchat: 120 },
    { fournisseur: "c", typeOffre: "PACKAGING", palierMinimum: 1, prixAchat: 10 },
  ];

  it("applique le palier, la formule et l'arrondi", () => {
    // a : (80 + 500/100) × 1,2 = 102 ; b : (120 + 5) × 1,2 = 150 ; + packaging 10.
    expect(calculerFourchette({ offres, quantite: 100, fraisLot: 500, aujourdhui: "2027-01-15" })).toEqual({ min: 110, max: 160 });
  });

  it("est masquée sans offre de packaging, ou avec une offre expirée seulement", () => {
    expect(calculerFourchette({ offres: offres.slice(0, 3), quantite: 100, fraisLot: 0, aujourdhui: "2027-01-15" })).toBeNull();
    const expirees = offres.map((o) => ({ ...o, valableJusquau: "2027-01-01" }));
    expect(calculerFourchette({ offres: expirees, quantite: 100, fraisLot: 0, aujourdhui: "2027-01-15" })).toBeNull();
  });

  it("arrondit à deux chiffres significatifs, vers l'extérieur", () => {
    expect(arrondir(1234, "bas")).toBe(1200);
    expect(arrondir(1234, "haut")).toBe(1300);
    expect(arrondir(7.4, "haut")).toBe(8);
  });
});

describe("liens privés signés", () => {
  it("refuse une signature fausse ou absente", () => {
    const chemin = cheminFichier("logos/abcdefghijklmnopqrstuvwx.png");
    const s = new URL(chemin, "https://x").searchParams.get("s");
    expect(signatureFichierValide("logos/abcdefghijklmnopqrstuvwx.png", s)).toBe(true);
    expect(signatureFichierValide("logos/abcdefghijklmnopqrstuvwy.png", s)).toBe(false);
    expect(signatureFichierValide("logos/abcdefghijklmnopqrstuvwx.png", null)).toBe(false);
  });

  it("refuse un jeton modifié ou expiré", () => {
    const jeton = creerJeton({ reference: "DV-2701-1" }, 60);
    expect(lireJeton(jeton)).toEqual({ reference: "DV-2701-1" });
    expect(lireJeton(jeton.replace(/^./, "x"))).toBeNull();
    expect(lireJeton(creerJeton({}, -1))).toBeNull();
  });
});

describe("logo", () => {
  afterAll(() => rm(join(process.cwd(), ".stockage", "logos"), { recursive: true, force: true }));

  it("réencode un PNG sans ses métadonnées et le range sous un nom aléatoire", async () => {
    const avecExif = await sharp({ create: { width: 40, height: 20, channels: 4, background: "#27366b" } })
      .png()
      .withMetadata({ exif: { IFD0: { Artist: "Auteur secret", Software: "Logiciel" } } })
      .toBuffer();
    expect((await sharp(avecExif).metadata()).exif).toBeDefined();
    const depose = await deposerLogo(new File([new Uint8Array(avecExif)], "mon-logo.png", { type: "image/png" }));
    expect(depose.cle).toMatch(/^logos\/[A-Za-z0-9_-]{32}\.png$/);
    expect(depose.cle).not.toContain("mon-logo");
    const lu = await stockage().lire(depose.cle);
    expect(lu).not.toBeNull();
    const meta = await sharp(lu!.contenu).metadata();
    expect(meta.exif).toBeUndefined();
    expect(lu!.contenu.includes(Buffer.from("Auteur secret"))).toBe(false);
  });

  it("nettoie les métadonnées d'un SVG et refuse les scripts", async () => {
    const svg = `<?xml version="1.0"?><!-- Créé par Logiciel --><svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org" inkscape:version="1.3" width="10" height="10"><metadata><rdf:RDF>Auteur</rdf:RDF></metadata><title>logo de Nom</title><rect width="10" height="10"/></svg>`;
    const propre = nettoyerSvg(svg);
    expect(propre).not.toMatch(/metadata|inkscape|Logiciel|Auteur|<title/);
    expect(propre).toContain("<rect");
    expect(svgDangereux('<svg><script>alert(1)</script></svg>')).toBe(true);
    expect(svgDangereux('<svg><rect onload="x()"/></svg>')).toBe(true);
    expect(svgDangereux('<svg><image href="https://x/y.png"/></svg>')).toBe(true);
    expect(svgDangereux('<svg><use href="#a"/></svg>')).toBe(false);
    await expect(
      deposerLogo(new File(['<svg xmlns="http://www.w3.org/2000/svg"><script>1</script></svg>'], "l.svg")),
    ).rejects.toBeInstanceOf(LogoRefuse);
  });

  it("refuse un fichier qui n'est ni PNG ni SVG, quel que soit son nom", async () => {
    const jpeg = await sharp({ create: { width: 4, height: 4, channels: 3, background: "#fff" } }).jpeg().toBuffer();
    await expect(deposerLogo(new File([new Uint8Array(jpeg)], "logo.png", { type: "image/png" }))).rejects.toBeInstanceOf(LogoRefuse);
  });
});
