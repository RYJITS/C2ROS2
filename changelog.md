# 📝 C2R OS - Journal des modifications
## [1.1.39] - 2025-08-11 "DualScreen"

### 📱🖥️ Responsivité généralisée
- Ajout d'une barre supérieure mobile avec bouton hamburger pour ouvrir le menu latéral.
- Conversion de la sidebar compacte en tiroir pleine hauteur sur smartphone avec blocage du défilement.
- Harmonisation des styles mobiles pour la barre latérale et sécurisation de l'ouverture/fermeture via l'overlay.

## [1.1.38] - 2025-08-10 "LandingMain"

### 🏠 Vitrine principale
- `accueil.html` devient `index.html` pour servir de page vitrine.
- L'ancien `index.html` est renommé `os.html`.
- Les liens de la vitrine redirigent vers `os.html#store` et `os.html#contact`.
- Le manifeste PWA démarre désormais sur `os.html`.

## [1.1.37] - 2025-08-09 "MountFlag"

### ♟️ Correctifs Échecs Pro
- Le chargeur définit `root.__mounted` après l'appel à `mountChessPro`, assurant l'affichage de l'échiquier et l'activation des boutons.

## [1.1.36] - 2025-08-09 "ChessMount"

### ♟️ Correctifs Échecs Pro
- Overlay de débogage activé via `?debug=1` capturant les journaux.
- Import explicite des modules et montage manuel de `mountChessPro(root)`.
- Levée du blocage des clics grâce aux règles CSS `pointer-events`.

## [1.1.35] - 2025-08-08 "ChessLoader"

### ♟️ Chargement explicite des modules
- Le Store résout le chemin de base pour GitHub Pages, importe `engine.js` et `chess.js` comme modules ES puis appelle `mountChessPro` avec journalisation.
## [1.1.34] - 2025-08-08 "ChessPro"

### ♟️ Échecs Pro
- Remplacement de l'application Échecs par une version complète avec SAN, FEN, flip, roque, prise en passant et promotion automatique.
## [1.1.33] - 2025-07-10 "StoreTop"

### 🖌️ Mise en page du Store
- La grande carte du Store s'étend désormais jusqu'en haut de l'écran.

## [1.1.31] - 2025-06-25 "UpdateDate"

### 🔮 Mise à jour de la date de version
- Actualisation de la date affichée sur la page d'accueil

## [1.1.30] - 2025-07-09 "HomeHistory"

### 🆕 Historique des modifications
- Ajout d'une tuile sur la page d'accueil affichant les trois dernières mises à jour.
## [1.1.29] - 2025-07-08 "WindowButtons"

### ✨ Harmonisation des contrôles
- Les boutons de fermeture, d'agrandissement et de réduction affichent désormais une croix, un carré et un trait sans couleur de fond.


## [1.1.28] - 2025-07-07 "VersionBump"

### 🚀 Mise à jour de version
- Mise à jour de la version et de la date d'actualisation sur la page d'accueil.

## [1.1.29] - 2025-07-08 "ProfileUpdate"

### ✨ Notification de mise à jour
- Le bouton "Mise à jour" de la page Profil affiche une pastille lorsque `version.json` indique une nouvelle version.

## [1.1.27] - 2025-07-06 "ChessRemoval"

### 🔥 Suppression de la page Échecs
- La tuile "Jouer aux échecs" disparait de l'accueil.
- La page autonome `chess.html` est retirée. Le jeu s'installe désormais uniquement via le Store.

## [1.1.26] - 2025-07-05 "StoreFullWidth"

### 📱 Optimisation mobile
- En mode mobile, la barre de recherche et les filtres du Store occupent à présent toute la largeur de l'écran.

## [1.1.25] - 2025-07-04 "NavIcons"

### 🎨 Icônes de navigation
- Les icônes Accueil, Store, Profil et Contact reprennent le style des applications.
- Aucun fond n'est appliqué lors du survol.
## [1.1.25] - 2025-07-04 "ProfileCleanup"

### 🧹 Interface Profil
- Suppression du titre "Applications installées" dans la page Profil pour un affichage plus épuré.
## [1.1.25] - 2025-07-04 "IconManagerTest"

### ✅ Vérification d'injection
- Ajout du test `tests/icon-manager.test.js` pour valider l'injection des icônes.

## [1.1.25] - 2025-07-04 "StoreButton"

