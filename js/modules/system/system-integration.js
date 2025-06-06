/**
 * C2R OS - Intégration Système
 * Module: SystemIntegration
 * Version: 1.0.0
 * Description: Coordination et intégration de tous les modules du système
 */

class SystemIntegration {
    constructor() {
        this.modules = new Map();
        this.initialized = false;
        this.bootSequence = [];
        this.systemReady = false;
        
        this.init();
    }
    
    /**
     * Initialisation du système d'intégration
     */
    async init() {
        console.log('🚀 C2R OS - Démarrage du système...');
        
        try {
            await this.loadCoreModules();
            await this.startBootSequence();
            await this.setupEventListeners();
            await this.finalizeSystem();
            
            this.systemReady = true;
            this.notifySystemReady();
            
            console.log('✅ C2R OS - Système prêt');
            
        } catch (error) {
            console.error('❌ Erreur initialisation système:', error);
            this.handleSystemError(error);
        }
    }
    
    /**
     * Charger les modules principaux
     */
    async loadCoreModules() {
        console.log('📦 Chargement des modules principaux...');
        
        const coreModules = [
            {
                name: 'config',
                class: CoreConfig,
                instance: window.C2R_CONFIG,
                required: true
            },
            {
                name: 'userCore',
                class: UserCore,
                instance: null,
                required: true
            },
            {
                name: 'appCore',
                class: AppCore,
                instance: null,
                required: true
            },
            {
                name: 'uiCore',
                class: UICore,
                instance: null,
                required: true
            },
            {
                name: 'profileSystem',
                class: ProfileSystem,
                instance: null,
                required: true
            }
        ];
        
        for (const moduleInfo of coreModules) {
            try {
                if (!moduleInfo.instance && moduleInfo.class) {
                    console.log(`  ⚡ Initialisation ${moduleInfo.name}...`);
                    moduleInfo.instance = new moduleInfo.class();
                }
                
                this.modules.set(moduleInfo.name, moduleInfo.instance);
                this.bootSequence.push(moduleInfo.name);
                
                console.log(`  ✅ ${moduleInfo.name} chargé`);
                
            } catch (error) {
                console.error(`  ❌ Erreur chargement ${moduleInfo.name}:`, error);
                if (moduleInfo.required) {
                    throw new Error(`Module requis ${moduleInfo.name} non disponible`);
                }
            }
        }
        
        // Rendre les modules accessibles globalement
        window.C2R_SYSTEM = {
            config: this.modules.get('config'),
            userCore: this.modules.get('userCore'),
            appCore: this.modules.get('appCore'),
            uiCore: this.modules.get('uiCore'),
            profileSystem: this.modules.get('profileSystem'),
            integration: this
        };
    }
    
    /**
     * Séquence de démarrage
     */
    async startBootSequence() {
        console.log('🔄 Séquence de démarrage...');
        
        // 1. Vérifier la configuration
        const config = this.modules.get('config');
        if (!config || !config.validate()) {
            throw new Error('Configuration système invalide');
        }
        
        // 2. Initialiser le système utilisateur
        const userCore = this.modules.get('userCore');
        if (userCore) {
            console.log('  👤 Système utilisateur initialisé');
        }
        
        // 3. Charger les applications
        const appCore = this.modules.get('appCore');
        if (appCore) {
            console.log(`  📱 ${appCore.getAvailableApps().length} applications disponibles`);
        }
        
        // 4. Initialiser l'interface
        const uiCore = this.modules.get('uiCore');
        if (uiCore) {
            await uiCore.initializeUI();
            console.log('  🎨 Interface utilisateur initialisée');
        }
        
        // 5. Configurer les profils
        const profileSystem = this.modules.get('profileSystem');
        if (profileSystem) {
            console.log('  ⚙️ Système de profils configuré');
        }
        
        console.log('✅ Séquence de démarrage terminée');
    }
    
    /**
     * Configurer les écouteurs d'événements système
     */
    async setupEventListeners() {
        console.log('🔗 Configuration des événements système...');
        
        // Écouteur de changement d'utilisateur
        this.addEventListener('userChanged', (user) => {
            this.handleUserChange(user);
        });
        
        // Écouteur d'installation d'application
        this.addEventListener('appInstalled', (appId) => {
            this.handleAppInstallation(appId);
        });
        
        // Écouteur de changement de préférences
        this.addEventListener('preferencesChanged', (preferences) => {
            this.handlePreferencesChange(preferences);
        });
        
        // Écouteur d'erreurs système
        this.addEventListener('systemError', (error) => {
            this.handleSystemError(error);
        });
        
        // Gestion des erreurs JavaScript globales
        window.addEventListener('error', (event) => {
            this.logError('JavaScript Error', event.error);
        });
        
        // Gestion des erreurs de promesses non gérées
        window.addEventListener('unhandledrejection', (event) => {
            this.logError('Unhandled Promise Rejection', event.reason);
        });
        
        console.log('✅ Événements système configurés');
    }
    
