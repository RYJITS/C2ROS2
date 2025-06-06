/**
 * C2R OS - Noyau Utilisateur
 * Module: UserCore
 * Version: 1.0.0
 * Description: Gestion des comptes, sessions, rôles et préférences utilisateur
 */

class UserCore {
    constructor() {
        this.config = window.C2R_CONFIG;
        this.currentUser = null;
        this.users = new Map();
        this.sessions = new Map();
        
        this.init();
    }
    
    /**
     * Initialisation du module
     */
    init() {
        this.loadUsers();
        this.loadSessions();
        this.checkCurrentSession();
        
        // Créer un admin par défaut si aucun utilisateur
        if (this.users.size === 0) {
            this.createDefaultAdmin();
        }
    }
    
    /**
     * Créer un utilisateur administrateur par défaut
     */
    createDefaultAdmin() {
        const adminUser = {
            id: this.generateUserId(),
            email: 'admin@c2ros.com',
            username: 'admin',
            passwordHash: this.hashPassword('admin123'),
            role: 'admin',
            createdAt: new Date().toISOString(),
            lastLogin: null,
            preferences: {
                theme: 'dark',
                sidebarPosition: 'left',
                showWelcomeMessage: true,
                fontSize: 'medium',
                animations: true
            },
            installedApps: ['notepad', 'todolist', 'weather'],
            appOrder: ['notepad', 'todolist', 'weather'],
            stats: {
                loginCount: 0,
                appsInstalled: 3,
                lastActivity: null
            }
        };
        
        this.users.set(adminUser.id, adminUser);
        this.saveUsers();
        console.log('Utilisateur admin par défaut créé:', adminUser.email);
    }
    
    /**
     * Créer un nouvel utilisateur
     * @param {Object} userData - Données utilisateur
     * @returns {Object|null} Utilisateur créé ou null si erreur
     */
    createUser(userData) {
        try {
            // Validation des données
            if (!userData.email || !userData.password) {
                throw new Error('Email et mot de passe requis');
            }
            
            if (userData.password.length < this.config.security.passwordMinLength) {
                throw new Error(`Mot de passe trop court (min ${this.config.security.passwordMinLength} caractères)`);
            }
            
            // Vérifier si l'email existe déjà
            if (this.getUserByEmail(userData.email)) {
                throw new Error('Cet email est déjà utilisé');
            }
            
            const newUser = {
                id: this.generateUserId(),
                email: userData.email,
                username: userData.username || userData.email.split('@')[0],
                passwordHash: this.hashPassword(userData.password),
                role: userData.role || 'user',
                createdAt: new Date().toISOString(),
                lastLogin: null,
                preferences: {
                    theme: this.config.themes.default,
                    sidebarPosition: 'left',
                    showWelcomeMessage: true,
                    fontSize: 'medium',
                    animations: true
                },
                installedApps: [],
                appOrder: [],
                stats: {
                    loginCount: 0,
                    appsInstalled: 0,
                    lastActivity: null
                }
            };
            
            this.users.set(newUser.id, newUser);
            this.saveUsers();
            
            return newUser;
            
        } catch (error) {
            console.error('Erreur création utilisateur:', error);
            return null;
        }
    }
    
