/**
 * C2R OS - Configuration centrale
 * Module: CoreConfig
 * Version: 1.0.0
 * Description: Configuration globale du système C2R OS
 */

class CoreConfig {
    constructor() {
        this.version = "1.0.0";
        this.build = "2025-05-27";
        this.codename = "Genesis";
        
        // Configuration système
        this.system = {
            name: "C2R OS",
            description: "Système d'exploitation dans le navigateur",
            maxUsers: 100,
            sessionTimeout: 24 * 60 * 60 * 1000, // 24h en ms
            autoSave: true,
            debugMode: false
        };
        
        // Configuration des thèmes
        this.themes = {
            default: "dark",
            available: ["dark", "light"],
            custom: false
        };
        
        // Configuration des applications
        this.apps = {
            maxInstalled: 20,
            autoUpdate: true,
            allowCustomApps: false,
            categories: [
                "Productivité",
                "Développement",
                "Utilitaires",
                "Multimédia",
                "Information",
                "Jeux"
            ],
            types: [
                "application",
                "information",
                "service",
                "formation"
            ]
        };
        
        // Configuration sécurité
        this.security = {
            passwordMinLength: 6,
            sessionSecure: true,
            adminRequired: true,
            encryptStorage: false
        };
        
        // Configuration UI
        this.ui = {
            sidebarWidth: 280,
            animationDuration: 300,
            notificationTimeout: 3000,
            responsiveBreakpoint: 768,
            maxNotifications: 5
        };
        
        // Stockage local
        this.storage = {
            prefix: "c2ros_",
            keys: {
                users: "users",
                currentUser: "current_user", 
                preferences: "preferences",
                apps: "installed_apps",
                sessions: "sessions",
                logs: "system_logs"
            }
        };
        
        // Messages système
        this.messages = {
            welcome: "Bienvenue sur C2R OS",
            loginRequired: "Connexion requise",
            accessDenied: "Accès refusé",
            appInstalled: "Application installée avec succès",
            appRemoved: "Application désinstallée",
            settingsSaved: "Préférences sauvegardées",
            systemError: "Erreur système"
        };
        
        // API endpoints (pour futures extensions)
        this.api = {
            baseUrl: "",
            endpoints: {
                auth: "/auth",
                users: "/users",
                apps: "/apps",
                system: "/system"
            },
            timeout: 5000
        };
    }
    
    /**
     * Obtenir la configuration complète
     * @returns {Object} Configuration
     */
    getConfig() {
        return {
            version: this.version,
            build: this.build,
            codename: this.codename,
            system: this.system,
            themes: this.themes,
            apps: this.apps,
            security: this.security,
            ui: this.ui,
            storage: this.storage,
            messages: this.messages,
            api: this.api
        };
    }
    
    /**
     * Obtenir une section de configuration
     * @param {string} section - Nom de la section
     * @returns {Object|null} Configuration de la section
     */
    get(section) {
        return this[section] || null;
    }
    
    /**
     * Définir une valeur de configuration
     * @param {string} section - Section
     * @param {string} key - Clé
     * @param {*} value - Valeur
     */
    set(section, key, value) {
        if (this[section] && typeof this[section] === 'object') {
            this[section][key] = value;
            this.save();
        }
    }
    
    /**
     * Sauvegarder la configuration
     */
    save() {
        try {
            const config = this.getConfig();
            localStorage.setItem(`${this.storage.prefix}config`, JSON.stringify(config));
        } catch (error) {
            console.error('Erreur sauvegarde configuration:', error);
        }
    }
    
    /**
     * Charger la configuration depuis le stockage
     */
    load() {
        try {
            const saved = localStorage.getItem(`${this.storage.prefix}config`);
            if (saved) {
                const config = JSON.parse(saved);
                Object.assign(this, config);
            }
        } catch (error) {
            console.error('Erreur chargement configuration:', error);
        }
    }
    
    /**
     * Réinitialiser la configuration
     */
    reset() {
        localStorage.removeItem(`${this.storage.prefix}config`);
        // Recharger les valeurs par défaut
        this.__constructor();
    }
    
    /**
     * Valider la configuration
     * @returns {boolean} True si valide
     */
    validate() {
        const required = ['version', 'system', 'storage'];
        return required.every(key => this[key] !== undefined);
    }
    
    /**
     * Obtenir les informations de version
     * @returns {Object} Infos version
     */
    getVersionInfo() {
        return {
            version: this.version,
            build: this.build,
            codename: this.codename,
            fullVersion: `${this.version} "${this.codename}" (Build ${this.build})`
        };
    }
}

// Export global
window.CoreConfig = CoreConfig;

// Instance globale
window.C2R_CONFIG = new CoreConfig();