    /**
     * Finaliser l'initialisation du système
     */
    async finalizeSystem() {
        console.log('🏁 Finalisation du système...');
        
        // Vérifier l'intégrité du système
        this.performSystemCheck();
        
        // Nettoyer les données obsolètes
        this.cleanupObsoleteData();
        
        // Afficher les informations de version
        this.displayVersionInfo();
        
        // Démarrer la surveillance du système
        this.startSystemMonitoring();
        
        this.initialized = true;
        console.log('✅ Système finalisé');
    }
    
    /**
     * Gestionnaire de changement d'utilisateur
     * @param {Object} user - Nouvel utilisateur
     */
    handleUserChange(user) {
        console.log('👤 Changement d\'utilisateur:', user?.email || 'Déconnexion');
        
        const uiCore = this.modules.get('uiCore');
        if (uiCore) {
            uiCore.updateUserInterface(user);
        }
        
        const profileSystem = this.modules.get('profileSystem');
        if (profileSystem && user) {
            profileSystem.loadUserProfile(user);
        }
    }
    
    /**
     * Gestionnaire d'installation d'application
     * @param {string} appId - ID de l'application
     */
    handleAppInstallation(appId) {
        console.log('📱 Application installée:', appId);
        
        const uiCore = this.modules.get('uiCore');
        if (uiCore) {
            uiCore.refreshApplicationsList();
        }
        
        this.logActivity('app_installed', { appId });
    }
    
    /**
     * Gestionnaire de changement de préférences
     * @param {Object} preferences - Nouvelles préférences
     */
    handlePreferencesChange(preferences) {
        console.log('⚙️ Préférences mises à jour:', preferences);
        
        const uiCore = this.modules.get('uiCore');
        if (uiCore) {
            uiCore.applyPreferences(preferences);
        }
        
        this.logActivity('preferences_changed', preferences);
    }
    
    /**
     * Gestionnaire d'erreurs système
     * @param {Error} error - Erreur
     */
    handleSystemError(error) {
        console.error('🚨 Erreur système:', error);
        
        this.logError('System Error', error);
        
        // Afficher une notification à l'utilisateur si l'UI est disponible
        const uiCore = this.modules.get('uiCore');
        if (uiCore && uiCore.showNotification) {
            uiCore.showNotification('Erreur système détectée', 'error');
        }
    }
    
    /**
     * Vérifier l'intégrité du système
     */
    performSystemCheck() {
        console.log('🔍 Vérification de l\'intégrité du système...');
        
        const issues = [];
        
        // Vérifier les modules requis
        const requiredModules = ['config', 'userCore', 'appCore', 'uiCore'];
        for (const moduleName of requiredModules) {
            if (!this.modules.has(moduleName)) {
                issues.push(`Module requis manquant: ${moduleName}`);
            }
        }
        
        // Vérifier la configuration
        const config = this.modules.get('config');
        if (config && !config.validate()) {
            issues.push('Configuration système invalide');
        }
        
        // Vérifier le stockage local
        try {
            localStorage.setItem('c2ros_test', 'test');
            localStorage.removeItem('c2ros_test');
        } catch (error) {
            issues.push('Stockage local non disponible');
        }
        
        if (issues.length > 0) {
            console.warn('⚠️ Problèmes détectés:', issues);
            this.logActivity('system_check_issues', { issues });
        } else {
            console.log('✅ Intégrité du système vérifiée');
        }
    }
    
    /**
     * Nettoyer les données obsolètes
     */
    cleanupObsoleteData() {
        console.log('🧹 Nettoyage des données obsolètes...');
        
        try {
            const config = this.modules.get('config');
            const prefix = config?.storage?.prefix || 'c2ros_';
            
            // Nettoyer les sessions expirées
            const sessionsKey = `${prefix}sessions`;
            const sessions = JSON.parse(localStorage.getItem(sessionsKey) || '[]');
            const now = new Date();
            
            const validSessions = sessions.filter(([, session]) => {
                return new Date(session.expiresAt) > now;
            });
            
            if (validSessions.length !== sessions.length) {
                localStorage.setItem(sessionsKey, JSON.stringify(validSessions));
                console.log(`🗑️ ${sessions.length - validSessions.length} sessions expirées supprimées`);
            }
            
        } catch (error) {
            console.error('Erreur nettoyage données:', error);
        }
    }
    
