// Application Lecteur Markdown pour C2R OS
let markdownState = {
    currentContent: '',
    viewMode: 'split', // 'split' ou 'preview'
    isPreviewOnly: false
};

// Initialisation de l'application
function initMarkdownReader() {
    console.log('📄 Initialisation du Lecteur Markdown');
    
    const markdownInput = document.getElementById('markdown-input');
    if (markdownInput) {
        markdownInput.addEventListener('input', updatePreview);
        
        // Charger l'exemple par défaut
        loadSample();
    }
}

// Mettre à jour l'aperçu
function updatePreview() {
    const markdownInput = document.getElementById('markdown-input');
    const markdownOutput = document.getElementById('markdown-output');
    
    if (!markdownInput || !markdownOutput) return;
    
    const markdownText = markdownInput.value;
    markdownState.currentContent = markdownText;
    
    // Convertir le Markdown en HTML (parser simple)
    const html = parseMarkdown(markdownText);
    markdownOutput.innerHTML = html;
}

// Parser Markdown simple
function parseMarkdown(markdown) {
    let html = markdown;
    
    // Échapper les caractères HTML
    html = html.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;');
    
    // Titres
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Gras et italique
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Code inline
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Liens
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Citations
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
    
    // Listes à puces
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Listes numérotées
    html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
    
    // Blocs de code
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, function(match, lang, code) {
        return `<pre><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`;
    });
    
    // Tableaux simples
    html = html.replace(/\|(.+)\|/g, function(match, content) {
        const cells = content.split('|').map(cell => cell.trim());
        const cellsHtml = cells.map(cell => `<td>${cell}</td>`).join('');
        return `<tr>${cellsHtml}</tr>`;
    });
    
    // Envelopper les tableaux
    html = html.replace(/(<tr>.*<\/tr>)/s, '<table>$1</table>');
    
    // Paragraphes
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    
    // Nettoyer les paragraphes vides
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[1-6]>)/g, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<blockquote>)/g, '$1');
    html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul>)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');
    html = html.replace(/<p>(<table>)/g, '$1');
    html = html.replace(/(<\/table>)<\/p>/g, '$1');
    html = html.replace(/<p>(<pre>)/g, '$1');
    html = html.replace(/(<\/pre>)<\/p>/g, '$1');
    
    return html;
}

// Nouveau document
function newDocument() {
    const markdownInput = document.getElementById('markdown-input');
    if (markdownInput) {
        markdownInput.value = '# Nouveau Document\n\nCommencez à écrire votre contenu ici...';
        updatePreview();
        showNotification('Nouveau document créé', 'success');
    }
}

// Charger un exemple
function loadSample() {
    const sampleMarkdown = `# Guide Markdown

## Introduction
Bienvenue dans le **Lecteur Markdown** de C2R OS ! Cette application vous permet de visualiser et éditer des documents Markdown en temps réel.

## Fonctionnalités

### Formatage de texte
- **Texte en gras** avec \`**texte**\`
- *Texte en italique* avec \`*texte*\`
- \`Code inline\` avec des backticks

### Listes
#### Liste à puces :
- Premier élément
- Deuxième élément
- Troisième élément

#### Liste numérotée :
1. Première étape
2. Deuxième étape
3. Troisième étape

### Liens et citations
Visitez [C2R OS](https://example.com) pour plus d'informations.

> Ceci est une citation importante qui sera mise en évidence dans l'aperçu.

### Code
Voici un exemple de code JavaScript :

\`\`\`javascript
function saluer(nom) {
    console.log(\`Bonjour \${nom} !\`);
}

saluer('Monde');
\`\`\`

### Tableau
| Fonctionnalité | Statut | Description |
|----------------|--------|-------------|
| Édition | ✅ | Édition en temps réel |
| Aperçu | ✅ | Rendu HTML instantané |
| Export | ✅ | Export HTML et copie |

## Conclusion
Le Lecteur Markdown vous offre une expérience d'édition fluide et intuitive. Profitez-en !`;

    const markdownInput = document.getElementById('markdown-input');
    if (markdownInput) {
        markdownInput.value = sampleMarkdown;
        updatePreview();
        showNotification('Exemple chargé', 'success');
    }
}

// Effacer l'éditeur
function clearEditor() {
    const markdownInput = document.getElementById('markdown-input');
    if (markdownInput) {
        markdownInput.value = '';
        updatePreview();
        showNotification('Éditeur effacé', 'info');
    }
}

// Basculer entre les vues
function toggleView() {
    const app = document.querySelector('.markdown-app');
    const toggleBtn = document.getElementById('view-toggle');
    
    if (!app || !toggleBtn) return;
    
    markdownState.isPreviewOnly = !markdownState.isPreviewOnly;
    
    if (markdownState.isPreviewOnly) {
        app.classList.add('preview-only');
        toggleBtn.innerHTML = '<span data-icon="edit"></span> Édition';
        IconManager.inject(toggleBtn);
        markdownState.viewMode = 'preview';
    } else {
        app.classList.remove('preview-only');
        toggleBtn.innerHTML = '<span data-icon="preview"></span> Aperçu';
        IconManager.inject(toggleBtn);
        markdownState.viewMode = 'split';
    }
    
    showNotification(`Mode ${markdownState.viewMode === 'preview' ? 'aperçu' : 'édition'} activé`, 'info');
}

// Exporter en HTML
function exportHTML() {
    if (!markdownState.currentContent) {
        showNotification('Aucun contenu à exporter', 'warning');
        return;
    }
    
    const html = parseMarkdown(markdownState.currentContent);
    const fullHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document Markdown</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        h1, h2, h3 { color: #333; }
        h1 { border-bottom: 2px solid #eee; padding-bottom: 10px; }
        h2 { border-bottom: 1px solid #eee; padding-bottom: 5px; }
        code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
        pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
        blockquote { border-left: 4px solid #ddd; margin: 0; padding: 10px 20px; background: #f9f9f9; }
        table { border-collapse: collapse; width: 100%; margin: 15px 0; }
        th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
        th { background: #f2f2f2; }
    </style>
</head>
<body>
${html}
</body>
</html>`;
    
    // Créer un blob et télécharger
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('HTML exporté avec succès', 'success');
}

// Copier le Markdown
function copyMarkdown() {
    if (!markdownState.currentContent) {
        showNotification('Aucun contenu à copier', 'warning');
        return;
    }
    
    copyToClipboard(markdownState.currentContent, 'Markdown copié dans le presse-papiers');
}

// Copier le HTML
function copyHTML() {
    if (!markdownState.currentContent) {
        showNotification('Aucun contenu à copier', 'warning');
        return;
    }
    
    const html = parseMarkdown(markdownState.currentContent);
    copyToClipboard(html, 'HTML copié dans le presse-papiers');
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
function markdownreaderCleanup() {
    console.log('🧹 Nettoyage du Lecteur Markdown');
    
    markdownState = {
        currentContent: '',
        viewMode: 'split',
        isPreviewOnly: false
    };
}

// Initialiser quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMarkdownReader);
} else {
    initMarkdownReader();
}
