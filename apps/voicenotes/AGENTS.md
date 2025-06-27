# Agent de l'application Note Vocale C2R

Cette application permet d'enregistrer la voix de l'utilisateur, de transcrire le contenu en temps réel via Whisper puis de reformuler le texte avec ChatGPT.

## Directives techniques
- Interface épurée et responsive en HTML, CSS et JavaScript.
- Visualisation audio animée pendant l'enregistrement.
- Les boutons permettent d'obtenir un résumé, un email, un rapport ou un compte‑rendu via l'API backend.
- Les fichiers audio ne sont jamais sauvegardés, uniquement traités en mémoire.
- L'application vérifie la présence du microphone et gère les erreurs d'autorisation.
- L'initialisation s'exécute dès que le DOM est prêt pour un démarrage rapide dans les pages chargées dynamiquement.
- Documenter toute nouvelle fonctionnalité directement ici.
