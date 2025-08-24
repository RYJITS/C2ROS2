# Instructions Generales pour l'Agent

Ce depot contient un ensemble d'applications et de pages web modulaires. Les instructions suivantes s'appliquent a l'ensemble du projet :

- Redigez le code et la documentation exclusivement en **francais**.
- Conservez un style professionnel de conception web et de developpement d'applications.
- Chaque page principale (Accueil, Store, Profil, Test, Contact) doit disposer d'un fichier `AGENTS.md` decrivant les fonctionnalites attendues, les technologies recommandees et la ligne directrice du design.
- Chaque application situee dans `apps/` doit posseder son propre `AGENTS.md` suivant le meme modele.
- **Aucun delimiteur de conflit Git** ne doit apparaitre dans ces fichiers.
- Mettez a jour systematiquement les fichiers `AGENTS.md` pour refleter les dernieres fonctionnalites et choix techniques.
- Les boutons de controle des fenetres (fermer, agrandir, reduire) utilisent les symboles "x", "[]" et "-" sans arriere-plan.
- Les ressources sont resolues dynamiquement pour GitHub Pages et les scripts sont charges en modules ES.
- Le Store charge les applications en important explicitement leurs modules ES puis en montant l'interface correspondante. L'app "Echecs Pro" est initialisee via `mountChessPro` avec des journaux de debug.
- Le chargeur marque `root.__mounted` seulement apres l'execution reussie de `mountChessPro` afin d'activer l'echiquier et les boutons.
- L'UI Core respecte cette regle en appelant `mountChessPro` puis en definissant `root.__mounted`.
- Un overlay de debogage active par `?debug=1` capture tous les journaux console.


## Plateforme d'echecs moderne

Un projet complet de jeu d'echecs en ligne est installe dans les dossiers racines `client`, `server`, `ai` et `db`. Il utilise React, Node.js, PostgreSQL et Docker. Consultez `docs/chess-platform/README.md` pour le detail du lancement.
Le composant `ChessBoard` presente dans `client/src` affiche un echiquier React complet. Il valide tous les coups via `chess.js` (roque, prise en passant, promotion) et bloque toute action illegale. L'interface signale les coups possibles au toucher, supporte le glisser-deposer et reste totalement responsive (max 90&nbsp;vw en mode mobile). Les fins de partie (mat, pat, nulle par repetition ou 50 coups) sont detectees.
