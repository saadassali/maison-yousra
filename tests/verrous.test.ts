import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { cooperatives } from "../content/cooperatives";
import exemplesJson from "../content/exemples.json";
import { photos } from "../content/photos";
import { produits } from "../content/produits";
import { realisations } from "../content/realisations";
import type { ContenuBrut } from "../app/_content/schemas";
import {
  cooperativeDuProduit,
  cooperativePourAffichage,
  ErreurContenu,
  photoPourAffichage,
  produitsAffichables,
  realisationPourAffichage,
  validerContenu,
} from "../app/_content/verrous";

// Ces tests montrent que la validation lancée au build (app/layout.tsx, prebuild) échoue pour
// chaque verrou du prompt 2.

const aujourdhui = new Date("2027-01-15T00:00:00Z");
const options = { aujourdhui, production: true };

const produitPublie = {
  id: "savon-test",
  nom: "Savon de test",
  categorie: "cosmetique",
  usage: "Test",
  segments: ["hotels"],
  formats: ["pot"],
  composition: "Test",
  conformite: { type: "DMP", numero: "TEST-0001", dateExpiration: "2030-01-01" },
  personnalisations: ["etiquette"],
  minimumCommande: "Test",
  delai: "Test",
  cooperative: "coop-test",
  statut: "publie",
} satisfies ContenuBrut["produits"][number];

const coopAutorisee = {
  id: "coop-test",
  nom: "Coopérative de test",
  region: "Test",
  nombreMembres: 10,
  histoire: "Test",
  dateAccordEcrit: "2026-12-01",
  produitsCoBrandes: ["savon-test"],
  fournitSiteA: false,
} satisfies ContenuBrut["cooperatives"][number];

const photoSansPersonne = {
  id: "photo-test",
  fichier: "/photos/test.jpg",
  legende: "Test",
  alt: "Test",
  personnes: [],
  accordEcrit: false,
} satisfies ContenuBrut["photos"][number];

function contenu(modif: Partial<ContenuBrut> = {}): ContenuBrut {
  return {
    produits: [produitPublie],
    cooperatives: [coopAutorisee],
    realisations: [],
    photos: [photoSansPersonne],
    ...modif,
  };
}

function problemes(brut: ContenuBrut): string[] {
  try {
    validerContenu(brut, options);
  } catch (e) {
    if (e instanceof ErreurContenu) return e.problemes;
    throw e;
  }
  return [];
}

const exemples = exemplesJson as ContenuBrut;

describe("contenu valide", () => {
  it("accepte un produit conforme co-brandé avec une coopérative autorisée", () => {
    const c = validerContenu(contenu(), options);
    const [produit] = produitsAffichables(c, { apercu: false, aujourdhui });
    expect(produit.id).toBe("savon-test");
    expect(cooperativeDuProduit(c, produit)?.nom).toBe("Coopérative de test");
  });

  it("valide le contenu réel du site, en production comme en développement", () => {
    const brut = { produits, cooperatives, realisations, photos };
    expect(() => validerContenu(brut, options)).not.toThrow();
    expect(() => validerContenu(brut, { aujourdhui, production: false })).not.toThrow();
  });

  it("ne publie aucun produit réel tant que les certificats ne sont pas saisis", () => {
    const c = validerContenu({ produits, cooperatives, realisations, photos }, options);
    expect(produitsAffichables(c, { apercu: false, aujourdhui })).toEqual([]);
  });

  it("retire les exemples EXEMPLE- en production et les garde en développement", () => {
    const brut = {
      produits: [...produits, ...exemples.produits],
      cooperatives: [...cooperatives, ...exemples.cooperatives],
      realisations: [...realisations, ...exemples.realisations],
      photos: [...photos, ...exemples.photos],
    };
    const prod = validerContenu(brut, options);
    const dev = validerContenu(brut, { aujourdhui, production: false });
    const ids = (c: typeof prod) => [...c.cooperatives, ...c.realisations].map((e) => e.id);
    expect(ids(prod).some((id) => id.startsWith("EXEMPLE-"))).toBe(false);
    expect(ids(dev).some((id) => id.startsWith("EXEMPLE-"))).toBe(true);
  });

  it("trouve le fichier de chaque photo réelle sous public/", () => {
    for (const photo of photos as ContenuBrut["photos"]) {
      if (!photo.id.startsWith("EXEMPLE-")) {
        expect(existsSync(join(process.cwd(), "public", photo.fichier)), photo.fichier).toBe(true);
      }
    }
  });
});

