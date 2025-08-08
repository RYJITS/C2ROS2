/**
 * C2R OS - Core d'Applications
 * Module: AppCore
 * Version: 1.0.0
 * Description: Chargement dynamique des applications modulaires
 */

class AppCore {
    constructor() {
        this.config = window.C2R_CONFIG;
        this.availableApps = new Map();
        this.loadedApps = new Map();
        this.currentApp = null;
        
        this.init();
    }
    
    /**
     * Initialisation du module
     */
    init() {
        this.registerBuiltinApps();
        this.loadAppStore();
    }
    
    /**
     * Enregistrer les applications intégrées
     */
    registerBuiltinApps() {
        const builtinApps = [
            {
                id: 'notepad',
                name: 'Bloc-Notes IA',
                description: 'Éditeur de texte simple et efficace avec assistance IA',
                icon: IconManager.getIcon('note'),
                category: 'Productivité',
                type: 'application',
                version: '1.0.0',
                author: 'C2R Team',
                size: '45 KB',
                permissions: ['storage'],
                tags: ['éditeur', 'texte', 'ia'],
                builtin: true,
                path: './apps/notepad/'
            },
                        {
                id: 'voicenotes',
                name: 'Notes Vocales C2R',
                description: 'Enregistrement vocal avec transcription live et actions IA',
                icon: IconManager.getIcon('microphone'),
                category: 'Productivité',
                type: 'application',
                version: '1.0.0',
                author: 'C2R Team',
                size: '40 KB',
                permissions: ['microphone', 'storage', 'network'],
                tags: ['audio', 'notes', 'whisper'],
                builtin: true,
                path: './apps/voicenotes/'
            },
            {
                id: 'todolist',
                name: 'To-Do Liste',
                description: 'Gestionnaire de tâches et rappels intelligent',
                icon: IconManager.getIcon('checkbox'),
                category: 'Productivité',
                type: 'application',
                version: '1.0.0',
                author: 'C2R Team',
                size: '38 KB',
                permissions: ['storage', 'notifications'],
                tags: ['tâches', 'organisation', 'rappels'],
                builtin: true,
                path: './apps/todolist/'
            },
            {
                id: 'promptgen',
                name: 'Générateur de Prompts IA',
                description: 'Création d\'instructions automatisées pour l\'IA',
                icon: IconManager.getIcon('robot'),
                category: 'Développement',
                type: 'application',
                version: '1.0.0',
                author: 'C2R Team',
                size: '52 KB',
                permissions: ['clipboard'],
                tags: ['ia', 'prompts', 'automatisation'],
                builtin: true,
                path: './apps/promptgen/'
            },
            {
                id: 'markdownreader',
                name: 'Lecteur Markdown',
                description: 'Rendu de fichiers Markdown par drag & drop',
                icon: IconManager.getIcon('file'),
                category: 'Développement',
                type: 'application',
                version: '1.0.0',
                author: 'C2R Team',
                size: '65 KB',
                permissions: ['files'],
                tags: ['markdown', 'documentation', 'lecteur'],
                builtin: true,
                path: './apps/markdownreader/'
            },
            {
                id: 'htmlformatter',
                name: 'Formateur HTML',
                description: 'Interface de création HTML/CSS de base',
                icon: IconManager.getIcon('globe'),
                category: 'Développement',
                type: 'application',
                version: '1.0.0',
                author: 'C2R Team',
                size: '58 KB',
                permissions: ['clipboard'],
                tags: ['html', 'css', 'web', 'éditeur'],
                builtin: true,
                path: './apps/htmlformatter/'
            },
            {
                id: 'calculator',
                name: 'Calculatrice',
                description: 'Calculatrice scientifique avancée',
                icon: IconManager.getIcon('calculator'),
                category: 'Utilitaires',
                type: 'application',
                version: '1.0.0',
                author: 'C2R Team',
                size: '32 KB',
                permissions: [],
                tags: ['calcul', 'mathématiques', 'scientifique'],
                builtin: true,
                path: './apps/calculator/'
            },
            {
                id: 'weather',
                name: 'Météo',
                description: 'Prévisions météorologiques en temps réel',
                icon: IconManager.getIcon('weather'),
                category: 'Information',
                type: 'information',
                version: '1.0.0',
                author: 'C2R Team',
                size: '42 KB',
                permissions: ['geolocation', 'network'],
                tags: ['météo', 'prévisions', 'température'],
                builtin: true,
                path: './apps/weather/'
            },
            {
                id: 'timer',
                name: 'Minuteur',
                description: 'Minuteur et chronomètre personnalisable',
                icon: IconManager.getIcon('timer'),
                category: 'Utilitaires',
                type: 'application',
                version: '1.0.0',
                author: 'C2R Team',
                size: '28 KB',
                permissions: ['notifications'],
                tags: ['temps', 'minuteur', 'chronomètre'],
                builtin: true,
                path: './apps/timer/'
            },
            {
                id: 'chatgpt-training',
                name: 'Formation ChatGPT',
                description: 'Apprenez à utiliser ChatGPT avec exemples et quiz',
                icon: IconManager.getIcon('robot'),
                category: 'Formation',
                type: 'formation',
                version: '1.0.0',
                author: 'C2R Team',
                size: '55 KB',
                permissions: [],
                tags: ['chatgpt', 'formation', 'ia'],
                builtin: true,
                path: './apps/chatgpt-training/'
            },
            {
                id: 'jobsearch',
                name: 'Recherche d\'Emploi',
                description: 'Créez CV et lettres puis trouvez des offres',
                icon: IconManager.getIcon('briefcase'),
                category: 'Service',
                type: 'service',
                version: '1.0.0',
                author: 'C2R Team',
                size: '70 KB',
                permissions: ['network', 'storage'],
                tags: ['emploi', 'cv', 'lettre'],
                builtin: true,
                path: './apps/jobsearch/'
            },
            {
                id: 'chess',
                name: 'Échecs Pro',
                description: 'Échecs complets : roque, en passant, promotion, échec & mat, pat. SAN, FEN, flip, surlignage.',
                icon: IconManager.getIcon('chess'),
                category: 'Jeu',
                type: 'application',
                version: '1.0.0',
                author: 'C2R Team',
                size: '60 KB',
                permissions: ['network', 'storage'],
                tags: ['jeu', 'échecs', 'ia'],
                builtin: true,
                path: './apps/chess/',
                entry: 'apps/chess/chess.html',
                scripts: ['apps/chess/engine.js', 'apps/chess/chess.js'],
                styles: ['apps/chess/chess.css']
            },
        ];
        
        builtinApps.forEach(app => {
            this.availableApps.set(app.id, app);
        });
        
        console.log(`${builtinApps.length} applications intégrées enregistrées`);
    }
    
