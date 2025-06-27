# Application d'échecs

Le mode autonome a été retiré. Le jeu s'ouvre uniquement depuis le Store. L'échiquier est géré par un script local `simple-chess.js` sans dépendance externe. Ce script est chargé dynamiquement par `app.js` pour garantir son exécution.

Les pièces se déplacent comme sur un vrai plateau. Elles sont désormais plus grandes pour être parfaitement visibles et portent la couleur du joueur (blanc pour le premier, noir pour le second). Lorsqu'une pièce est sélectionnée, les cases accessibles sont marquées par un point. L'IA joue automatiquement si vous avez configuré son URL.
Depuis la version 1.2, chaque couleur dispose d'un minuteur de cinq minutes. La partie s'interrompt quand le temps d'un joueur est écoulé. Un panneau latéral récapitule également la liste des coups.

## Version intégrée au Store

Le Store inclut également ce jeu dans la liste des applications disponibles. Lors de son lancement depuis la modale, `AppCore` charge `app.html`, `app.css` et `app.js`. Le fichier `simple-chess.js` est ensuite ajouté par la fonction `loadDependencies()`. Aucune connexion n'est requise pour jouer car toutes les ressources sont embarquées.
