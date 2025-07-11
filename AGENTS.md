# Instructions Générales pour l'Agent

Ce dépôt contient un ensemble d'applications et de pages web modulaires. Les instructions suivantes s'appliquent à l'ensemble du projet :

- Rédigez le code et la documentation exclusivement en **français**.
- Conservez un style professionnel de conception web et de développement d'applications.
- Chaque page principale (Accueil, Store, Profil, Test, Contact) doit disposer d'un fichier `AGENTS.md` décrivant les fonctionnalités attendues, les technologies recommandées et la ligne directrice du design.
- Chaque application située dans `apps/` doit posséder son propre `AGENTS.md` suivant le même modèle.
- **Aucun délimiteur de conflit Git** ne doit apparaître dans ces fichiers.
- Mettez à jour systématiquement les fichiers `AGENTS.md` pour refléter les dernières fonctionnalités et choix techniques.
- Les boutons de contrôle des fenêtres (fermer, agrandir, réduire) utilisent les symboles « × », « □ » et « − » sans arrière‑plan.


## Plateforme d'echecs moderne

Un projet complet de jeu d'echecs en ligne est installe dans les dossiers racines `client`, `server`, `ai` et `db`. Il utilise React, Node.js, PostgreSQL et Docker. Consultez `docs/chess-platform/README.md` pour le detail du lancement.
Le composant `ChessBoard` presente dans `client/src` affiche un echiquier React complet. Il valide tous les coups via `chess.js` (roque, prise en passant, promotion) et bloque toute action illegale. L'interface signale les coups possibles au toucher, supporte le glisser-deposer et reste totalement responsive (max 90&nbsp;vw en mode mobile). Les fins de partie (mat, pat, nulle par repetition ou 50 coups) sont detectees.
