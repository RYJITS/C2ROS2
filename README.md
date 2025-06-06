# C2ROS

Mini OS modulaire basé sur HTML/CSS/JS.

Les icônes Font Awesome sont chargées via CDN. Le fichier `index.html` référence directement `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css`.

- Voir [`docs/icon-workflow.md`](docs/icon-workflow.md) pour le workflow complet des icônes.
- La documentation de chaque module se trouve dans `docs/*-readme.md`.
- La liste des pop-ups indispensables figure dans [`docs/popup-readme.md`](docs/popup-readme.md).

Le Store propose un bouton unique pour installer ou désinstaller une application. Les icônes restent alignées à droite et conservent leur couleur en mode sombre. Un bouton **Applications** apparaît sur mobile et les applications installées peuvent être réordonnées par glisser-déposer. Le filtre par type (applications, informations, services, formations) permet désormais de trier le catalogue.

- Le Store propose un bouton unique pour installer ou désinstaller une application : l'icône « plus » devient une poubelle rouge.
- Les icônes d'installation sont alignées à droite des tuiles pour plus de clarté.
- En mode sombre, la poubelle reste rouge et la taille des icônes est réduite pour le mobile.
- Correction: en mode mobile, la poubelle conserve bien sa couleur rouge.
- En affichage mobile, un bouton **Applications** apparaît dans la barre de navigation basse.
- La croix du menu mobile adopte la même couleur neutre que les autres boutons.
- Depuis la version 1.1.0, les applications installées peuvent être réordonnées par glisser-déposer dans la page Profil.
- Un bouton de déconnexion est disponible dans la page Profil.
- La barre latérale intègre un bouton de réduction : l'icône passe d'une croix à un petit carré suivant l'état de la barre.
- La barre latérale utilise un dégradé de gris et une ombre portée pour s'intégrer au thème.
- L'application **Formation ChatGPT** propose désormais un cours en dix pages avec navigation pour une prise en main intuitive.
- La page d'accueil présente des tuiles explicatives pour découvrir le fonctionnement du site.
- Les applications internes utilisent désormais uniquement les icônes Font Awesome pour un style unifié.

## Aperçu local

Pour afficher le projet en local :

- `python3 -m http.server 8000` (Linux/Mac)
- `python -m http.server 8000` ou `py -m http.server 8000` (Windows)

Veillez à disposer de Python 3.

## Tests

Avant de lancer les tests, installez les dépendances :

```bash
npm install
```

Vous pouvez ensuite exécuter les tests avec :

```bash
npm test
```