describe("le build échoue pour", () => {
  it("une coopérative sans accord écrit", () => {
    const brut = contenu({ cooperatives: [{ ...coopAutorisee, dateAccordEcrit: null }] });
    expect(problemes(brut).join()).toMatch(/coop-test nommée .* pas d'accord écrit/);

    const c = validerContenu(contenu({ produits: [{ ...produitPublie, statut: "brouillon" }], cooperatives: [{ ...coopAutorisee, dateAccordEcrit: null }] }), options);
    expect(() => cooperativePourAffichage(c, "coop-test")).toThrow(ErreurContenu);
  });

  it("une coopérative qui fournit le site A", () => {
    const brut = contenu({ cooperatives: [{ ...coopAutorisee, fournitSiteA: true }] });
    expect(problemes(brut).join()).toMatch(/coop-test nommée .* fournit le site A/);

    const c = validerContenu(contenu({ produits: [{ ...produitPublie, statut: "brouillon" }], cooperatives: [{ ...coopAutorisee, fournitSiteA: true }] }), options);
    expect(() => cooperativePourAffichage(c, "coop-test")).toThrow(/fournit le site A/);
  });

  it("une photo de personne sans accord", () => {
    const brut = contenu({ photos: [{ ...photoSansPersonne, personnes: ["Fatima"], accordEcrit: false }] });
    expect(problemes(brut)).toContain("photo photo-test : personne(s) sans accord écrit");
  });

  it("un produit publié sans conformité", () => {
    const brut = contenu({
      produits: [{ ...produitPublie, conformite: "[À COMPLÉTER : numéro DMP]" }],
    });
    expect(problemes(brut).join()).toMatch(/savon-test publié sans conformité valable : conformité non saisie/);
  });

  it("un produit publié dont le certificat a expiré", () => {
    const brut = contenu({
      produits: [{ ...produitPublie, conformite: { ...produitPublie.conformite, dateExpiration: "2027-01-14" } }],
    });
    expect(problemes(brut).join()).toMatch(/certificat expiré le 2027-01-14/);
  });

  it("un produit alimentaire publié avec un enregistrement DMP au lieu de l'ONSSA", () => {
    const brut = contenu({ produits: [{ ...produitPublie, categorie: "alimentaire" }] });
    expect(problemes(brut).join()).toMatch(/attendu : ONSSA/);
  });

  it("un accessoire publié", () => {
    const brut = contenu({ produits: [{ ...produitPublie, categorie: "accessoire" }] });
    expect(problemes(brut).join()).toMatch(/accessoire/);
  });

  it("un produit publié avec un champ à compléter", () => {
    const brut = contenu({ produits: [{ ...produitPublie, delai: "[À COMPLÉTER : délai]" }] });
    expect(problemes(brut)).toContain("produit savon-test publié avec delai à compléter");
  });

  it("un marqueur mal formé", () => {
    const brut = contenu({ produits: [{ ...produitPublie, statut: "brouillon", delai: "[A COMPLETER délai]" }] });
    expect(problemes(brut).join()).toMatch(/marqueur mal formé/);
  });
});

describe("affichage des réalisations", () => {
  const realisation = {
    id: "realisation-test",
    client: "Hôtel Réel",
    descriptionAnonyme: "un hôtel de Marrakech",
    segment: "hotels",
    produits: ["savon-test"],
    photos: ["photo-test"],
    dateAccordClient: null,
  } satisfies ContenuBrut["realisations"][number];

  it("est anonyme sans accord du client", () => {
    const c = validerContenu(contenu({ realisations: [realisation] }), options);
    const affichee = realisationPourAffichage(c, c.realisations[0], c.produits);
    expect(affichee?.titre).toBe("un hôtel de Marrakech");
    expect(JSON.stringify(affichee)).not.toContain("Hôtel Réel");
  });

  it("n'affiche rien sans accord ni description anonyme", () => {
    const c = validerContenu(contenu({ realisations: [{ ...realisation, descriptionAnonyme: null }] }), options);
    expect(realisationPourAffichage(c, c.realisations[0], c.produits)).toBeNull();
  });

  it("nomme le client avec son accord", () => {
    const c = validerContenu(contenu({ realisations: [{ ...realisation, dateAccordClient: "2027-01-10" }] }), options);
    expect(realisationPourAffichage(c, c.realisations[0], c.produits)?.titre).toBe("Hôtel Réel");
  });

  it("refuse d'afficher une photo de personne sans accord", () => {
    const c = validerContenu(contenu(), options);
    c.photos[0] = { ...c.photos[0], personnes: ["Fatima"] };
    expect(() => photoPourAffichage(c, "photo-test")).toThrow(ErreurContenu);
  });
});

describe("point d'entrée du contenu", () => {
  it("charge les exemples hors production et ne publie rien", async () => {
    const { contenu, produitsPublies } = await import("../app/_content");
    expect(contenu().realisations.map((r) => r.id)).toContain("EXEMPLE-realisation-riad");
    expect(produitsPublies()).toEqual([]);
  });
});