### 🎨 Bouton du Store
- Le bouton d'installation ne possède plus d'arrière-plan et se situe désormais en bas à droite de chaque tuile.
## [1.1.25] - 2025-07-04 "NoHeaderLine"

### ✨ En-tête épuré
- Suppression de la bordure inférieure de la barre latérale pour retirer la séparation au-dessus de l'icône Accueil.
- Suppression du titre "Applications" dans la barre latérale pour un design plus minimaliste.

## [1.1.24] - 2025-07-03 "SidebarFlat"

### 🎨 Barre latérale simplifiée
- Suppression du logo C2R et des effets de dégradé, bordure et ombre.
- La colonne latérale conserve une couleur unie et un style minimal.

## [1.1.23] - 2025-07-02 "CleanMinimal"

### 🔥 Nettoyage des scripts inutilisés
- Les fichiers `sidebar-minimal.js` et `ui-minimal-red.js` ont été supprimés car ils n'étaient plus chargés par `index.html`.

## [1.1.22] - 2025-07-01 "StoreTileAlign"

### ♻️ Tuiles du Store uniformisées
- La mise en page du Store n'utilise plus de grille afin d'afficher les tuiles en liste verticale.
## [1.1.23] - 2025-07-02 "RemoveRunner"

### 🔧 Nettoyage
- Suppression du composant obsolète `app-runner` et du CSS associé.
## [1.1.21] - 2025-06-30 "NoSidebarToggle"

### 🔧 Suppression du mode compact
- La barre latérale ne peut plus être réduite en mode bureau. Le logo C2R reste
  visible en haut de la barre.
## [1.1.20] - 2025-06-26 "ChessDesign"

### ✨ Échiquier amélioré
- Les cases sont plus grandes et la sélection est mise en évidence.
- L'IA joue automatiquement après votre coup.

## [1.1.19] - 2025-06-25 "ChessQuickPage"

### ✨ Accès direct au jeu d'échecs
- Ajout de la page `chess.html` prête à jouer.
- Une tuile "Jouer aux échecs" ouvre cette page depuis l'accueil.


## [1.1.18] - 2025-06-24 "ChessEngineSelect"

### ✨ Application Échecs
- Ajout d'un menu déroulant pour choisir un moteur IA (Stockfish, LCZero…).
- L'URL de l'API se remplit automatiquement et peut être modifiée manuellement.
- Sans API choisie, un robot local joue les coups.

## [1.1.17] - 2025-06-23 "StoreTilesMobile"

### 📅 Interface mobile
- Les tuiles du Store s'adaptent maintenant mieux à la largeur des petits écrans.


## [1.1.17] - 2025-06-23 "IconBG"

### ✨ Interface Store
- Icône des tuiles sur fond rouge très transparent pour un rendu minimaliste.

## [1.1.16] - 2025-06-22 "ChessAI"

### ✨ Application intégrée
- Ajout du jeu **Échecs IA** pour affronter une intelligence artificielle via API.

## [1.1.15] - 2025-06-21 "StoreFix"

### 🐛 Correctif
- La page Store n'apparaît plus sur toutes les pages : un style CSS empêchait son masquage.

## [1.1.14] - 2025-06-20 "SidebarOffMobile"

### ✨ Interface mobile
- La barre latérale est à présent totalement masquée sur les petits écrans.

## [1.1.13] - 2025-06-19 "ContactFinalize"

### 📩 Page de contact finalisée
- Formulaire amélioré et adresse `contact@c2ros.com`.

## [1.1.8] - 2025-06-14 "ContactLink"

### 📮 Lien vers la section Contact
- Ajout d'un accès direct à la section Contact depuis la barre de navigation.
## [1.1.12] - 2025-06-18 "DragVibrate"

### ✨ Interface mobile
- Vibration courte lors du déplacement des applications dans la page Profil.
## [1.1.12] - 2025-06-18 "MobileMenuCompact"

### ✨ Interface mobile
- Menu des applications repensé : largeur réduite et suppression du bouton de fermeture.
- Icônes et pictogrammes encore plus petits pour un style minimaliste.
- Le menu est désormais aligné à droite sur mobile et ses icônes sont minuscules.
## [1.1.11] - 2025-06-17 "MobileIconsGrey"

### ✨ Interface mobile
- Les icônes de la liste déroulante des applications sont grisées pour un rendu minimaliste.
## [1.1.8] - 2025-06-14 "BottomNav80"