    /**
     * Obtenir toutes les applications disponibles
     * @returns {Array} Liste des applications
     */
    getAvailableApps() {
        return Array.from(this.availableApps.values());
    }
    
    /**
     * Obtenir une application par ID
     * @param {string} appId - ID de l'application
     * @returns {Object|null} Application
     */
    getApp(appId) {
        return this.availableApps.get(appId) || null;
    }
    
    /**
     * Charger une application
     * @param {string} appId - ID de l'application
     * @returns {Promise<Object>} Application chargée
     */
    async loadApp(appId) {
        try {
            const app = this.getApp(appId);
            if (!app) {
                throw new Error(`Application ${appId} non trouvée`);
            }
            
            // Vérifier si déjà chargée
            if (this.loadedApps.has(appId)) {
                return this.loadedApps.get(appId);
            }
            
            console.log(`Chargement de l'application ${app.name}...`);
            
            // Charger les fichiers de l'application
            const appFiles = await this.loadAppFiles(app);
            
            // Créer l'instance de l'application
            const appInstance = {
                ...app,
                html: appFiles.html,
                css: appFiles.css,
                js: appFiles.js,
                loaded: true,
                loadedAt: new Date().toISOString()
            };
            
            this.loadedApps.set(appId, appInstance);
            console.log(`Application ${app.name} chargée avec succès`);
            
            return appInstance;
            
        } catch (error) {
            console.error(`Erreur chargement application ${appId}:`, error);
            throw error;
        }
    }
    
    /**
     * Charger les fichiers d'une application
     * @param {Object} app - Application
     * @returns {Promise<Object>} Fichiers chargés
     */
    async loadAppFiles(app) {
        const files = {
            html: '',
            css: [],
            js: []
        };

        try {
            const htmlUrl = app.entry || `${app.path}app.html`;
            const htmlResponse = await fetch(htmlUrl);
            if (htmlResponse.ok) {
                files.html = await htmlResponse.text();
            }

            if (app.styles && app.styles.length) {
                files.css = app.styles.map(href => ({ href }));
            } else {
                const cssResponse = await fetch(`${app.path}app.css`);
                if (cssResponse.ok) {
                    files.css.push({ content: await cssResponse.text() });
                }
            }

            if (app.scripts && app.scripts.length) {
                files.js = app.scripts.map(src => ({ src, module: true }));
            } else {
                const jsResponse = await fetch(`${app.path}app.js`);
                if (jsResponse.ok) {
                    files.js.push({ content: await jsResponse.text() });
                }
            }

            return files;

        } catch (error) {
            console.error(`Erreur chargement fichiers pour ${app.name}:`, error);
            throw error;
        }
    }
    