    /**
     * Connecter un utilisateur
     * @param {string} email - Email
     * @param {string} password - Mot de passe
     * @returns {Object|null} Utilisateur connecté ou null
     */
    login(email, password) {
        try {
            const user = this.getUserByEmail(email);
            
            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }
            
            if (!this.verifyPassword(password, user.passwordHash)) {
                throw new Error('Mot de passe incorrect');
            }
            
            // Mettre à jour les stats
            user.lastLogin = new Date().toISOString();
            user.stats.loginCount++;
            user.stats.lastActivity = new Date().toISOString();
            
            // Créer une session
            const sessionId = this.createSession(user);
            
            this.currentUser = user;
            this.saveUsers();
            this.saveSessions();
            this.saveCurrentUser();
            
            console.log('Connexion réussie:', user.email);
            return user;
            
        } catch (error) {
            console.error('Erreur connexion:', error);
            return null;
        }
    }
    
    /**
     * Déconnecter l'utilisateur actuel
     */
    logout() {
        if (this.currentUser) {
            this.endSession(this.currentUser.id);
            this.currentUser = null;
            localStorage.removeItem(`${this.config.storage.prefix}${this.config.storage.keys.currentUser}`);
            console.log('Déconnexion réussie');
        }
    }
    
    /**
     * Obtenir l'utilisateur actuellement connecté
     * @returns {Object|null} Utilisateur actuel
     */
    getCurrentUser() {
        return this.currentUser;
    }
    
    /**
     * Vérifier si l'utilisateur actuel est administrateur
     * @returns {boolean} True si admin
     */
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }
    
    /**
     * Obtenir un utilisateur par email
     * @param {string} email - Email
     * @returns {Object|null} Utilisateur
     */
    getUserByEmail(email) {
        for (const user of this.users.values()) {
            if (user.email === email) {
                return user;
            }
        }
        return null;
    }
    
    /**
     * Obtenir tous les utilisateurs (admin uniquement)
     * @returns {Array} Liste des utilisateurs
     */
    getAllUsers() {
        if (!this.isAdmin()) {
            throw new Error('Accès refusé - Admin requis');
        }
        return Array.from(this.users.values());
    }
    
    /**
     * Mettre à jour les préférences utilisateur
     * @param {Object} preferences - Nouvelles préférences
     */
    updatePreferences(preferences) {
        if (!this.currentUser) return;
        
        Object.assign(this.currentUser.preferences, preferences);
        this.currentUser.stats.lastActivity = new Date().toISOString();
        
        this.saveUsers();
        this.saveCurrentUser();
    }
    
    /**
     * Supprimer un utilisateur (admin uniquement)
     * @param {string} userId - ID utilisateur
     * @returns {boolean} Succès
     */
    deleteUser(userId) {
        if (!this.isAdmin()) {
            throw new Error('Accès refusé - Admin requis');
        }
        
        if (userId === this.currentUser.id) {
            throw new Error('Impossible de supprimer son propre compte');
        }
        
        const deleted = this.users.delete(userId);
        if (deleted) {
            this.endSession(userId);
            this.saveUsers();
        }
        
        return deleted;
    }
    
    /**
     * Générer un ID utilisateur unique
     * @returns {string} ID unique
     */
    generateUserId() {
        return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Hacher un mot de passe (simulation simple)
     * @param {string} password - Mot de passe
     * @returns {string} Hash
     */
    hashPassword(password) {
        // Simple hash pour démo - À remplacer par une vraie fonction de hachage
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Conversion en 32bit
        }
        return hash.toString();
    }
    
    /**
     * Vérifier un mot de passe
     * @param {string} password - Mot de passe
     * @param {string} hash - Hash stocké
     * @returns {boolean} Correspondance
     */
    verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    }
    
    /**
     * Créer une session
     * @param {Object} user - Utilisateur
     * @returns {string} ID de session
     */
    createSession(user) {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const session = {
            id: sessionId,
            userId: user.id,
            createdAt: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            expiresAt: new Date(Date.now() + this.config.system.sessionTimeout).toISOString()
        };
        
        this.sessions.set(sessionId, session);
        return sessionId;
    }
    
    /**
     * Terminer une session
     * @param {string} userId - ID utilisateur
     */
    endSession(userId) {
        for (const [sessionId, session] of this.sessions.entries()) {
            if (session.userId === userId) {
                this.sessions.delete(sessionId);
            }
        }
        this.saveSessions();
    }
    
    /**
     * Vérifier la session actuelle
     */
    checkCurrentSession() {
        try {
            const savedUser = localStorage.getItem(`${this.config.storage.prefix}${this.config.storage.keys.currentUser}`);
            if (savedUser) {
                const userData = JSON.parse(savedUser);
                const user = this.users.get(userData.id);
                if (user) {
                    this.currentUser = user;
                }
            }
        } catch (error) {
            console.error('Erreur vérification session:', error);
        }
    }
    
    /**
     * Sauvegarder les utilisateurs
     */
    saveUsers() {
        try {
            const usersArray = Array.from(this.users.entries());
            localStorage.setItem(
                `${this.config.storage.prefix}${this.config.storage.keys.users}`,
                JSON.stringify(usersArray)
            );
        } catch (error) {
            console.error('Erreur sauvegarde utilisateurs:', error);
        }
    }
    
    /**
     * Charger les utilisateurs
     */
    loadUsers() {
        try {
            const saved = localStorage.getItem(`${this.config.storage.prefix}${this.config.storage.keys.users}`);
            if (saved) {
                const usersArray = JSON.parse(saved);
                this.users = new Map(usersArray);
            }
        } catch (error) {
            console.error('Erreur chargement utilisateurs:', error);
        }
    }
    
    /**
     * Sauvegarder l'utilisateur actuel
     */
    saveCurrentUser() {
        if (this.currentUser) {
            localStorage.setItem(
                `${this.config.storage.prefix}${this.config.storage.keys.currentUser}`,
                JSON.stringify(this.currentUser)
            );
        }
    }
    
    /**
     * Sauvegarder les sessions
     */
    saveSessions() {
        try {
            const sessionsArray = Array.from(this.sessions.entries());
            localStorage.setItem(
                `${this.config.storage.prefix}${this.config.storage.keys.sessions}`,
                JSON.stringify(sessionsArray)
            );
        } catch (error) {
            console.error('Erreur sauvegarde sessions:', error);
        }
    }
    
    /**
     * Charger les sessions
     */
    loadSessions() {
        try {
            const saved = localStorage.getItem(`${this.config.storage.prefix}${this.config.storage.keys.sessions}`);
            if (saved) {
                const sessionsArray = JSON.parse(saved);
                this.sessions = new Map(sessionsArray);
            }
        } catch (error) {
            console.error('Erreur chargement sessions:', error);
        }
    }
}

// Export global
window.UserCore = UserCore;
