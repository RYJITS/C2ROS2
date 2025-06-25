# Application d'échecs autonome

Cette page permet de jouer immédiatement aux échecs. L'échiquier est affiché grâce à **chessboard.js** et chaque déplacement est validé par **chess.js**.

Ouvrez simplement `chess.html` pour démarrer une partie contre un adversaire humain ou un petit robot local. Un menu permet de renseigner l'URL d'un moteur IA compatible.

Vous pouvez aussi cliquer sur la tuile « Jouer aux échecs » depuis la page d'accueil pour ouvrir ce même échiquier dans un nouvel onglet.
Les pièces se déplacent comme sur un vrai plateau. L'IA joue automatiquement si vous avez configuré son URL.

## Version intégrée au Store

Le Store inclut également ce jeu dans la liste des applications disponibles. Lors de son lancement depuis la modale, `AppCore` charge `app.html`, `app.css` et `app.js`. Ce dernier récupère désormais **chess.js** et **chessboard.js** de manière dynamique afin de garantir le bon fonctionnement de l'échiquier. Une connexion Internet reste nécessaire pour charger ces bibliothèques hébergées sur CDN.
