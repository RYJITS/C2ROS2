# C2ROS

Mini OS modulaire basé sur HTML/CSS/JS.

Les icônes Font Awesome sont chargées via CDN. Le fichier `index.html` référence directement `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css`.

- Voir [`docs/icon-workflow.md`](docs/icon-workflow.md) pour le workflow complet des icônes.
- La documentation de chaque module se trouve dans `docs/*-readme.md`.
- La liste des pop-ups indispensables figure dans [`docs/popup-readme.md`](docs/popup-readme.md).
- Une section **Contact** intégrée dans `index.html` permet d'envoyer un message à `contact@c2ros.com`.
- La documentation de cette section se trouve dans [`docs/contact-readme.md`](docs/contact-readme.md).
- Des fichiers `AGENTS.md` définissent les directives à suivre pour chaque page et chaque application. Consultez-les avant toute modification.


Le Store propose un bouton unique pour installer ou désinstaller une application. Les icônes se placent désormais en bas à droite des tuiles et conservent leur couleur en mode sombre. Un bouton **Applications** apparaît sur mobile et les applications installées peuvent être réordonnées par glisser-déposer. Le filtre par type (applications, informations, services, formations) permet désormais de trier le catalogue.

- Le Store propose un bouton unique pour installer ou désinstaller une application : l'icône « plus » devient une poubelle rouge, positionnée en bas à droite de chaque tuile sans aucun arrière-plan.
- Les icônes d'installation sont centrées dans l'angle inférieur droit des tuiles pour plus de clarté et ne possèdent aucun fond.
- En mode sombre, la poubelle reste rouge et la taille des icônes est réduite pour le mobile.
- En mode mobile, la poubelle s'affiche désormais en rouge grâce à une règle CSS dédiée.
- En affichage mobile, un bouton **Applications** apparaît dans la barre de navigation basse.
- Si vous êtes connecté en administrateur, une icône supplémentaire donne accès à la gestion des comptes.
- Depuis ce panneau, l'administrateur peut ajouter ou supprimer des utilisateurs, consulter leur nom d'utilisateur et le hash de leur mot de passe. Les logs système sont visibles dans les options avancées.
- Un administrateur peut se connecter temporairement sous l'identité d'un autre utilisateur depuis ce tableau.
- La croix du menu mobile adopte la même couleur neutre que les autres boutons.
- En mode mobile, la liste des applications se referme si l'on touche un autre bouton de la barre.
- La barre de navigation mobile mesure maintenant 80px de haut pour une meilleure ergonomie.
- Le titre du menu mobile a été retiré et les icônes sont encore plus petites pour gagner de la place.
- Les icônes de la liste déroulante des applications sont désormais d'un gris neutre pour un rendu minimaliste.
- La barre de recherche du Store se masque automatiquement lors du défilement vers le bas.
- Le Store adopte un mode sombre rouge (fond #0D0D12 avec dégradé #15151B).
- Les tuiles du Store reprennent désormais le format des cartes d'accueil : icône au-dessus du texte et disposition en liste.
- Toutes ces tuiles sont maintenant regroupées dans une grande carte afin de mieux structurer la page Store.
- Les tuiles s'alignent automatiquement sur plusieurs colonnes pour occuper toute la largeur disponible.
- Sur mobile, chaque tuile occupe toute la largeur de l'écran avec une petite marge latérale.
- Depuis la version 1.1.0, les applications installées peuvent être réordonnées par glisser-déposer dans la page Profil.
- Un court retour haptique est émis sur smartphone au début et à la fin du déplacement.
- Un bouton de déconnexion est disponible dans la page Profil.
- Une option permet de désactiver les pop-ups d'information dans les préférences du profil, ce qui masque toutes les notifications du système.
- Si vous tentez d'installer une application sans être connecté, une notification précise désormais « Veuillez vous connecter pour installer ».
- Une vibration confirme désormais l'installation ou la désinstallation d'une application sur les appareils compatibles.
- La barre latérale adopte désormais un fond uni sans ombre pour un rendu minimal.
- En mode PC, la barre latérale adopte un style de tuile plus sobre, sans barre de défilement.
- Le titre "Applications" n'apparaît plus dans la barre latérale pour gagner en clarté.
- En mode bureau, elle ne comporte plus de texte : les icônes deviennent rouges au survol et une infobulle explique leur fonction.
- En mode mobile, la barre latérale est désormais totalement masquée pour laisser la place à la navigation basse.
- Les icônes Accueil, Store, Profil et Contact reprennent le même design que celles des applications et ne prennent plus de fond au survol.
- L'application **Formation ChatGPT** propose désormais un cours en dix pages avec navigation pour une prise en main intuitive.
 - Le jeu d'échecs repose désormais sur le script local `simple-chess.js` qui gère l'affichage et les règles. Un menu permet de choisir un moteur IA et de renseigner son URL. Sans configuration, un robot local joue aléatoirement.
 - Le jeu d'échecs s'installe depuis le Store et se lance dans une modale dédiée.
- La page d'accueil propose quatre tuiles pour comprendre le fonctionnement de C2R OS :
  1. **Installez des applications IA et services** — la tuile elle-même mène directement au Store et les applications installées apparaissent dans la barre de navigation.
  2. **Options du profil** — la tuile ouvre directement la page correspondante pour activer ou désactiver les notifications, passer en mode sombre ou déplacer la barre de navigation.
  3. **Installer C2R OS** — un bouton permet d'ajouter l'application sur smartphone en mode PWA.
  4. **Infos sur les applications** — cette tuile renvoie directement au Store pour découvrir les différents types d'apps disponibles.
- Les applications internes utilisent désormais uniquement les icônes Font Awesome pour un style unifié.
- L'application **Notes Vocales** permet d'enregistrer votre voix et de la transcrire via Whisper.
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

Les tests couvrent la gestion des icônes via `IconManager`.


## Jeu d'échecs

Pour jouer, installez l'application depuis le Store. L'échiquier est entièrement géré en local via `simple-chess.js`.
