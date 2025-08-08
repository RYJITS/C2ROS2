# Agent de l'application chess

- Concevoir l'interface de façon épurée et responsive.
- Utiliser HTML, CSS et JavaScript de manière modulaire.
- Documenter toute nouvelle fonctionnalité directement dans ce fichier.

## Fonctionnalités

- L'interface n'utilise plus de bibliothèques externes. Le jeu repose sur le fichier `simple-chess.js` pour la logique et la gestion de l'échiquier.
- Les pièces sont affichées à l'aide des caractères Unicode et peuvent être déplacées par glisser-déposer ou par interaction tactile.
- Les pièces blanches appartiennent au joueur 1 et les pièces noires au joueur 2. Les captures sont possibles.
- La taille des pièces a été augmentée pour une meilleure visibilité.
- Lorsqu'une pièce est sélectionnée, sa case est entourée d'un liseré vert et les destinations autorisées sont indiquées par un point central.
- Un robot local joue aléatoirement lorsque c'est au tour des noirs.
- L'initialisation se déclenche automatiquement même si le script est injecté
  après l'événement `DOMContentLoaded` afin d'éviter l'écran noir.
- Le fichier `simple-chess.js` est désormais chargé dynamiquement par
  `loadDependencies()` afin d'éviter l'erreur "Erreur de chargement".
- Compatibilité mobile assurée : les déplacements fonctionnent aussi via les 
  événements `touchstart` et `touchend`.

## Fonctionnalités supplémentaires

- Affichage d'un minuteur de cinq minutes par couleur.
- Arrêt de la partie lorsque l'un des joueurs n'a plus de temps.
- Liste chronologique des coups joués mise à jour après chaque mouvement.

## Version avancee

Une version React/Node.js plus riche est developpee dans les dossiers `client` et `server`. Elle integre le composant `ChessBoard` base sur `chess.js` qui gere roque, prise en passant, promotion via une fenetre modale et signale mat, pat ou nulle. L'echiquier est responsive et les pieces se deplacent au toucher ou par glisser-deposer.
