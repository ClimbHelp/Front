'use client'

import React, { useState } from "react";

async function fetchRegisterData() {
  // TODO: Implémenter la récupération des données pour l'inscription
}

function handleGoogleRegister() {
  console.log("Google register");
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

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    // TODO: Appeler l'API d'inscription avec les données du formulaire
  };

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', background: '#f3f4f6' }}>
      <div style={cardStyle}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>Inscription</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <label style={{ ...labelStyle, flex: 1 }}>
              Prénom
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </label>
            <label style={{ ...labelStyle, flex: 1 }}>
              Nom
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </label>
          </div>
          <label style={labelStyle}>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </label>
          <label style={labelStyle}>
            Mot de passe
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              style={inputStyle}
            />
          </label>
          <label style={labelStyle}>
            Confirmer le mot de passe
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              style={inputStyle}
            />
          </label>
          <button 
            type="submit" 
            style={buttonStyle}
          >
            S'inscrire
          </button>
        </form>
        <div style={separatorStyle}>
          <div style={lineStyle} />
          <span style={orStyle}>ou</span>
          <div style={lineStyle} />
        </div>
        <button 
          onClick={handleGoogleRegister} 
          style={googleBtnStyle}
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} />
          S'inscrire avec Google
        </button>
      </div>
    </main>
  );
} 