### ✨ Interface mobile
- Barre de navigation mobile agrandie à 80px de haut.

## [1.1.9] - 2025-06-15 "MobileIcons"

### ✨ Interface mobile
- Icônes du menu mobile alignées sur celles de la page Profil.

## [1.1.10] - 2025-06-16 "MobileIconsSmall"

### ✨ Interface mobile
- Icônes du menu mobile encore réduites pour économiser de l'espace.

## [1.1.7] - 2025-06-13 "MobileApps"

### ✨ Interface mobile
- Suppression du titre "Applications installées" dans le menu mobile.
- Icônes réduites pour un affichage plus épuré.


## [1.1.6] - 2025-06-12 "SidebarTiles"

### ✨ Interface
- La sidebar PC adopte un style de tuile plus sobre et ne comporte plus de barre de défilement.

### ✨ Améliorations du bouton de réduction
- Le bouton de basculement de la sidebar est désormais plus discret et collé au coin supérieur droit en mode desktop.

### ✨ Préférences
- Possibilité de désactiver tous les pop-ups d'information depuis la page Profil.

### 📮 Formulaire de contact
- Ajout d'une section Contact pour envoyer un message depuis le navigateur.
- Une tuile d'accueil propose désormais l'installation de C2R OS en PWA.
## [1.1.6] - 2025-06-12 "UI"

### ✨ Améliorations du bouton de réduction
- Le bouton de basculement de la sidebar est désormais plus discret et collé au coin supérieur droit en mode desktop.
## [1.1.6] - 2025-06-12 "InfoToggle"

### ✨ Préférences
- Possibilité de désactiver tous les pop-ups d'information depuis la page Profil.
- La désactivation masque désormais également les notifications de lancement ou de désinstallation d'application.
## [1.1.6] - 2025-06-12 "Contact"

### 📮 Formulaire de contact
- Ajout d'une section Contact pour envoyer un message depuis le navigateur.

## [1.1.5] - 2025-06-11 "UI Icons"

### ✨ Harmonisation des icônes
- Les applications utilisent désormais les pictogrammes Font Awesome au lieu des emojis.
- Mise à jour du gestionnaire d'icônes avec de nouveaux glyphes (table, bars, code, chart).

## [1.1.4] - 2025-06-10 "TrainingUI"

### 📚 Formation
- La formation ChatGPT est désormais découpée en dix pages avec navigation intuitive.

## [1.1.3] - 2025-06-09 "Tests"

### ✅ Configuration Jest
- Ajout du fichier `jest.config.cjs` pour centraliser la configuration des tests.
- Mise à jour de `package.json` et de la documentation pour expliquer l'installation des dépendances avant l'exécution des tests.


## [1.1.2] - 2025-06-08 "WelcomeTiles"

### ✨ Page d'accueil
- Ajout de tuiles explicatives présentant le fonctionnement du site.

## [1.1.1] - 2025-06-07 "ChatGPT"

### 📚 Formation
- Ajout de l'application **Formation ChatGPT** avec exemples et quiz intégrés.

## [1.1.0] - 2025-06-06 "DragDrop"

### 🚀 Nouvelles fonctionnalités
- Réorganisation des applications depuis la page Profil via glisser-déposer
  (SortableJS), compatible mobile et desktop.
- Ajout d'un bouton de déconnexion dans la page Profil.

## [1.0.2] - 2025-06-05 "UX"

### ✨ Améliorations de l'interface
- Alignement des icônes "installer" et "poubelle" en bas à droite des tuiles du Store pour plus de cohérence.

## [1.0.1] - 2025-06-05 "Docs"

### 📄 Documentation
- Ajout des fichiers `docs/*-readme.md` décrivant les modules.

## [1.0.0] - 2025-05-27 "Genesis"

### 🆕 Nouvelles fonctionnalités réelles implémentées

#### 🔐 Système d'authentification fonctionnel
- ✅ Modal de connexion/inscription avec validation
- ✅ Système de comptes par défaut (`admin@c2ros.com` / `admin123`)
- ✅ Gestion des sessions utilisateur avec localStorage
- ✅ Bouton connexion/déconnexion qui change d'état automatiquement
- ✅ Validation des mots de passe (minimum 6 caractères)
- ✅ Pré-remplissage email après inscription

