'use client'

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ProfileContainer, ProfileContent, ProfileHeader, ProfileAvatar, ProfileName, ProfileEmail,
  FloatingElements, FloatingElement, HoldsPattern, Hold
} from "../../components/auth/AuthStyles";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";

// Styles pour le formulaire d'édition
const editFormStyle: React.CSSProperties = {
  background: 'white',
  borderRadius: '20px',
  padding: '2.5rem',
  marginBottom: '2rem',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  animation: 'slideInUp 0.6s ease-out',
};

const formGroupStyle: React.CSSProperties = {
  marginBottom: '1.5rem',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontWeight: 600,
  fontSize: '0.95rem',
  color: '#2c3e50',
  marginBottom: '0.5rem',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.875rem 1rem',
  border: '2px solid #e1e8ed',
  borderRadius: '12px',
  background: '#f8f9fa',
  fontSize: '1rem',
  transition: 'all 0.3s ease',
  color: '#2c3e50',
  boxSizing: 'border-box',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: '100px',
  resize: 'vertical',
  fontFamily: 'inherit',
};

const buttonGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  justifyContent: 'center',
  marginTop: '2rem',
};

const primaryButtonStyle: React.CSSProperties = {
  padding: '0.875rem 2rem',
  background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(231, 76, 60, 0.3)',
};

const secondaryButtonStyle: React.CSSProperties = {
  ...primaryButtonStyle,
  background: 'white',
  color: '#2c3e50',
  border: '2px solid #e1e8ed',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 600,
  color: '#2c3e50',
  marginBottom: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '1.5rem',
};

const checkboxGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
};

const checkboxStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  cursor: 'pointer',
};

const checkboxInputStyle: React.CSSProperties = {
  width: '18px',
  height: '18px',
  cursor: 'pointer',
};

const checkboxLabelStyle: React.CSSProperties = {
  fontSize: '0.95rem',
  color: '#2c3e50',
  cursor: 'pointer',
};

interface ProfileFormData {
  // Informations personnelles
  bio: string;
  
  // Préférences de grimpe
  typeGrimpe: string[];
  niveauPrefere: string;
  frequence: string;
  objectifs: string;
  
