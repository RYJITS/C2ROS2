# C2ROS

Mini OS modulaire basé sur HTML/CSS/JS.

Les icônes Font Awesome sont chargées via CDN. Le fichier `index.html` référence directement `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css`.

- Voir [`docs/icon-workflow.md`](docs/icon-workflow.md) pour le workflow complet des icônes.
- La documentation de chaque module se trouve dans `docs/*-readme.md`.
- La liste des pop-ups indispensables figure dans [`docs/popup-readme.md`](docs/popup-readme.md).
- Une page de contact est accessible depuis la barre de navigation via [`contact.html`](contact.html).
- La documentation de la page de contact se trouve dans [`docs/contact-readme.md`](docs/contact-readme.md).

Le Store propose un bouton unique pour installer ou désinstaller une application. Les icônes restent alignées à droite et conservent leur couleur en mode sombre. Un bouton **Applications** apparaît sur mobile et les applications installées peuvent être réordonnées par glisser-déposer. Le filtre par type (applications, informations, services, formations) permet désormais de trier le catalogue.

- Le Store propose un bouton unique pour installer ou désinstaller une application : l'icône « plus » devient une poubelle rouge.
- Les icônes d'installation sont alignées à droite des tuiles pour plus de clarté.
- En mode sombre, la poubelle reste rouge et la taille des icônes est réduite pour le mobile.
- En mode mobile, la poubelle s'affiche désormais en rouge grâce à une règle CSS dédiée.
- En affichage mobile, un bouton **Applications** apparaît dans la barre de navigation basse.
- La croix du menu mobile adopte la même couleur neutre que les autres boutons.
- En mode mobile, la liste des applications se referme si l'on touche un autre bouton de la barre.
- La barre de navigation mobile mesure maintenant 80px de haut pour une meilleure ergonomie.
- Le titre du menu mobile a été retiré et les icônes sont encore plus petites pour gagner de la place.
- Les icônes de la liste déroulante des applications sont désormais d'un gris neutre pour un rendu minimaliste.
- La barre de recherche du Store se masque automatiquement lors du défilement vers le bas.
- Depuis la version 1.1.0, les applications installées peuvent être réordonnées par glisser-déposer dans la page Profil.
- Un court retour haptique est émis sur smartphone au début et à la fin du déplacement.
- Un bouton de déconnexion est disponible dans la page Profil.
- La barre latérale intègre un bouton de réduction discret dans son coin supérieur droit ; l'icône passe d'une croix à un petit carré selon l'état de la barre.
- Une option permet de désactiver les pop-ups d'information dans les préférences du profil, ce qui masque toutes les notifications du système.
- Si vous tentez d'installer une application sans être connecté, une notification précise désormais « Veuillez vous connecter pour installer ».
- Une vibration confirme désormais l'installation ou la désinstallation d'une application sur les appareils compatibles.
- La barre latérale utilise un dégradé de gris et une ombre portée pour s'intégrer au thème.
- En mode PC, la barre latérale adopte un style de tuile plus sobre, sans barre de défilement.
- L'application **Formation ChatGPT** propose désormais un cours en dix pages avec navigation pour une prise en main intuitive.
- La page d'accueil propose quatre tuiles pour comprendre le fonctionnement de C2R OS :
  1. **Installez des applications IA et services** — la tuile elle-même mène directement au Store et les applications installées apparaissent dans la barre de navigation.
  2. **Options du profil** — la tuile ouvre directement la page correspondante pour activer ou désactiver les notifications, passer en mode sombre ou déplacer la barre de navigation.
  3. **Installer C2R OS** — un bouton permet d'ajouter l'application sur smartphone en mode PWA.
  4. **Infos sur les applications** — cette tuile renvoie directement au Store pour découvrir les différents types d'apps disponibles.
- Les applications internes utilisent désormais uniquement les icônes Font Awesome pour un style unifié.
- Sur mobile, l'application peut s'installer en plein écran grâce au fichier `manifest.webmanifest`.
- Les icônes PWA ne sont pas incluses dans le dépôt pour éviter d'ajouter des fichiers binaires.
- Une tuile d'accueil propose l'installation directe de l'application en PWA.

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
