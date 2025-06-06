/**
 * To-Do Liste - Application C2R OS
 * Version: 1.0.0
 * Fonctionnalités: Gestion de tâches, priorités, catégories, statistiques
 */

// Variables globales de l'application
let todoApp = {
    tasks: [],
    currentFilter: 'all',
    editingTaskId: null,
    nextId: 1
};

/**
 * Initialisation de l'application To-Do Liste
 */
function initTodoApp() {
    console.log('🚀 Initialisation To-Do Liste...');
    
    // Charger les tâches sauvegardées
    loadSavedTasks();
    
    // Configurer les événements
    setupTodoEvents();
    
    // Rendre l'interface
    renderTasks();
    updateStats();
    
    // Focus sur le champ de saisie
    setTimeout(() => {
        document.getElementById('new-task-input')?.focus();
    }, 100);
    
    console.log('✅ To-Do Liste initialisée');
}

/**
 * Configuration des événements
 */
function setupTodoEvents() {
    // Champ de saisie
    const taskInput = document.getElementById('new-task-input');
    if (taskInput) {
        taskInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                addNewTask();
            }
        });
    }
    
    // Bouton d'ajout
    document.getElementById('add-task-btn')?.addEventListener('click', addNewTask);
    
    // Filtre
    document.getElementById('filter-select')?.addEventListener('change', (e) => {
        todoApp.currentFilter = e.target.value;
        renderTasks();
    });
    
    // Vider les tâches terminées
    document.getElementById('clear-completed')?.addEventListener('click', clearCompletedTasks);
    
    // Modal d'édition
    document.getElementById('close-edit-modal')?.addEventListener('click', hideEditModal);
    document.getElementById('save-task-changes')?.addEventListener('click', saveTaskChanges);
    document.getElementById('cancel-task-edit')?.addEventListener('click', hideEditModal);
    
    // Fermeture modal en cliquant à l'extérieur
    document.getElementById('edit-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'edit-modal') hideEditModal();
    });
}

/**
 * Ajouter une nouvelle tâche
 */
function addNewTask() {
    const taskInput = document.getElementById('new-task-input');
    const prioritySelect = document.getElementById('priority-select');
    
    if (!taskInput || !prioritySelect) return;
    
    const text = taskInput.value.trim();
    if (!text) {
        showNotification('❌ Veuillez saisir une tâche', 'error');
        return;
    }
    
    const task = {
        id: todoApp.nextId++,
        text: text,
        completed: false,
        priority: prioritySelect.value,
        category: 'other',
        createdAt: new Date().toISOString(),
        completedAt: null,
        notes: ''
    };
    
    todoApp.tasks.push(task);
    taskInput.value = '';
    
    saveTasksToStorage();
    renderTasks();
    updateStats();
    
    showNotification(`✅ Tâche "${text}" ajoutée`, 'success');
}

/**
 * Ajouter une tâche rapide
 */
function addQuickTask(text) {
    const task = {
        id: todoApp.nextId++,
        text: text,
        completed: false,
        priority: 'medium',
        category: getCategoryFromText(text),
        createdAt: new Date().toISOString(),
        completedAt: null,
        notes: ''
    };
    
    todoApp.tasks.push(task);
    
    saveTasksToStorage();
    renderTasks();
    updateStats();
    
    showNotification(`✅ Tâche rapide "${text}" ajoutée`, 'success');
}

/**
 * Déterminer la catégorie à partir du texte
 */
function getCategoryFromText(text) {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('email') || lowerText.includes('appel') || lowerText.includes('réunion')) {
        return 'work';
    } else if (lowerText.includes('courses') || lowerText.includes('acheter')) {
        return 'shopping';
    } else if (lowerText.includes('médecin') || lowerText.includes('santé') || lowerText.includes('sport')) {
        return 'health';
    } else if (lowerText.includes('nettoyer') || lowerText.includes('ménage') || lowerText.includes('ranger')) {
        return 'personal';
    }
    
    return 'other';
}

/**
 * Basculer l'état d'une tâche
 */
function toggleTask(taskId) {
    const task = todoApp.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : null;
    
    saveTasksToStorage();
    renderTasks();
    updateStats();
    
    const action = task.completed ? 'terminée' : 'réactivée';
    showNotification(`${task.completed ? '✅' : '🔄'} Tâche ${action}`, 'info');
}

/**
 * Modifier une tâche
 */
function editTask(taskId) {
    const task = todoApp.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    todoApp.editingTaskId = taskId;
    
    // Remplir le formulaire
    document.getElementById('edit-task-text').value = task.text;
    document.getElementById('edit-task-priority').value = task.priority;
    document.getElementById('edit-task-category').value = task.category;
    document.getElementById('edit-task-notes').value = task.notes || '';
    
    // Afficher la modal
    document.getElementById('edit-modal').classList.add('show');
}