    /**
     * Exécuter une application
     * @param {string} appId - ID de l'application
     * @param {HTMLElement} container - Conteneur
     * @returns {Promise<Object>} Instance de l'application
     */
    async runApp(appId, container) {
        try {
            const app = await this.loadApp(appId);
            
            // Nettoyer le conteneur
            container.innerHTML = '';
            
            // Injecter le CSS
            if (app.css && app.css.length) {
                app.css.forEach(style => {
                    if (style.href) {
                        const link = document.createElement('link');
                        link.rel = 'stylesheet';
                        link.href = style.href;
                        link.setAttribute('data-app', appId);
                        document.head.appendChild(link);
                    } else if (style.content) {
                        const styleElement = document.createElement('style');
                        styleElement.setAttribute('data-app', appId);
                        styleElement.textContent = style.content;
                        document.head.appendChild(styleElement);
                    }
                });
            }

            // Injecter le HTML
            if (app.html) {
                container.innerHTML = app.html;
            }

            // Exécuter le JavaScript
            if (app.js && app.js.length) {
                app.js.forEach(script => {
                    const scriptElement = document.createElement('script');
                    scriptElement.setAttribute('data-app', appId);
                    if (script.src) {
                        scriptElement.type = script.module ? 'module' : 'text/javascript';
                        scriptElement.src = script.src;
                    } else if (script.content) {
                        scriptElement.textContent = script.content;
                    }
                    document.head.appendChild(scriptElement);
                });
            }
            
            this.currentApp = app;
            console.log(`Application ${app.name} en cours d'exécution`);
            
            return app;
            
        } catch (error) {
            console.error(`Erreur exécution application ${appId}:`, error);
            throw error;
        }
    }
    
    /**
     * Arrêter une application
     * @param {string} appId - ID de l'application
     */
    stopApp(appId) {
        try {
            // Supprimer les styles
            const styleElements = document.querySelectorAll(`style[data-app="${appId}"]`);
            styleElements.forEach(el => el.remove());
            const linkElements = document.querySelectorAll(`link[data-app="${appId}"]`);
            linkElements.forEach(el => el.remove());

            // Supprimer les scripts
            const scriptElements = document.querySelectorAll(`script[data-app="${appId}"]`);
            scriptElements.forEach(el => el.remove());
            
            // Appeler la fonction de nettoyage si elle existe
            if (window[`${appId}Cleanup`]) {
                window[`${appId}Cleanup`]();
            }
            
            if (this.currentApp && this.currentApp.id === appId) {
                this.currentApp = null;
            }
            
            console.log(`Application ${appId} arrêtée`);
            
        } catch (error) {
            console.error(`Erreur arrêt application ${appId}:`, error);
        }
    }
    
    /**
     * Installer une application pour l'utilisateur actuel
     * @param {string} appId - ID de l'application
     * @returns {boolean} Succès
     */
    installApp(appId) {
        try {
            const userCore = window.C2R_SYSTEM?.userCore;
            if (!userCore || !userCore.getCurrentUser()) {
                throw new Error('Utilisateur non connecté');
            }
            
            const app = this.getApp(appId);
            if (!app) {
                throw new Error(`Application ${appId} non trouvée`);
            }
            
            const user = userCore.getCurrentUser();
            
            // Vérifier si déjà installée
            if (user.installedApps.includes(appId)) {
                throw new Error('Application déjà installée');
            }
            
            // Vérifier la limite d'applications
            if (user.installedApps.length >= this.config.apps.maxInstalled) {
                throw new Error(`Limite d'applications atteinte (${this.config.apps.maxInstalled})`);
            }
            
            // Installer l'application
            user.installedApps.push(appId);
            user.appOrder.push(appId);
            user.stats.appsInstalled++;
            user.stats.lastActivity = new Date().toISOString();
            
            userCore.saveUsers();
            userCore.saveCurrentUser();
            
            console.log(`Application ${app.name} installée pour ${user.email}`);
            
            // Mettre à jour la sidebar avec les applications
            if (window.C2R_SYSTEM?.uiCore) {
                window.C2R_SYSTEM.uiCore.updateSidebarApps();
            }
            
            return true;
            
        } catch (error) {
            console.error(`Erreur installation application ${appId}:`, error);
            return false;
        }
    }
    
