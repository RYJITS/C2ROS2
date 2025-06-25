# SystemIntegration (Orchestrateur)

Coordonne tous les modules pour démarrer C2R OS. Il lance la séquence de
chargement, écoute les événements globaux et assure le suivi des activités. Ce
composant vérifie l'intégrité du système et peut redémarrer ou arrêter l'OS.

Les actions et erreurs sont enregistrées dans `localStorage` sous la clé `system_logs`. Ces entrées sont consultables depuis le panneau d'administration dans la section **Options Avancées**, où elles sont chargées automatiquement lors de l'ouverture du détail.
