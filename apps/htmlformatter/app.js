// Application Formateur HTML pour C2R OS
let htmlFormatterState = {
    currentTab: 'html',
    htmlContent: '',
    cssContent: '',
    snippets: {
        button: '<button class="btn">Cliquez ici</button>',
        form: `<form>
    <div class="form-group">
        <label for="email">Email :</label>
        <input type="email" id="email" name="email" required>
    </div>
    <div class="form-group">
        <label for="message">Message :</label>
        <textarea id="message" name="message" rows="4"></textarea>
    </div>
    <button type="submit">Envoyer</button>
</form>`,
        table: `<table>
    <thead>
        <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Jean Dupont</td>
            <td>jean@example.com</td>
            <td>Développeur</td>
        </tr>
        <tr>
            <td>Marie Martin</td>
            <td>marie@example.com</td>
            <td>Designer</td>
        </tr>
    </tbody>
</table>`,
        card: `<div class="card">
    <div class="card-header">
        <h3>Titre de la carte</h3>
    </div>
    <div class="card-body">
        <p>Contenu de la carte avec du texte descriptif.</p>
        <button class="btn">Action</button>
    </div>
</div>`,
        navbar: `<nav class="navbar">
    <div class="nav-brand">
        <a href="#" class="brand-link">Mon Site</a>
    </div>
    <ul class="nav-menu">
        <li><a href="#" class="nav-link">Accueil</a></li>
        <li><a href="#" class="nav-link">À propos</a></li>
        <li><a href="#" class="nav-link">Services</a></li>
        <li><a href="#" class="nav-link">Contact</a></li>
    </ul>
</nav>`,
        footer: `<footer class="footer">
    <div class="footer-content">
        <div class="footer-section">
            <h4>À propos</h4>
            <p>Description de votre site ou entreprise.</p>
        </div>
        <div class="footer-section">
            <h4>Liens utiles</h4>
            <ul>
                <li><a href="#">Accueil</a></li>
                <li><a href="#">Services</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        </div>
    </div>
    <div class="footer-bottom">
        <p>&copy; 2025 Mon Site. Tous droits réservés.</p>
    </div>
</footer>`
    }
};

// Initialisation de l'application
function initHTMLFormatter() {
    console.log('🌐 Initialisation du Formateur HTML');
    
    const htmlInput = document.getElementById('html-input');
    const cssInput = document.getElementById('css-input');
    
    if (htmlInput) {
        htmlInput.addEventListener('input', updatePreview);
        htmlFormatterState.htmlContent = htmlInput.value;
    }
    
    if (cssInput) {
        cssInput.addEventListener('input', updatePreview);
        htmlFormatterState.cssContent = cssInput.value;
    }
    
    // Mettre à jour l'aperçu initial
    updatePreview();
}

// Changer d'onglet
function switchTab(tab) {
    htmlFormatterState.currentTab = tab;
    
    // Mettre à jour les boutons d'onglet
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${tab}-tab`).classList.add('active');
    
    // Afficher/masquer les panneaux
    document.getElementById('html-panel').style.display = tab === 'html' ? 'block' : 'none';
    document.getElementById('css-panel').style.display = tab === 'css' ? 'block' : 'none';
    
    showNotification(`Onglet ${tab.toUpperCase()} activé`, 'info');
}

// Mettre à jour l'aperçu
function updatePreview() {
    const htmlInput = document.getElementById('html-input');
    const cssInput = document.getElementById('css-input');
    const previewFrame = document.getElementById('preview-frame');
    
    if (!htmlInput || !cssInput || !previewFrame) return;
    
    htmlFormatterState.htmlContent = htmlInput.value;
    htmlFormatterState.cssContent = cssInput.value;
    
    // Créer le document complet
    const fullHTML = createFullHTML(htmlFormatterState.htmlContent, htmlFormatterState.cssContent);
    
    // Mettre à jour l'iframe
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    previewFrame.src = url;
    
    // Nettoyer l'URL après un délai
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Créer le HTML complet avec CSS intégré
function createFullHTML(html, css) {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aperçu</title>
    <style>
        ${css}
        
        /* Styles par défaut pour une meilleure présentation */
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .btn { padding: 8px 16px; background: #E53935; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .btn:hover { background: #F74B45; }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
        .form-group input, .form-group textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        table { border-collapse: collapse; width: 100%; margin: 15px 0; }
        th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
        th { background: #f2f2f2; font-weight: bold; }
        .card { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; margin: 15px 0; }
        .card-header { background: #f8f9fa; padding: 15px; border-bottom: 1px solid #ddd; }
        .card-body { padding: 15px; }
        .navbar { background: #343a40; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; }
        .nav-brand .brand-link { color: white; text-decoration: none; font-size: 18px; font-weight: bold; }
        .nav-menu { list-style: none; display: flex; gap: 20px; margin: 0; padding: 0; }
        .nav-link { color: white; text-decoration: none; }
        .nav-link:hover { color: #ccc; }
        .footer { background: #343a40; color: white; padding: 20px; margin-top: 40px; }
        .footer-content { display: flex; gap: 40px; margin-bottom: 20px; }
        .footer-section h4 { margin: 0 0 10px 0; }
        .footer-section ul { list-style: none; padding: 0; }
        .footer-section a { color: #ccc; text-decoration: none; }
        .footer-bottom { text-align: center; padding-top: 20px; border-top: 1px solid #555; }
    </style>
</head>
<body>
    ${html}
</body>
</html>`;
}