#### 📦 Store d'applications opérationnel
- ✅ Installation/désinstallation d'applications en temps réel
- ✅ Mise à jour automatique de l'interface après installation
- ✅ Applications apparaissent dans la barre latérale après installation
- ✅ Recherche et filtrage des applications disponibles
- ✅ Affichage du statut installé/disponible pour chaque app

#### 📱 Applications disponibles (vraiment fonctionnelles)
- ✅ **Notepad** : Éditeur de texte simple avec sauvegarde
- ✅ **TodoList** : Gestionnaire de tâches avec ajout/suppression
- ✅ **PromptGen** : Générateur de prompts pour IA
- ✅ **MarkdownReader** : Lecteur et éditeur Markdown
- ✅ **HTMLFormatter** : Formateur de code HTML

#### 🎨 Interface utilisateur complète
- ✅ Navigation entre pages (Accueil, Store, Profil, Admin)
- ✅ Sidebar avec applications installées cliquables
- ✅ Système de notifications toast fonctionnel
- ✅ Design responsive mobile/desktop
- ✅ Thème moderne avec couleurs cohérentes

#### ⚙️ Architecture modulaire réelle
- ✅ **SystemIntegration** : Orchestrateur principal du système
- ✅ **UserCore** : Gestion complète des utilisateurs
- ✅ **AppCore** : Gestion du catalogue et installation d'apps
- ✅ **UICore** : Interface utilisateur et navigation
- ✅ **ProfileSystem** : Gestion des profils utilisateur
- ✅ **Config** : Configuration centralisée du système

### 🔧 Corrections importantes appliquées

#### 🐛 Problèmes d'authentification résolus
- ✅ **Modal de connexion ne se fermait plus** : Correction des gestionnaires d'événements
- ✅ **Bouton déconnexion dysfonctionnel** : Ajout de la logique de changement d'état
- ✅ **État de connexion non persistant** : Amélioration de la gestion des sessions
- ✅ **Modal ne se rouvrait pas** : Correction des références des fonctions

#### 📦 Applications dans la sidebar corrigées
- ✅ **Apps n'apparaissaient pas après installation** : Appel direct à `updateSidebarApps()`
- ✅ **Apps ne disparaissaient pas après désinstallation** : Correction de la mise à jour
- ✅ **Fonctions UI non connectées** : Liaison correcte entre AppCore et UI

#### 🎯 Améliorations UX/UI
- ✅ **Modal ne se ferme plus accidentellement** : Suppression du clic extérieur
- ✅ **Notifications plus claires** : Messages d'état pour chaque action
- ✅ **Navigation fluide** : Transitions entre les pages améliorées
- ✅ **Responsivité mobile** : Interface adaptée aux petits écrans

### 🏗️ Structure de fichiers réelle

```
c2rOS2/
├── index.html                 # Page vitrine
├── os.html                    # Interface principale
├── version.json              # Informations de version
├── changelog.md              # Ce fichier
│
├── css/                      # Styles CSS
│   ├── reset.css            # Reset CSS standard
│   ├── global.css           # Styles globaux
│   ├── layout.css           # Mise en page
│   ├── theme.css            # Thème et couleurs
│   └── apps.css             # Styles des applications
│
├── js/                       # JavaScript
│   ├── main.js              # Point d'entrée principal
│   └── modules/             # Modules du système
│       ├── core/config.js   # Configuration système
│       ├── user/user-core.js # Gestion utilisateurs
│       ├── app/app-core.js  # Gestion applications
│       ├── ui/ui-core.js    # Interface utilisateur
│       ├── profile/profile-system.js # Profils
│       └── system/system-integration.js # Intégration
│
├── apps/                     # Applications disponibles
│   ├── notepad/             # Bloc-notes
│   ├── todolist/            # Liste de tâches
│   ├── promptgen/           # Générateur prompts
│   ├── markdownreader/      # Lecteur Markdown
│   └── htmlformatter/       # Formateur HTML
│
└── docs/                     # Documentation modules
    ├── core-readme.md
    ├── user-readme.md
    ├── app-readme.md
    ├── ui-readme.md
    ├── profile-readme.md
    └── system-readme.md
```

### 🎯 Fonctionnalités réellement testées et validées

#### ✅ Authentification
- Connexion avec compte admin : `admin@c2ros.com` / `admin123`
- Inscription de nouveaux utilisateurs
- Déconnexion et reconnexion automatique
- Persistance des sessions

