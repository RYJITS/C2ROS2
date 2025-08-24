# Journal des modifications de C2R OS
## [1.1.38] - 2025-08-09 "StoreMount"

### Correctifs Echecs Pro
- Le Store definit `root.__mounted` apres l'appel a `mountChessPro`, garantissant l'affichage de l'echiquier et des boutons actifs.

## [1.1.37] - 2025-08-09 "MountFlag"

### Correctifs Echecs Pro
- Le chargeur definit `root.__mounted` apres l'appel a `mountChessPro`, assurant l'affichage de l'echiquier et l'activation des boutons.

## [1.1.36] - 2025-08-09 "ChessMount"

### Correctifs Echecs Pro
- Overlay de debogage active via `?debug=1` capturant les journaux.
- Import explicite des modules et montage manuel de `mountChessPro(root)`.
- Levee du blocage des clics grace aux regles CSS `pointer-events`.

## [1.1.35] - 2025-08-08 "ChessLoader"

### Chargement explicite des modules
- Le Store resout le chemin de base pour GitHub Pages, importe `engine.js` et `chess.js` comme modules ES puis appelle `mountChessPro` avec journalisation.
## [1.1.34] - 2025-08-08 "ChessPro"

### Echecs Pro
- Remplacement de l'application Echecs par une version complete avec SAN, FEN, flip, roque, prise en passant et promotion automatique.
## [1.1.33] - 2025-07-10 "StoreTop"

### Mise en page du Store
- La grande carte du Store s'etend desormais jusqu'en haut de l'ecran.

## [1.1.31] - 2025-06-25 "UpdateDate"

### Mise a jour de la date de version
- Actualisation de la date affichee sur la page d'accueil

## [1.1.30] - 2025-07-09 "HomeHistory"

### Historique des modifications
- Ajout d'une tuile sur la page d'accueil affichant les trois dernieres mises a jour.
## [1.1.29] - 2025-07-08 "WindowButtons"

### ? Harmonisation des controles
- Les boutons de fermeture, d'agrandissement et de reduction affichent desormais une croix, un carre et un trait sans couleur de fond.


## [1.1.28] - 2025-07-07 "VersionBump"

### ? Mise a jour de version
- Mise a jour de la version et de la date d'actualisation sur la page d'accueil.

## [1.1.29] - 2025-07-08 "ProfileUpdate"

### ? Notification de mise a jour
- Le bouton "Mise a jour" de la page Profil affiche une pastille lorsque `version.json` indique une nouvelle version.

## [1.1.27] - 2025-07-06 "ChessRemoval"

### ? Suppression de la page Echecs
- La tuile "Jouer aux echecs" disparait de l'accueil.
- La page autonome `chess.html` est retiree. Le jeu s'installe desormais uniquement via le Store.

## [1.1.26] - 2025-07-05 "StoreFullWidth"

### ? Optimisation mobile
- En mode mobile, la barre de recherche et les filtres du Store occupent a present toute la largeur de l'ecran.

## [1.1.25] - 2025-07-04 "NavIcons"

### ? Icones de navigation
- Les icones Accueil, Store, Profil et Contact reprennent le style des applications.
- Aucun fond n'est applique lors du survol.
## [1.1.25] - 2025-07-04 "ProfileCleanup"

### ? Interface Profil
- Suppression du titre "Applications installees" dans la page Profil pour un affichage plus epure.
## [1.1.25] - 2025-07-04 "IconManagerTest"

### ? Verification d'injection
- Ajout du test `tests/icon-manager.test.js` pour valider l'injection des icones.

## [1.1.25] - 2025-07-04 "StoreButton"

### ? Bouton du Store
- Le bouton d'installation ne possede plus d'arriere-plan et se situe desormais en bas a droite de chaque tuile.
## [1.1.25] - 2025-07-04 "NoHeaderLine"

### ? En-tete epure
- Suppression de la bordure inferieure de la barre laterale pour retirer la separation au-dessus de l'icone Accueil.
- Suppression du titre "Applications" dans la barre laterale pour un design plus minimaliste.

## [1.1.24] - 2025-07-03 "SidebarFlat"

