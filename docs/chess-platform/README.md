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

## Echiquier interactif

La page d'accueil React comporte un composant `Board` affichant un echiquier 8x8. Les deplacements sont valides selon les regles officielles grace a la bibliotheque **chess.js**. Lorsqu'une piece est selectionnee, ses cases accessibles sont indiquees par des points translucides. Les pieces du joueur 1 sont blanches et celles du joueur 2 sont noires.
