'use client'

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ProfileContainer, ProfileContent, ProfileHeader, ProfileAvatar, ProfileName, ProfileEmail, ProfileStats,
  ProfileStat, ProfileStatNumber, ProfileStatLabel, ProfileSection, ProfileSectionTitle, ProfileGrid,
  ProfileCard, ProfileCardTitle, ProfileCardValue, LogoutButton, FloatingElements, FloatingElement, HoldsPattern, Hold
} from "../components/auth/AuthStyles";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";

async function fetchProfileData() {
  // TODO: Implémenter la récupération des données du profil utilisateur
  return {
    stats: {
      totalAscensions: 156,
      sallesVisitees: 8,
      niveauMax: "6c",
      joursGrimpe: 45
    },
    preferences: {
      typeGrimpe: "Bloc",
      niveauPrefere: "5c-6b",
      frequence: "2-3 fois par semaine"
    },
    derniereActivite: {
      date: "2024-01-15",
      salle: "Vertical Art",
      voies: 12
    }
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const { userInfo, logout, getToken } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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

  // Charger les données du profil
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const data = await fetchProfileData();
        setProfileData(data);
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Extraire le prénom et nom depuis le username du token
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

  if (loading) {
    return (
      <ProfileContainer>
        <ProfileContent>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '2rem', color: '#7f8c8d' }}>Chargement...</div>
          </div>
        </ProfileContent>
      </ProfileContainer>
    );
  }

  const { firstName, lastName } = getUserDisplayName();

  return (
    <ProtectedRoute>
      <ProfileContainer>
        <FloatingElements>
          <FloatingElement ref={floatRefs[0]} $top="10%" $right="8%">🧗‍♂️</FloatingElement>
          <FloatingElement ref={floatRefs[1]} $top="60%" $left="5%">🏔️</FloatingElement>
          <FloatingElement ref={floatRefs[2]} $bottom="15%" $right="12%">⛰️</FloatingElement>
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
            
            <ProfileStats>
              <ProfileStat>
                <ProfileStatNumber>{profileData?.stats.totalAscensions || 0}</ProfileStatNumber>
                <ProfileStatLabel>Ascensions</ProfileStatLabel>
              </ProfileStat>
              <ProfileStat>
                <ProfileStatNumber>{profileData?.stats.sallesVisitees || 0}</ProfileStatNumber>
                <ProfileStatLabel>Salles visitées</ProfileStatLabel>
              </ProfileStat>
              <ProfileStat>
                <ProfileStatNumber>{profileData?.stats.niveauMax || "N/A"}</ProfileStatNumber>
                <ProfileStatLabel>Niveau max</ProfileStatLabel>
              </ProfileStat>
              <ProfileStat>
                <ProfileStatNumber>{profileData?.stats.joursGrimpe || 0}</ProfileStatNumber>
                <ProfileStatLabel>Jours de grimpe</ProfileStatLabel>
              </ProfileStat>
            </ProfileStats>
          </ProfileHeader>

          <ProfileSection>
            <ProfileSectionTitle>Préférences de grimpe</ProfileSectionTitle>
            <ProfileGrid>
              <ProfileCard>
                <ProfileCardTitle>Type de grimpe préféré</ProfileCardTitle>
                <ProfileCardValue>{profileData?.preferences.typeGrimpe || "Non défini"}</ProfileCardValue>
              </ProfileCard>
              <ProfileCard>
                <ProfileCardTitle>Niveau préféré</ProfileCardTitle>
                <ProfileCardValue>{profileData?.preferences.niveauPrefere || "Non défini"}</ProfileCardValue>
              </ProfileCard>
              <ProfileCard>
                <ProfileCardTitle>Fréquence de grimpe</ProfileCardTitle>
                <ProfileCardValue>{profileData?.preferences.frequence || "Non définie"}</ProfileCardValue>
              </ProfileCard>
            </ProfileGrid>
          </ProfileSection>

          <ProfileSection>
            <ProfileSectionTitle>Dernière activité</ProfileSectionTitle>
            <ProfileGrid>
              <ProfileCard>
                <ProfileCardTitle>Date</ProfileCardTitle>
                <ProfileCardValue>
                  {profileData?.derniereActivite?.date 
                    ? new Date(profileData.derniereActivite.date).toLocaleDateString('fr-FR')
                    : "Aucune activité"
                  }
                </ProfileCardValue>
              </ProfileCard>
              <ProfileCard>
                <ProfileCardTitle>Salle</ProfileCardTitle>
                <ProfileCardValue>{profileData?.derniereActivite?.salle || "Aucune salle"}</ProfileCardValue>
              </ProfileCard>
              <ProfileCard>
                <ProfileCardTitle>Voies grimpées</ProfileCardTitle>
                <ProfileCardValue>
                  {profileData?.derniereActivite?.voies 
                    ? `${profileData.derniereActivite.voies} voies`
                    : "Aucune voie"
                  }
                </ProfileCardValue>
              </ProfileCard>
            </ProfileGrid>
          </ProfileSection>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              onClick={() => router.push('/profile/edit')}
              style={{
                background: 'linear-gradient(135deg, #3498db, #2980b9)',
                color: 'white',
                padding: '0.875rem 2rem',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)',
                marginRight: '1rem'
              }}
            >
              Modifier le profil
            </button>
            <LogoutButton onClick={handleLogout}>
              Se déconnecter
            </LogoutButton>
          </div>
        </ProfileContent>
      </ProfileContainer>
    </ProtectedRoute>
  );
} 