### ? Barre laterale simplifiee
- Suppression du logo C2R et des effets de degrade, bordure et ombre.
- La colonne laterale conserve une couleur unie et un style minimal.

## [1.1.23] - 2025-07-02 "CleanMinimal"

### ? Nettoyage des scripts inutilises
- Les fichiers `sidebar-minimal.js` et `ui-minimal-red.js` ont ete supprimes car ils n'etaient plus charges par `index.html`.

## [1.1.22] - 2025-07-01 "StoreTileAlign"

### ? Tuiles du Store uniformisees
- La mise en page du Store n'utilise plus de grille afin d'afficher les tuiles en liste verticale.
## [1.1.23] - 2025-07-02 "RemoveRunner"

### ? Nettoyage
- Suppression du composant obsolete `app-runner` et du CSS associe.
## [1.1.21] - 2025-06-30 "NoSidebarToggle"

### ? Suppression du mode compact
- La barre laterale ne peut plus etre reduite en mode bureau. Le logo C2R reste
  visible en haut de la barre.
## [1.1.20] - 2025-06-26 "ChessDesign"

### ? Echiquier ameliore
- Les cases sont plus grandes et la selection est mise en evidence.
- L'IA joue automatiquement apres votre coup.

## [1.1.19] - 2025-06-25 "ChessQuickPage"

### ? Acces direct au jeu d'echecs
- Ajout de la page `chess.html` prete a jouer.
- Une tuile "Jouer aux echecs" ouvre cette page depuis l'accueil.


## [1.1.18] - 2025-06-24 "ChessEngineSelect"

### ? Application Echecs
- Ajout d'un menu deroulant pour choisir un moteur IA (Stockfish, LCZero...).
- L'URL de l'API se remplit automatiquement et peut etre modifiee manuellement.
- Sans API choisie, un robot local joue les coups.

## [1.1.17] - 2025-06-23 "StoreTilesMobile"

### ? Interface mobile
- Les tuiles du Store s'adaptent maintenant mieux a la largeur des petits ecrans.


## [1.1.17] - 2025-06-23 "IconBG"

### ? Interface Store
- Icone des tuiles sur fond rouge tres transparent pour un rendu minimaliste.

## [1.1.16] - 2025-06-22 "ChessAI"

### ? Application integree
- Ajout du jeu **Echecs IA** pour affronter une intelligence artificielle via API.

## [1.1.15] - 2025-06-21 "StoreFix"

### ? Correctif
- La page Store n'apparait plus sur toutes les pages : un style CSS empechait son masquage.

## [1.1.14] - 2025-06-20 "SidebarOffMobile"

### ? Interface mobile
- La barre laterale est a present totalement masquee sur les petits ecrans.

## [1.1.13] - 2025-06-19 "ContactFinalize"

### ? Page de contact finalisee
- Formulaire ameliore et adresse `contact@c2ros.com`.

## [1.1.8] - 2025-06-14 "ContactLink"

### ? Lien vers la section Contact
- Ajout d'un acces direct a la section Contact depuis la barre de navigation.
## [1.1.12] - 2025-06-18 "DragVibrate"

### ? Interface mobile
- Vibration courte lors du deplacement des applications dans la page Profil.
## [1.1.12] - 2025-06-18 "MobileMenuCompact"

### ? Interface mobile
- Menu des applications repense : largeur reduite et suppression du bouton de fermeture.
- Icones et pictogrammes encore plus petits pour un style minimaliste.
- Le menu est desormais aligne a droite sur mobile et ses icones sont minuscules.
## [1.1.11] - 2025-06-17 "MobileIconsGrey"

### ? Interface mobile
- Les icones de la liste deroulante des applications sont grisees pour un rendu minimaliste.
## [1.1.8] - 2025-06-14 "BottomNav80"

### ? Interface mobile
- Barre de navigation mobile agrandie a 80px de haut.

## [1.1.9] - 2025-06-15 "MobileIcons"

### ? Interface mobile
- Icones du menu mobile alignees sur celles de la page Profil.

## [1.1.10] - 2025-06-16 "MobileIconsSmall"

