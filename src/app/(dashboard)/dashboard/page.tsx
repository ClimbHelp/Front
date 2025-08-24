'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Redirection en cours
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Tableau de bord</h1>
          <p className={styles.welcome}>
            Bienvenue, {user.name} !
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <h3>Voies grimpées</h3>
              <p className={styles.statNumber}>24</p>
              <p className={styles.statLabel}>Ce mois</p>
            </div>
            
            <div className={styles.statCard}>
              <h3>Niveau moyen</h3>
              <p className={styles.statNumber}>6a</p>
              <p className={styles.statLabel}>Progression</p>
            </div>
            
            <div className={styles.statCard}>
              <h3>Sessions</h3>
              <p className={styles.statNumber}>12</p>
              <p className={styles.statLabel}>Ce mois</p>
            </div>
          </div>

          <div className={styles.sections}>
            <div className={styles.section}>
              <h2>Activité récente</h2>
              <div className={styles.activityList}>
                <div className={styles.activityItem}>
                  <span className={styles.activityDate}>Aujourd&apos;hui</span>
                  <span className={styles.activityText}>Voie 6b+ grimpée à Climb Up</span>
                </div>
                <div className={styles.activityItem}>
                  <span className={styles.activityDate}>Hier</span>
                  <span className={styles.activityText}>Session de 2h à Vertical Art</span>
                </div>
                <div className={styles.activityItem}>
                  <span className={styles.activityDate}>Il y a 3 jours</span>
                  <span className={styles.activityText}>Nouveau niveau atteint : 6c</span>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h2>Prochaines sessions</h2>
              <div className={styles.upcomingList}>
                <div className={styles.upcomingItem}>
                  <span className={styles.upcomingDate}>Demain 14h</span>
                  <span className={styles.upcomingText}>Session avec le groupe</span>
                </div>
                <div className={styles.upcomingItem}>
                  <span className={styles.upcomingDate}>Samedi 10h</span>
                  <span className={styles.upcomingText}>Compétition locale</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 