// Conditions commerciales affichées sur les pages. Aucune n'est fixée : elles le seront après
// les premiers devis (fichier 13 §4 et §8). Le fichier 13 cite, à titre d'exemple seulement,
// un minimum de 500 unités ou 50 L de recharge.

export const conditions = {
  minimumUnites: "[À COMPLÉTER : minimum de commande en unités (le fichier 13 cite 500 unités, à confirmer)]",
  minimumRecharge: "[À COMPLÉTER : minimum de commande en recharge (le fichier 13 cite 50 L, à confirmer)]",
  delai: "[À COMPLÉTER : délai de la validation du BAT à la livraison]",
  acompte: "[À COMPLÉTER : montant de l’acompte et seuil des petites séries]",
  stationRecharge: "[À COMPLÉTER : conditions du contrat « station de recharge » (durée, fréquence, prêt des distributeurs)]",
} as const;
