'use client'

import React, { useState } from "react";

async function fetchLoginData() {
  // TODO: Implémenter la récupération des données pour la connexion
}

function handleGoogleLogin() {
  console.log("Google login");
  // TODO: Rediriger vers l'authentification Google (fonctionnalité déjà existante côté backend)
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '1.25rem',
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  padding: '2rem',
  width: '100%',
  maxWidth: 400,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.5rem 0.75rem',
  border: '1px solid #ccc',
  borderRadius: '0.5rem',
  background: '#f7f7f7',
  marginTop: 2,
};
const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  fontWeight: 500,
  fontSize: '1rem',
  marginBottom: 8,
};
const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  background: '#2563eb',
  color: '#fff',
  fontWeight: 600,
  border: 'none',
  borderRadius: '0.5rem',
  marginTop: 12,
  cursor: 'pointer',
  fontSize: '1rem',
  boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
  transition: 'background 0.2s',
};
const googleBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  background: '#fff',
  color: '#222',
  border: '1px solid #ccc',
  borderRadius: '0.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  fontWeight: 500,
  fontSize: '1rem',
  marginTop: 0,
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  cursor: 'pointer',
};
const separatorStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  margin: '1.5rem 0',
};
const lineStyle: React.CSSProperties = {
  flex: 1,
  height: 1,
  background: '#e5e7eb',
};
const orStyle: React.CSSProperties = {
  margin: '0 1rem',
  color: '#888',
  fontSize: '0.95rem',
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Appeler l'API de login avec email et mot de passe
  };

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', background: '#f3f4f6' }}>
      <div style={cardStyle}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>Connexion</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 12 }}>
          <label style={labelStyle}>
            Email
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </label>
          <label style={labelStyle}>
            Mot de passe
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </label>
          <button 
            type="submit" 
            style={buttonStyle}
          >
            Se connecter
          </button>
        </form>
        <div style={separatorStyle}>
          <div style={lineStyle} />
          <span style={orStyle}>ou</span>
          <div style={lineStyle} />
        </div>
        <button 
          onClick={handleGoogleLogin} 
          style={googleBtnStyle}
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} />
          Se connecter avec Google
        </button>
      </div>
    </main>
  );
} 