#### ✅ Gestion des applications
- Installation d'applications depuis le Store
- Apparition dans la barre latérale
- Lancement des applications
- Désinstallation et disparition de la sidebar

#### ✅ Interface utilisateur
- Navigation entre toutes les pages
- Notifications pour chaque action
- Responsive design testé
- Raccourcis clavier fonctionnels

### 💻 Outils de debug intégrés

```javascript
// Console de debug disponible
C2R_DEBUG.getSystemStatus()     // État du système
C2R_DEBUG.getCurrentUser()      // Utilisateur connecté
C2R_DEBUG.getInstalledApps()    // Apps installées
C2R_DEBUG.testNotification()   // Test notifications
C2R_DEBUG.installAllApps()     // Installer toutes les apps
```

### 🔑 Raccourcis clavier opérationnels
- `Ctrl + K` : Focus sur la recherche dans le Store
- `Ctrl + H` : Retour à l'accueil
- `Ctrl + P` : Aller au profil
- `Ctrl + Shift + A` : Panel admin (admin uniquement)

### 📊 Statistiques réelles du projet
- **Lignes de code** : ~3,500
- **Modules JavaScript** : 7
- **Feuilles CSS** : 5
- **Applications** : 5
- **Pages de documentation** : 7
- **Fonctionnalités principales** : 15+ testées

### 🔧 Configuration système réelle

**Comptes par défaut :**
- Admin : `admin@c2ros.com` / `admin123`
- User : `user@c2ros.com` / `user123`

**Stockage :**
- localStorage pour toutes les données
- Préfixe : `c2ros_`
- Données sauvegardées : utilisateurs, apps installées, préférences

**Architecture :**
- Modules ES6+ avec import/export
- Système d'événements personnalisé
- API modulaire pour chaque composant

---

## 🔮 Prochaines améliorations planifiées

### Version 1.1.0 - "Stabilité"
- Correction des bugs mineurs restants
- Optimisation des performances
- Amélioration de l'accessibilité
- Tests automatisés

### Version 1.2.0 - "Expansion"  
- Ajout de nouvelles applications
- Système de thèmes personnalisables
- Gestionnaire de fichiers intégré
- API pour applications tierces

---

## 📝 Notes de développement

**Technologies utilisées :**
- HTML5, CSS3, JavaScript ES6+
- localStorage pour la persistance
- Architecture modulaire pure
- Design responsive mobile-first

**Navigateurs testés :**
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

**Performance :**
- Temps de chargement : <2s
- Taille totale : ~200KB
- Modules chargés à la demande
- Optimisation mobile

---

## 🐛 Bugs connus résolus

 Problèmes initiaux
- Modal d'authentification se fermait toute seule
- Applications n'apparaissaient pas dans la sidebar
- Bouton déconnexion ne fonctionnait pas
- État de connexion perdu au rechargement

Solutions appliquées
- Correction des gestionnaires d'événements
- Ajout d'appels directs à `updateSidebarApps()`
- Implémentation de `updateConnectionStatus()`
- Amélioration de la persistance des sessions
- Correction de l'affichage de l'icône **Applications** dans la barre de navigation mobile

---

Documentation
- Ajout du fichier `docs/icon-workflow.md` pour la gestion Design → Dev des icônes.
- Migration vers la librairie **Font Awesome** pour toutes les icônes (chargement via CDN).
*Journal maintenu à jour à chaque modification significative du système*

## [1.0.3] - 2025-06-06 "UI"

### ✨ Améliorations de la sidebar
- Le bouton de réduction est désormais intégré à la barre latérale elle-même,
  placé dans l'en-tête. L'icône passe d'une croix à un petit carré selon l'état
  de la barre et sa position s'adapte lorsqu'elle est à droite.

## [1.0.4] - 2025-06-07 "UI"

### ♻️ Navigation mobile simplifiée
- Suppression du menu hamburger au profit de la barre de navigation basse.

## [1.0.5] - 2025-06-08 "Fix"

### 🐛 Correctifs
- Les icônes "installer" et "poubelle" conservent leur design lors de la recherche ou du filtrage dans le Store.

## [1.0.6] - 2025-06-09 "Fix"

### 🐛 Correctifs
- La poubelle du Store et la croix de fermeture du menu mobile s'affichent désormais avec une couleur neutre.