### ? Interface mobile
- Icones du menu mobile encore reduites pour economiser de l'espace.

## [1.1.7] - 2025-06-13 "MobileApps"

### ? Interface mobile
- Suppression du titre "Applications installees" dans le menu mobile.
- Icones reduites pour un affichage plus epure.


## [1.1.6] - 2025-06-12 "SidebarTiles"

### ? Interface
- La sidebar PC adopte un style de tuile plus sobre et ne comporte plus de barre de defilement.

### ? Ameliorations du bouton de reduction
- Le bouton de basculement de la sidebar est desormais plus discret et colle au coin superieur droit en mode desktop.

### ? Preferences
- Possibilite de desactiver tous les pop-ups d'information depuis la page Profil.

### ? Formulaire de contact
- Ajout d'une section Contact pour envoyer un message depuis le navigateur.
- Une tuile d'accueil propose desormais l'installation de C2R OS en PWA.
## [1.1.6] - 2025-06-12 "UI"

### ? Ameliorations du bouton de reduction
- Le bouton de basculement de la sidebar est desormais plus discret et colle au coin superieur droit en mode desktop.
## [1.1.6] - 2025-06-12 "InfoToggle"

### ? Preferences
- Possibilite de desactiver tous les pop-ups d'information depuis la page Profil.
- La desactivation masque desormais egalement les notifications de lancement ou de desinstallation d'application.
## [1.1.6] - 2025-06-12 "Contact"

### ? Formulaire de contact
- Ajout d'une section Contact pour envoyer un message depuis le navigateur.

## [1.1.5] - 2025-06-11 "UI Icons"

### ? Harmonisation des icones
- Les applications utilisent desormais les pictogrammes Font Awesome au lieu des emojis.
- Mise a jour du gestionnaire d'icones avec de nouveaux glyphes (table, bars, code, chart).

## [1.1.4] - 2025-06-10 "TrainingUI"

### ? Formation
- La formation ChatGPT est desormais decoupee en dix pages avec navigation intuitive.

## [1.1.3] - 2025-06-09 "Tests"

### ? Configuration Jest
- Ajout du fichier `jest.config.cjs` pour centraliser la configuration des tests.
- Mise a jour de `package.json` et de la documentation pour expliquer l'installation des dependances avant l'execution des tests.


## [1.1.2] - 2025-06-08 "WelcomeTiles"

### ? Page d'accueil
- Ajout de tuiles explicatives presentant le fonctionnement du site.

## [1.1.1] - 2025-06-07 "ChatGPT"

### ? Formation
- Ajout de l'application **Formation ChatGPT** avec exemples et quiz integres.

## [1.1.0] - 2025-06-06 "DragDrop"

### ? Nouvelles fonctionnalites
- Reorganisation des applications depuis la page Profil via glisser-deposer
  (SortableJS), compatible mobile et desktop.
- Ajout d'un bouton de deconnexion dans la page Profil.

## [1.0.2] - 2025-06-05 "UX"

### ? Ameliorations de l'interface
- Alignement des icones "installer" et "poubelle" en bas a droite des tuiles du Store pour plus de coherence.

## [1.0.1] - 2025-06-05 "Docs"

### ? Documentation
- Ajout des fichiers `docs/*-readme.md` decrivant les modules.

## [1.0.0] - 2025-05-27 "Genesis"

### ? Nouvelles fonctionnalites reelles implementees

#### ? Systeme d'authentification fonctionnel
- ? Modal de connexion/inscription avec validation
- ? Systeme de comptes par defaut (`admin@c2ros.com` / `admin123`)
- ? Gestion des sessions utilisateur avec localStorage
- ? Bouton connexion/deconnexion qui change d'etat automatiquement
- ? Validation des mots de passe (minimum 6 caracteres)
- ? Pre-remplissage email apres inscription

#### ? Store d'applications operationnel
- ? Installation/desinstallation d'applications en temps reel
- ? Mise a jour automatique de l'interface apres installation
- ? Applications apparaissent dans la barre laterale apres installation
- ? Recherche et filtrage des applications disponibles
- ? Affichage du statut installe/disponible pour chaque app

