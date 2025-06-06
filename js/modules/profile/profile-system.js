/**
 * C2R OS - Système de Profils
 * Module: ProfileSystem
 * Version: 1.0.0
 * Description: Gestion des profils utilisateur et personnalisation
 */

class ProfileSystem {
    constructor() {
        this.config = window.C2R_CONFIG;
        this.currentProfile = null;
        this.profileTemplates = new Map();
        
        this.init();
    }
    
    /**
     * Initialisation du système de profils
     */
    init() {
        this.setupProfileTemplates();
        this.loadCurrentProfile();
    }
    
    /**
     * Configurer les modèles de profils
     */
    setupProfileTemplates() {
        const templates = [
            {
                id: 'default_user',
                name: 'Utilisateur Standard',
                description: 'Configuration par défaut pour les utilisateurs',
                preferences: {
                    theme: 'dark',
                    sidebarPosition: 'left',
                    showWelcomeMessage: true,
                    fontSize: 'medium',
                    animations: true
                },
                defaultApps: ['notepad', 'todolist'],
                restrictions: {
                    maxApps: 15,
                    adminAccess: false
                }
            },
            {
                id: 'admin_user',
                name: 'Administrateur',
                description: 'Configuration pour les administrateurs',
                preferences: {
                    theme: 'dark',
                    sidebarPosition: 'left',
                    showWelcomeMessage: true,
                    fontSize: 'medium',
                    animations: true
                },
                defaultApps: ['notepad', 'todolist', 'weather'],
                restrictions: {
                    maxApps: 20,
                    adminAccess: true
                }
            },
            {
                id: 'developer',
                name: 'Développeur',
                description: 'Configuration optimisée pour le développement',
                preferences: {
                    theme: 'dark',
                    sidebarPosition: 'left',
                    showWelcomeMessage: false,
                    fontSize: 'small',
                    animations: false
                },
                defaultApps: ['notepad', 'htmlformatter', 'markdownreader'],
                restrictions: {
                    maxApps: 20,
                    adminAccess: false
                }
            },
            {
                id: 'mobile_user',
                name: 'Utilisateur Mobile',
                description: 'Configuration optimisée pour mobile',
                preferences: {
                    theme: 'light',
                    sidebarPosition: 'left',
                    showWelcomeMessage: true,
                    fontSize: 'large',
                    animations: true
                },
                defaultApps: ['notepad', 'todolist'],
                restrictions: {
                    maxApps: 10,
                    adminAccess: false
                }
            }
        ];
        
        templates.forEach(template => {
            this.profileTemplates.set(template.id, template);
        });
        
        console.log(`${templates.length} modèles de profils chargés`);
    }
    
    /**
     * Charger le profil utilisateur actuel
     */
    loadCurrentProfile() {
        const userCore = window.C2R_SYSTEM?.userCore;
        if (userCore && userCore.getCurrentUser()) {
            const user = userCore.getCurrentUser();
            this.loadUserProfile(user);
        }
    }
    
    /**
     * Charger un profil utilisateur
     * @param {Object} user - Utilisateur
     */
    loadUserProfile(user) {
        if (!user) {
            this.currentProfile = null;
            return;
        }
        
        // Créer le profil basé sur l'utilisateur
        this.currentProfile = {
            userId: user.id,
            email: user.email,
            role: user.role,
            preferences: { ...user.preferences },
            installedApps: [...user.installedApps],
            appOrder: [...user.appOrder],
            stats: { ...user.stats },
            settings: this.getUserSettings(user),
            templateId: this.detectProfileTemplate(user),
            lastModified: new Date().toISOString()
        };
        
        console.log(`Profil chargé pour ${user.email}:`, this.currentProfile.templateId);
    }
    
    /**
     * Obtenir le profil actuel
     * @returns {Object|null} Profil actuel
     */
    getCurrentProfile() {
        return this.currentProfile;
    }
    