// Nouveau document
function newDocument() {
    const htmlInput = document.getElementById('html-input');
    const cssInput = document.getElementById('css-input');
    
    if (htmlInput) {
        htmlInput.value = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouveau Document</title>
</head>
<body>
    <h1>Nouveau Document</h1>
    <p>Commencez à créer votre contenu ici...</p>
</body>
</html>`;
    }
    
    if (cssInput) {
        cssInput.value = `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

h1 {
    color: #333;
    text-align: center;
}

p {
    color: #666;
    line-height: 1.6;
}`;
    }
    
    updatePreview();
    showNotification('Nouveau document créé', 'success');
}

// Charger un template
function loadTemplate() {
    const htmlInput = document.getElementById('html-input');
    const cssInput = document.getElementById('css-input');
    
    const templateHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Template de Base</title>
</head>
<body>
    <header class="header">
        <h1>Mon Site Web</h1>
        <nav>
            <a href="#accueil">Accueil</a>
            <a href="#apropos">À propos</a>
            <a href="#contact">Contact</a>
        </nav>
    </header>
    
    <main class="main-content">
        <section class="hero">
            <h2>Bienvenue sur mon site</h2>
            <p>Ceci est un template de base pour commencer votre projet web.</p>
            <button class="cta-button">Commencer</button>
        </section>
        
        <section class="features">
            <div class="feature">
                <h3>Fonctionnalité 1</h3>
                <p>Description de la première fonctionnalité.</p>
            </div>
            <div class="feature">
                <h3>Fonctionnalité 2</h3>
                <p>Description de la deuxième fonctionnalité.</p>
            </div>
            <div class="feature">
                <h3>Fonctionnalité 3</h3>
                <p>Description de la troisième fonctionnalité.</p>
            </div>
        </section>
    </main>
    
    <footer class="footer">
        <p>&copy; 2025 Mon Site. Tous droits réservés.</p>
    </footer>
</body>
</html>`;

    const templateCSS = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
}

.header {
    background: #2c3e50;
    color: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header h1 {
    font-size: 1.8rem;
}

.header nav a {
    color: white;
    text-decoration: none;
    margin-left: 2rem;
    transition: color 0.3s;
}

.header nav a:hover {
    color: #3498db;
}

.main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.hero {
    text-align: center;
    padding: 4rem 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 10px;
    margin-bottom: 3rem;
}

.hero h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.hero p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
}

.cta-button {
    background: #e74c3c;
    color: white;
    padding: 12px 30px;
    border: none;
    border-radius: 25px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background 0.3s;
}

.cta-button:hover {
    background: #c0392b;
}

.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin: 3rem 0;
}

.feature {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    text-align: center;
}

.feature h3 {
    color: #2c3e50;
    margin-bottom: 1rem;
}

