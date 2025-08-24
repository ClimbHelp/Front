'use client'

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  AuthContainer, AuthCard, AuthHeader, AuthLogo, AuthSubtitle, AuthForm, FormGroup, FormLabel, FormInput,
  PrimaryButton, SecondaryButton, Separator, SeparatorLine, SeparatorText, AuthFooter, AuthLink,
  FloatingElements, FloatingElement, HoldsPattern, Hold
} from "./AuthStyles";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const floatRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  // Vérifier s'il y a un message d'erreur dans l'URL
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      setErrorMessage(decodeURIComponent(error));
    }
  }, [searchParams]);

  // Parallaxe emojis flottants
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      floatRefs.forEach((ref, i) => {
        if (!ref.current) return;
        const speed = (i + 1) * 0.3;
        const xPos = (x - 0.5) * speed * 30;
        const yPos = (y - 0.5) * speed * 30;
        ref.current.style.transform = `translate(${xPos}px, ${yPos}px)`;
      });
    }
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [floatRefs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch('http://localhost:3003/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Connexion réussie
        const { token, user } = data.data;
        login(token, user);
        router.push('/');
      } else {
        // Erreur de connexion
        setErrorMessage(data.error || 'Erreur lors de la connexion');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setErrorMessage('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = () => {
    router.push('/register');
  };
  
  function handleGoogleLogin() {
    
    // Redirection vers l'authentification Google
    try {
      router.push('http://localhost:3001/auth');
    } catch (error) {
      console.error("Erreur lors de la redirection Google:", error);
    }
  }

  return (
    <AuthContainer>
      <FloatingElements>
        <FloatingElement ref={floatRefs[0]} $top="15%" $right="10%">🧗‍♂️</FloatingElement>
        <FloatingElement ref={floatRefs[1]} $top="60%" $left="8%">🏔️</FloatingElement>
        <FloatingElement ref={floatRefs[2]} $bottom="20%" $right="15%">⛰️</FloatingElement>
      </FloatingElements>
      
      <HoldsPattern>
        <Hold $delay={0} />
        <Hold $delay={0.5} />
        <Hold $delay={1} />
        <Hold $delay={1.5} />
      </HoldsPattern>

      <AuthCard>
        <AuthHeader>
          <AuthLogo>ClimbHelp</AuthLogo>
          <AuthSubtitle>Connectez-vous à votre compte</AuthSubtitle>
        </AuthHeader>
        
        <AuthForm onSubmit={handleSubmit}>
          {errorMessage && (
            <div style={{
              background: '#fee',
              border: '1px solid #fcc',
              borderRadius: '8px',
              padding: '0.75rem',
              marginBottom: '1rem',
              color: '#c33',
              fontSize: '0.9rem'
            }}>
              {errorMessage}
            </div>
          )}
          
          <FormGroup>
            <FormLabel>Email</FormLabel>
            <FormInput
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              disabled={isLoading}
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Mot de passe</FormLabel>
            <FormInput
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              required
              disabled={isLoading}
            />
          </FormGroup>
          
          <PrimaryButton type="submit" disabled={isLoading}>
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </PrimaryButton>
        </AuthForm>
        
        <Separator>
          <SeparatorLine />
          <SeparatorText>ou</SeparatorText>
          <SeparatorLine />
        </Separator>
        
        <SecondaryButton onClick={handleGoogleLogin} disabled={isLoading}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} />
          Se connecter avec Google
        </SecondaryButton>
        
        <AuthFooter>
          <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>
            Pas encore de compte ?
          </p>
          <AuthLink onClick={handleRegisterClick} style={{ cursor: 'pointer' }}>
            Créer un compte
          </AuthLink>
        </AuthFooter>
      </AuthCard>
    </AuthContainer>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
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
          <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Chargement...</h2>
          <p style={{ color: '#7f8c8d' }}>Veuillez patienter.</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}