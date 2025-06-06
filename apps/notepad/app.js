/**
 * Bloc-Notes IA - Application C2R OS
 * Version: 1.0.0
 * Fonctionnalités: Édition de texte, sauvegarde, assistance IA simulée
 */

// Variables globales de l'application
let notepadApp = {
    editor: null,
    currentFile: null,
    isModified: false,
    autoSaveTimer: null,
    files: [],
    aiResult: null
};

/**
 * Initialisation de l'application Bloc-Notes
 */
function initNotepadApp() {
    console.log('🚀 Initialisation Bloc-Notes IA...');
    
    // Récupérer les éléments DOM
    notepadApp.editor = document.getElementById('notepad-editor');
    
    if (!notepadApp.editor) {
        console.error('❌ Éléments DOM non trouvés');
        return;
    }
    
    // Charger les fichiers sauvegardés
    loadSavedFiles();
    
    // Configurer les événements
    setupNotepadEvents();
    
    // Démarrer les mises à jour
    startRealTimeUpdates();
    
    // Focus sur l'éditeur
    setTimeout(() => {
        notepadApp.editor.focus();
    }, 100);
    
    console.log('✅ Bloc-Notes IA initialisé');
}

/**
 * Configuration des événements
 */
function setupNotepadEvents() {
    // Événements de l'éditeur
    notepadApp.editor.addEventListener('input', handleTextChange);
    notepadApp.editor.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Boutons de la barre d'outils
    document.getElementById('new-note')?.addEventListener('click', createNewNote);
    document.getElementById('save-note')?.addEventListener('click', saveCurrentNote);
    document.getElementById('load-note')?.addEventListener('click', showLoadModal);
    document.getElementById('ai-assist')?.addEventListener('click', showAIAssistant);
    
    // Taille de police
    document.getElementById('font-size')?.addEventListener('change', changeFontSize);
    
    // Modales
    document.getElementById('close-modal')?.addEventListener('click', hideFileModal);
    document.getElementById('confirm-action')?.addEventListener('click', confirmFileAction);
    document.getElementById('filename-input')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') confirmFileAction();
    });
    
    // IA
    document.getElementById('close-ai')?.addEventListener('click', hideAINotification);
    document.getElementById('apply-ai')?.addEventListener('click', applyAIResult);
    document.getElementById('cancel-ai')?.addEventListener('click', hideAINotification);
    
    // Fermeture des modales en cliquant à l'extérieur
    document.getElementById('file-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'file-modal') hideFileModal();
    });
    
    document.getElementById('ai-notification')?.addEventListener('click', (e) => {
        if (e.target.id === 'ai-notification') hideAINotification();
    });
}

/**
 * Gestion des changements de texte
 */
function handleTextChange() {
    notepadApp.isModified = true;
    updateStatusBar();
    updateSaveStatus('Non sauvegardé');
    
    // Auto-sauvegarde après 3 secondes d'inactivité
    clearTimeout(notepadApp.autoSaveTimer);
    notepadApp.autoSaveTimer = setTimeout(() => {
        if (notepadApp.currentFile) {
            autoSaveNote();
        }
    }, 3000);
}

/**
 * Gestion des raccourcis clavier
 */
function handleKeyboardShortcuts(e) {
    if (e.ctrlKey) {
        switch (e.key) {
            case 's':
                e.preventDefault();
                saveCurrentNote();
                break;
            case 'n':
                e.preventDefault();
                createNewNote();
                break;
            case 'o':
                e.preventDefault();
                showLoadModal();
                break;
        }
    }
}

/**
 * Mise à jour de la barre de statut
 */
function updateStatusBar() {
    const text = notepadApp.editor.value;
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text.split('\n').length;
    
    // Mettre à jour les compteurs
    document.getElementById('char-count').textContent = `${chars} caractères`;
    document.getElementById('word-counter').textContent = `${words} mots`;
    document.getElementById('line-count').textContent = `${lines} ligne${lines > 1 ? 's' : ''}`;
}

/**
 * Mise à jour du statut de sauvegarde
 */
function updateSaveStatus(status, className = '') {
    const saveStatus = document.getElementById('save-status');
    if (saveStatus) {
        saveStatus.textContent = status;
        saveStatus.className = `save-status ${className}`;
    }
}

/**
 * Démarrer les mises à jour en temps réel
 */
function startRealTimeUpdates() {
    // Mise à jour de l'heure
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('current-time').textContent = timeString;
    }
    
    updateTime();
    setInterval(updateTime, 1000);
    
    // Mise à jour initiale de la barre de statut
    updateStatusBar();
}

/**
 * Créer une nouvelle note
 */