    /**
     * Détecter le modèle de profil approprié
     * @param {Object} user - Utilisateur
     * @returns {string} ID du modèle
     */
    detectProfileTemplate(user) {
        if (user.role === 'admin') {
            return 'admin_user';
        }
        
        // Détecter si c'est un développeur (basé sur les apps installées)
        const devApps = ['htmlformatter', 'markdownreader', 'promptgen'];
        const installedDevApps = user.installedApps.filter(app => devApps.includes(app));
        
        if (installedDevApps.length >= 2) {
            return 'developer';
        }
        
        // Détecter si c'est mobile (basé sur la taille d'écran)
        if (window.innerWidth <= 768) {
            return 'mobile_user';
        }
        
        return 'default_user';
    }
    
    /**
     * Obtenir les paramètres utilisateur
     * @param {Object} user - Utilisateur
     * @returns {Object} Paramètres
     */
    getUserSettings(user) {
        return {
            notifications: {
                enabled: true,
                sound: true,
                desktop: true,
                frequency: 'normal'
            },
            privacy: {
                shareUsageData: false,
                allowAnalytics: false,
                showOnlineStatus: true
            },
            accessibility: {
                highContrast: false,
                largeText: user.preferences.fontSize === 'large',
                reduceMotion: !user.preferences.animations,
                screenReader: false
            },
            security: {
                autoLock: false,
                lockTimeout: 30,
                requirePasswordChange: false,
                twoFactorAuth: false
            },
            advanced: {
                debugMode: false,
                betaFeatures: false,
                developerMode: user.role === 'admin',
                backupEnabled: true
            }
        };
    }
    
    /**
     * Appliquer un modèle de profil
     * @param {string} templateId - ID du modèle
     * @param {Object} user - Utilisateur
     * @returns {boolean} Succès
     */
    applyProfileTemplate(templateId, user) {
        const template = this.profileTemplates.get(templateId);
        if (!template || !user) {
            return false;
        }
        
        try {
            // Appliquer les préférences
            Object.assign(user.preferences, template.preferences);
            
            // Installer les applications par défaut si pas déjà installées
            const appCore = window.C2R_SYSTEM?.appCore;
            if (appCore) {
                template.defaultApps.forEach(appId => {
                    if (!user.installedApps.includes(appId)) {
                        appCore.installApp(appId);
                    }
                });
            }
            
            // Appliquer les restrictions
            if (template.restrictions) {
                user.maxApps = template.restrictions.maxApps;
            }
            
            // Sauvegarder
            const userCore = window.C2R_SYSTEM?.userCore;
            if (userCore) {
                userCore.saveUsers();
                userCore.saveCurrentUser();
            }
            
            // Recharger le profil
            this.loadUserProfile(user);
            
            console.log(`Modèle ${template.name} appliqué à ${user.email}`);
            return true;
            
        } catch (error) {
            console.error('Erreur application modèle profil:', error);
            return false;
        }
    }
    
    /**
     * Mettre à jour les préférences du profil
     * @param {Object} newPreferences - Nouvelles préférences
     * @returns {boolean} Succès
     */
    updateProfilePreferences(newPreferences) {
        if (!this.currentProfile) return false;
        
        try {
            const userCore = window.C2R_SYSTEM?.userCore;
            if (!userCore) return false;
            
            const user = userCore.getCurrentUser();
            if (!user) return false;
            
            // Mettre à jour les préférences
            Object.assign(user.preferences, newPreferences);
            Object.assign(this.currentProfile.preferences, newPreferences);
            
            this.currentProfile.lastModified = new Date().toISOString();
            
            // Sauvegarder
            userCore.updatePreferences(newPreferences);
            
            console.log('Préférences profil mises à jour:', newPreferences);
            return true;
            
        } catch (error) {
            console.error('Erreur mise à jour préférences profil:', error);
            return false;
        }
    }
    
