# Codex / IA — Projet C2ROS

Ce document résume les bonnes pratiques pour travailler avec une IA de type Codex ou GPT dans ce dépôt GitHub.

## 1. Toujours partir de `main` à jour

1. Récupérez les dernières modifications :
   ```bash
   git checkout main
   git pull origin main
   ```
2. Créez ensuite votre branche de travail à partir de cet état synchronisé.

## 2. Modulariser systématiquement le code

Divisez les fonctionnalités en modules ou composants indépendants. Cela simplifie la relecture et limite les conflits lors des merges.

## 3. Format de prompt recommandé pour Codex

- Contexte du dépôt ou du dossier concerné
- Objectif clair et concis
- Contraintes éventuelles (taille, style, dépendances…)
- Tests ou vérifications à effectuer

Exemple de prompt :
```
Agis sur le dossier `app/` : ajoute un script Node.js pour vérifier les dépendances. Le code doit être commenté en français et couvert par un test Jest.
```

## 4. Tester un merge à blanc

Avant toute Pull Request, simulez l’intégration avec `main` pour déceler les conflits :
```bash
# Depuis votre branche de travail
git fetch origin
git merge --no-commit --no-ff origin/main
```
Si aucun conflit n’apparaît, annulez le merge à blanc :
```bash
git merge --abort
```

## 5. Exemple de hook `pre-commit` anti-conflit (optionnel)

Créez le fichier `.git/hooks/pre-commit` et rendez-le exécutable :
```bash
#!/bin/sh
# Empêche un commit si un merge à blanc échoue
if ! git merge --no-commit --no-ff origin/main >/dev/null 2>&1; then
  echo "Conflits détectés avec main : résolvez-les avant de committer." >&2
  git merge --abort
  exit 1
fi
```

Rendez ce script exécutable : `chmod +x .git/hooks/pre-commit`.

## Conclusion

En suivant ces étapes—branche à jour, code modulaire, prompts clairs et vérifications avant la PR—vous limitez les risques de conflit et exploitez Codex dans de bonnes conditions.