function createNewNote() {
    if (notepadApp.isModified && notepadApp.editor.value.trim()) {
        if (!confirm('Le document actuel a été modifié. Voulez-vous continuer sans sauvegarder ?')) {
            return;
        }
    }
    
    notepadApp.editor.value = '';
    notepadApp.currentFile = null;
    notepadApp.isModified = false;
    updateStatusBar();
    updateSaveStatus('Nouveau document');
    notepadApp.editor.focus();
    
    showNotification('📄 Nouveau document créé', 'info');
}

/**
 * Sauvegarder la note actuelle
 */
function saveCurrentNote() {
    const filename = prompt('Nom du fichier:', notepadApp.currentFile || 'Mon Document');
    if (!filename) return;
    
    const noteData = {
        name: filename,
        content: notepadApp.editor.value,
        lastModified: new Date().toISOString(),
        size: notepadApp.editor.value.length
    };
    
    // Sauvegarder dans les fichiers
    const existingIndex = notepadApp.files.findIndex(f => f.name === filename);
    if (existingIndex !== -1) {
        notepadApp.files[existingIndex] = noteData;
    } else {
        notepadApp.files.push(noteData);
    }
    
    // Sauvegarder dans localStorage
    saveFilesToStorage();
    
    notepadApp.currentFile = filename;
    notepadApp.isModified = false;
    updateSaveStatus('Sauvegardé', 'saved');
    
    showNotification(`💾 "${filename}" sauvegardé avec succès`, 'success');
}

/**
 * Auto-sauvegarde
 */
function autoSaveNote() {
    if (!notepadApp.currentFile || !notepadApp.isModified) return;
    
    updateSaveStatus('Sauvegarde...', 'saving');
    
    const noteData = {
        name: notepadApp.currentFile,
        content: notepadApp.editor.value,
        lastModified: new Date().toISOString(),
        size: notepadApp.editor.value.length
    };
    
    const existingIndex = notepadApp.files.findIndex(f => f.name === notepadApp.currentFile);
    if (existingIndex !== -1) {
        notepadApp.files[existingIndex] = noteData;
        saveFilesToStorage();
        notepadApp.isModified = false;
        updateSaveStatus('Auto-sauvegardé', 'saved');
    }
}

/**
 * Afficher la modal de chargement
 */
function showLoadModal() {
    renderFileList();
    document.getElementById('file-modal').classList.add('show');
    document.getElementById('filename-input').value = '';
    document.getElementById('filename-input').placeholder = 'Sélectionnez un fichier...';
}

/**
 * Masquer la modal de fichiers
 */
function hideFileModal() {
    document.getElementById('file-modal').classList.remove('show');
}

/**
 * Afficher la liste des fichiers
 */
function renderFileList() {
    const fileList = document.getElementById('file-list');
    
    if (notepadApp.files.length === 0) {
        fileList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--c2r-text-muted);">
                <p>📁 Aucun fichier sauvegardé</p>
                <p style="font-size: 12px;">Créez et sauvegardez votre premier document !</p>
            </div>
        `;
        return;
    }
    
    fileList.innerHTML = notepadApp.files.map((file, index) => `
        <div class="file-item" data-filename="${escapeHtml(file.name)}" onclick="selectFile('${file.name}')">
            <div class="file-info">
                <div class="file-name">${escapeHtml(file.name)}</div>
                <div class="file-date">${new Date(file.lastModified).toLocaleString('fr-FR')} • ${file.size} caractères</div>
            </div>
            <div class="file-actions">
                <button class="file-action-btn" onclick="event.stopPropagation(); previewFile('${file.name}')" title="Aperçu"><span data-icon="preview"></span></button>
                <button class="file-action-btn delete" onclick="event.stopPropagation(); deleteFile('${file.name}')" title="Supprimer"><span data-icon="uninstall"></span></button>
            </div>
        </div>
    `).join('');

    IconManager.inject(fileList);
}

/**
 * Sélectionner un fichier
 */
function selectFile(filename) {
    // Désélectionner tous les éléments
    document.querySelectorAll('.file-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Sélectionner l'élément cliqué
    document.querySelector(`[data-filename="${filename}"]`).classList.add('selected');
    document.getElementById('filename-input').value = filename;
}

/**
 * Aperçu d'un fichier
 */
function previewFile(filename) {
    const file = notepadApp.files.find(f => f.name === filename);
    if (file) {
        const preview = file.content.substring(0, 200) + (file.content.length > 200 ? '...' : '');
        showNotification(`📖 Aperçu de "${filename}":\n${preview}`, 'info', 5000);
    }
}

/**
 * Supprimer un fichier
 */
function deleteFile(filename) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${filename}" ?`)) {
        notepadApp.files = notepadApp.files.filter(f => f.name !== filename);
        saveFilesToStorage();
        renderFileList();
        showNotification(`🗑️ "${filename}" supprimé`, 'warning');
    }
}