    /**
     * Mettre à jour les paramètres du profil
     * @param {string} category - Catégorie
     * @param {Object} newSettings - Nouveaux paramètres
     * @returns {boolean} Succès
     */
    updateProfileSettings(category, newSettings) {
        if (!this.currentProfile || !this.currentProfile.settings[category]) {
            return false;
        }
        
        try {
            Object.assign(this.currentProfile.settings[category], newSettings);
            this.currentProfile.lastModified = new Date().toISOString();
            
            // Sauvegarder dans le stockage local
            this.saveProfileSettings();
            
            console.log(`Paramètres ${category} mis à jour:`, newSettings);
            return true;
            
        } catch (error) {
            console.error('Erreur mise à jour paramètres:', error);
            return false;
        }
    }
    
    /**
     * Sauvegarder les paramètres du profil
     */
    saveProfileSettings() {
        if (!this.currentProfile) return;
        
        try {
            const settingsKey = `${this.config.storage.prefix}profile_settings_${this.currentProfile.userId}`;
            localStorage.setItem(settingsKey, JSON.stringify(this.currentProfile.settings));
        } catch (error) {
            console.error('Erreur sauvegarde paramètres profil:', error);
        }
    }
    
    /**
     * Charger les paramètres du profil
     * @param {string} userId - ID utilisateur
     * @returns {Object|null} Paramètres
     */
    loadProfileSettings(userId) {
        try {
            const settingsKey = `${this.config.storage.prefix}profile_settings_${userId}`;
            const saved = localStorage.getItem(settingsKey);
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Erreur chargement paramètres profil:', error);
            return null;
        }
    }
    
    /**
     * Exporter le profil
     * @returns {Object|null} Données du profil
     */
    exportProfile() {
        if (!this.currentProfile) return null;
        
        return {
            version: '1.0.0',
            exportDate: new Date().toISOString(),
            profile: {
                preferences: this.currentProfile.preferences,
                installedApps: this.currentProfile.installedApps,
                appOrder: this.currentProfile.appOrder,
                settings: this.currentProfile.settings,
                templateId: this.currentProfile.templateId
            }
        };
    }
    
    /**
     * Importer un profil
     * @param {Object} profileData - Données du profil
     * @returns {boolean} Succès
     */
    importProfile(profileData) {
        if (!profileData || !profileData.profile) return false;
        
        try {
            const userCore = window.C2R_SYSTEM?.userCore;
            const user = userCore?.getCurrentUser();
            
            if (!user) return false;
            
            const { profile } = profileData;
            
            // Importer les préférences
            if (profile.preferences) {
                Object.assign(user.preferences, profile.preferences);
            }
            
            // Importer les applications (si elles existent)
            const appCore = window.C2R_SYSTEM?.appCore;
            if (profile.installedApps && appCore) {
                profile.installedApps.forEach(appId => {
                    if (appCore.getApp(appId) && !user.installedApps.includes(appId)) {
                        appCore.installApp(appId);
                    }
                });
            }
            
            // Importer l'ordre des applications
            if (profile.appOrder) {
                user.appOrder = profile.appOrder.filter(appId => user.installedApps.includes(appId));
            }
            
            // Importer les paramètres
            if (profile.settings && this.currentProfile) {
                Object.assign(this.currentProfile.settings, profile.settings);
                this.saveProfileSettings();
            }
            
            // Sauvegarder
            userCore.saveUsers();
            userCore.saveCurrentUser();
            
            // Recharger le profil
            this.loadUserProfile(user);
            
            console.log('Profil importé avec succès');
            return true;
            
        } catch (error) {
            console.error('Erreur importation profil:', error);
            return false;
        }
    }
    
