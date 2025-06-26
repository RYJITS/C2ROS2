# Application d'échecs

Le mode autonome a été retiré. Le jeu s'ouvre uniquement depuis le Store. L'échiquier est géré par un script local `simple-chess.js` sans dépendance externe. Ce script est chargé dynamiquement par `app.js` pour garantir son exécution.

Les pièces se déplacent comme sur un vrai plateau. L'IA joue automatiquement si vous avez configuré son URL.

## Version intégrée au Store

Le Store inclut également ce jeu dans la liste des applications disponibles. Lors de son lancement depuis la modale, `AppCore` charge `app.html`, `app.css` et `app.js`. Le fichier `simple-chess.js` est ensuite ajouté par la fonction `loadDependencies()`. Aucune connexion n'est requise pour jouer car toutes les ressources sont embarquées.
