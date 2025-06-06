# C2R OS - Workflow & Ways-of-Working: UI / Icônes

Ce document décrit le processus complet de gestion des icônes entre l'équipe Design (Figma) et l'équipe Développement (INIA)

Ce mini-OS suit le thème "Minimal Red" : fonds gris sombre (#181818 → #222222) avec un accent rouge (#E53935) et la police "Inter Variable".

## 1. Gestion des icônes

### Librairie commune
- **Font Awesome** est la librairie principale utilisée.
- Les polices sont désormais chargées via CDN (`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css`) au lieu du dossier `fonts/` afin d'assurer leur disponibilité.
- Les designers sélectionnent les glyphes nécessaires dans Figma à partir de la librairie Font Awesome officielle.
- Utiliser le plugin Figma "Font Awesome" pour importer et maintenir la librairie.

### Icônes personnalisées
- Les icônes non disponibles dans Font Awesome sont dessinées dans Figma (format vectoriel).
- Export en **SVG** (1 fichier par icône) avec un nom explicite (`custom-<nom>.svg`).
- Les SVG sont placés dans `public/icons/custom/` du dépôt React.
- L'équipe Dev ajoute ces références dans `IconManager` pour pouvoir les injecter côté client.

## 2. Arborescence recommandée

```
c2ros-react/
├── public/
│   ├── icons/
│   │   ├── fontawesome/              # Copie locale des icônes Font Awesome
│   │   └── custom/               # SVG customs exportés depuis Figma
│   └── index.html
├── src/
│   ├── components/
│   │   └── Icon.jsx              # Composant React pour les icônes
│   ├── styles/
│   │   └── tailwind.css          # Fichier d'entrée Tailwind
│   └── main.jsx                  # Entrée Vite
└── package.json
```

Les fichiers CSS actuels (`css/`) et JS vanilla (`js/`) restent pour l'ancienne version. La nouvelle application React se trouve dans `c2ros-react/`.

## 3. Pipeline d'intégration (React + Vite + Tailwind)

1. **Installation**
   ```bash
   npm create vite@latest c2ros-react -- --template react
   cd c2ros-react
   npm install
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```
    - Ajouter la police "Inter Variable" via npm (`@fontsource/inter`) ou CDN avant de lancer le dev server.
2. **Configuration Tailwind**
   - Modifier `tailwind.config.js` pour ajouter le chemin `./public/icons/**/*.{svg}` si besoin.
   - Importer `tailwind.css` dans `src/main.jsx`.
3. **Composant Icon**
   ```jsx
   import React from 'react';

  export default function Icon({ name, className }) {
    const icons = {
      home: <i className="icon fa-solid fa-house" />,
      store: <i className="icon fa-solid fa-store" />,
      // icônes supplémentaires…
    };
    return <span className={className}>{icons[name] || null}</span>;
  }
   ```
4. **Utilisation**
   ```jsx
   import Icon from './components/Icon';
   <button className="btn"><Icon name="store" className="mr-2" />Store</button>
   ```
5. **Build & preview**
   ```bash
   npm run dev        # développement
   npm run build      # production
   npm run preview    # aperçu du build
   ```

## 4. Qualité et accessibilité

- **Contrôle qualité** : vérification visuelle des icônes dans Storybook ou un écran dédié.
- **Tests** : linting ESLint + tests unitaires Jest pour les composants.
- **Accessibilité** :
  - Fournir un `aria-label` ou `title` explicite pour chaque icône utilisée seule.
  - Veiller au contraste couleurs (rouge #E53935 sur fond sombre #181818/#222222).
  - Utiliser `role="img"` sur les icônes personnalisées SVG si nécessaire.
  - Vérifier la lisibilité de la police Inter Variable sur tous les supports.

---

Cette procédure assure une cohérence entre Design et Développement lors de l'intégration des icônes de C2R OS.

Depuis la version 1.1.5, des pictogrammes supplémentaires (`table`, `bars`, `code`, `chart`) sont disponibles dans `IconManager` pour les applications internes.
