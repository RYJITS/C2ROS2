// Application Générateur de Prompts IA pour C2R OS
let promptGenState = {
    savedPrompts: [],
    currentPrompt: '',
    templates: {
        writing: {
            taskType: 'creative',
            context: 'Je travaille sur un projet de rédaction',
            objective: 'Créer un contenu engageant et bien structuré',
            outputFormat: 'text',
            detailLevel: 'detailed'
        },
        coding: {
            taskType: 'technical',
            context: 'Je développe une application',
            objective: 'Résoudre un problème technique ou implémenter une fonctionnalité',
            outputFormat: 'code',
            detailLevel: 'comprehensive'
        },
        analysis: {
            taskType: 'analytical',
            context: 'J\'analyse des données ou un problème complexe',
            objective: 'Obtenir des insights et des recommandations',
            outputFormat: 'list',
            detailLevel: 'detailed'
        },
        brainstorm: {
            taskType: 'creative',
            context: 'Je cherche des idées innovantes',
            objective: 'Générer des concepts créatifs et originaux',
            outputFormat: 'list',
            detailLevel: 'moderate'
        }
    }
};

// Initialisation de l'application
function initPromptGen() {
    console.log('🤖 Initialisation du Générateur de Prompts IA');
    
    loadSavedPrompts();
    updatePrompt();
    updateSavedPromptsList();
}

// Mettre à jour le prompt généré
function updatePrompt() {
    const taskType = document.getElementById('task-type').value;
    const context = document.getElementById('context-input').value;
    const objective = document.getElementById('objective-input').value;
    const outputFormat = document.getElementById('output-format').value;
    const detailLevel = document.getElementById('detail-level').value;
    
    let prompt = generatePrompt(taskType, context, objective, outputFormat, detailLevel);
    
    promptGenState.currentPrompt = prompt;
    
    const promptDisplay = document.getElementById('prompt-display');
    if (promptDisplay) {
        promptDisplay.textContent = prompt;
    }
}

// Générer le prompt basé sur les paramètres
function generatePrompt(taskType, context, objective, outputFormat, detailLevel) {
    let prompt = '';
    
    // Introduction basée sur le type de tâche
    const taskIntros = {
        creative: 'En tant qu\'assistant créatif,',
        analytical: 'En tant qu\'analyste expert,',
        technical: 'En tant que développeur expérimenté,',
        educational: 'En tant qu\'éducateur pédagogue,',
        business: 'En tant que consultant business,'
    };
    
    prompt += taskIntros[taskType] || 'En tant qu\'assistant IA,';
    prompt += ' ';
    
    // Ajouter le contexte
    if (context.trim()) {
        prompt += `dans le contexte suivant : "${context.trim()}". `;
    }
    
    // Ajouter l'objectif
    if (objective.trim()) {
        prompt += `Mon objectif est de ${objective.trim()}. `;
    }
    
    // Instructions de format
    const formatInstructions = {
        text: 'Réponds sous forme de texte structuré et clair.',
        list: 'Présente ta réponse sous forme de liste à puces organisée.',
        table: 'Organise ta réponse sous forme de tableau avec colonnes appropriées.',
        code: 'Fournis du code commenté et des explications techniques.',
        json: 'Structure ta réponse au format JSON valide.'
    };
    
    prompt += formatInstructions[outputFormat] || '';
    prompt += ' ';
    
    // Instructions de niveau de détail
    const detailInstructions = {
        brief: 'Sois concis et va à l\'essentiel.',
        moderate: 'Fournis une réponse équilibrée avec les points clés.',
        detailed: 'Développe en détail avec des exemples et explications.',
        comprehensive: 'Fournis une analyse complète et exhaustive.'
    };
    
    prompt += detailInstructions[detailLevel] || '';
    
    return prompt.trim();
}

// Copier le prompt dans le presse-papiers
function copyPrompt() {
    if (!promptGenState.currentPrompt) {
        showNotification('Aucun prompt à copier', 'warning');
        return;
    }
    
    // Utiliser l'API Clipboard si disponible
    if (navigator.clipboard) {
        navigator.clipboard.writeText(promptGenState.currentPrompt).then(() => {
            showNotification('Prompt copié dans le presse-papiers!', 'success');
        }).catch(() => {
            fallbackCopyToClipboard(promptGenState.currentPrompt);
        });
    } else {
        fallbackCopyToClipboard(promptGenState.currentPrompt);
    }
}

