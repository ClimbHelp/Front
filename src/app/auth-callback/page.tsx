'use client'

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      console.error("Erreur d'authentification:", error);
      // Redirection vers la page de login avec un message d'erreur
      router.push('/login?error=' + encodeURIComponent(error));
      return;
    }

    if (token) {
      // Décoder le token pour obtenir les infos utilisateur
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userInfo = {
          username: payload.username,
          email: payload.email,
          userId: payload.userId
        };
        
        // Utiliser le contexte pour se connecter
        login(token, userInfo);
        
        // Redirection vers la page de profil
        router.push('/profile');
      } catch (e) {
        console.error("Erreur lors du décodage du token:", e);
        router.push('/login?error=Token invalide');
      }
    } else {
      // Pas de token, redirection vers login
      router.push('/login?error=Authentification échouée');
    }
  }, [searchParams, router, login]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        maxWidth: '400px'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
        <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Connexion en cours...</h2>
        <p style={{ color: '#7f8c8d' }}>Veuillez patienter pendant que nous vous connectons.</p>
      </div>
    </div>
  );
} 