    /**
     * Désinstaller une application
     * @param {string} appId - ID de l'application
     * @returns {boolean} Succès
     */
    uninstallApp(appId) {
        try {
            const userCore = window.C2R_SYSTEM?.userCore;
            if (!userCore || !userCore.getCurrentUser()) {
                throw new Error('Utilisateur non connecté');
            }
            
            const user = userCore.getCurrentUser();
            
            // Vérifier si installée
            const installedIndex = user.installedApps.indexOf(appId);
            if (installedIndex === -1) {
                throw new Error('Application non installée');
            }
            
            // Arrêter l'application si en cours
            this.stopApp(appId);
            
            // Désinstaller
            user.installedApps.splice(installedIndex, 1);
            
            const orderIndex = user.appOrder.indexOf(appId);
            if (orderIndex !== -1) {
                user.appOrder.splice(orderIndex, 1);
            }
            
            user.stats.appsInstalled--;
            user.stats.lastActivity = new Date().toISOString();
            
            userCore.saveUsers();
            userCore.saveCurrentUser();
            
            console.log(`Application ${appId} désinstallée pour ${user.email}`);
            
            // Mettre à jour la sidebar avec les applications
            if (window.C2R_SYSTEM?.uiCore) {
                window.C2R_SYSTEM.uiCore.updateSidebarApps();
            }
            
            return true;
            
        } catch (error) {
            console.error(`Erreur désinstallation application ${appId}:`, error);
            return false;
        }
    }
    
    /**
     * Obtenir les applications installées de l'utilisateur
     * @returns {Array} Applications installées
     */
    getInstalledApps() {
        const userCore = window.C2R_SYSTEM?.userCore;
        if (!userCore || !userCore.getCurrentUser()) {
            return [];
        }
        
        const user = userCore.getCurrentUser();
        const order = (user.appOrder && user.appOrder.length)
            ? user.appOrder
            : user.installedApps;

        return order
            .filter(appId => user.installedApps.includes(appId))
            .map(appId => this.getApp(appId))
            .filter(Boolean);
    }
    
    /**
     * Vérifier si une application est installée
     * @param {string} appId - ID de l'application
     * @returns {boolean} Installée
     */
    isInstalled(appId) {
        const userCore = window.C2R_SYSTEM?.userCore;
        if (!userCore || !userCore.getCurrentUser()) {
            return false;
        }
        
        const user = userCore.getCurrentUser();
        return user.installedApps.includes(appId);
    }
    
    /**
     * Réorganiser l'ordre des applications
     * @param {Array} newOrder - Nouvel ordre
     */
    reorderApps(newOrder) {
        const userCore = window.C2R_SYSTEM?.userCore;
        if (!userCore || !userCore.getCurrentUser()) {
            return;
        }
        
        const user = userCore.getCurrentUser();
        user.appOrder = newOrder.filter(appId => user.installedApps.includes(appId));
        user.stats.lastActivity = new Date().toISOString();

        userCore.saveUsers();
        userCore.saveCurrentUser();

        if (window.C2R_SYSTEM?.uiCore) {
            window.C2R_SYSTEM.uiCore.updateSidebarApps();
        }

        if (window.bottomNav) {
            window.bottomNav.updateAppsList();
        }

        if (window.uiMinimalRed) {
            window.uiMinimalRed.updateSidebarApps();
            window.uiMinimalRed.updateMobileAppsList();
        }
    }
    
    /**
     * Rechercher des applications
     * @param {string} query - Terme de recherche
     * @returns {Array} Applications trouvées
     */
    searchApps(query) {
        if (!query) return this.getAvailableApps();
        
        const searchTerm = query.toLowerCase();
        return this.getAvailableApps().filter(app =>
            app.name.toLowerCase().includes(searchTerm) ||
            app.description.toLowerCase().includes(searchTerm) ||
            app.category.toLowerCase().includes(searchTerm) ||
            (app.type && app.type.toLowerCase().includes(searchTerm)) ||
            app.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
    
    /**
     * Filtrer par catégorie
     * @param {string} category - Catégorie
     * @returns {Array} Applications de la catégorie
     */
    getAppsByCategory(category) {
        return this.getAvailableApps().filter(app => app.category === category);
    }

    /**
     * Filtrer par type
     * @param {string} type - Type d'application
     * @returns {Array} Applications du type
     */
    getAppsByType(type) {
        return this.getAvailableApps().filter(app => app.type === type);
    }
    
    /**
     * Charger le store depuis le stockage
     */
    loadAppStore() {
        try {
            const saved = localStorage.getItem(`${this.config.storage.prefix}app_store`);
            if (saved) {
                const storeData = JSON.parse(saved);
                // Fusionner avec les apps intégrées
                storeData.forEach(app => {
                    if (!app.builtin) {
                        this.availableApps.set(app.id, app);
                    }
                });
            }
        } catch (error) {
            console.error('Erreur chargement store:', error);
        }
    }
    
    /**
     * Sauvegarder le store
     */
    saveAppStore() {
        try {
            const customApps = this.getAvailableApps().filter(app => !app.builtin);
            localStorage.setItem(
                `${this.config.storage.prefix}app_store`,
                JSON.stringify(customApps)
            );
        } catch (error) {
            console.error('Erreur sauvegarde store:', error);
        }
    }
}

// Export global
window.AppCore = AppCore;
