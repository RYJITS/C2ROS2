# UICore (Interface utilisateur)

S'occupe du thème, de la navigation et des notifications. Il adapte l'interface aux différents écrans et applique les préférences de l'utilisateur. C'est lui qui met à jour la sidebar et les pages lors des interactions.

Depuis la version actuelle, le Store utilise la méthode `toggleApp(appId)` pour installer ou désinstaller une application. L'icône « plus » devient une poubelle rouge, alignée à droite du texte. L'affichage sombre conserve cette couleur et la taille des icônes est réduite pour un meilleur rendu mobile. Une correction assure également que la poubelle reste rouge sur mobile.
La petite croix fermant la liste déroulante des applications sur mobile adopte elle aussi une teinte neutre.

En mode mobile, la barre de navigation basse comprend un bouton **Applications**. L'icône est chargée grâce à l'ajout du pictogramme `list` dans `IconManager`.

La page Profil permet de réordonner visuellement les applications installées grâce à SortableJS. Un bouton de déconnexion est également présent sur cette page.

La sidebar propose un mode compact activé par un bouton dans son en-tête. L'icône passe d'une croix à un petit carré lorsque la barre est repliée, quelles que soient sa position et son thème. Les icônes de suppression restent rouges comme en mode standard.

La barre latérale bénéficie d'un fond dégradé gris et d'une ombre pour s'intégrer harmonieusement aux thèmes sombre et clair. Le bouton hamburger a été supprimé au profit de cette barre de navigation basse.