    /**
     * Afficher les informations de version
     */
    displayVersionInfo() {
        const config = this.modules.get('config');
        if (config) {
            const version = config.getVersionInfo();
            console.log(`🏷️ ${config.system.name} ${version.fullVersion}`);
            
            // Afficher dans l'interface si disponible
            const versionElement = document.querySelector('.system-version');
            if (versionElement) {
                versionElement.textContent = `${config.system.name} v${version.version} – Build ${version.build}`;
            }
        }
    }
    
    /**
     * Démarrer la surveillance du système
     */
    startSystemMonitoring() {
        console.log('👁️ Démarrage surveillance système...');
        
        // Surveiller l'utilisation mémoire
        setInterval(() => {
            if (performance.memory) {
                const memory = performance.memory;
                const usage = (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100;
                
                if (usage > 80) {
                    console.warn('⚠️ Utilisation mémoire élevée:', Math.round(usage) + '%');
                }
            }
        }, 30000); // Vérifier toutes les 30 secondes
        
        // Surveiller les erreurs
        let errorCount = 0;
        const errorThreshold = 5;
        const errorWindow = 60000; // 1 minute
        
        this.addEventListener('error', () => {
            errorCount++;
            setTimeout(() => errorCount--, errorWindow);
            
            if (errorCount >= errorThreshold) {
                console.error('🚨 Trop d\'erreurs détectées, système potentiellement instable');
            }
        });
    }
    
    /**
     * Ajouter un écouteur d'événement système
     * @param {string} event - Type d'événement
     * @param {Function} callback - Fonction de rappel
     */
    addEventListener(event, callback) {
        if (!this.eventListeners) {
            this.eventListeners = new Map();
        }
        
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        
        this.eventListeners.get(event).push(callback);
    }
    
    /**
     * Émettre un événement système
     * @param {string} event - Type d'événement
     * @param {*} data - Données de l'événement
     */
    emitEvent(event, data) {
        if (this.eventListeners && this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Erreur callback événement ${event}:`, error);
                }
            });
        }
    }
    
    /**
     * Enregistrer une activité système
     * @param {string} type - Type d'activité
     * @param {Object} data - Données
     */
    logActivity(type, data) {
        const activity = {
            type,
            data,
            timestamp: new Date().toISOString(),
            user: this.modules.get('userCore')?.getCurrentUser()?.email || 'anonymous'
        };
        
        try {
            const config = this.modules.get('config');
            const logsKey = `${config.storage.prefix}${config.storage.keys.logs}`;
            const logs = JSON.parse(localStorage.getItem(logsKey) || '[]');
            
            logs.push(activity);
            
            // Garder seulement les 1000 dernières entrées
            if (logs.length > 1000) {
                logs.splice(0, logs.length - 1000);
            }
            
            localStorage.setItem(logsKey, JSON.stringify(logs));
            
        } catch (error) {
            console.error('Erreur enregistrement activité:', error);
        }
    }
    
    /**
     * Enregistrer une erreur
     * @param {string} type - Type d'erreur
     * @param {Error} error - Erreur
     */
    logError(type, error) {
        const errorLog = {
            type,
            message: error.message || error.toString(),
            stack: error.stack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        this.logActivity('error', errorLog);
        this.emitEvent('error', errorLog);
    }
    
    /**
     * Notifier que le système est prêt
     */
    notifySystemReady() {
        // Émettre l'événement système prêt
        this.emitEvent('systemReady', {
            timestamp: new Date().toISOString(),
            bootTime: Date.now() - window.C2R_BOOT_START,
            modules: Array.from(this.modules.keys())
        });
        
        // Déclencher l'événement personnalisé DOM
        window.dispatchEvent(new CustomEvent('c2rosReady', {
            detail: { system: this }
        }));
    }
    
    /**
     * Obtenir l'état du système
     * @returns {Object} État système
     */
    getSystemStatus() {
        return {
            ready: this.systemReady,
            initialized: this.initialized,
            modules: Array.from(this.modules.keys()),
            bootSequence: this.bootSequence,
            uptime: Date.now() - window.C2R_BOOT_START
        };
    }
    
    /**
     * Redémarrer le système
     */
    async restart() {
        console.log('🔄 Redémarrage du système...');
        
        // Nettoyer les modules
        this.modules.clear();
        this.initialized = false;
        this.systemReady = false;
        
        // Réinitialiser
        await this.init();
    }
    
    /**
     * Arrêter le système
     */
    shutdown() {
        console.log('🛑 Arrêt du système...');
        
        // Déconnecter l'utilisateur
        const userCore = this.modules.get('userCore');
        if (userCore) {
            userCore.logout();
        }
        
        // Nettoyer les modules
        this.modules.clear();
        this.initialized = false;
        this.systemReady = false;
        
        console.log('✅ Système arrêté');
    }
}

// Marquer le début du démarrage
window.C2R_BOOT_START = Date.now();

// Export global
window.SystemIntegration = SystemIntegration;
