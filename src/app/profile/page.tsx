import React from "react";

async function fetchProfileData() {
  // TODO: Implémenter la récupération des données du profil utilisateur
}

export default function ProfilePage() {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', background: '#f3f4f6' }}>
      <div style={{ background: '#fff', borderRadius: '1.25rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '2rem', width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>Profil</h1>
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: 32 }}>Voici votre profil utilisateur.</p>
        {/* TODO: Afficher les informations du profil */}
      </div>
    </main>
  );
} 