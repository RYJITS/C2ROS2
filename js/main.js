/**
 * C2R OS - Point d'entrée principal
 * Version: 1.0.0
 * Description: Système d'exploitation dans le navigateur avec architecture modulaire
 */

// Initialisation du système C2R OS
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initialisation C2R OS...');
    
    try {
        // Vérifier la disponibilité des modules
        if (!window.SystemIntegration) {
            throw new Error('Module SystemIntegration non disponible');
        }
        
        // Démarrer le système d'intégration
        window.C2R_INTEGRATION = new SystemIntegration();
        
        // Attendre que le système soit prêt
        window.addEventListener('c2rosReady', (event) => {
            console.log('✅ C2R OS prêt à l\'utilisation');
            
            // Initialiser l'interface utilisateur spécifique
            initializeUserInterface();
            
            // Configurer les gestionnaires d'événements globaux
            setupGlobalEventHandlers();
            
            // Afficher les informations de démarrage
            displayBootInfo(event.detail.system);
        });
        
    } catch (error) {
        console.error('❌ Erreur critique lors de l\'initialisation:', error);
        showCriticalError(error);
    }
});

/**
 * Initialiser l'interface utilisateur spécifique
 */
function initializeUserInterface() {
    const uiCore = window.C2R_SYSTEM?.uiCore;
    const userCore = window.C2R_SYSTEM?.userCore;
    
    if (!uiCore || !userCore) return;
    
    // Vérifier si un utilisateur est déjà connecté
    const currentUser = userCore.getCurrentUser();
    if (currentUser) {
        console.log(`👤 Utilisateur connecté: ${currentUser.email}`);
        uiCore.updateUserInterface(currentUser);
        updateSidebarApps();
        updateConnectionStatus(true);
    } else {
        // Mettre à jour l'état de déconnexion
        updateConnectionStatus(false);
        // Afficher la modale de connexion
        setTimeout(() => {
            showAuthModal('login');
        }, 1000);
    }

    displayUpdateTime();
}

/**
 * Mettre à jour l'état de connexion dans l'interface
 * @param {boolean} isConnected - État de connexion
 */
function updateConnectionStatus(isConnected) {
    const logoutBtns = document.querySelectorAll('.btn-logout');
    const userOnlySections = document.querySelectorAll('.user-only');

    logoutBtns.forEach(btn => {
        if (isConnected) {
            btn.style.display = 'flex';
            btn.innerHTML = `
                <span class="nav-icon">${IconManager.getIcon('signout')}</span>
                <span class="nav-text">Déconnexion</span>
            `;
        } else {
            btn.style.display = 'flex';
            btn.innerHTML = `
                <span class="nav-icon">${IconManager.getIcon('signout')}</span>
                <span class="nav-text">Se connecter</span>
            `;
            btn.onclick = () => showAuthModal('login');
        }
    });
    
    // Afficher/masquer les sections utilisateur
    userOnlySections.forEach(section => {
        section.style.display = isConnected ? 'block' : 'none';
    });
}

/**
 * Configurer les gestionnaires d'événements globaux
 */
function setupGlobalEventHandlers() {
    // Gestionnaire de recherche dans le Store
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                handleStoreSearch(e.target.value);
            }, 300);
        });
    }
    
    // Gestionnaire de tri dans le Store
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            handleStoreSort(e.target.value);
        });
    }

    // Gestionnaire de filtre par type dans le Store
    const typeFilter = document.getElementById('type-filter');
    if (typeFilter) {
        typeFilter.addEventListener('change', (e) => {
            handleTypeFilter(e.target.value);
        });
    }
    
    // Gestionnaires admin
    setupAdminHandlers();

    // Bouton de vidage du cache pour l'utilisateur
    const userCacheBtn = document.getElementById('clear-cache-user');
    if (userCacheBtn) {
        userCacheBtn.addEventListener('click', handleClearCache);
    }
    
    // Gestionnaires de drag & drop pour réorganiser les apps
    setupDragAndDrop();
    
    // Raccourcis clavier globaux
    setupKeyboardShortcuts();
    
    // Configurer les gestionnaires d'authentification
    setupAuthEventListeners();
}

