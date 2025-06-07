# UICore (Interface utilisateur)

S'occupe du thème, de la navigation et des notifications. Il adapte l'interface aux différents écrans et applique les préférences de l'utilisateur. C'est lui qui met à jour la sidebar et les pages lors des interactions.

Depuis la version actuelle, le Store utilise la méthode `toggleApp(appId)` pour installer ou désinstaller une application. L'icône « plus » devient une poubelle rouge, alignée à droite du texte. L'affichage sombre conserve cette couleur et la taille des icônes est réduite pour un meilleur rendu mobile. Une règle CSS dédiée garantit que la poubelle reste rouge sur mobile.
Lorsqu'un utilisateur tente d'installer une application sans être connecté, une notification indique désormais « Veuillez vous connecter pour installer ».
31dlz4-codex/2025-06-07
=======
Un bref retour tactile confirme aussi l'installation ou la désinstallation sur les appareils compatibles.
main
La liste déroulante des applications se ferme désormais en appuyant hors du menu ; la petite croix a été supprimée.
Le titre "Applications installées" a été retiré pour gagner de la place et les icônes y sont affichées en plus petit.

La barre de recherche du Store se masque automatiquement lors du défilement vers le bas.
En mode mobile, la barre de navigation basse comprend un bouton **Applications**. L'icône est chargée grâce à l'ajout du pictogramme `list` dans `IconManager`.
Depuis la version 1.1.8, cette barre mesure 80px de haut pour faciliter la navigation tactile.
Les icônes du menu mobile sont encore plus petites afin d'optimiser l'espace disponible.
Les pictogrammes de la liste déroulante adoptent maintenant un gris neutre pour un aspect minimaliste.
31dlz4-codex/2025-06-07
La largeur du menu est réduite et le bloc est aligné sur la droite afin d'optimiser l'espace sur petits écrans.
=======
La largeur du menu est réduite et son contenu est centré pour gagner de la place sur petits écrans.
main
L'ajout d'un fichier `manifest.webmanifest` permet d'installer C2R OS en plein écran sur mobile.
Les icônes nécessaires à la PWA sont chargées dynamiquement afin d'éviter tout fichier binaire dans le dépôt.
Une série de tuiles d'accueil explique comment utiliser l'OS :
1. **Installez des applications IA et services** — la tuile entière mène directement au Store.
2. **Options du profil** — la tuile ouvre directement la page correspondante pour gérer les notifications, le thème sombre ou la position de la barre de navigation.
3. **Installer C2R OS** en mode PWA sur smartphone.
4. **Infos sur les applications** — cette tuile renvoie directement au catalogue complet du Store.

La page Profil permet de réordonner visuellement les applications installées grâce à SortableJS. Un bouton de déconnexion est également présent sur cette page.
Un interrupteur permet désormais de désactiver tous les pop-ups d'information depuis les préférences du profil.

La sidebar propose un mode compact activé par un petit bouton discret situé dans le coin supérieur droit. L'icône passe d'une croix à un petit carré lorsque la barre est repliée, quelle que soit la position de la barre ou le thème. Le bouton utilise un gris légèrement plus sombre que la sidebar pour rester visible sans attirer l'œil. Les icônes de suppression demeurent rouges comme en mode standard.

La barre latérale bénéficie d'un fond dégradé gris et d'une ombre pour s'intégrer harmonieusement aux thèmes sombre et clair. Le bouton hamburger a été supprimé au profit de cette barre de navigation basse.

En affichage **PC**, la sidebar adopte désormais un style de tuile plus sobre sans barre de défilement verticale.
