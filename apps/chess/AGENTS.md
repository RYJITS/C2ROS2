# Agent de l'application chess

- Concevoir l'interface de façon épurée et responsive.
- Utiliser HTML, CSS et JavaScript de manière modulaire.
- Documenter toute nouvelle fonctionnalité directement dans ce fichier.

## Fonctionnalités

- L'interface n'utilise plus de bibliothèques externes. Le jeu repose sur le fichier `simple-chess.js` pour la logique et la gestion de l'échiquier.
- Les pièces sont affichées à l'aide des caractères Unicode et peuvent être déplacées par glisser-déposer.
- Un robot local joue aléatoirement lorsque c'est au tour des noirs.
- L'initialisation se déclenche automatiquement même si le script est injecté
  après l'événement `DOMContentLoaded` afin d'éviter l'écran noir.
- Le fichier `simple-chess.js` est désormais chargé dynamiquement par
  `loadDependencies()` afin d'éviter l'erreur "Erreur de chargement".

## Fonctionnalités supplémentaires

- Affichage d'un minuteur de cinq minutes par couleur.
- Arrêt de la partie lorsque l'un des joueurs n'a plus de temps.
- Liste chronologique des coups joués mise à jour après chaque mouvement.
