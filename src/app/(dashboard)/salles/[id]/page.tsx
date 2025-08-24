'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Map from '../../../../components/Map';
import VoiesModal from '../../../../components/VoiesModal';
import styles from './salle-detail.module.css';

interface Voie {
  id: number;
  salle_id: number;
  nom?: string; // Ajout du nom de la voie si disponible
  cotation?: string;        // Difficulté en escalade
  description?: string;
  ouvreur?: string;         // Personne qui a ouvert la voie
  type_de_voie?: string;    // Type de voie (déversante, verticale, etc.)
}

interface Localisation {
  latitude: number;
  longitude: number;
}

interface Salle {
  id: number;
  nom: string;
  description?: string;
  email?: string;
  telephone?: string;
  localisation?: number; // ID de la localisation
  localisation_data?: Localisation; // Données de localisation
  voies: Voie[];
}

export default function SalleDetailPage() {
  const params = useParams();
  const salleId = params.id as string;
  
  const [salle, setSalle] = useState<Salle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isVoiesModalOpen, setIsVoiesModalOpen] = useState(false);



  useEffect(() => {
    if (salleId) {
      fetchSalleDetail();
    }
  }, [salleId]);

  const fetchSalleDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BDD_SERVICE_URL}/api/salles/${salleId}/voies`);
      const data = await response.json();
      
      if (data.success) {
        setSalle(data.data);
      } else {
        setError('Erreur lors du chargement de la salle');
      }
    } catch {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };



  // Correction robuste pour la localisation
  let localisation;
  if (salle && salle.localisation) {
    if (Array.isArray(salle.localisation)) {
      localisation = salle.localisation.length > 0 ? salle.localisation[0] : undefined;
    } else if (
      typeof salle.localisation === 'object' &&
      salle.localisation !== null &&
      'latitude' in salle.localisation &&
      'longitude' in salle.localisation
    ) {
      localisation = salle.localisation;
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Chargement de la salle...</div>
      </div>
    );
  }

  if (error || !salle) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          {error || 'Salle non trouvée'}
        </div>
        <Link href="/salles" className={styles.backButton}>
          Retour aux salles
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/salles" className={styles.backLink}>
          ← Retour aux salles
        </Link>
        <h1 className={styles.title}>{salle.nom}</h1>
        <Link
          href={`/salles/${salle.id}/seance-nouvelle`}
          className={styles.createSeanceButton}
          style={{ display: 'inline-block', margin: '16px 0', padding: '8px 16px', background: '#0070f3', color: '#fff', borderRadius: 4, textDecoration: 'none', fontWeight: 500 }}
        >
          + Nouvelle séance dans cette salle
        </Link>
        {/* Suppression de l'affichage direct de salle.localisation */}
        {/* {salle.localisation && (
          <p className={styles.location}>Localisation: {localisation && localisation.latitude}, {localisation && localisation.longitude}</p>
        )} */}
      </div>

      {salle.description && (
        <div className={styles.description}>
          <h2>Description</h2>
          <p>{salle.description}</p>
        </div>
      )}

      {/* Carte interactive avec vérification des coordonnées */}
      {localisation && localisation.latitude && localisation.longitude && (
        <div className={styles.mapSection}>
          <h2>Localisation</h2>
          <div className={styles.mapContainer}>
            <Map
              latitude={localisation.latitude}
              longitude={localisation.longitude}
              title={salle.nom}
              height="300px"
            />
          </div>
        </div>
      )}

      <div className={styles.contactSection}>
        <h2>Informations de contact</h2>
        <div className={styles.contactInfo}>
          {salle.email && (
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>Email:</span>
              <a href={`mailto:${salle.email}`} className={styles.contactLink}>
                {salle.email}
              </a>
            </div>
          )}
          {salle.telephone && (
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>Téléphone:</span>
              <a href={`tel:${salle.telephone}`} className={styles.contactLink}>
                {salle.telephone}
              </a>
            </div>
          )}
        </div>
      </div>

      <div className={styles.voiesSection}>
        <div className={styles.voiesHeader}>
          <h2>Voies d&apos;escalade ({salle.voies.length})</h2>
          <button 
            className={styles.viewVoiesButton}
            onClick={() => setIsVoiesModalOpen(true)}
          >
            Voir toutes les voies
          </button>
        </div>
        
        <div className={styles.voiesPreview}>
          <p>Cliquez sur le bouton ci-dessus pour voir toutes les voies d'escalade avec filtres avancés.</p>
        </div>
      </div>

      <VoiesModal
        isOpen={isVoiesModalOpen}
        onClose={() => setIsVoiesModalOpen(false)}
        voies={salle.voies}
        salleName={salle.nom}
      />
    </div>
  );
} 