.footer {
    background: #34495e;
    color: white;
    text-align: center;
    padding: 2rem;
    margin-top: 3rem;
}`;
    
    if (htmlInput) htmlInput.value = templateHTML;
    if (cssInput) cssInput.value = templateCSS;
    
    updatePreview();
    showNotification('Template chargé', 'success');
}

// Formater le code
function formatCode() {
    const currentInput = htmlFormatterState.currentTab === 'html' ? 
        document.getElementById('html-input') : 
        document.getElementById('css-input');
    
    if (!currentInput) return;
    
    let formatted = '';
    if (htmlFormatterState.currentTab === 'html') {
        formatted = formatHTML(currentInput.value);
    } else {
        formatted = formatCSS(currentInput.value);
    }
    
    currentInput.value = formatted;
    updatePreview();
    showNotification(`Code ${htmlFormatterState.currentTab.toUpperCase()} formaté`, 'success');
}

// Formater HTML (simple)
function formatHTML(html) {
    let formatted = html;
    let indent = 0;
    const indentSize = 4;
    
    // Supprimer les espaces en trop
    formatted = formatted.replace(/>\s+</g, '><');
    
    // Ajouter des retours à la ligne
    formatted = formatted.replace(/></g, '>\n<');
    
    // Indenter
    const lines = formatted.split('\n');
    const result = [];
    
    for (let line of lines) {
        line = line.trim();
        if (line.length === 0) continue;
        
        // Diminuer l'indentation pour les balises fermantes
        if (line.startsWith('</')) {
            indent = Math.max(0, indent - indentSize);
        }
        
        result.push(' '.repeat(indent) + line);
        
        // Augmenter l'indentation pour les balises ouvrantes
        if (line.startsWith('<') && !line.startsWith('</') && !line.endsWith('/>')) {
            indent += indentSize;
        }
    }
    
    return result.join('\n');
}

// Formater CSS (simple)
function formatCSS(css) {
    let formatted = css;
    
    // Ajouter des espaces autour des accolades
    formatted = formatted.replace(/\{/g, ' {\n');
    formatted = formatted.replace(/\}/g, '\n}\n');
    
    // Ajouter des retours à la ligne après les points-virgules
    formatted = formatted.replace(/;/g, ';\n');
    
    // Indenter les propriétés
    const lines = formatted.split('\n');
    const result = [];
    
    for (let line of lines) {
        line = line.trim();
        if (line.length === 0) continue;
        
        if (line.includes(':') && !line.includes('{')) {
            result.push('    ' + line);
        } else {
            result.push(line);
        }
    }
    
    return result.join('\n');
}

// Aperçu du code
function previewCode() {
    updatePreview();
    showNotification('Aperçu mis à jour', 'info');
}

// Effacer tout
function clearAll() {
    const htmlInput = document.getElementById('html-input');
    const cssInput = document.getElementById('css-input');
    
    if (htmlInput) htmlInput.value = '';
    if (cssInput) cssInput.value = '';
    
    updatePreview();
    showNotification('Tout effacé', 'info');
}

// Télécharger HTML
function downloadHTML() {
    const fullHTML = createFullHTML(htmlFormatterState.htmlContent, htmlFormatterState.cssContent);
    
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('HTML téléchargé', 'success');
}

// Copier HTML
function copyHTML() {
    copyToClipboard(htmlFormatterState.htmlContent, 'HTML copié dans le presse-papiers');
}

// Copier CSS
function copyCSS() {
    copyToClipboard(htmlFormatterState.cssContent, 'CSS copié dans le presse-papiers');
}

// Insérer un snippet
function insertSnippet(type) {
    const snippet = htmlFormatterState.snippets[type];
    if (!snippet) return;
    
    const currentInput = htmlFormatterState.currentTab === 'html' ? 
        document.getElementById('html-input') : 
        document.getElementById('css-input');
    
    if (!currentInput) return;
    
    // Insérer à la position du curseur
    const start = currentInput.selectionStart;
    const end = currentInput.selectionEnd;
    const text = currentInput.value;
    
    currentInput.value = text.substring(0, start) + snippet + text.substring(end);
    
    // Repositionner le curseur
    currentInput.selectionStart = currentInput.selectionEnd = start + snippet.length;
    currentInput.focus();
    
    updatePreview();
    showNotification(`Snippet "${type}" inséré`, 'success');
}

// Valider le code
function validateCode() {
    const validationResults = document.getElementById('validation-results');
    const validationOutput = document.getElementById('validation-output');
    
    if (!validationResults || !validationOutput) return;
    
    const errors = [];
    const warnings = [];
    
    // Validation HTML basique
    const html = htmlFormatterState.htmlContent;
    if (!html.includes('<!DOCTYPE')) {
        warnings.push('DOCTYPE manquant');
    }
    if (!html.includes('<html')) {
        errors.push('Balise <html> manquante');
    }
    if (!html.includes('<head')) {
        errors.push('Balise <head> manquante');
    }
    if (!html.includes('<body')) {
        errors.push('Balise <body> manquante');
    }
    
    // Validation CSS basique
    const css = htmlFormatterState.cssContent;
    const openBraces = (css.match(/\{/g) || []).length;
    const closeBraces = (css.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
        errors.push('Accolades CSS non équilibrées');
    }
    
    // Afficher les résultats
    let output = '';
    
    if (errors.length === 0 && warnings.length === 0) {
        output = '<div class="validation-success">✅ Code valide ! Aucune erreur détectée.</div>';
    } else {
        errors.forEach(error => {
            output += `<div class="validation-error">❌ Erreur: ${error}</div>`;
        });
        warnings.forEach(warning => {
            output += `<div class="validation-warning">⚠️ Avertissement: ${warning}</div>`;
        });
    }
    
    validationOutput.innerHTML = output;
    validationResults.style.display = 'block';
    
    showNotification('Validation terminée', 'info');
}

// Fonction utilitaire pour copier dans le presse-papiers
function copyToClipboard(text, successMessage) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification(successMessage, 'success');
        }).catch(() => {
            fallbackCopyToClipboard(text, successMessage);
        });
    } else {
        fallbackCopyToClipboard(text, successMessage);
    }
}

// Méthode de fallback pour copier
function fallbackCopyToClipboard(text, successMessage) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification(successMessage, 'success');
    } catch (err) {
        showNotification('Erreur lors de la copie', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Afficher une notification
function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Si l'UI Core est disponible, utiliser ses notifications
    if (window.C2R_SYSTEM?.uiCore?.showNotification) {
        window.C2R_SYSTEM.uiCore.showNotification(message, type);
    }
}

// Fonction de nettoyage pour C2R OS
function htmlformatterCleanup() {
    console.log('🧹 Nettoyage du Formateur HTML');
    
    htmlFormatterState = {
        currentTab: 'html',
        htmlContent: '',
        cssContent: '',
        snippets: htmlFormatterState.snippets // Garder les snippets
    };
}

// Initialiser quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHTMLFormatter);
} else {
    initHTMLFormatter();
}
