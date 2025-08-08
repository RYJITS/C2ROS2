# Agent de l'application Échecs Pro

- Interface épurée, responsive et sans dépendance externe.
- Utiliser HTML, CSS et JavaScript en modules ES.
- Documenter toute nouvelle fonctionnalité directement dans ce fichier.
- Tous les chemins restent **relatifs** pour compatibilité GitHub Pages.
- Un garde global empêche le double montage lorsque le module est chargé plusieurs fois.

## Fonctionnalités

- Règles complètes : roque, prise en passant, promotion automatique en dame, échec, échec et mat, pat.
- Liste des coups au format SAN.
- Import et export de positions FEN.
- Possibilité de retourner l'échiquier.
- Surlignage des coups légaux et coordonnées optionnelles.
- Chargement automatique depuis `chess.html` ou via le Store.

## Paramètres

- Afficher les coordonnées.
- Activer ou désactiver le surlignage des coups légaux.