/**
 * Gérer la recherche dans le Store
 * @param {string} query - Terme de recherche
 */
function handleStoreSearch(query) {
    const appCore = window.C2R_SYSTEM?.appCore;
    const uiCore = window.C2R_SYSTEM?.uiCore;
    
    if (!appCore || !uiCore) return;
    
    const filteredApps = appCore.searchApps(query);
    renderFilteredApps(filteredApps);
}

/**
 * Gérer le tri dans le Store
 * @param {string} criteria - Critère de tri
 */
function handleStoreSort(criteria) {
    const appCore = window.C2R_SYSTEM?.appCore;
    
    if (!appCore) return;
    
    let apps = appCore.getAvailableApps();
    
    switch (criteria) {
        case 'name':
            apps.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'installed':
            apps.sort((a, b) => appCore.isInstalled(b.id) - appCore.isInstalled(a.id));
            break;
        case 'category':
            apps.sort((a, b) => a.category.localeCompare(b.category));
            break;
        case 'type':
            apps.sort((a, b) => (a.type || '').localeCompare(b.type || ''));
            break;
        case 'size':
            apps.sort((a, b) => parseFloat(a.size) - parseFloat(b.size));
            break;
    }
    
    renderFilteredApps(apps);
}

/**
 * Filtrer par type dans le Store
 * @param {string} type - Type sélectionné
 */
function handleTypeFilter(type) {
    const appCore = window.C2R_SYSTEM?.appCore;

    if (!appCore) return;

    let apps = appCore.getAvailableApps();
    if (type !== 'all') {
        apps = appCore.getAppsByType(type);
    }

    renderFilteredApps(apps);
}

/**
 * Afficher les applications filtrées
 * @param {Array} apps - Applications à afficher
 */
function renderFilteredApps(apps) {
    const appsGrid = document.getElementById('apps-grid');
    const appCore = window.C2R_SYSTEM?.appCore;
    
    if (!appsGrid || !appCore) return;
    
    appsGrid.innerHTML = apps.map(app => `
        <div class="app-card">
            <div class="app-header">
                <div class="app-icon">${app.icon}</div>
                <div class="app-info">
                    <h3>${app.name}</h3>
                    <p>${app.description}</p>
                </div>
            </div>
            <div class="app-meta text-small text-muted">
                <span>Catégorie: ${app.category}</span>
                <span>Type: ${app.type || 'application'}</span>
                <span>Version: ${app.version}</span>
                <span>Taille: ${app.size}</span>
                <span>Auteur: ${app.author}</span>
            </div>
            <div class="app-permissions text-small">
                <strong>Permissions:</strong> ${app.permissions.join(', ') || 'Aucune'}
            </div>
            <div class="app-actions">
                <button class="app-toggle-btn ${appCore.isInstalled(app.id) ? 'installed' : ''}"
                        onclick="${appCore.isInstalled(app.id) ? `handleAppUninstall('${app.id}')` : `handleAppInstall('${app.id}')`}"
                        aria-label="${appCore.isInstalled(app.id) ? `Désinstaller ${app.name}` : `Installer ${app.name}`}">
                    <span class="icon">${IconManager.getIcon(appCore.isInstalled(app.id) ? 'uninstall' : 'install')}</span>
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Gérer l'installation d'une application
 * @param {string} appId - ID de l'application
 */
window.handleAppInstall = function(appId) {
    const appCore = window.C2R_SYSTEM?.appCore;
    const uiCore = window.C2R_SYSTEM?.uiCore;
    
    if (!appCore || !uiCore) return;
    
    const app = appCore.getApp(appId);
    if (!app) return;
    
    if (appCore.installApp(appId)) {
        uiCore.showNotification(`${IconManager.getIcon('check')} ${app.name} installée avec succès!`, 'success');
        uiCore.refreshApplicationsList();
        
        // Mettre à jour la sidebar avec les applications
        updateSidebarApps();
        
        // Émettre l'événement d'installation
        const integration = window.C2R_SYSTEM?.integration;
        if (integration) {
            integration.emitEvent('appInstalled', appId);
        }
    } else {
        uiCore.showNotification(`❌ Erreur lors de l'installation de ${app.name}`, 'error');
    }
};

