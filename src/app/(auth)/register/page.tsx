'use client'

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  AuthContainer, AuthCard, AuthHeader, AuthLogo, AuthSubtitle, AuthForm, FormGroup, FormLabel, FormInput,
  PrimaryButton, SecondaryButton, Separator, SeparatorLine, SeparatorText, AuthFooter, AuthLink,
  FloatingElements, FloatingElement, HoldsPattern, Hold
} from "./AuthStyles";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const floatRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Effacer l'erreur quand l'utilisateur modifie le formulaire
    if (error) setError("");
  };

  const validateForm = () => {
    // Validation du nom d'utilisateur
    if (formData.username.length < 3) {
      setError("Le nom d'utilisateur doit contenir au moins 3 caractères");
      return false;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Veuillez entrer une adresse email valide");
      return false;
    }

    // Validation du mot de passe
    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }

    // Validation de la confirmation du mot de passe
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('http://localhost:3003/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {

        // Rediriger vers la page de connexion avec un message de succès
        router.push('/login?message=inscription_reussie');
      } else {
        setError(data.error || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      setError("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  function handleGoogleRegister() {
    
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
        <FloatingElement ref={floatRefs[0]} $top="10%" $left="12%">🧗‍♀️</FloatingElement>
        <FloatingElement ref={floatRefs[1]} $top="70%" $right="8%">🏔️</FloatingElement>
        <FloatingElement ref={floatRefs[2]} $bottom="15%" $left="15%">⛰️</FloatingElement>
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
          <AuthSubtitle>Rejoignez la communauté d&apos;escalade</AuthSubtitle>
        </AuthHeader>
        
        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
        <AuthForm onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>Nom d&apos;utilisateur</FormLabel>
            <FormInput
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Votre nom d&apos;utilisateur"
              required
              minLength={3}
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Email</FormLabel>
            <FormInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Mot de passe</FormLabel>
            <FormInput
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Votre mot de passe"
              required
              minLength={6}
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Confirmer le mot de passe</FormLabel>
            <FormInput
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmez votre mot de passe"
              required
              minLength={6}
            />
          </FormGroup>
          
          <PrimaryButton type="submit" disabled={isLoading}>
            {isLoading ? "Création en cours..." : "Créer mon compte"}
          </PrimaryButton>
        </AuthForm>
        
        <Separator>
          <SeparatorLine />
          <SeparatorText>ou</SeparatorText>
          <SeparatorLine />
        </Separator>
        
        <SecondaryButton onClick={handleGoogleRegister} disabled={isLoading}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} />
          S&apos;inscrire avec Google
        </SecondaryButton>
        
        <AuthFooter>
          <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>
            Déjà un compte ?
          </p>
          <AuthLink onClick={handleLoginClick} style={{ cursor: 'pointer' }}>
            Se connecter
          </AuthLink>
        </AuthFooter>
      </AuthCard>
    </AuthContainer>
  );
} 