#### ? Applications disponibles (vraiment fonctionnelles)
- ? **Notepad** : Editeur de texte simple avec sauvegarde
- ? **TodoList** : Gestionnaire de taches avec ajout/suppression
- ? **PromptGen** : Generateur de prompts pour IA
- ? **MarkdownReader** : Lecteur et editeur Markdown
- ? **HTMLFormatter** : Formateur de code HTML

#### ? Interface utilisateur complete
- ? Navigation entre pages (Accueil, Store, Profil, Admin)
- ? Sidebar avec applications installees cliquables
- ? Systeme de notifications toast fonctionnel
- ? Design responsive mobile/desktop
- ? Theme moderne avec couleurs coherentes

#### ? Architecture modulaire reelle
- ? **SystemIntegration** : Orchestrateur principal du systeme
- ? **UserCore** : Gestion complete des utilisateurs
- ? **AppCore** : Gestion du catalogue et installation d'apps
- ? **UICore** : Interface utilisateur et navigation
- ? **ProfileSystem** : Gestion des profils utilisateur
- ? **Config** : Configuration centralisee du systeme

### ? Corrections importantes appliquees

#### ? Problemes d'authentification resolus
- ? **Modal de connexion ne se fermait plus** : Correction des gestionnaires d'evenements
- ? **Bouton deconnexion dysfonctionnel** : Ajout de la logique de changement d'etat
- ? **Etat de connexion non persistant** : Amelioration de la gestion des sessions
- ? **Modal ne se rouvrait pas** : Correction des references des fonctions

#### ? Applications dans la sidebar corrigees
- ? **Apps n'apparaissaient pas apres installation** : Appel direct a `updateSidebarApps()`
- ? **Apps ne disparaissaient pas apres desinstallation** : Correction de la mise a jour
- ? **Fonctions UI non connectees** : Liaison correcte entre AppCore et UI

#### ? Ameliorations UX/UI
- ? **Modal ne se ferme plus accidentellement** : Suppression du clic exterieur
- ? **Notifications plus claires** : Messages d'etat pour chaque action
- ? **Navigation fluide** : Transitions entre les pages ameliorees
- ? **Responsivite mobile** : Interface adaptee aux petits ecrans

### ? Structure de fichiers reelle

```
c2rOS2/
+-- index.html                 # Page principale
+-- version.json              # Informations de version
+-- changelog.md              # Ce fichier
|
+-- css/                      # Styles CSS
|   +-- reset.css            # Reset CSS standard
|   +-- global.css           # Styles globaux
|   +-- layout.css           # Mise en page
|   +-- theme.css            # Theme et couleurs
|   +-- apps.css             # Styles des applications
|
+-- js/                       # JavaScript
|   +-- main.js              # Point d'entree principal
|   +-- modules/             # Modules du systeme
|       +-- core/config.js   # Configuration systeme
|       +-- user/user-core.js # Gestion utilisateurs
|       +-- app/app-core.js  # Gestion applications
|       +-- ui/ui-core.js    # Interface utilisateur
|       +-- profile/profile-system.js # Profils
|       +-- system/system-integration.js # Integration
|
+-- apps/                     # Applications disponibles
|   +-- notepad/             # Bloc-notes
|   +-- todolist/            # Liste de taches
|   +-- promptgen/           # Generateur prompts
|   +-- markdownreader/      # Lecteur Markdown
|   +-- htmlformatter/       # Formateur HTML
|
+-- docs/                     # Documentation modules
    +-- core-readme.md
    +-- user-readme.md
    +-- app-readme.md
    +-- ui-readme.md
    +-- profile-readme.md
    +-- system-readme.md
```

### ? Fonctionnalites reellement testees et validees

#### ? Authentification
- Connexion avec compte admin : `admin@c2ros.com` / `admin123`
- Inscription de nouveaux utilisateurs
- Deconnexion et reconnexion automatique
- Persistance des sessions

#### ? Gestion des applications
- Installation d'applications depuis le Store
- Apparition dans la barre laterale
- Lancement des applications
- Desinstallation et disparition de la sidebar

