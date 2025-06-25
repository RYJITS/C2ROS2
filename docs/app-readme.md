# AppCore (Catalogue d'applications)

Charge les applications intégrées et gère leur installation ou suppression. Le module maintient la liste des apps disponibles et leur état (installée ou non). Les applications peuvent être étendues par la suite pour enrichir le système.

Le module est utilisé par `UICore.toggleApp()` pour installer ou désinstaller les applications depuis le Store.

Depuis la version 1.1.0, chaque application possède un type (application, information, service ou formation) afin de faciliter le filtrage dans le Store.

La formation **ChatGPT** fait partie des applications intégrées. Elle présente désormais un cours en dix pages avec quiz final pour apprendre à rédiger de bons prompts.
Un jeu d'échecs est également proposé. L'affichage et les règles sont gérés par le script local `simple-chess.js`.
Un menu déroulant liste plusieurs moteurs IA
(Stockfish, LCZero…). Le champ situé dessous permet de saisir l'URL de l'API.
Sans configuration, un robot local joue hors ligne.
L'application s'installe via le Store et se lance dans une modale dédiée.
Une nouvelle application **Notes Vocales** enregistre la voix de l'utilisateur puis utilise Whisper pour la convertir automatiquement en texte.

Depuis juillet 2025, les applications s'ouvrent dans des modales générées par `UICore`. Le conteneur obsolète `.app-runner` a été supprimé pour éviter l'apparition d'une tuile « Application » inutile.