/**
 * Supprimer une tâche
 */
function deleteTask(taskId) {
    const task = todoApp.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${task.text}" ?`)) {
        todoApp.tasks = todoApp.tasks.filter(t => t.id !== taskId);
        
        saveTasksToStorage();
        renderTasks();
        updateStats();
        
        showNotification(`🗑️ Tâche supprimée`, 'warning');
    }
}

/**
 * Sauvegarder les modifications d'une tâche
 */
function saveTaskChanges() {
    if (todoApp.editingTaskId === null) return;
    
    const task = todoApp.tasks.find(t => t.id === todoApp.editingTaskId);
    if (!task) return;
    
    // Récupérer les valeurs du formulaire
    task.text = document.getElementById('edit-task-text').value.trim();
    task.priority = document.getElementById('edit-task-priority').value;
    task.category = document.getElementById('edit-task-category').value;
    task.notes = document.getElementById('edit-task-notes').value.trim();
    
    if (!task.text) {
        showNotification('❌ Le texte de la tâche ne peut pas être vide', 'error');
        return;
    }
    
    saveTasksToStorage();
    renderTasks();
    updateStats();
    hideEditModal();
    
    showNotification('💾 Tâche modifiée avec succès', 'success');
}

/**
 * Masquer la modal d'édition
 */
function hideEditModal() {
    document.getElementById('edit-modal').classList.remove('show');
    todoApp.editingTaskId = null;
}

/**
 * Vider les tâches terminées
 */
function clearCompletedTasks() {
    const completedCount = todoApp.tasks.filter(t => t.completed).length;
    
    if (completedCount === 0) {
        showNotification('ℹ️ Aucune tâche terminée à supprimer', 'info');
        return;
    }
    
    if (confirm(`Supprimer ${completedCount} tâche(s) terminée(s) ?`)) {
        todoApp.tasks = todoApp.tasks.filter(t => !t.completed);
        
        saveTasksToStorage();
        renderTasks();
        updateStats();
        
        showNotification(`🗑️ ${completedCount} tâche(s) supprimée(s)`, 'warning');
    }
}

/**
 * Rendre la liste des tâches
 */
