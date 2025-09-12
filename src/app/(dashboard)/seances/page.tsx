'use client'

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./seances.module.css";

interface VoieSeance {
  id: number;
  seance_id: number;
  voie_id: number;
  reussie: boolean;
  avis: string;
  voies?: {
    id: number;
    nom?: string;
    cotation?: string;
    type_de_voie?: string;
    ouvreur?: string;
  };
}

interface Seance {
  id: number;
  user_id: number;
  date: string;
  avis: string;
  salle_id: number;
  salle_nom?: string;
  voie?: VoieSeance[];
}

// Fonction pour la couleur de cotation
function getDifficultyColor(difficulte: string): string {
  const colors: { [key: string]: string } = {
    '3a': '#00ff00', '3b': '#00ff00', '3c': '#00ff00',
    '4a': '#ffff00', '4b': '#ffff00', '4c': '#ffff00',
    '5a': '#ff8000', '5b': '#ff8000', '5c': '#ff8000',
    '6a': '#ff0000', '6b': '#ff0000', '6c': '#ff0000',
    '7a': '#800080', '7b': '#800080', '7c': '#800080',
    '8a': '#000000', '8b': '#000000', '8c': '#000000',
  };
  const base = difficulte?.toLowerCase().replace('+', '');
  return colors[base] || '#666';
}

