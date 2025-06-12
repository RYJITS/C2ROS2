Store C2R – UI dark-mode rouge »
Palette
– Fond global : #0D0D12 → radial #15151B.
– Rouge accent : #C53A3A, hover #FF5858.
– Texte prim. : #FFFFFF | Texte sec. : #B7B7C0.
– Gris cartes : #1A1A21, bord 1 px #2A2A32.

Layout général
display:flex; flex-direction:column; padding:40px 64px;
Barre d’outils (recherche + filtres) alignée à droite : display:flex; gap:16px;

Grille des cartes
```css
.grid {
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
  gap:32px;
}
```
Carte application
```css
.card {
  width:100%; height:220px; position:relative;
  background:#1A1A21; border:1px solid #2A2A32; border-radius:16px;
  padding:24px 24px 56px;  /* place pour le bouton */
  transition:background 180ms ease;
}
.card:hover { background:linear-gradient(#1E1E26,#23232B); }
```
– Icône : carré 48 px, display:flex; align:center; justify:center;
– Titre : 18 px, 700, couleur #FFFFFF, margin-top:12px;
– Description : 14 px, #B7B7C0.
– Badge catégorie : font-size:12px; background:#26262F; color:#B7B7C0; border-radius:4px; padding:2px 6px;

Bouton “+” / “🗑️”
```css
.action-btn {
  position:absolute; right:16px; bottom:16px;
  width:44px; height:44px; border-radius:50%;
  background:#15151B; border:1px solid #2A2A32;
  display:flex; align-items:center; justify-content:center;
  color:#C53A3A; transition:all 180ms ease;
  box-shadow:0 2px 6px rgba(0,0,0,0.45);
}
.action-btn:hover {
  background:radial-gradient(circle,#C53A3A 0%,#FF5858 100%);
  color:#FFFFFF; transform:translateY(-2px) scale(1.05);
}
.action-btn:active { background:#FF5858; }
```
Animations globales
transition:all 180ms ease-in-out; sur icônes, boutons et cartes.

Accessibilité : contraste 4.5:1 min., outline:2px solid #FF5858 au focus clavier.

— Fin du prompt —