    /**
     * Réinitialiser le profil aux valeurs par défaut
     * @returns {boolean} Succès
     */
    resetProfile() {
        const userCore = window.C2R_SYSTEM?.userCore;
        const user = userCore?.getCurrentUser();
        
        if (!user) return false;
        
        try {
            // Détecter le modèle approprié
            const templateId = this.detectProfileTemplate(user);
            
            // Appliquer le modèle
            const success = this.applyProfileTemplate(templateId, user);
            
            if (success) {
                console.log('Profil réinitialisé avec succès');
            }
            
            return success;
            
        } catch (error) {
            console.error('Erreur réinitialisation profil:', error);
            return false;
        }
    }
    
    /**
     * Obtenir les modèles de profils disponibles
     * @returns {Array} Liste des modèles
     */
    getAvailableTemplates() {
        return Array.from(this.profileTemplates.values());
    }
    
    /**
     * Obtenir un modèle de profil
     * @param {string} templateId - ID du modèle
     * @returns {Object|null} Modèle
     */
    getTemplate(templateId) {
        return this.profileTemplates.get(templateId) || null;
    }
    
    /**
     * Obtenir les statistiques du profil
     * @returns {Object|null} Statistiques
     */
    getProfileStats() {
        if (!this.currentProfile) return null;
        
        const userCore = window.C2R_SYSTEM?.userCore;
        const appCore = window.C2R_SYSTEM?.appCore;
        
        if (!userCore || !appCore) return null;
        
        const user = userCore.getCurrentUser();
        if (!user) return null;
        
        return {
            appsInstalled: user.installedApps.length,
            maxApps: this.config.apps.maxInstalled,
            loginCount: user.stats.loginCount,
            lastActivity: user.stats.lastActivity,
            accountAge: this.calculateAccountAge(user.createdAt),
            storageUsed: this.calculateStorageUsage(),
            templateUsed: this.currentProfile.templateId,
            preferencesModified: this.currentProfile.lastModified
        };
    }
    
    /**
     * Calculer l'âge du compte
     * @param {string} createdAt - Date de création
     * @returns {number} Âge en jours
     */
    calculateAccountAge(createdAt) {
        const created = new Date(createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - created);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    /**
     * Calculer l'utilisation du stockage
     * @returns {number} Taille en KB
     */
    calculateStorageUsage() {
        try {
            let totalSize = 0;
            const prefix = this.config.storage.prefix;
            
            for (let key in localStorage) {
                if (key.startsWith(prefix)) {
                    totalSize += localStorage[key].length;
                }
            }
            
            return Math.round(totalSize / 1024); // Convertir en KB
            
        } catch (error) {
            console.error('Erreur calcul stockage:', error);
            return 0;
        }
    }
    
    /**
     * Valider un profil
     * @param {Object} profile - Profil à valider
     * @returns {Object} Résultat de validation
     */
    validateProfile(profile) {
        const errors = [];
        const warnings = [];
        
        if (!profile) {
            errors.push('Profil manquant');
            return { valid: false, errors, warnings };
        }
        
        // Vérifier les préférences
        if (!profile.preferences) {
            errors.push('Préférences manquantes');
        } else {
            if (!profile.preferences.theme || !['dark', 'light'].includes(profile.preferences.theme)) {
                warnings.push('Thème invalide, utilisation de la valeur par défaut');
            }
        }
        
        // Vérifier les applications
        if (profile.installedApps && Array.isArray(profile.installedApps)) {
            const appCore = window.C2R_SYSTEM?.appCore;
            if (appCore) {
                const invalidApps = profile.installedApps.filter(appId => !appCore.getApp(appId));
                if (invalidApps.length > 0) {
                    warnings.push(`Applications non trouvées: ${invalidApps.join(', ')}`);
                }
            }
        }
        
        // Vérifier les limites
        if (profile.installedApps && profile.installedApps.length > this.config.apps.maxInstalled) {
            warnings.push(`Trop d'applications installées (max: ${this.config.apps.maxInstalled})`);
        }
        
        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }
}

// Export global
window.ProfileSystem = ProfileSystem;
