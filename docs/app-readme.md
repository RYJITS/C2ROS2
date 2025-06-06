# AppCore (Catalogue d'applications)

Charge les applications intégrées et gère leur installation ou suppression. Le module maintient la liste des apps disponibles et leur état (installée ou non). Les applications peuvent être étendues par la suite pour enrichir le système.

Le module est utilisé par `UICore.toggleApp()` pour installer ou désinstaller les applications depuis le Store.

Depuis la version 1.1.0, chaque application possède un type (application, information, service ou formation) afin de faciliter le filtrage dans le Store.

La formation **ChatGPT** fait partie des applications intégrées. Elle présente désormais un cours en dix pages avec quiz final pour apprendre à rédiger de bons prompts.