  // Contact et notifications
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  
  // Préférences d'affichage
  theme: string;
  langue: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const { userInfo } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    bio: '',
    typeGrimpe: [],
    niveauPrefere: '',
    frequence: '',
    objectifs: '',
    notifications: {
      email: true,
      push: false,
      sms: false,
    },
    theme: 'light',
    langue: 'fr',
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
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
        const speed = (i + 1) * 0.2;
        const xPos = (x - 0.5) * speed * 20;
        const yPos = (y - 0.5) * speed * 20;
        ref.current.style.transform = `translate(${xPos}px, ${yPos}px)`;
      });
    }
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Charger les données existantes
  useEffect(() => {
    // TODO: Charger les données existantes depuis l'API
    // Pour l'instant, on utilise des données par défaut
    setFormData({
      bio: 'Passionné d\'escalade depuis 3 ans, j\'aime particulièrement le bloc et les voies en falaise.',
      typeGrimpe: ['Bloc', 'Voies'],
      niveauPrefere: '5c-6b',
      frequence: '2-3 fois par semaine',
      objectifs: 'Atteindre le niveau 7a en bloc et faire ma première voie en falaise',
      notifications: {
        email: true,
        push: false,
        sms: false,
      },
      theme: 'light',
      langue: 'fr',
    });
  }, []);

  const handleInputChange = (field: keyof ProfileFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (type: keyof ProfileFormData['notifications'], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: value
      }
    }));
  };

  const handleTypeGrimpeChange = (type: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      typeGrimpe: checked 
        ? [...prev.typeGrimpe, type]
        : prev.typeGrimpe.filter(t => t !== type)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // TODO: Appeler l'API pour sauvegarder les modifications
      console.log('Sauvegarde des données:', formData);
      
      // Simulation d'un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getUserDisplayName = () => {
    if (!userInfo?.username) return { firstName: "Utilisateur", lastName: "" };
    
    const nameParts = userInfo.username.split(' ');
    if (nameParts.length >= 2) {
      return {
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(' ')
      };
    } else {
      return {
        firstName: userInfo.username,
        lastName: ""
      };
    }
  };

  const { firstName, lastName } = getUserDisplayName();

  return (
    <ProtectedRoute>
      <ProfileContainer>
        <FloatingElements>
          <FloatingElement ref={floatRefs[0]} $top="10%" $right="8%">✏️</FloatingElement>
          <FloatingElement ref={floatRefs[1]} $top="60%" $left="5%">📝</FloatingElement>
          <FloatingElement ref={floatRefs[2]} $bottom="15%" $right="12%">⚙️</FloatingElement>
        </FloatingElements>
        
        <HoldsPattern>
          <Hold $delay={0} />
          <Hold $delay={0.5} />
          <Hold $delay={1} />
          <Hold $delay={1.5} />
        </HoldsPattern>

        <ProfileContent>
          <ProfileHeader>
            <ProfileAvatar>
              {getInitials(firstName, lastName)}
            </ProfileAvatar>
            <ProfileName>{firstName} {lastName}</ProfileName>
            <ProfileEmail>{userInfo?.email || "Email non disponible"}</ProfileEmail>
          </ProfileHeader>

          <form onSubmit={handleSubmit} style={editFormStyle}>
            <div style={sectionTitleStyle}>
              <span>✏️</span>
              Modifier mon profil
            </div>

            {/* Section Informations personnelles */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>Bio</label>
              <textarea
                style={textareaStyle}
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Parlez-nous de votre passion pour l'escalade..."
                maxLength={500}
              />
              <small style={{ color: '#7f8c8d', fontSize: '0.85rem' }}>
                {formData.bio.length}/500 caractères
              </small>
            </div>

            {/* Section Préférences de grimpe */}
            <div style={sectionTitleStyle}>
              <span>🧗‍♂️</span>
              Préférences de grimpe
            </div>

            <div style={gridStyle}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Types de grimpe</label>
                <div style={checkboxGroupStyle}>
                  {['Bloc', 'Voies', 'Falaise', 'Via Ferrata', 'Alpinisme'].map(type => (
                    <label key={type} style={checkboxStyle}>
                      <input
                        type="checkbox"
                        style={checkboxInputStyle}
                        checked={formData.typeGrimpe.includes(type)}
                        onChange={(e) => handleTypeGrimpeChange(type, e.target.checked)}
                      />
                      <span style={checkboxLabelStyle}>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Niveau préféré</label>
                <select
                  style={selectStyle}
                  value={formData.niveauPrefere}
                  onChange={(e) => handleInputChange('niveauPrefere', e.target.value)}
                >
                  <option value="">Sélectionner un niveau</option>
                  <option value="3a-4a">3a - 4a (Débutant)</option>
                  <option value="4b-5a">4b - 5a (Intermédiaire)</option>
                  <option value="5b-6a">5b - 6a (Avancé)</option>
                  <option value="6b-7a">6b - 7a (Expert)</option>
                  <option value="7b+">7b+ (Elite)</option>
                </select>
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Fréquence de grimpe</label>
                <select
                  style={selectStyle}
                  value={formData.frequence}
                  onChange={(e) => handleInputChange('frequence', e.target.value)}
                >
                  <option value="">Sélectionner une fréquence</option>
                  <option value="1 fois par semaine">1 fois par semaine</option>
                  <option value="2-3 fois par semaine">2-3 fois par semaine</option>
                  <option value="4-5 fois par semaine">4-5 fois par semaine</option>
                  <option value="Quotidien">Quotidien</option>
                  <option value="Occasionnel">Occasionnel</option>
                </select>
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Objectifs</label>
                <textarea
                  style={textareaStyle}
                  value={formData.objectifs}
                  onChange={(e) => handleInputChange('objectifs', e.target.value)}
                  placeholder="Vos objectifs en escalade..."
                  maxLength={300}
                />
                <small style={{ color: '#7f8c8d', fontSize: '0.85rem' }}>
                  {formData.objectifs.length}/300 caractères
                </small>
              </div>
            </div>

            {/* Section Notifications */}
            <div style={sectionTitleStyle}>
              <span>🔔</span>
              Notifications
            </div>

            <div style={gridStyle}>
              <div style={formGroupStyle}>
                <label style={checkboxStyle}>
                  <input
                    type="checkbox"
                    style={checkboxInputStyle}
                    checked={formData.notifications.email}
                    onChange={(e) => handleNotificationChange('email', e.target.checked)}
                  />
                  <span style={checkboxLabelStyle}>Notifications par email</span>
                </label>
              </div>

              <div style={formGroupStyle}>
                <label style={checkboxStyle}>
                  <input
                    type="checkbox"
                    style={checkboxInputStyle}
                    checked={formData.notifications.push}
                    onChange={(e) => handleNotificationChange('push', e.target.checked)}
                  />
                  <span style={checkboxLabelStyle}>Notifications push</span>
                </label>
              </div>

              <div style={formGroupStyle}>
                <label style={checkboxStyle}>
                  <input
                    type="checkbox"
                    style={checkboxInputStyle}
                    checked={formData.notifications.sms}
                    onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                  />
                  <span style={checkboxLabelStyle}>Notifications SMS</span>
                </label>
              </div>
            </div>

            {/* Section Préférences */}
            <div style={sectionTitleStyle}>
              <span>⚙️</span>
              Préférences
            </div>

            <div style={gridStyle}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Thème</label>
                <select
                  style={selectStyle}
                  value={formData.theme}
                  onChange={(e) => handleInputChange('theme', e.target.value)}
                >
                  <option value="light">Clair</option>
                  <option value="dark">Sombre</option>
                  <option value="auto">Automatique</option>
                </select>
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Langue</label>
                <select
                  style={selectStyle}
                  value={formData.langue}
                  onChange={(e) => handleInputChange('langue', e.target.value)}
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>

            {/* Boutons d'action */}
            <div style={buttonGroupStyle}>
              <button
                type="button"
                onClick={handleCancel}
                style={secondaryButtonStyle}
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="submit"
                style={primaryButtonStyle}
                disabled={loading}
              >
                {loading ? 'Sauvegarde...' : saved ? 'Sauvegardé !' : 'Sauvegarder'}
              </button>
            </div>
          </form>
        </ProfileContent>
      </ProfileContainer>
    </ProtectedRoute>
  );
} 