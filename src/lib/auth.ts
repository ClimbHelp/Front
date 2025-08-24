import { authService } from './db';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: 'user' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Gestionnaire d'authentification
 */
export class AuthManager {
  private static instance: AuthManager;
  private tokenKey = 'authToken';
  private userKey = 'userData';

  private constructor() {}

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  /**
   * Récupère le token d'authentification
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Définit le token d'authentification
   */
  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Supprime le token d'authentification
   */
  removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.tokenKey);
  }

  /**
   * Récupère les données utilisateur
   */
  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Définit les données utilisateur
   */
  setUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  /**
   * Supprime les données utilisateur
   */
  removeUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.userKey);
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  }

  /**
   * Connexion utilisateur
   */
  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const response = await authService.login(credentials.email, credentials.password);
      
      if (response.success && response.data) {
        const { token, user } = response.data as { token: string; user: User };
        this.setToken(token);
        this.setUser(user);
        return { success: true, user };
      } else {
        return { success: false, error: response.error || 'Erreur de connexion' };
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  }

  /**
   * Inscription utilisateur
   */
  async register(credentials: RegisterCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const response = await authService.register(credentials.email, credentials.password, credentials.name);
      
      if (response.success && response.data) {
        const { token, user } = response.data as { token: string; user: User };
        this.setToken(token);
        this.setUser(user);
        return { success: true, user };
      } else {
        return { success: false, error: response.error || 'Erreur d\'inscription' };
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  }

  /**
   * Déconnexion utilisateur
   */
  async logout(): Promise<void> {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      this.removeToken();
      this.removeUser();
    }
  }

  /**
   * Récupère le profil utilisateur
   */
  async getProfile(): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const response = await authService.getProfile();
      
      if (response.success && response.data) {
        const user = response.data as User;
        this.setUser(user);
        return { success: true, user };
      } else {
        return { success: false, error: response.error || 'Erreur de récupération du profil' };
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  }

  /**
   * Rafraîchit le token d'authentification
   */
  async refreshToken(): Promise<boolean> {
    try {
      // Implémentation du refresh token
      return true;
    } catch (error) {
      console.error('Erreur lors du refresh du token:', error);
      return false;
    }
  }
}

// Instance par défaut
export const authManager = AuthManager.getInstance(); 