/**
 * Gérer la désinstallation d'une application
 * @param {string} appId - ID de l'application
 */
window.handleAppUninstall = function(appId) {
    const appCore = window.C2R_SYSTEM?.appCore;
    const uiCore = window.C2R_SYSTEM?.uiCore;
    
    if (!appCore || !uiCore) return;
    
    const app = appCore.getApp(appId);
    if (!app) return;
    
    if (confirm(`Êtes-vous sûr de vouloir désinstaller ${app.name} ?`)) {
        if (appCore.uninstallApp(appId)) {
            uiCore.showNotification(`${IconManager.getIcon('uninstall')} ${app.name} désinstallée`, 'info');
            uiCore.refreshApplicationsList();
            
            // Mettre à jour la sidebar avec les applications
            updateSidebarApps();
        } else {
            uiCore.showNotification(`❌ Erreur lors de la désinstallation`, 'error');
        }
    }
};

/**
 * Configurer les gestionnaires admin
 */
function setupAdminHandlers() {
    // Bouton réinitialisation système
    const resetBtn = document.getElementById('reset-system');
    if (resetBtn) {
        resetBtn.addEventListener('click', handleSystemReset);
    }
    
    // Bouton vider cache
    const clearCacheBtn = document.getElementById('clear-cache');
    if (clearCacheBtn) {
        clearCacheBtn.addEventListener('click', handleClearCache);
    }
}

/**
 * Gérer la réinitialisation système
 */
function handleSystemReset() {
    const uiCore = window.C2R_SYSTEM?.uiCore;
    const userCore = window.C2R_SYSTEM?.userCore;
    
    if (!userCore?.isAdmin()) {
        uiCore?.showNotification('Accès refusé - Admin requis', 'error');
        return;
    }
    
    if (confirm('⚠️ Cette action va réinitialiser complètement le système. Continuer ?')) {
        if (confirm('🚨 ATTENTION: Toutes les données seront perdues. Êtes-vous absolument certain ?')) {
            uiCore?.showNotification(`${IconManager.getIcon('refresh')} Réinitialisation du système en cours...`, 'warning');
            
            setTimeout(() => {
                // Nettoyer le localStorage
                const config = window.C2R_CONFIG;
                if (config) {
                    Object.keys(localStorage).forEach(key => {
                        if (key.startsWith(config.storage.prefix)) {
                            localStorage.removeItem(key);
                        }
                    });
                }
                
                // Recharger la page
                location.reload();
            }, 2000);
        }
    }
}

/**
 * Gérer le vidage du cache
 */
