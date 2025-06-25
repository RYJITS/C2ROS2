# UICore (Interface utilisateur)

S'occupe du thème, de la navigation et des notifications. Il adapte l'interface aux différents écrans et applique les préférences de l'utilisateur. C'est lui qui met à jour la sidebar et les pages lors des interactions.

## Palette de couleurs

| Rôle | Code |
|------|------|
| Rouge principal (accent) | `#C53A3A` |
| Rouge hover / actif | `#FF5858` |
| Blanc (texte inversé, icônes actives) | `#FFFFFF` |
| Noir profond (fond corps) | `#0D0D12` |
| Noir/gris foncé (zones, cartes) | `#15151B` |
| Gris moyen (bordures, séparateurs) | `#2A2A32` |
| Gris badge / conteneur sélectionné | `#26262F` |
| Gris clair (texte secondaire) | `#B7B7C0` |
| Gris placeholder (inputs) | `#5E5E66` |

Depuis la version actuelle, le Store utilise la méthode `toggleApp(appId)` pour installer ou désinstaller une application. L'icône « plus » devient une poubelle rouge, positionnée en bas à droite de chaque tuile, centrée et sans aucun arrière‑plan. L'affichage sombre conserve cette couleur et la taille des icônes est réduite pour un meilleur rendu mobile. Une règle CSS dédiée garantit que la poubelle reste rouge sur mobile.
Lorsqu'un utilisateur tente d'installer une application sans être connecté, une notification indique désormais « Veuillez vous connecter pour installer ».
Un bref retour tactile confirme aussi l'installation ou la désinstallation sur les appareils compatibles.
En mode mobile, chaque notification déclenche également une courte vibration pour attirer l'attention.
La liste déroulante des applications se ferme désormais en appuyant hors du menu ; la petite croix a été supprimée.
Le titre "Applications installées" a été retiré pour gagner de la place et les icônes y sont affichées en plus petit.
Le titre "Applications" dans la barre latérale a également été supprimé pour un affichage épuré.

La barre de recherche du Store se masque automatiquement lors du défilement vers le bas.
Le Store adopte un thème sombre rouge (fond `#0D0D12` avec dégradé `#15151B`).
Les tuiles reprennent le format des cartes d'accueil : icône au-dessus du texte et disposition en liste verticale.
Les applications sont désormais regroupées dans une grande carte qui contient toutes ces tuiles.
Sur mobile, chaque tuile occupe toute la largeur de l'écran avec une petite marge latérale.
La page Store n'a plus de marge latérale en mode mobile afin d'exploiter toute la largeur disponible.
La barre de recherche et les filtres s'étendent également sur toute la largeur pour un usage optimisé sur smartphone.
La page Store reste masquée tant qu'elle ne porte pas la classe `active`, évitant son affichage sur les autres pages.
En mode mobile, la barre de navigation basse comprend un bouton **Applications**. L'icône est chargée grâce à l'ajout du pictogramme `list` dans `IconManager`.
Depuis la version 1.1.8, cette barre mesure 80px de haut pour faciliter la navigation tactile.
Lorsque l'on presse un autre bouton de cette barre, la liste d'applications se referme automatiquement.
Si l'utilisateur connecté possède le rôle *admin*, un bouton supplémentaire apparaît pour ouvrir la page de configuration administrateur.
La barre latérale est désormais désactivée sur mobile pour laisser toute la place à la navigation basse.
Les icônes du menu mobile reprennent la même taille que celles utilisées dans la page Profil pour une cohérence visuelle.
Les icônes du menu mobile sont encore plus petites afin d'optimiser l'espace disponible.
Les pictogrammes de la liste déroulante adoptent maintenant un gris neutre pour un aspect minimaliste.
La largeur du menu est réduite et le bloc est aligné sur la droite afin d'optimiser l'espace sur petits écrans.
La largeur du menu est réduite et son contenu est centré pour gagner de la place sur petits écrans.
L'ajout d'un fichier `manifest.webmanifest` permet d'installer C2R OS en plein écran sur mobile.
Les icônes nécessaires à la PWA sont chargées dynamiquement afin d'éviter tout fichier binaire dans le dépôt.
Une série de tuiles d'accueil explique comment utiliser l'OS :
1. **Installez des applications IA et services** — la tuile entière mène directement au Store.
2. **Options du profil** — la tuile ouvre directement la page correspondante pour gérer les notifications, le thème sombre ou la position de la barre de navigation.
3. **Installer C2R OS** en mode PWA sur smartphone.
4. **Infos sur les applications** — cette tuile renvoie directement au catalogue complet du Store.

 La page Profil permet de réordonner visuellement les applications installées grâce à SortableJS. Un bouton de déconnexion est également présent sur cette page. Sur smartphone, une vibration courte marque le début et la fin du déplacement.
 Un interrupteur permet désormais de désactiver tous les pop-ups d'information depuis les préférences du profil.


La barre latérale affiche un fond uni sans ombre pour s'intégrer aux thèmes sombre ou clair. Le bouton hamburger a été supprimé au profit de cette barre de navigation basse.

En affichage **PC**, la sidebar adopte désormais un style de tuile plus sobre sans barre de défilement verticale.

Les textes des éléments disparaissent pour ne laisser que les icônes. Au passage de la souris, celles-ci se colorent en rouge et une info‑bulle identique apparaît pour chaque icône, qu'elle provienne du menu principal ou des applications. La règle `.sidebar-app-item:hover .app-icon` applique désormais explicitement la couleur `#ff5858` aux icônes des applications.
- Les icônes Accueil, Store, Profil et Contact adoptent la même taille et la même couleur que celles des applications, sans fond au survol.
Les icônes de la navigation utilisent désormais la même classe `app-icon` que celles des applications.
- Les contrôles des fenêtres (croix, carré, trait) sont affichés sans couleur de fond.

## Nouvelle barre latérale C2R
La version sombre fixe adopte une largeur de 72 px. Son fond est uni (#0d0d12) sans bordure droite. Les icônes centrées changent de couleur au survol (#ff5858). Le logo "C2R" a été retiré et la police Montserrat est utilisée pour tout le contenu.
Le survol n'affiche plus de fond gris : seules les icônes passent en rouge.
