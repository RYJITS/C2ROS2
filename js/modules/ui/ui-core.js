/**
 * C2R OS - Interface Utilisateur
 * Module: UICore
 * Version: 1.0.0
 * Description: Gestion des thèmes, navigation et interface responsive
 */

class UICore {
    constructor() {
        this.config = window.C2R_CONFIG;
        this.currentTheme = 'dark';
        this.sidebarOpen = false;
        this.currentPage = 'home';
        this.notifications = [];
        
        this.init();
    }
    
    /**
     * Initialisation du module UI
     */
    init() {
        this.setupEventListeners();
        this.initializeTheme();
        this.setupResponsive();
    }
    
    /**
     * Initialiser l'interface utilisateur
     */
    async initializeUI() {
        console.log('Initialisation interface utilisateur...');
        
        try {
            await this.loadUserPreferences();
            this.setupNavigation();
            this.setupModals();
            this.setupNotifications();
            this.updateUserInterface();
            
            console.log('Interface utilisateur initialisée');
            
        } catch (error) {
            console.error('Erreur initialisation UI:', error);
        }
    }
    
    /**
     * Configurer les écouteurs d'événements
     */
    setupEventListeners() {
        // Navigation
        document.addEventListener('click', (e) => {
            const pageLink = e.target.closest('[data-page]');
            if (pageLink) {
                e.preventDefault();
                const page = pageLink.dataset.page;
                this.navigateToPage(page);
            }
        });
        
        
        // Overlay mobile
        const overlay = document.getElementById('overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeSidebar());
        }
        
        // Bouton fermeture sidebar mobile
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeSidebar();
            });
        }
        
        // Gestion responsive
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Gestion des touches clavier
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
        
        // Fermeture automatique du menu mobile sur navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= this.config.ui.responsiveBreakpoint) {
                    this.closeSidebar();
                }
            });
        });
    }
    
    /**
     * Charger les préférences utilisateur
     */
    async loadUserPreferences() {
        const userCore = window.C2R_SYSTEM?.userCore;
        if (userCore && userCore.getCurrentUser()) {
            const user = userCore.getCurrentUser();
            const preferences = user.preferences;
            
            if (preferences) {
                this.applyPreferences(preferences);
            }
        }
    }
    
    /**
     * Appliquer les préférences utilisateur
     * @param {Object} preferences - Préférences
     */
    applyPreferences(preferences) {
        if (preferences.theme) {
            this.setTheme(preferences.theme);
        }
        
        if (preferences.sidebarPosition) {
            this.setSidebarPosition(preferences.sidebarPosition);
        }
        
        if (preferences.fontSize) {
            this.setFontSize(preferences.fontSize);
        }
        
        if (preferences.animations !== undefined) {
            this.setAnimations(preferences.animations);
        }
    }
    
    /**
     * Configurer la navigation
     */
    setupNavigation() {
        // Mettre à jour les états actifs
        this.updateNavigation();
        
        // Configurer les boutons d'action
        this.setupActionButtons();
    }
    
    /**
     * Configurer les boutons d'action
     */
    setupActionButtons() {
        // Bouton déconnexion
        const logoutBtns = document.querySelectorAll('.btn-logout');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleLogout();
            });
        });
        
        // Boutons de préférences
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('change', (e) => {
                const isDark = e.target.checked;
                this.setTheme(isDark ? 'dark' : 'light');
                this.savePreferences();
            });
        }
        
        const welcomeToggle = document.getElementById('welcome-toggle');
        if (welcomeToggle) {
            welcomeToggle.addEventListener('change', (e) => {
                this.setWelcomeMessage(e.target.checked);
                this.savePreferences();
            });
        }
        
        const sidebarPositionToggle = document.getElementById('sidebar-position-toggle');
        if (sidebarPositionToggle) {
            sidebarPositionToggle.addEventListener('change', (e) => {
                const isRight = e.target.checked;
                this.setSidebarPosition(isRight ? 'right' : 'left');
                this.savePreferences();
            });
        }
    }
    
    /**
     * Naviguer vers une page
     * @param {string} page - Page cible
     */
    navigateToPage(page) {
        // Masquer toutes les pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        
        // Afficher la page cible
        const targetPage = document.getElementById(`page-${page}`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = page;
            
            // Mettre à jour la navigation
            this.updateNavigation();
            
            // Actions spécifiques par page
            this.handlePageChange(page);
            
            // Fermer la sidebar sur mobile
            if (window.innerWidth <= this.config.ui.responsiveBreakpoint) {
                this.closeSidebar();
            }
        }
    }
    
    /**
     * Mettre à jour la navigation
     */
    updateNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        document.querySelectorAll(`[data-page="${this.currentPage}"]`).forEach(link => {
            link.classList.add('active');
        });
    }
    
    /**
     * Gérer le changement de page
     * @param {string} page - Nouvelle page
     */
    handlePageChange(page) {
        switch (page) {
            case 'store':
                this.refreshApplicationsList();
                break;
            case 'profile':
                this.refreshUserProfile();
                break;
            case 'admin':
                this.refreshAdminPanel();
                break;
            case 'home':
                this.refreshHomePage();
                break;
        }
    }
    
    /**
     * Rafraîchir la liste des applications
     */
    refreshApplicationsList() {
        const appCore = window.C2R_SYSTEM?.appCore;
        if (!appCore) return;
        
        const appsGrid = document.getElementById('apps-grid');
        if (!appsGrid) return;
        
        const apps = appCore.getAvailableApps();
        
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
                    <span>Date: ${app.version}</span>
                    <span>Taille: ${app.size}</span>
                </div>
                <div class="app-actions">
                    <button class="app-toggle-btn ${appCore.isInstalled(app.id) ? 'installed' : ''}"
                            onclick="window.C2R_SYSTEM.uiCore.toggleApp('${app.id}')"
                            aria-label="${appCore.isInstalled(app.id) ? 'Désinstaller' : 'Installer'}">
                        <span class="icon">${IconManager.getIcon(appCore.isInstalled(app.id) ? 'uninstall' : 'install')}</span>
                    </button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Installer ou désinstaller une application selon son état actuel
     * @param {string} appId - ID de l'application
     */
    toggleApp(appId) {
        const appCore = window.C2R_SYSTEM?.appCore;
        if (!appCore) return;

        if (appCore.isInstalled(appId)) {
            appCore.uninstallApp(appId);
            this.showNotification('Application désinstallée', 'warning');
        } else {
            appCore.installApp(appId);
            this.showNotification('Application installée', 'success');
        }

        this.refreshApplicationsList();
        if (this.currentPage === 'profile') {
            this.refreshUserProfile();
        }
    }
    
    /**
     * Rafraîchir le profil utilisateur
     */
    refreshUserProfile() {
        const userCore = window.C2R_SYSTEM?.userCore;
        const appCore = window.C2R_SYSTEM?.appCore;
        
        if (!userCore || !appCore) return;
        
        const user = userCore.getCurrentUser();
        if (!user) return;
        
        // Mettre à jour les informations utilisateur
        const emailElement = document.getElementById('user-email');
        const roleElement = document.getElementById('user-role');
        
        if (emailElement) emailElement.textContent = user.email;
        if (roleElement) roleElement.textContent = user.role === 'admin' ? 'Administrateur' : 'Utilisateur';
        
        // Mettre à jour les applications installées
        const appsList = document.getElementById('installed-apps-list');
        if (appsList) {
            const installedApps = appCore.getInstalledApps();

            if (installedApps.length === 0) {
                appsList.innerHTML = '<p class="text-muted">Aucune application installée</p>';
            } else {
                appsList.innerHTML = installedApps.map(app => `
                    <div class="app-item" draggable="true" data-app-id="${app.id}">
                        <div class="app-item-info">
                            <span class="app-icon">${app.icon}</span>
                            <span>${app.name}</span>
                        </div>
                        <button class="btn btn-small btn-ghost" onclick="window.C2R_SYSTEM.appCore.uninstallApp('${app.id}'); window.C2R_SYSTEM.uiCore.refreshUserProfile();" aria-label="Désinstaller ${app.name}">
                            ${IconManager.getIcon('uninstall')}
                        </button>
                    </div>
                `).join('');
                if (window.setupDragAndDrop) {
                    window.setupDragAndDrop();
                }
            }
        }
        
        // Mettre à jour les préférences
        this.updatePreferencesUI(user.preferences);
    }
    
    /**
     * Mettre à jour l'UI des préférences
     * @param {Object} preferences - Préférences
     */
    updatePreferencesUI(preferences) {
        const themeToggle = document.getElementById('theme-toggle');
        const welcomeToggle = document.getElementById('welcome-toggle');
        const sidebarToggle = document.getElementById('sidebar-position-toggle');
        
        if (themeToggle) {
            themeToggle.checked = preferences.theme === 'dark';
        }
        
        if (welcomeToggle) {
            welcomeToggle.checked = preferences.showWelcomeMessage;
        }
        
        if (sidebarToggle) {
            sidebarToggle.checked = preferences.sidebarPosition === 'right';
        }
    }
    
    /**
     * Rafraîchir le panneau admin
     */
    refreshAdminPanel() {
        const userCore = window.C2R_SYSTEM?.userCore;
        if (!userCore || !userCore.isAdmin()) return;
        
        try {
            const users = userCore.getAllUsers();
            const tbody = document.getElementById('users-table-body');
            
            if (tbody) {
                tbody.innerHTML = users.map(user => `
                    <tr>
                        <td>${user.email}</td>
                        <td>
                            <span class="badge ${user.role === 'admin' ? 'badge-warning' : 'badge-info'}">
                                ${user.role === 'admin' ? IconManager.getIcon('admin') + ' Admin' : IconManager.getIcon('profile') + ' Utilisateur'}
                            </span>
                        </td>
                        <td>${user.lastLogin ? new Date(user.lastLogin).toLocaleString('fr-FR') : 'Jamais'}</td>
                        <td>
                            <button class="btn btn-small btn-secondary" onclick="window.C2R_SYSTEM.uiCore.toggleUserRole('${user.id}')" aria-label="Modifier ${user.email}">
                                ${IconManager.getIcon('edit')} Modifier
                            </button>
                            ${user.id !== userCore.getCurrentUser().id ? 
                                `<button class="btn btn-small btn-danger" onclick="window.C2R_SYSTEM.uiCore.deleteUser('${user.id}')" aria-label="Supprimer ${user.email}">
                                    ${IconManager.getIcon('uninstall')} Supprimer
                                </button>` : ''
                            }
                        </td>
                    </tr>
                `).join('');
            }
            
            // Mettre à jour les statistiques
            this.updateSystemStats(users);
            
        } catch (error) {
            console.error('Erreur refresh admin panel:', error);
        }
    }
    
    /**
     * Mettre à jour les statistiques système
     * @param {Array} users - Liste des utilisateurs
     */
    updateSystemStats(users) {
        const appCore = window.C2R_SYSTEM?.appCore;
        
        const activeUsersEl = document.getElementById('active-users');
        const totalInstallationsEl = document.getElementById('total-installations');
        const lastUpdateEl = document.getElementById('last-update');
        
        if (activeUsersEl) {
            activeUsersEl.textContent = users.length;
        }
        
        if (totalInstallationsEl && appCore) {
            const totalInstallations = users.reduce((total, user) => total + user.installedApps.length, 0);
            totalInstallationsEl.textContent = totalInstallations;
        }
        
        if (lastUpdateEl) {
            lastUpdateEl.textContent = new Date().toLocaleDateString('fr-FR');
        }
    }
    
    /**
     * Basculer le rôle d'un utilisateur
     * @param {string} userId - ID utilisateur
     */
    toggleUserRole(userId) {
        const userCore = window.C2R_SYSTEM?.userCore;
        if (!userCore || !userCore.isAdmin()) return;
        
        try {
            const users = userCore.getAllUsers();
            const user = users.find(u => u.id === userId);
            
            if (user) {
                const newRole = user.role === 'admin' ? 'user' : 'admin';
                if (confirm(`Changer le rôle de ${user.email} vers ${newRole} ?`)) {
                    user.role = newRole;
                    userCore.saveUsers();
                    this.refreshAdminPanel();
                    this.showNotification(`Rôle de ${user.email} mis à jour`, 'success');
                }
            }
        } catch (error) {
            console.error('Erreur modification rôle:', error);
            this.showNotification('Erreur lors de la modification', 'error');
        }
    }
    
    /**
     * Supprimer un utilisateur
     * @param {string} userId - ID utilisateur
     */
    deleteUser(userId) {
        const userCore = window.C2R_SYSTEM?.userCore;
        if (!userCore || !userCore.isAdmin()) return;
        
        try {
            const users = userCore.getAllUsers();
            const user = users.find(u => u.id === userId);
            
            if (user && confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.email} ?`)) {
                if (userCore.deleteUser(userId)) {
                    this.refreshAdminPanel();
                    this.showNotification(`Utilisateur ${user.email} supprimé`, 'warning');
                }
            }
        } catch (error) {
            console.error('Erreur suppression utilisateur:', error);
            this.showNotification('Erreur lors de la suppression', 'error');
        }
    }
    
    /**
     * Rafraîchir la page d'accueil
     */
    refreshHomePage() {
        // Mettre à jour le conseil du jour
        this.updateDailyTip();
        
        // Mettre à jour les informations de version
        const config = window.C2R_SYSTEM?.config;
        if (config) {
            const versionEl = document.querySelector('.system-version');
            if (versionEl) {
                const version = config.getVersionInfo();
                versionEl.textContent = `${config.system.name} v${version.version} – Build ${version.build}`;
            }
        }
    }
    
    /**
     * Mettre à jour le conseil du jour
     */
    updateDailyTip() {
        const tips = [
            "Explorez les nouvelles applications disponibles dans le Store pour enrichir votre expérience.",
            "Vous pouvez réorganiser vos applications installées par glisser-déposer dans la section Profil.",
            "Le thème sombre peut être activé/désactivé à tout moment dans vos préférences.",
            "Les administrateurs ont accès à des outils de gestion avancés dans la section Configuration.",
            "Utilisez la barre de recherche du Store pour trouver rapidement les applications dont vous avez besoin.",
            "Personnalisez votre expérience en modifiant la position de la barre latérale.",
            "Vos préférences sont automatiquement sauvegardées à chaque modification."
        ];
        
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        const tipElement = document.querySelector('#daily-tip p');
        if (tipElement) {
            tipElement.textContent = randomTip;
        }
    }
    
    /**
     * Gérer la déconnexion
     */
    handleLogout() {
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            const userCore = window.C2R_SYSTEM?.userCore;
            if (userCore) {
                userCore.logout();
                this.showNotification('Déconnexion en cours...', 'info');
                
                setTimeout(() => {
                    this.updateUserInterface(null);
                    this.navigateToPage('home');
                }, 1500);
            }
        }
    }
    
    /**
     * Mettre à jour l'interface utilisateur
     * @param {Object} user - Utilisateur actuel
     */
    updateUserInterface(user) {
        // Afficher/masquer les éléments selon l'état de connexion
        const adminElements = document.querySelectorAll('.admin-only');
        const userElements = document.querySelectorAll('.user-only');
        
        if (user) {
            // Utilisateur connecté
            if (user.role === 'admin') {
                adminElements.forEach(el => el.style.display = 'block');
            } else {
                adminElements.forEach(el => el.style.display = 'none');
            }
            
            userElements.forEach(el => el.style.display = 'block');
            
            // Appliquer les préférences
            this.applyPreferences(user.preferences);
            
            // Mettre à jour la barre latérale avec les applications
            this.updateSidebarApps();
            
        } else {
            // Utilisateur déconnecté
            adminElements.forEach(el => el.style.display = 'none');
            userElements.forEach(el => el.style.display = 'none');
            this.clearSidebarApps();
        }
        
        // Rafraîchir la page actuelle
        this.handlePageChange(this.currentPage);
    }
    
    /**
     * Mettre à jour les applications dans la barre latérale
     */
    updateSidebarApps() {
        const appCore = window.C2R_SYSTEM?.appCore;
        if (!appCore) return;
        
        const sidebarApps = document.getElementById('sidebar-apps');
        if (!sidebarApps) return;
        
        const installedApps = appCore.getInstalledApps();
        
        if (installedApps.length === 0) {
            sidebarApps.innerHTML = '<p class="no-apps">Aucune application installée</p>';
            return;
        }
        
        sidebarApps.innerHTML = installedApps.map(app => `
            <div class="sidebar-app-item" onclick="window.C2R_SYSTEM.uiCore.launchApp('${app.id}')" title="Lancer ${app.name}">
                <span class="app-icon">${app.icon}</span>
                <span class="app-name">${app.name}</span>
            </div>
        `).join('');
    }
    
    /**
     * Vider les applications de la barre latérale
     */
    clearSidebarApps() {
        const sidebarApps = document.getElementById('sidebar-apps');
        if (sidebarApps) {
            sidebarApps.innerHTML = '';
        }
    }
    
    /**
     * Lancer une application
     * @param {string} appId - ID de l'application
     */
    launchApp(appId) {
        const appCore = window.C2R_SYSTEM?.appCore;
        if (!appCore) return;
        
        const app = appCore.getApp(appId);
        if (!app) {
            this.showNotification('Application non trouvée', 'error');
            return;
        }
        
        if (!appCore.isInstalled(appId)) {
            this.showNotification('Application non installée', 'error');
            return;
        }
        
        this.showNotification(`Lancement de ${app.name}...`, 'info');
        
        // Charger et afficher l'application dans une modal ou zone dédiée
        this.loadAppContent(app);
    }
    
    /**
     * Charger le contenu d'une application
     * @param {Object} app - Application à charger
     */
    async loadAppContent(app) {
        try {
            // Créer une modal pour l'application
            const appModal = this.createAppModal(app);
            document.body.appendChild(appModal);
            
            // Charger le contenu HTML de l'application
            const response = await fetch(`apps/${app.id}/app.html`);
            if (!response.ok) {
                throw new Error(`Erreur chargement ${app.name}`);
            }
            
            const htmlContent = await response.text();
            const appContent = appModal.querySelector('.app-modal-content');
            appContent.innerHTML = htmlContent;
            IconManager.inject(appContent);
            
            // Charger le CSS de l'application
            await this.loadAppCSS(app.id);
            
            // Charger et exécuter le JavaScript de l'application
            await this.loadAppJS(app.id);
            
            // Afficher la modal
            appModal.classList.add('show');
            
            this.showNotification(`${app.name} lancée avec succès`, 'success');
            
        } catch (error) {
            console.error('Erreur lancement application:', error);
            this.showNotification(`Erreur lors du lancement de ${app.name}`, 'error');
        }
    }
    
    /**
     * Créer une modal pour l'application
     * @param {Object} app - Application
     * @returns {HTMLElement} Modal
     */
    createAppModal(app) {
        const modal = document.createElement('div');
        modal.className = 'app-modal';
        modal.id = `app-modal-${app.id}`;
        
        modal.innerHTML = `
            <div class="app-modal-overlay" onclick="window.C2R_SYSTEM.uiCore.closeApp('${app.id}')"></div>
            <div class="app-modal-window">
                <div class="app-modal-header">
                    <div class="app-modal-title">
                        <span class="app-icon">${app.icon}</span>
                        <span>${app.name}</span>
                    </div>
                    <div class="app-modal-controls">
                        <button class="app-modal-btn minimize" onclick="window.C2R_SYSTEM.uiCore.minimizeApp('${app.id}')" title="Réduire">−</button>
                        <button class="app-modal-btn maximize" onclick="window.C2R_SYSTEM.uiCore.maximizeApp('${app.id}')" title="Agrandir">□</button>
                        <button class="app-modal-btn close" onclick="window.C2R_SYSTEM.uiCore.closeApp('${app.id}')" title="Fermer">×</button>
                    </div>
                </div>
                <div class="app-modal-content">
                    <div class="app-loading">
                        <div class="loader"></div>
                        <p>Chargement de ${app.name}...</p>
                    </div>
                </div>
            </div>
        `;
        
        return modal;
    }
    
    /**
     * Charger le CSS d'une application
     * @param {string} appId - ID de l'application
     */
    async loadAppCSS(appId) {
        return new Promise((resolve, reject) => {
            // Vérifier si le CSS n'est pas déjà chargé
            if (document.getElementById(`app-css-${appId}`)) {
                resolve();
                return;
            }
            
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `apps/${appId}/app.css`;
            link.id = `app-css-${appId}`;
            
            link.onload = () => resolve();
            link.onerror = () => reject(new Error(`Erreur chargement CSS ${appId}`));
            
            document.head.appendChild(link);
        });
    }
    
    /**
     * Charger le JavaScript d'une application
     * @param {string} appId - ID de l'application
     */
    async loadAppJS(appId) {
        return new Promise((resolve, reject) => {
            // Vérifier si le JS n'est pas déjà chargé
            if (document.getElementById(`app-js-${appId}`)) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = `apps/${appId}/app.js`;
            script.id = `app-js-${appId}`;
            
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Erreur chargement JS ${appId}`));
            
            document.head.appendChild(script);
        });
    }
    
    /**
     * Fermer une application
     * @param {string} appId - ID de l'application
     */
    closeApp(appId) {
        const modal = document.getElementById(`app-modal-${appId}`);
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
                
                // Nettoyer les ressources si l'application a une fonction cleanup
                const cleanupFunction = window[`${appId}Cleanup`];
                if (typeof cleanupFunction === 'function') {
                    cleanupFunction();
                }
            }, 300);
        }
    }
    
    /**
     * Réduire une application
     * @param {string} appId - ID de l'application
     */
    minimizeApp(appId) {
        const modal = document.getElementById(`app-modal-${appId}`);
        if (modal) {
            modal.classList.add('minimized');
            this.showNotification('Application réduite', 'info', 1000);
        }
    }
    
    /**
     * Agrandir une application
     * @param {string} appId - ID de l'application
     */
    maximizeApp(appId) {
        const modal = document.getElementById(`app-modal-${appId}`);
        if (modal) {
            modal.classList.toggle('maximized');
        }
    }
    
    /**
     * Définir le thème
     * @param {string} theme - Thème (dark/light)
     */
    setTheme(theme) {
        document.body.className = `theme-${theme}`;
        this.currentTheme = theme;
    }
    
    /**
     * Définir la position de la sidebar
     * @param {string} position - Position (left/right)
     */
    setSidebarPosition(position) {
        if (position === 'right') {
            document.body.classList.add('sidebar-right');
        } else {
            document.body.classList.remove('sidebar-right');
        }
    }
    
    /**
     * Définir l'affichage du message d'accueil
     * @param {boolean} show - Afficher
     */
    setWelcomeMessage(show) {
        const dailyTip = document.getElementById('daily-tip');
        if (dailyTip) {
            dailyTip.style.display = show ? 'block' : 'none';
        }
    }
    
    /**
     * Définir la taille de police
     * @param {string} size - Taille (small/medium/large)
     */
    setFontSize(size) {
        document.body.setAttribute('data-font-size', size);
    }
    
    /**
     * Définir les animations
     * @param {boolean} enabled - Activées
     */
    setAnimations(enabled) {
        document.body.setAttribute('data-animations', enabled ? 'enabled' : 'disabled');
    }
    
    /**
     * Basculer la sidebar
     */
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');

        if (sidebar && overlay) {
            const isOpen = sidebar.classList.contains('open');

            if (isOpen) {
                this.closeSidebar();
            } else {
                this.openSidebar();
            }
        }
    }
    
    /**
     * Ouvrir la sidebar
     */
    openSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');

        sidebar?.classList.add('open');
        overlay?.classList.add('show');
        
        this.sidebarOpen = true;
    }
    
    /**
     * Fermer la sidebar
     */
    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');

        sidebar?.classList.remove('open');
        overlay?.classList.remove('show');
        
        this.sidebarOpen = false;
    }
    
    /**
     * Gérer le redimensionnement
     */
    handleResize() {
        if (window.innerWidth > this.config.ui.responsiveBreakpoint) {
            this.closeSidebar();
        }
    }
    
    /**
     * Gérer les raccourcis clavier
     * @param {KeyboardEvent} e - Événement clavier
     */
    handleKeyboard(e) {
        // Échap pour fermer la sidebar
        if (e.key === 'Escape') {
            this.closeSidebar();
        }
        
        // Ctrl+/ pour basculer la sidebar
        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            this.toggleSidebar();
        }
    }
    
    /**
     * Sauvegarder les préférences
     */
    savePreferences() {
        const userCore = window.C2R_SYSTEM?.userCore;
        if (userCore && userCore.getCurrentUser()) {
            const user = userCore.getCurrentUser();
            const preferences = {
                theme: this.currentTheme,
                sidebarPosition: document.body.classList.contains('sidebar-right') ? 'right' : 'left',
                showWelcomeMessage: document.getElementById('welcome-toggle')?.checked ?? true,
                fontSize: document.body.getAttribute('data-font-size') || 'medium',
                animations: document.body.getAttribute('data-animations') !== 'disabled'
            };
            
            userCore.updatePreferences(preferences);
            
            // Émettre l'événement de changement de préférences
            const integration = window.C2R_SYSTEM?.integration;
            if (integration) {
                integration.emitEvent('preferencesChanged', preferences);
            }
        }
    }
    
    /**
     * Initialiser le thème
     */
    initializeTheme() {
        const userCore = window.C2R_SYSTEM?.userCore;
        if (userCore && userCore.getCurrentUser()) {
            const user = userCore.getCurrentUser();
            this.setTheme(user.preferences.theme || 'dark');
        } else {
            this.setTheme(this.config.themes.default);
        }
    }
    
    /**
     * Configurer la responsivité
     */
    setupResponsive() {
        // Gérer le redimensionnement initial
        this.handleResize();
    }
    
    /**
     * Configurer les modales
     */
    setupModals() {
        // Implémenter les modales si nécessaire
    }
    
    /**
     * Configurer les notifications
     */
    setupNotifications() {
        // Créer le conteneur de notifications s'il n'existe pas
        if (!document.getElementById('notifications-container')) {
            const container = document.createElement('div');
            container.id = 'notifications-container';
            container.className = 'notifications-container';
            document.body.appendChild(container);
        }
    }
    
    /**
     * Afficher une notification
     * @param {string} message - Message
     * @param {string} type - Type (success/error/warning/info)
     * @param {number} duration - Durée en ms
     */
    showNotification(message, type = 'info', duration = 3000) {
        const container = document.getElementById('notifications-container');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Fermer">&times;</button>
        `;
        
        // Ajouter les styles inline pour l'animation
        notification.style.cssText = `
            transform: translateX(100%);
            transition: var(--c2r-transition);
        `;
        
        container.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Bouton fermeture
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        // Suppression automatique
        setTimeout(() => {
            this.removeNotification(notification);
        }, duration);
        
        // Gérer la limite de notifications
        this.manageNotificationsLimit();
    }
    
    /**
     * Supprimer une notification
     * @param {HTMLElement} notification - Élément notification
     */
    removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    /**
     * Gérer la limite de notifications
     */
    manageNotificationsLimit() {
        const container = document.getElementById('notifications-container');
        if (!container) return;
        
        const notifications = container.querySelectorAll('.notification');
        const maxNotifications = this.config.ui.maxNotifications;
        
        if (notifications.length > maxNotifications) {
            const excess = notifications.length - maxNotifications;
            for (let i = 0; i < excess; i++) {
                this.removeNotification(notifications[i]);
            }
        }
    }
}

// Export global
window.UICore = UICore;