async function fetchSeancesData(userId: number) {
  try {
    // Récupérer les séances de l'utilisateur
    const seancesResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BDD_SERVICE_URL}/api/seances/user/${userId}`
    );
    
    if (!seancesResponse.ok) {
      throw new Error('Erreur lors de la récupération des séances');
    }
    
    const seancesData = await seancesResponse.json();
    const seances = seancesData.success ? seancesData.data : [];
    
    if (seances.length === 0) {
      return {
        seances: [],
        stats: {
          totalSeances: 0,
          totalVoies: 0,
          voiesReussies: 0,
          tauxReussite: 0
        }
      };
    }
    
    // Pour chaque séance, récupérer les détails complets avec les voies
    const seancesCompletes = await Promise.all(
      seances.map(async (seance: Seance) => {
        try {
          const seanceCompleteResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BDD_SERVICE_URL}/api/seances/${seance.id}/complete`
          );
          
          if (seanceCompleteResponse.ok) {
            const seanceCompleteData = await seanceCompleteResponse.json();
            return seanceCompleteData.success ? seanceCompleteData.data : seance;
          }
          return seance;
        } catch (error) {
          console.error(`Erreur lors de la récupération de la séance ${seance.id}:`, error);
          return seance;
        }
      })
    );
    
    // Récupérer les noms des salles
    const sallesUniques = new Set(seancesCompletes.map((s: Seance) => s.salle_id));
    const sallesData: { [key: number]: string } = {};
    
    for (const salleId of sallesUniques) {
      try {
        const salleResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BDD_SERVICE_URL}/api/salles/${salleId}`
        );
        if (salleResponse.ok) {
          const salleData = await salleResponse.json();
          if (salleData.success) {
            sallesData[salleId] = salleData.data.nom;
          }
        }
      } catch (error) {
        console.error(`Erreur lors de la récupération de la salle ${salleId}:`, error);
      }
    }
    
    // Ajouter les noms des salles aux séances
    const seancesAvecSalles = seancesCompletes.map((seance: Seance) => ({
      ...seance,
      salle_nom: sallesData[seance.salle_id] || `Salle #${seance.salle_id}`
    }));
    
    // Calculer les statistiques
    const totalSeances = seancesAvecSalles.length;
    const totalVoies = seancesAvecSalles.reduce((acc: number, seance: Seance) => acc + (seance.voie?.length || 0), 0);
    const voiesReussies = seancesAvecSalles.reduce((acc: number, seance: Seance) => 
      acc + (seance.voie?.filter((v: VoieSeance) => v.reussie).length || 0), 0
    );
    
    // Trier les séances par date (plus récente en premier)
    const seancesTriees = seancesAvecSalles.sort((a: Seance, b: Seance) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return {
      seances: seancesTriees,
      stats: {
        totalSeances,
        totalVoies,
        voiesReussies,
        tauxReussite: totalVoies > 0 ? Math.round((voiesReussies / totalVoies) * 100) : 0
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des séances:', error);
    return {
      seances: [],
      stats: {
        totalSeances: 0,
        totalVoies: 0,
        voiesReussies: 0,
        tauxReussite: 0
      }
    };
  }
}

export default function SeancesPage() {
  const router = useRouter();
  const { userInfo, logout, loading: authLoading } = useAuth();
  const [seancesData, setSeancesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Charger les données des séances
  useEffect(() => {
    const loadSeancesData = async () => {
      if (!userInfo?.id) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const data = await fetchSeancesData(userInfo.id);
        setSeancesData(data);
      } catch (error) {
        console.error("Erreur lors du chargement des séances:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadSeancesData();
    }
  }, [userInfo?.id, authLoading]);

  // Afficher le loader
  if (authLoading || loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>
          <div className={styles.loadingMessage}>Chargement...</div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/' as any);
  };

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>
              Mes Séances d&apos;Escalade
            </h1>
            <p className={styles.subtitle}>
              Suivez vos progrès et vos performances
            </p>
          </div>

          {seancesData?.seances.length > 0 ? (
            seancesData.seances.map((seance: Seance) => {
              const voiesReussies = seance.voie?.filter((v: VoieSeance) => v.reussie).length || 0;
              const totalVoies = seance.voie?.length || 0;
              const tauxReussite = totalVoies > 0 ? Math.round((voiesReussies / totalVoies) * 100) : 0;
              const niveauMax = seance.voie?.reduce((max: string, voie: VoieSeance) => {
                if (voie.reussie && voie.voies?.cotation) {
                  return voie.voies.cotation;
                }
                return max;
              }, '') || 'N/A';

              return (
                <div key={seance.id} className={styles.seanceCard}>
                  {/* Session Header */}
                  <div className={styles.seanceHeader}>
                    <div className={styles.seanceHeaderContent}>
                      <div>
                        <h3 className={styles.seanceInfo}>
                          {new Date(seance.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </h3>
                        <p className={styles.seanceLocation}>
                          📍 {seance.salle_nom}
                        </p>
                      </div>
                      <div className={styles.seanceAvis}>
                        Avis: {seance.avis || 'Aucun avis'}
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                      <div className={styles.statNumber}>
                        {totalVoies}
                      </div>
                      <div className={styles.statLabel}>
                        Voies tentées
                      </div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statNumber}>
                        {voiesReussies}
                      </div>
                      <div className={styles.statLabel}>
                        Réussies
                      </div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statNumber}>
                        {tauxReussite}%
                      </div>
                      <div className={styles.statLabel}>
                        Taux de réussite
                      </div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statNumber}>
                        {niveauMax}
                      </div>
                      <div className={styles.statLabel}>
                        Niveau max
                      </div>
                    </div>
                  </div>

                  {/* Routes Section */}
                  {seance.voie && seance.voie.length > 0 && (
                    <div className={styles.voiesSection}>
                      <div className={styles.voiesTitle}>
                        <span className={styles.voiesTitleIcon}>🧗‍♂️</span>
                        Voies réalisées
                      </div>
                      
                      <div className={styles.voiesGrid}>
                        {seance.voie.map((voieSeance: VoieSeance) => (
                          <div
                            key={voieSeance.id}
                            className={`${styles.voieCard} ${voieSeance.reussie ? styles.success : styles.failed}`}
                          >
                            <div className={styles.voieHeader}>
                              <div className={styles.voieName}>
                                {voieSeance.voies?.nom || `Voie #${voieSeance.voie_id}`}
                              </div>
                              <div className={styles.voieCotation}>
                                {voieSeance.voies?.cotation || 'N/A'}
                              </div>
                            </div>
                            
                            <div className={styles.voieDetails}>
                              {voieSeance.voies?.type_de_voie && (
                                <div className={styles.voieType}>
                                  🏔️ Type: {voieSeance.voies.type_de_voie}
                                </div>
                              )}
                              {voieSeance.voies?.ouvreur && (
                                <div className={styles.voieOuvreur}>
                                  👨‍🎨 Ouvreur: {voieSeance.voies.ouvreur}
                                </div>
                              )}
                            </div>
                            
                            <div className={styles.voieStatus}>
                              <div className={styles.voieStatusIcon}>
                                {voieSeance.reussie ? '✅' : '❌'}
                              </div>
                              <div>
                                <div className={styles.voieStatusText}>
                                  {voieSeance.reussie ? 'Réussie' : 'Échouée'}
                                </div>
                                {voieSeance.avis && (
                                  <div className={styles.voieAvis}>
                                    {voieSeance.avis}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Achievements - seulement si toutes les voies sont réussies */}
                  {seance.voie && seance.voie.length > 0 && voiesReussies === totalVoies && (
                    <div className={styles.achievements}>
                      <div className={styles.achievement}>
                        🏆 Toutes les voies réussies
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🧗‍♂️</div>
              <h3 className={styles.emptyTitle}>Aucune séance enregistrée</h3>
              <p className={styles.emptyMessage}>
                Commencez votre aventure en escalade en créant votre première séance !
              </p>
              <button
                onClick={() => router.push('/salles' as any)}
                className={styles.emptyButton}
              >
                Voir les salles
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className={styles.navigation}>
            <button
              onClick={() => router.push('/profile' as any)}
              className={`${styles.navButton} ${styles.primary}`}
            >
              Retour au profil
            </button>
            <button
              onClick={handleLogout}
              className={`${styles.navButton} ${styles.danger}`}
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