function renderTasks() {
    const container = document.getElementById('tasks-container');
    const emptyState = document.getElementById('empty-state');
    
    if (!container) return;
    
    // Filtrer les tâches
    let filteredTasks = [...todoApp.tasks];
    
    switch (todoApp.currentFilter) {
        case 'pending':
            filteredTasks = filteredTasks.filter(t => !t.completed);
            break;
        case 'completed':
            filteredTasks = filteredTasks.filter(t => t.completed);
            break;
        case 'priority':
            filteredTasks = filteredTasks.filter(t => t.priority === 'high');
            break;
    }
    
    // Trier par priorité puis par date
    filteredTasks.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    // Afficher l'état vide si nécessaire
    if (filteredTasks.length === 0) {
        emptyState.style.display = 'block';
        container.innerHTML = '';
        container.appendChild(emptyState);
        return;
    }
    
    emptyState.style.display = 'none';
    
    // Générer le HTML des tâches
    container.innerHTML = filteredTasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask(${task.id})">
                ${task.completed ? '✓' : ''}
            </div>
            
            <div class="task-content">
                <div class="task-text">${escapeHtml(task.text)}</div>
                <div class="task-meta">
                    <span class="task-priority ${task.priority}">
                        ${getPriorityIcon(task.priority)} ${getPriorityLabel(task.priority)}
                    </span>
                    <span class="task-category">
                        ${getCategoryIcon(task.category)} ${getCategoryLabel(task.category)}
                    </span>
                    <span class="task-date">
                        ${formatDate(task.createdAt)}
                    </span>
                    ${task.notes ? `<span class="task-notes-indicator" title="${escapeHtml(task.notes)}">📝 Notes</span>` : ''}
                </div>
            </div>
            
            <div class="task-actions">
                <button class="task-action-btn edit" onclick="editTask(${task.id})" title="Modifier"><span data-icon="edit"></span></button>
                <button class="task-action-btn delete" onclick="deleteTask(${task.id})" title="Supprimer"><span data-icon="uninstall"></span></button>
            </div>
        </div>
    `).join('');

    IconManager.inject(container);
}

/**
 * Mettre à jour les statistiques
 */
function updateStats() {
    const total = todoApp.tasks.length;
    const completed = todoApp.tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Mettre à jour les éléments
    document.getElementById('total-tasks').textContent = total;
    document.getElementById('pending-tasks').textContent = pending;
    document.getElementById('completed-tasks').textContent = completed;
    document.getElementById('productivity-score').textContent = `${productivity}%`;
    
    // Mettre à jour la barre de progression
    const progressText = document.getElementById('progress-text');
    const progressFill = document.getElementById('progress-fill');
    
    if (progressText && progressFill) {
        progressText.textContent = `${completed} tâche(s) complétée(s) sur ${total}`;
        progressFill.style.width = `${productivity}%`;
    }
}

/**
 * Fonctions utilitaires
 */
function getPriorityIcon(priority) {
    const icons = { high: '🔴', medium: '🟡', low: '🟢' };
    return icons[priority] || '⚪';
}

function getPriorityLabel(priority) {
    const labels = { high: 'Haute', medium: 'Moyenne', low: 'Basse' };
    return labels[priority] || 'Inconnue';
}

function getCategoryIcon(category) {
    const icons = {
        work: '💼',
        personal: '👤',
        health: '🏥',
        shopping: '🛒',
        other: '📋'
    };
    return icons[category] || '📋';
}

function getCategoryLabel(category) {
    const labels = {
        work: 'Travail',
        personal: 'Personnel',
        health: 'Santé',
        shopping: 'Courses',
        other: 'Autre'
    };
    return labels[category] || 'Autre';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return "Aujourd'hui";
    } else if (diffDays === 2) {
        return "Hier";
    } else if (diffDays <= 7) {
        return `Il y a ${diffDays - 1} jour(s)`;
    } else {
        return date.toLocaleDateString('fr-FR');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Sauvegarder les tâches dans localStorage
 */
function saveTasksToStorage() {
    try {
        const userCore = window.C2R_SYSTEM?.userCore;
        const currentUser = userCore?.getCurrentUser();
        
        const data = {
            tasks: todoApp.tasks,
            nextId: todoApp.nextId
        };
        
        if (currentUser) {
            const storageKey = `c2r_todo_data_${currentUser.id}`;
            localStorage.setItem(storageKey, JSON.stringify(data));
        } else {
            localStorage.setItem('c2r_todo_data_guest', JSON.stringify(data));
        }
    } catch (error) {
        console.error('Erreur sauvegarde tâches:', error);
    }
}

/**
 * Charger les tâches depuis localStorage
 */
function loadSavedTasks() {
    try {
        const userCore = window.C2R_SYSTEM?.userCore;
        const currentUser = userCore?.getCurrentUser();
        
        let storageKey;
        if (currentUser) {
            storageKey = `c2r_todo_data_${currentUser.id}`;
        } else {
            storageKey = 'c2r_todo_data_guest';
        }
        
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            const data = JSON.parse(saved);
            todoApp.tasks = data.tasks || [];
            todoApp.nextId = data.nextId || 1;
            
            // S'assurer que nextId est correct
            if (todoApp.tasks.length > 0) {
                const maxId = Math.max(...todoApp.tasks.map(t => t.id));
                todoApp.nextId = Math.max(todoApp.nextId, maxId + 1);
            }
        } else {
            // Ajouter quelques tâches de démonstration pour les nouveaux utilisateurs
            addDemoTasks();
        }
    } catch (error) {
        console.error('Erreur chargement tâches:', error);
        todoApp.tasks = [];
        todoApp.nextId = 1;
        addDemoTasks();
    }
}

/**
 * Ajouter des tâches de démonstration
 */
function addDemoTasks() {
    const demoTasks = [
        {
            id: todoApp.nextId++,
            text: "Bienvenue dans votre To-Do Liste !",
            completed: false,
            priority: 'high',
            category: 'other',
            createdAt: new Date().toISOString(),
            completedAt: null,
            notes: 'Ceci est une tâche de démonstration. Vous pouvez la modifier ou la supprimer.'
        },
        {
            id: todoApp.nextId++,
            text: "Essayer les fonctionnalités",
            completed: false,
            priority: 'medium',
            category: 'other',
            createdAt: new Date(Date.now() - 60000).toISOString(),
            completedAt: null,
            notes: 'Explorez les différentes fonctionnalités de cette application.'
        },
        {
            id: todoApp.nextId++,
            text: "Marquer cette tâche comme terminée",
            completed: true,
            priority: 'low',
            category: 'other',
            createdAt: new Date(Date.now() - 120000).toISOString(),
            completedAt: new Date(Date.now() - 30000).toISOString(),
            notes: ''
        }
    ];
    
    todoApp.tasks = demoTasks;
    saveTasksToStorage();
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
function todoCleanup() {
    // Sauvegarder avant de fermer
    saveTasksToStorage();
    console.log('🧹 To-Do Liste fermée');
}

// Initialiser l'application
document.addEventListener('DOMContentLoaded', initTodoApp);

// Si l'application est déjà chargée
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTodoApp);
} else {
    initTodoApp();
}

// Exposer les fonctions globalement pour les événements inline
window.addQuickTask = addQuickTask;
window.toggleTask = toggleTask;
window.editTask = editTask;
window.deleteTask = deleteTask;
window.todoCleanup = todoCleanup;
