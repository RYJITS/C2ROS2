# UICore (Interface utilisateur)

S'occupe du thème, de la navigation et des notifications. Il adapte l'interface aux différents écrans et applique les préférences de l'utilisateur. C'est lui qui met à jour la sidebar et les pages lors des interactions.

Depuis la version actuelle, le Store utilise la méthode `toggleApp(appId)` pour installer ou désinstaller une application. L'icône « plus » devient une poubelle rouge, alignée à droite du texte. L'affichage sombre conserve cette couleur et la taille des icônes est réduite pour un meilleur rendu mobile. Une règle CSS dédiée garantit que la poubelle reste rouge sur mobile.
La petite croix fermant la liste déroulante des applications sur mobile adopte elle aussi une teinte neutre.
Le titre "Applications installées" a été retiré pour gagner de la place et les icônes y sont affichées en plus petit.

En mode mobile, la barre de navigation basse comprend un bouton **Applications**. L'icône est chargée grâce à l'ajout du pictogramme `list` dans `IconManager`.
L'ajout d'un fichier `manifest.webmanifest` permet d'installer C2R OS en plein écran sur mobile.
Les icônes nécessaires à la PWA sont chargées dynamiquement afin d'éviter tout fichier binaire dans le dépôt.
Une tuile sur la page d'accueil invite l'utilisateur à installer l'application en PWA.

La page Profil permet de réordonner visuellement les applications installées grâce à SortableJS. Un bouton de déconnexion est également présent sur cette page.
Un interrupteur permet désormais de désactiver tous les pop-ups d'information depuis les préférences du profil.

La sidebar propose un mode compact activé par un petit bouton discret situé dans le coin supérieur droit. L'icône passe d'une croix à un petit carré lorsque la barre est repliée, quelle que soit la position de la barre ou le thème. Le bouton utilise un gris légèrement plus sombre que la sidebar pour rester visible sans attirer l'œil. Les icônes de suppression demeurent rouges comme en mode standard.

La barre latérale bénéficie d'un fond dégradé gris et d'une ombre pour s'intégrer harmonieusement aux thèmes sombre et clair. Le bouton hamburger a été supprimé au profit de cette barre de navigation basse.

En affichage **PC**, la sidebar adopte désormais un style de tuile plus sobre sans barre de défilement verticale.
