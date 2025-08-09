# Agent de l'application Échecs Pro

- Interface épurée, responsive et sans dépendance externe.
- Utiliser HTML, CSS et JavaScript en modules ES.
- Documenter toute nouvelle fonctionnalité directement dans ce fichier.
- Tous les chemins restent **relatifs** pour compatibilité GitHub Pages.
- Un garde global `__C2R_CHESS_EXPOSED` et l'attribut `root.__mounted` empêchent tout double montage.
- `mountChessPro` est exposé sur `window` pour un appel explicite par le Store.
- Le Store importe `engine.js` et `chess.js` comme modules ES, puis appelle explicitement `mountChessPro(root)` après injection du HTML.
- Chaque étape de chargement est tracée dans la console et les chemins respectent le préfixe GitHub Pages.

## Fonctionnalités

- Règles complètes : roque, prise en passant, promotion automatique en dame, échec, échec et mat, pat.
- Liste des coups au format SAN.
- Import et export de positions FEN.
- Possibilité de retourner l'échiquier.
- Surlignage des coups légaux et coordonnées optionnelles.
- L'application est montée via le Store qui gère le chargement et l'appel à `mountChessPro`.

## Paramètres

- Afficher les coordonnées.
- Activer ou désactiver le surlignage des coups légaux.