/**
 * Confirmer l'action de fichier
 */
function confirmFileAction() {
    const filename = document.getElementById('filename-input').value.trim();
    if (!filename) {
        showNotification('❌ Veuillez sélectionner ou saisir un nom de fichier', 'error');
        return;
    }
    
    const file = notepadApp.files.find(f => f.name === filename);
    if (file) {
        // Charger le fichier
        if (notepadApp.isModified && !confirm('Le document actuel a été modifié. Continuer ?')) {
            return;
        }
        
        notepadApp.editor.value = file.content;
        notepadApp.currentFile = filename;
        notepadApp.isModified = false;
        updateStatusBar();
        updateSaveStatus('Chargé', 'saved');
        hideFileModal();
        showNotification(`📂 "${filename}" chargé`, 'success');
    } else {
        // Créer un nouveau fichier avec ce nom
        notepadApp.currentFile = filename;
        hideFileModal();
        showNotification(`📄 Nouveau fichier "${filename}" créé`, 'info');
    }
}

/**
 * Changer la taille de police
 */
function changeFontSize() {
    const fontSize = document.getElementById('font-size').value;
    notepadApp.editor.style.fontSize = fontSize + 'px';
    showNotification(`🔤 Taille de police: ${fontSize}px`, 'info');
}

/**
 * Afficher l'assistant IA
 */
function showAIAssistant() {
    const selectedText = getSelectedText();
    const fullText = notepadApp.editor.value;
    
    if (!selectedText && !fullText.trim()) {
        showNotification('❌ Veuillez saisir du texte ou en sélectionner une partie', 'error');
        return;
    }
    
    const action = document.getElementById('ai-action').value;
    const textToProcess = selectedText || fullText;
    
    // Simuler le traitement IA
    simulateAIProcessing(textToProcess, action);
}

/**
 * Simuler le traitement IA
 */
function simulateAIProcessing(text, action) {
    showNotification('🤖 Assistant IA en cours de traitement...', 'info');
    
    // Simulation avec un délai réaliste
    setTimeout(() => {
        let result = '';
        
        switch (action) {
            case 'improve':
                result = improveText(text);
                break;
            case 'correct':
                result = correctText(text);
                break;
            case 'summarize':
                result = summarizeText(text);
                break;
            case 'translate':
                result = translateText(text);
                break;
            case 'format':
                result = formatText(text);
                break;
            default:
                result = text;
        }
        
        notepadApp.aiResult = result;
        displayAIResult(result, action);
    }, 2000 + Math.random() * 1000);
}

/**
 * Fonctions IA simulées
 */
function improveText(text) {
    const improvements = [
        'Voici une version améliorée de votre texte avec un style plus fluide et engageant :',
        '',
        text.split('.').map(sentence => {
            if (sentence.trim()) {
                return sentence.trim() + ' [Amélioré avec un style plus professionnel]';
            }
            return sentence;
        }).join('. '),
        '',
        '💡 Améliorations apportées :',
        '• Style plus fluide et engageant',
        '• Vocabulaire enrichi',
        '• Structure optimisée'
    ];
    return improvements.join('\n');
}

function correctText(text) {
    let corrected = text
        .replace(/\s+/g, ' ')
        .replace(/\s*,\s*/g, ', ')
        .replace(/\s*\.\s*/g, '. ')
        .replace(/\s*!\s*/g, ' ! ')
        .replace(/\s*\?\s*/g, ' ? ');
    
    return `Texte corrigé :\n\n${corrected}\n\n✅ Corrections appliquées :\n• Espacement normalisé\n• Ponctuation ajustée\n• Casse vérifiée`;
}

function summarizeText(text) {
    const words = text.split(' ').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    
    const summary = text.split(/[.!?]+/)
        .filter(s => s.trim())
        .slice(0, Math.max(1, Math.floor(sentences / 3)))
        .join('. ') + '.';
    
    return `📋 Résumé automatique :\n\n${summary}\n\n📊 Statistiques :\n• Document original : ${words} mots, ${sentences} phrases\n• Résumé : ${summary.split(' ').length} mots\n• Compression : ${Math.round((1 - summary.split(' ').length / words) * 100)}%`;
}

