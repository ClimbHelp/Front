
'use client'
export const dynamic = "force-dynamic";


import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ProfileContainer, ProfileContent, ProfileHeader, ProfileAvatar, ProfileName, ProfileEmail, ProfileStats,
  ProfileStat, ProfileStatNumber, ProfileStatLabel, ProfileSection, ProfileSectionTitle, ProfileGrid,
  ProfileCard, ProfileCardTitle, ProfileCardValue, LogoutButton, FloatingElements, FloatingElement, HoldsPattern, Hold
} from "../../components/auth/AuthStyles";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";

async function fetchProfileData(userId: number) {
  try {
    // Récupérer les statistiques utilisateur depuis l'API
    const statsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BDD_SERVICE_URL}/api/seances/user/${userId}/stats`
    );
    
    if (!statsResponse.ok) {
      throw new Error('Erreur lors de la récupération des statistiques');
    }
    
    const statsData = await statsResponse.json();
    
    // Récupérer la dernière séance pour l'activité récente
    const seancesResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BDD_SERVICE_URL}/api/seances/user/${userId}`
    );
    
    let derniereActivite = {
      date: null as string | null,
      salle: null as string | null,
      voies: 0
    };
    
    if (seancesResponse.ok) {
      const seancesData = await seancesResponse.json();
      if (seancesData.success && seancesData.data && seancesData.data.length > 0) {
        // Trier par date et prendre la plus récente
        const seances = seancesData.data.sort((a: unknown, b: unknown) => 
          new Date((b as { date: string }).date).getTime() - new Date((a as { date: string }).date).getTime()
        );
        const derniereSeance = seances[0];
        
        // Compter les voies de la dernière séance
        const voiesCount = (derniereSeance as { voie?: unknown[] }).voie ? (derniereSeance as { voie: unknown[] }).voie.length : 0;
        
        // Récupérer le nom de la salle si disponible
        let nomSalle = "Salle inconnue";
        if (derniereSeance.salle_id) {
          try {
            const salleResponse = await fetch(
              `${process.env.NEXT_PUBLIC_BDD_SERVICE_URL}/api/salles/${derniereSeance.salle_id}`
            );
            if (salleResponse.ok) {
              const salleData = await salleResponse.json();
              if (salleData.success && salleData.data) {
                nomSalle = salleData.data.nom || `Salle #${derniereSeance.salle_id}`;
              }
            }
          } catch (error) {
            console.error('Erreur lors de la récupération du nom de la salle:', error);
            nomSalle = `Salle #${derniereSeance.salle_id}`;
          }
        }
        
        derniereActivite = {
          date: derniereSeance.date,
          salle: nomSalle,
          voies: voiesCount
        };
      }
    }
    
    return {
      stats: {
        totalAscensions: statsData.data.ascensions || 0,
        sallesVisitees: statsData.data.sallesVisitees || 0,
        niveauMax: statsData.data.niveauMax || "N/A",
        joursGrimpe: statsData.data.joursGrimpe || 0
      },
      preferences: {
        typeGrimpe: "Bloc", // TODO: À implémenter dans le profil utilisateur
        niveauPrefere: "5c-6b", // TODO: À implémenter dans le profil utilisateur
        frequence: "2-3 fois par semaine" // TODO: À implémenter dans le profil utilisateur
      },
      derniereActivite
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    // Retourner des valeurs par défaut en cas d'erreur
    return {
      stats: {
        totalAscensions: 0,
        sallesVisitees: 0,
        niveauMax: "N/A",
        joursGrimpe: 0
      },
      preferences: {
        typeGrimpe: "Non défini",
        niveauPrefere: "Non défini",
        frequence: "Non définie"
      },
      derniereActivite: {
        date: null,
        salle: null,
        voies: 0
      }
    };
  }
}

export default function ProfilePage() {
  const router = useRouter();
  const { userInfo, logout, loading: authLoading } = useAuth();
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
  }, [floatRefs]);

  // Charger les données du profil dynamiquement selon l'utilisateur connecté
  useEffect(() => {
    const loadProfileData = async () => {
      if (!userInfo?.id) {
        setLoading(false); // Ne pas bloquer si pas d'utilisateur
        return;
      }
      setLoading(true);
      try {
        const data = await fetchProfileData(userInfo.id);
        setProfileData(data);
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadProfileData();
    }
      }, [userInfo?.id, authLoading]);

  // Afficher le loader si le contexte Auth charge OU (Auth prêt mais profil en cours)
  if (authLoading || loading) {
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

  const handleLogout = () => {
    logout();
    router.push('/');
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
            {userInfo?.premium && (
              <div style={{ marginTop: '0.5rem', color: '#27ae60', fontWeight: 600, fontSize: '1.1rem' }}>
                <span role="img" aria-label="étoile">⭐</span> Compte Premium
              </div>
            )}
            
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
              onClick={() => router.push('/seances')}
              style={{
                background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                color: 'white',
                padding: '0.875rem 2rem',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(231, 76, 60, 0.3)',
                marginRight: '1rem'
              }}
            >
              Voir mes séances
            </button>
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