# Plateforme d'echecs

Ce dossier de documentation presente l'architecture de la nouvelle plateforme d'echecs developpee en React et Node.js.

## Structure generale

- `client` : application frontend React/TypeScript geree par Vite.
- `server` : API Node.js/Express avec socket.io pour le temps reel.
- `ai` : integration du moteur Stockfish.
- `db` : scripts et migrations PostgreSQL.
- `docs` : guides et informations techniques.

## Lancement rapide

```bash
./scripts/dev.sh
```

Cette commande construit et lance les conteneurs Docker de developpement.

## Interface React

Le composant `ChessBoard` gere l'affichage de l'echiquier et les interactions. Il s'appuie sur `chess.js` pour les regles et propose :

- Surlignage des deplacements legaux apres selection d'une piece
- Differenciation visuelle des captures
- Deplacement par glisser-deposer ou simple clic
- Animation des pieces lors des mouvements

Les pieces proviennent du jeu d'icones Lichess et sont stockees dans `client/src/assets/pieces`.