function handleClearCache() {
    const uiCore = window.C2R_SYSTEM?.uiCore;
    const userCore = window.C2R_SYSTEM?.userCore;

    if (!userCore?.getCurrentUser()) {
        uiCore?.showNotification('Veuillez vous connecter pour continuer', 'error');
        return;
    }
    
    try {
        // Garder les données utilisateur essentielles
        const config = window.C2R_CONFIG;
        const essential = {};
        
        if (config) {
            const essentialKeys = [
                `${config.storage.prefix}${config.storage.keys.users}`,
                `${config.storage.prefix}${config.storage.keys.currentUser}`
            ];
            
            essentialKeys.forEach(key => {
                const data = localStorage.getItem(key);
                if (data) essential[key] = data;
            });
            
            // Nettoyer tout le cache C2R OS
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(config.storage.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            
            // Restaurer les données essentielles
            Object.keys(essential).forEach(key => {
                localStorage.setItem(key, essential[key]);
            });
        }
        
        uiCore?.showNotification(`${IconManager.getIcon('uninstall')} Cache vidé avec succès`, 'success');
        
    } catch (error) {
        console.error('Erreur vidage cache:', error);
        uiCore?.showNotification('❌ Erreur lors du vidage du cache', 'error');
    }
}

/**
 * Configurer le drag & drop pour réorganiser les applications
 */
function setupDragAndDrop() {
    const list = document.getElementById('installed-apps-list');
    if (!list || typeof Sortable === 'undefined') return;

    if (list.dataset.sortableApplied) return;
    list.dataset.sortableApplied = 'true';

    new Sortable(list, {
        animation: 150,
        onStart: (evt) => {
            evt.item.classList.add('dragging');
        },
        onEnd: (evt) => {
            evt.item.classList.remove('dragging');
            const order = Array.from(list.querySelectorAll('.app-item'))
                .map(item => item.dataset.appId);
            window.C2R_SYSTEM?.appCore.reorderApps(order);
        }
    });
}

/**
 * Configurer les raccourcis clavier
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        const uiCore = window.C2R_SYSTEM?.uiCore;
        
        // Ctrl + K : Focus sur la recherche
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                uiCore?.navigateToPage('store');
                setTimeout(() => searchInput.focus(), 100);
            }
        }
        
        // Ctrl + H : Aller à l'accueil
        if (e.ctrlKey && e.key === 'h') {
            e.preventDefault();
            uiCore?.navigateToPage('home');
        }
        
        // Ctrl + P : Aller au profil
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            uiCore?.navigateToPage('profile');
        }
        
        // Ctrl + Shift + A : Aller à l'admin (si admin)
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            const userCore = window.C2R_SYSTEM?.userCore;
            if (userCore?.isAdmin()) {
                uiCore?.navigateToPage('admin');
            }
        }
        
        // Échap : Fermer la modal si ouverte, mais permettre la réouverture
        if (e.key === 'Escape') {
            const modal = document.getElementById('auth-modal');
            if (modal && modal.classList.contains('show')) {
                e.preventDefault(); // Empêcher la fermeture par défaut
            }
        }
    });
}

/**
 * Afficher les informations de démarrage
 * @param {Object} system - Système d'intégration
 */
function displayBootInfo(system) {
    const status = system.getSystemStatus();
    
    console.log('📊 État du système C2R OS:');
    console.log(`  ⏱️ Temps de démarrage: ${status.uptime}ms`);
    console.log(`  📦 Modules chargés: ${status.modules.join(', ')}`);
    console.log(`  🔄 Séquence: ${status.bootSequence.join(' → ')}`);
    
    // Afficher dans l'interface si élément disponible
    const versionElement = document.querySelector('.system-version');
    if (versionElement && window.C2R_CONFIG) {
        const config = window.C2R_CONFIG;
        const version = config.getVersionInfo();
        versionElement.textContent = `${config.system.name} ${version.fullVersion}`;
    }
}

/**
 * Afficher l'heure de la dernière mise à jour
 */
function displayUpdateTime() {
    const el = document.getElementById('update-time');
    if (el) {
        const now = new Date();
        el.textContent = now.toLocaleString();
    }
}

/**
 * Afficher une erreur critique
 * @param {Error} error - Erreur
 */
function showCriticalError(error) {
    console.error('💥 Erreur critique:', error);
    
    // Créer un affichage d'erreur d'urgence
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #dc2626;
        color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 9999;
        max-width: 500px;
        text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    `;
    
    errorDiv.innerHTML = `
        <h2>💥 Erreur Critique C2R OS</h2>
        <p><strong>Le système n'a pas pu démarrer correctement.</strong></p>
        <p>Erreur: ${error.message}</p>
        <button onclick="location.reload()" style="
            background: white;
            color: #dc2626;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
        ">${IconManager.getIcon('refresh')} Recharger la page</button>
    `;
    
    document.body.appendChild(errorDiv);
}

/**
 * Afficher la modale d'authentification
 * @param {string} mode - 'login' ou 'register'
 */
function showAuthModal(mode = 'login') {
    const modal = document.getElementById('auth-modal');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const modalTitle = document.getElementById('modal-title');
    
    if (!modal) return;
    
    if (mode === 'login') {
        modalTitle.textContent = 'Connexion à C2R OS';
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        modalTitle.textContent = 'Inscription à C2R OS';
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
    
    modal.classList.add('show');
    
    // Ne pas fermer la modal en cliquant à l'extérieur
    modal.onclick = null;
}

/**
 * Masquer la modale d'authentification
 */
function hideAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

/**
 * Configurer les gestionnaires d'événements d'authentification
 */
function setupAuthEventListeners() {
    const modal = document.getElementById('auth-modal');
    const closeBtn = document.getElementById('modal-close');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutBtns = document.querySelectorAll('.btn-logout');
    
    // Bouton de fermeture (X)
    if (closeBtn) {
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            hideAuthModal();
        };
    }
    
    // NE PAS fermer en cliquant à l'extérieur pour éviter les fermetures accidentelles
    if (modal) {
        modal.onclick = (e) => {
            e.stopPropagation();
            // Ne rien faire - garder la modal ouverte
        };
        
        // Gérer seulement le clic sur l'overlay interne
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.onclick = (e) => {
                e.stopPropagation();
            };
        }
    }
    
    // Basculer vers l'inscription
    if (showRegisterLink) {
        showRegisterLink.onclick = (e) => {
            e.preventDefault();
            showAuthModal('register');
        };
    }
    
    // Basculer vers la connexion
    if (showLoginLink) {
        showLoginLink.onclick = (e) => {
            e.preventDefault();
            showAuthModal('login');
        };
    }
    
    // Gérer la soumission du formulaire de connexion
    if (loginForm) {
        loginForm.onsubmit = handleLogin;
    }
    
    // Gérer la soumission du formulaire d'inscription
    if (registerForm) {
        registerForm.onsubmit = handleRegister;
    }
    
    // Gestionnaire du bouton déconnexion/connexion
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const userCore = window.C2R_SYSTEM?.userCore;
            if (userCore && userCore.getCurrentUser()) {
                handleLogout();
            } else {
                showAuthModal('login');
            }
        });
    });
}

/**
 * Gérer la connexion
 * @param {Event} e - Événement de soumission
 */
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const uiCore = window.C2R_SYSTEM?.uiCore;
    const userCore = window.C2R_SYSTEM?.userCore;
    
    if (!userCore || !uiCore) return;
    
    const loginResult = userCore.login(email, password);
    
    if (loginResult) {
        hideAuthModal();
        uiCore.updateUserInterface(loginResult);
        uiCore.showNotification(`Bienvenue ${loginResult.email}!`, 'success');
        updateSidebarApps();
        updateConnectionStatus(true);
        
        // Émettre l'événement de changement d'utilisateur
        const integration = window.C2R_SYSTEM?.integration;
        if (integration) {
            integration.emitEvent('userChanged', loginResult);
        }
    } else {
        uiCore.showNotification('❌ Connexion échouée. Vérifiez vos identifiants.', 'error');
    }
}

/**
 * Gérer l'inscription
 * @param {Event} e - Événement de soumission
 */
function handleRegister(e) {
    e.preventDefault();
    
    const email = document.getElementById('register-email').value;
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    const uiCore = window.C2R_SYSTEM?.uiCore;
    const userCore = window.C2R_SYSTEM?.userCore;
    
    if (!userCore || !uiCore) return;
    
    // Validation côté client
    if (password !== confirmPassword) {
        uiCore.showNotification('❌ Les mots de passe ne correspondent pas', 'error');
        return;
    }
    
    if (password.length < 6) {
        uiCore.showNotification('❌ Le mot de passe doit contenir au moins 6 caractères', 'error');
        return;
    }
    
    const newUser = userCore.createUser({
        email,
        username,
        password,
        role: 'user'
    });
    
    if (newUser) {
        uiCore.showNotification(`${IconManager.getIcon('check')} Inscription réussie! Vous pouvez maintenant vous connecter.`, 'success');
        showAuthModal('login');
        
        // Pré-remplir l'email de connexion
        document.getElementById('login-email').value = email;
    } else {
        uiCore.showNotification('❌ Erreur lors de l\'inscription. Email peut-être déjà utilisé.', 'error');
    }
}

/**
 * Gérer la déconnexion
 */
function handleLogout() {
    const userCore = window.C2R_SYSTEM?.userCore;
    const uiCore = window.C2R_SYSTEM?.uiCore;
    
    if (!userCore || !uiCore) return;
    
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        userCore.logout();
        uiCore.showNotification(`${IconManager.getIcon('signout')} Déconnexion réussie`, 'info');
        
        // Mettre à jour l'interface
        uiCore.updateUserInterface(null);
        updateConnectionStatus(false);
        clearSidebarApps();
        
        // Naviguer vers l'accueil
        uiCore.navigateToPage('home');
        
        // Afficher la modal de connexion après un délai
        setTimeout(() => {
            showAuthModal('login');
        }, 1500);
    }
}

/**
 * Mettre à jour la sidebar avec les applications installées
 */
function updateSidebarApps() {
    const sidebarApps = document.getElementById('sidebar-apps');
    const appCore = window.C2R_SYSTEM?.appCore;
    const userCore = window.C2R_SYSTEM?.userCore;
    
    if (!sidebarApps || !appCore || !userCore) return;
    
    const currentUser = userCore.getCurrentUser();
    if (!currentUser) {
        clearSidebarApps();
        return;
    }
    
    const installedApps = appCore.getInstalledApps();
    
    if (installedApps.length === 0) {
        sidebarApps.innerHTML = '<p class="no-apps">Aucune application installée</p>';
    } else {
        sidebarApps.innerHTML = installedApps.map(app => `
            <div class="sidebar-app-item" onclick="window.C2R_SYSTEM.uiCore.launchApp('${app.id}')" title="Lancer ${app.name}">
                <span class="app-icon">${app.icon}</span>
                <span class="app-name">${app.name}</span>
            </div>
        `).join('');
    }
}

/**
 * Vider la sidebar des applications
 */
function clearSidebarApps() {
    const sidebarApps = document.getElementById('sidebar-apps');
    if (sidebarApps) {
        sidebarApps.innerHTML = '';
    }
}

/**
 * Utilitaires globaux pour le debug
 */
window.C2R_DEBUG = {
    getSystemStatus: () => window.C2R_SYSTEM?.integration?.getSystemStatus(),
    getConfig: () => window.C2R_CONFIG,
    getCurrentUser: () => window.C2R_SYSTEM?.userCore?.getCurrentUser(),
    getInstalledApps: () => window.C2R_SYSTEM?.appCore?.getInstalledApps(),
    restart: () => window.C2R_SYSTEM?.integration?.restart(),
    
    // Fonctions de test
    testNotification: (message, type) => {
        window.C2R_SYSTEM?.uiCore?.showNotification(message || 'Test notification', type || 'info');
    },
    
    installAllApps: () => {
        const appCore = window.C2R_SYSTEM?.appCore;
        if (appCore) {
            appCore.getAvailableApps().forEach(app => {
                if (!appCore.isInstalled(app.id)) {
                    appCore.installApp(app.id);
                }
            });
            window.C2R_SYSTEM?.uiCore?.refreshApplicationsList();
            window.C2R_SYSTEM?.uiCore?.updateSidebarApps();
        }
    },
    
    exportUserData: () => {
        const profileSystem = window.C2R_SYSTEM?.profileSystem;
        return profileSystem?.exportProfile();
    },
    
    showLoginModal: () => showAuthModal('login'),
    hideLoginModal: () => hideAuthModal()
};

// Message de bienvenue développeur
console.log(`
🎯 C2R OS v1.0.0 "Genesis" - Développement
┌─────────────────────────────────────────┐
│ 🔧 Mode Debug activé                   │
│ 💻 Tapez C2R_DEBUG pour les utilitaires│
│ 📚 Documentation: ./docs/              │
│ 🐛 Logs système activés                │
└─────────────────────────────────────────┘
`);

// Exposer les fonctions principales globalement pour compatibilité
window.c2ros = {
    installApp: window.handleAppInstall,
    uninstallApp: window.handleAppUninstall,
    system: () => window.C2R_SYSTEM,
    showLogin: () => showAuthModal('login'),
    logout: handleLogout
};

// Rendre les fonctions disponibles globalement
window.showAuthModal = showAuthModal;
window.hideAuthModal = hideAuthModal;
window.updateSidebarApps = updateSidebarApps;
window.updateConnectionStatus = updateConnectionStatus;
