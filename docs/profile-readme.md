# ProfileSystem (Profils utilisateur)

Propose plusieurs modèles de profils prédéfinis et charge celui de l'utilisateur
courant. Chaque profil définit des préférences et des limitations (nombre
maximal d'applications, accès administrateur, etc.).

Les applications installées peuvent être réordonnées par glisser-déposer depuis
la page Profil. L'ordre choisi est sauvegardé et fonctionne aussi bien sur
mobile que sur ordinateur grâce à SortableJS. La barre latérale et le menu
mobile se mettent automatiquement à jour pour refléter ce nouvel ordre. Lors du
déplacement, l'application en cours de glisse est légèrement agrandie et son
fond s'assombrit pour mieux la distinguer. Sur smartphone, une courte vibration
signale le début et la fin du déplacement.
Un bouton de déconnexion est disponible pour terminer la session.
Les préférences incluent plusieurs options : activer ou désactiver les notifications, choisir le mode sombre et déplacer la barre de navigation.
Un bouton "Mise à jour" permet de rafraîchir l'application lorsqu'elle est installée en PWA.
