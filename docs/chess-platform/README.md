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
