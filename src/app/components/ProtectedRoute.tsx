'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { userInfo, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !userInfo) {
      router.push('/login?error=Vous devez être connecté pour accéder à cette page');
    }
  }, [userInfo, loading, router]);

  if (loading) {
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
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Vérification...</h2>
          <p style={{ color: '#7f8c8d' }}>Vérification de votre authentification.</p>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return null; // La redirection se fait dans le useEffect
  }

  return <>{children}</>;
} 