function translateText(text) {
    // Simulation de traduction basique
    const translations = {
        'bonjour': 'hello',
        'au revoir': 'goodbye',
        'merci': 'thank you',
        'oui': 'yes',
        'non': 'no',
        'comment': 'how',
        'pourquoi': 'why',
        'quand': 'when',
        'où': 'where',
        'qui': 'who'
    };
    
    let translated = text.toLowerCase();
    Object.entries(translations).forEach(([fr, en]) => {
        translated = translated.replace(new RegExp(fr, 'g'), en);
    });
    
    return `🌐 Traduction en anglais :\n\n${translated}\n\n💡 Note : Traduction simulée à des fins de démonstration.\nPour une traduction professionnelle, utilisez un service spécialisé.`;
}

function formatText(text) {
    const formatted = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line)
        .map((line, index) => {
            if (line.length > 100) {
                return `${index + 1}. ${line}`;
            }
            return `   • ${line}`;
        })
        .join('\n');
    
    return `📝 Texte formaté :\n\n${formatted}\n\n✨ Formatage appliqué :\n• Numérotation des paragraphes longs\n• Puces pour les éléments courts\n• Espacement normalisé`;
}

/**
 * Afficher le résultat IA
 */
function displayAIResult(result, action) {
    document.getElementById('ai-result').textContent = result;
    document.getElementById('ai-notification').classList.add('show');
}

/**
 * Masquer la notification IA
 */
function hideAINotification() {
    document.getElementById('ai-notification').classList.remove('show');
}

/**
 * Appliquer le résultat IA
 */
function applyAIResult() {
    if (notepadApp.aiResult) {
        const selectedText = getSelectedText();
        if (selectedText) {
            // Remplacer le texte sélectionné
            replaceSelectedText(notepadApp.aiResult);
        } else {
            // Remplacer tout le contenu
            notepadApp.editor.value = notepadApp.aiResult;
        }
        
        handleTextChange();
        hideAINotification();
        showNotification('✨ Résultat IA appliqué avec succès', 'success');
    }
}

/**
 * Obtenir le texte sélectionné
 */
function getSelectedText() {
    const start = notepadApp.editor.selectionStart;
    const end = notepadApp.editor.selectionEnd;
    return notepadApp.editor.value.substring(start, end);
}

/**
 * Remplacer le texte sélectionné
 */
function replaceSelectedText(newText) {
    const start = notepadApp.editor.selectionStart;
    const end = notepadApp.editor.selectionEnd;
    const before = notepadApp.editor.value.substring(0, start);
    const after = notepadApp.editor.value.substring(end);
    
    notepadApp.editor.value = before + newText + after;
    notepadApp.editor.setSelectionRange(start, start + newText.length);
}

/**
 * Sauvegarder les fichiers dans localStorage
 */
function saveFilesToStorage() {
    try {
        const userCore = window.C2R_SYSTEM?.userCore;
        const currentUser = userCore?.getCurrentUser();
        
        if (currentUser) {
            const storageKey = `c2r_notepad_files_${currentUser.id}`;
            localStorage.setItem(storageKey, JSON.stringify(notepadApp.files));
        } else {
            localStorage.setItem('c2r_notepad_files_guest', JSON.stringify(notepadApp.files));
        }
    } catch (error) {
        console.error('Erreur sauvegarde fichiers:', error);
    }
}

/**
 * Charger les fichiers depuis localStorage
 */
function loadSavedFiles() {
    try {
        const userCore = window.C2R_SYSTEM?.userCore;
        const currentUser = userCore?.getCurrentUser();
        
        let storageKey;
        if (currentUser) {
            storageKey = `c2r_notepad_files_${currentUser.id}`;
        } else {
            storageKey = 'c2r_notepad_files_guest';
        }
        
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            notepadApp.files = JSON.parse(saved);
        }
    } catch (error) {
        console.error('Erreur chargement fichiers:', error);
        notepadApp.files = [];
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Afficher une notification
 */
function showNotification(message, type = 'info', duration = 3000) {
    const uiCore = window.C2R_SYSTEM?.uiCore;
    if (uiCore) {
        uiCore.showNotification(message, type, duration);
    } else {
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

/**
 * Nettoyage lors de la fermeture de l'application
 */
function notepadCleanup() {
    clearTimeout(notepadApp.autoSaveTimer);
    console.log('🧹 Bloc-Notes IA fermé');
}

// Initialiser l'application
document.addEventListener('DOMContentLoaded', initNotepadApp);

// Si l'application est déjà chargée
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNotepadApp);
} else {
    initNotepadApp();
}

// Exposer les fonctions globalement pour les événements inline
window.selectFile = selectFile;
window.previewFile = previewFile;
window.deleteFile = deleteFile;
window.notepadCleanup = notepadCleanup;
