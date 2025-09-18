'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: any) => void;
  logout: () => void;
  isSalleAdmin: (salleAdminId?: number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté via localStorage
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('authToken');
        const userInfo = localStorage.getItem('userInfo');
        
        if (token && userInfo) {
          const parsedUserInfo = JSON.parse(userInfo);
          setUser({
            id: parsedUserInfo.id.toString(),
            email: parsedUserInfo.email,
            name: parsedUserInfo.username || parsedUserInfo.name || 'Utilisateur'
          });
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        // Nettoyer les données corrompues
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (token: string, userData: any) => {
    // Sauvegarder les données dans localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    
    // Mettre à jour l'état utilisateur
    setUser({
      id: userData.id.toString(),
      email: userData.email,
      name: userData.username || userData.name
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    setUser(null);
    // Redirection automatique vers la page principale après déconnexion
    router.push('/');
  };

  const isSalleAdmin = (salleAdminId?: number) => {
    if (!user || !salleAdminId) return false;
    return parseInt(user.id) === salleAdminId;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isSalleAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}