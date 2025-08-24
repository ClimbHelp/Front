'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';


interface UserInfo {
  username: string;
  email: string;
  id: number; // Changé de userId à id pour correspondre au backend
  premium?: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  loading: boolean;
  login: (token: string, user: UserInfo) => void;
  logout: () => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem('authToken');
    const userInfoStr = localStorage.getItem('userInfo');
    if (token && userInfoStr) {
      try {
        const user = JSON.parse(userInfoStr);
        setIsAuthenticated(true);
        setUserInfo(user);
      } catch (e) {
        console.warn("Erreur lors du parsing des infos utilisateur:", e);
        logout();
      }
    } else {
      setIsAuthenticated(false);
      setUserInfo(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = useCallback((token: string, user: UserInfo) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userInfo', JSON.stringify(user));
    setIsAuthenticated(true);
    setUserInfo(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    setIsAuthenticated(false);
    setUserInfo(null);
    router.push('/');
  }, [router]);

  const getToken = useCallback(() => {
    return localStorage.getItem('authToken');
  }, []);

  const value = {
    isAuthenticated,
    userInfo,
    loading,
    login,
    logout,
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 