# Application d'échecs

Le jeu peut s'ouvrir depuis le Store ou directement via `chess.html`. L'échiquier est géré par les modules ES `engine.js` et `chess.js` sans dépendance externe. Ils sont chargés en `type="module"` pour garantir leur exécution.

Les pièces se déplacent comme sur un vrai plateau. Elles sont désormais plus grandes pour être parfaitement visibles et portent la couleur du joueur (blanc pour le premier, noir pour le second). Lorsqu'une pièce est sélectionnée, les cases accessibles sont marquées par un point. L'IA joue automatiquement si vous avez configuré son URL.
Depuis la version 1.2, chaque couleur dispose d'un minuteur de cinq minutes. La partie s'interrompt quand le temps d'un joueur est écoulé. Un panneau latéral récapitule également la liste des coups.

## Version intégrée au Store

Le Store inclut ce jeu dans la liste des applications disponibles. Lors de son lancement, `AppCore` injecte `chess.html` puis charge les modules `engine.js` et `chess.js` déclarés dans `app.json`. Aucune connexion n'est requise pour jouer car toutes les ressources sont embarquées.
