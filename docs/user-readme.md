# UserCore (Gestion des utilisateurs)

Gère la création de comptes, l'authentification et les sessions. Il stocke les
préférences de chaque utilisateur et assure la persistance des données via
`localStorage`. Un compte administrateur est créé par défaut pour permettre la
première connexion.

Depuis le panneau d'administration, un bouton permet désormais d'ajouter un nouvel utilisateur via la fenêtre d'inscription. Les administrateurs peuvent aussi supprimer des comptes existants et consulter le nom d'utilisateur ainsi que le hash des mots de passe enregistrés dans le tableau des utilisateurs.