// Méthode de fallback pour copier
function fallbackCopyToClipboard(text) {
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
        showNotification('Prompt copié!', 'success');
    } catch (err) {
        showNotification('Erreur lors de la copie', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Sauvegarder le prompt actuel
function savePrompt() {
    if (!promptGenState.currentPrompt) {
        showNotification('Aucun prompt à sauvegarder', 'warning');
        return;
    }
    
    const promptData = {
        id: Date.now(),
        prompt: promptGenState.currentPrompt,
        taskType: document.getElementById('task-type').value,
        context: document.getElementById('context-input').value,
        objective: document.getElementById('objective-input').value,
        outputFormat: document.getElementById('output-format').value,
        detailLevel: document.getElementById('detail-level').value,
        createdAt: new Date().toISOString()
    };
    
    promptGenState.savedPrompts.unshift(promptData);
    
    // Limiter à 20 prompts sauvegardés
    if (promptGenState.savedPrompts.length > 20) {
        promptGenState.savedPrompts = promptGenState.savedPrompts.slice(0, 20);
    }
    
    saveSavedPrompts();
    updateSavedPromptsList();
    showNotification('Prompt sauvegardé!', 'success');
}

// Effacer le prompt actuel
function clearPrompt() {
    document.getElementById('context-input').value = '';
    document.getElementById('objective-input').value = '';
    document.getElementById('task-type').value = 'creative';
    document.getElementById('output-format').value = 'text';
    document.getElementById('detail-level').value = 'moderate';
    
    updatePrompt();
    showNotification('Prompt effacé', 'info');
}

// Charger un template prédéfini
function loadTemplate(templateName) {
    const template = promptGenState.templates[templateName];
    if (!template) return;
    
    document.getElementById('task-type').value = template.taskType;
    document.getElementById('context-input').value = template.context;
    document.getElementById('objective-input').value = template.objective;
    document.getElementById('output-format').value = template.outputFormat;
    document.getElementById('detail-level').value = template.detailLevel;
    
    updatePrompt();
    showNotification(`Template "${templateName}" chargé!`, 'success');
}

// Charger un prompt sauvegardé
function loadSavedPrompt(promptId) {
    const prompt = promptGenState.savedPrompts.find(p => p.id === promptId);
    if (!prompt) return;
    
    document.getElementById('task-type').value = prompt.taskType;
    document.getElementById('context-input').value = prompt.context;
    document.getElementById('objective-input').value = prompt.objective;
    document.getElementById('output-format').value = prompt.outputFormat;
    document.getElementById('detail-level').value = prompt.detailLevel;
    
    updatePrompt();
    showNotification('Prompt chargé!', 'success');
}

// Supprimer un prompt sauvegardé
function deleteSavedPrompt(promptId) {
    promptGenState.savedPrompts = promptGenState.savedPrompts.filter(p => p.id !== promptId);
    saveSavedPrompts();
    updateSavedPromptsList();
    showNotification('Prompt supprimé', 'info');
}

// Mettre à jour la liste des prompts sauvegardés
function updateSavedPromptsList() {
    const promptsList = document.getElementById('prompts-list');
    if (!promptsList) return;
    
    if (promptGenState.savedPrompts.length === 0) {
        promptsList.innerHTML = '<div class="no-prompts">Aucun prompt sauvegardé</div>';
        return;
    }
    
    let promptsHTML = '';
    promptGenState.savedPrompts.forEach(prompt => {
        const preview = prompt.prompt.length > 100 ? 
            prompt.prompt.substring(0, 100) + '...' : 
            prompt.prompt;
        
        promptsHTML += `
            <div class="prompt-item">
                <div class="prompt-preview" title="${prompt.prompt}">${preview}</div>
                <div class="prompt-item-actions">
                    <button class="prompt-item-btn load" onclick="loadSavedPrompt(${prompt.id})"><span data-icon="open"></span></button>
                    <button class="prompt-item-btn delete" onclick="deleteSavedPrompt(${prompt.id})"><span data-icon="uninstall"></span></button>
                </div>
            </div>
        `;
    });

    promptsList.innerHTML = promptsHTML;
    IconManager.inject(promptsList);
}

// Sauvegarder les prompts dans le localStorage
function saveSavedPrompts() {
    try {
        localStorage.setItem('c2ros_promptgen_saved', JSON.stringify(promptGenState.savedPrompts));
    } catch (error) {
        console.error('Erreur sauvegarde prompts:', error);
    }
}

// Charger les prompts depuis le localStorage
function loadSavedPrompts() {
    try {
        const saved = localStorage.getItem('c2ros_promptgen_saved');
        if (saved) {
            promptGenState.savedPrompts = JSON.parse(saved);
        }
    } catch (error) {
        console.error('Erreur chargement prompts:', error);
        promptGenState.savedPrompts = [];
    }
}

// Afficher une notification simple
function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Si l'UI Core est disponible, utiliser ses notifications
    if (window.C2R_SYSTEM?.uiCore?.showNotification) {
        window.C2R_SYSTEM.uiCore.showNotification(message, type);
    }
}

// Fonction de nettoyage pour C2R OS
function promptgenCleanup() {
    console.log('🧹 Nettoyage du Générateur de Prompts IA');
    
    promptGenState = {
        savedPrompts: [],
        currentPrompt: '',
        templates: promptGenState.templates // Garder les templates
    };
}

// Initialiser quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPromptGen);
} else {
    initPromptGen();
}