#### ? Interface utilisateur
- Navigation entre toutes les pages
- Notifications pour chaque action
- Responsive design teste
- Raccourcis clavier fonctionnels

### ? Outils de debug integres

```javascript
// Console de debug disponible
C2R_DEBUG.getSystemStatus()     // Etat du systeme
C2R_DEBUG.getCurrentUser()      // Utilisateur connecte
C2R_DEBUG.getInstalledApps()    // Apps installees
C2R_DEBUG.testNotification()   // Test notifications
C2R_DEBUG.installAllApps()     // Installer toutes les apps
```

### ? Raccourcis clavier operationnels
- `Ctrl + K` : Focus sur la recherche dans le Store
- `Ctrl + H` : Retour a l'accueil
- `Ctrl + P` : Aller au profil
- `Ctrl + Shift + A` : Panel admin (admin uniquement)

### ? Statistiques reelles du projet
- **Lignes de code** : ~3,500
- **Modules JavaScript** : 7
- **Feuilles CSS** : 5
- **Applications** : 5
- **Pages de documentation** : 7
- **Fonctionnalites principales** : 15+ testees

### ? Configuration systeme reelle

**Comptes par defaut :**
- Admin : `admin@c2ros.com` / `admin123`
- User : `user@c2ros.com` / `user123`

**Stockage :**
- localStorage pour toutes les donnees
- Prefixe : `c2ros_`
- Donnees sauvegardees : utilisateurs, apps installees, preferences

**Architecture :**
- Modules ES6+ avec import/export
- Systeme d'evenements personnalise
- API modulaire pour chaque composant

---

## ? Prochaines ameliorations planifiees

### Version 1.1.0 - "Stabilite"
- Correction des bugs mineurs restants
- Optimisation des performances
- Amelioration de l'accessibilite
- Tests automatises

### Version 1.2.0 - "Expansion"  
- Ajout de nouvelles applications
- Systeme de themes personnalisables
- Gestionnaire de fichiers integre
- API pour applications tierces

---

## ? Notes de developpement

**Technologies utilisees :**
- HTML5, CSS3, JavaScript ES6+
- localStorage pour la persistance
- Architecture modulaire pure
- Design responsive mobile-first

**Navigateurs testes :**
- Chrome 90+ ?
- Firefox 88+ ?
- Safari 14+ ?
- Edge 90+ ?

**Performance :**
- Temps de chargement : <2s
- Taille totale : ~200KB
- Modules charges a la demande
- Optimisation mobile

---

## ? Bugs connus resolus

 Problemes initiaux
- Modal d'authentification se fermait toute seule
- Applications n'apparaissaient pas dans la sidebar
- Bouton deconnexion ne fonctionnait pas
- Etat de connexion perdu au rechargement

Solutions appliquees
- Correction des gestionnaires d'evenements
- Ajout d'appels directs a `updateSidebarApps()`
- Implementation de `updateConnectionStatus()`
- Amelioration de la persistance des sessions
- Correction de l'affichage de l'icone **Applications** dans la barre de navigation mobile

---

Documentation
- Ajout du fichier `docs/icon-workflow.md` pour la gestion Design -> Dev des icones.
- Migration vers la librairie **Font Awesome** pour toutes les icones (chargement via CDN).
*Journal maintenu a jour a chaque modification significative du systeme*

## [1.0.3] - 2025-06-06 "UI"

### ? Ameliorations de la sidebar
- Le bouton de reduction est desormais integre a la barre laterale elle-meme,
  place dans l'en-tete. L'icone passe d'une croix a un petit carre selon l'etat
  de la barre et sa position s'adapte lorsqu'elle est a droite.

## [1.0.4] - 2025-06-07 "UI"

### ? Navigation mobile simplifiee
- Suppression du menu hamburger au profit de la barre de navigation basse.

## [1.0.5] - 2025-06-08 "Fix"

### ? Correctifs
- Les icones "installer" et "poubelle" conservent leur design lors de la recherche ou du filtrage dans le Store.

## [1.0.6] - 2025-06-09 "Fix"

### ? Correctifs
- La poubelle du Store et la croix de fermeture du menu mobile s'affichent desormais avec une couleur neutre.
