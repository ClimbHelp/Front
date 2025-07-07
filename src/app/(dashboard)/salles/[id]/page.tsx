'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Map from '../../../../components/Map';
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
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [selectedOuvreurs, setSelectedOuvreurs] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Générer la liste unique des ouvreurs et types de voie
  const ouvreurs = salle ? Array.from(new Set(salle.voies.map(v => v.ouvreur).filter(Boolean))) : [];
  const typesDeVoie = salle ? Array.from(new Set(salle.voies.map(v => v.type_de_voie).filter(Boolean))) : [];

  // Gestion du changement multi-select ouvreur
  const handleOuvreurChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedOuvreurs(selected);
  };

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
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  // Filtrage et tri combinés
  const filteredVoies = (salle?.voies || [])
    .filter(voie =>
      (!filterDifficulty || voie.cotation === filterDifficulty) &&
      (selectedOuvreurs.length === 0 || (voie.ouvreur && selectedOuvreurs.includes(voie.ouvreur))) &&
      (!selectedType || voie.type_de_voie === selectedType)
    )
    .sort((a, b) => {
      if (!a.cotation || !b.cotation) return 0;
      if (sortOrder === 'asc') {
        return a.cotation.localeCompare(b.cotation, undefined, { numeric: true });
      } else {
        return b.cotation.localeCompare(a.cotation, undefined, { numeric: true });
      }
    });

  const getDifficultyColor = (difficulte: string) => {
    const colors: { [key: string]: string } = {
      '3a': '#00ff00',
      '3b': '#00ff00',
      '3c': '#00ff00',
      '4a': '#ffff00',
      '4b': '#ffff00',
      '4c': '#ffff00',
      '5a': '#ff8000',
      '5b': '#ff8000',
      '5c': '#ff8000',
      '6a': '#ff0000',
      '6b': '#ff0000',
      '6c': '#ff0000',
      '7a': '#800080',
      '7b': '#800080',
      '7c': '#800080',
      '8a': '#000000',
      '8b': '#000000',
      '8c': '#000000',
    };
    // On retire le + éventuel pour la couleur
    const base = difficulte.toLowerCase().replace('+', '');
    return colors[base] || '#666';
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
          href={`/salles/${salle.id}/seance-nouvelle` as any}
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
          <h2>Voies d'escalade ({salle.voies.length})</h2>
          <div className={styles.filterContainer} style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Filtre cotation */}
            <label style={{ fontWeight: 500 }}>Cotation&nbsp;
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">Toutes</option>
                <option value="3a">3a</option>
                <option value="3b">3b</option>
                <option value="3c">3c</option>
                <option value="4a">4a</option>
                <option value="4b">4b</option>
                <option value="4c">4c</option>
                <option value="5a">5a</option>
                <option value="5a+">5a+</option>
                <option value="5b">5b</option>
                <option value="5b+">5b+</option>
                <option value="5c">5c</option>
                <option value="5c+">5c+</option>
                <option value="6a">6a</option>
                <option value="6a+">6a+</option>
                <option value="6b">6b</option>
                <option value="6b+">6b+</option>
                <option value="6c">6c</option>
                <option value="6c+">6c+</option>
                <option value="7a">7a</option>
                <option value="7a+">7a+</option>
                <option value="7b">7b</option>
                <option value="7b+">7b+</option>
                <option value="7c">7c</option>
                <option value="7c+">7c+</option>
                <option value="8a">8a</option>
                <option value="8a+">8a+</option>
                <option value="8b">8b</option>
                <option value="8b+">8b+</option>
                <option value="8c">8c</option>
                <option value="8c+">8c+</option>
              </select>
            </label>
            {/* Tri cotation */}
            <label style={{ fontWeight: 500 }}>Tri&nbsp;
              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}
                className={styles.filterSelect}
              >
                <option value="asc">Croissant</option>
                <option value="desc">Décroissant</option>
              </select>
            </label>
            {/* Filtre ouvreur multi-select */}
            <label style={{ fontWeight: 500 }}>Ouvreur(s)&nbsp;
              <select
                multiple
                value={selectedOuvreurs}
                onChange={handleOuvreurChange}
                className={styles.filterSelect}
                style={{ minWidth: 120, minHeight: 60 }}
              >
                {ouvreurs.map(ouvreur => (
                  <option key={ouvreur} value={ouvreur}>{ouvreur}</option>
                ))}
              </select>
            </label>
            {/* Filtre type de voie */}
            <label style={{ fontWeight: 500 }}>Type&nbsp;
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">Tous</option>
                {typesDeVoie.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {filteredVoies.length === 0 ? (
          <div className={styles.noVoies}>
            {filterDifficulty ? 'Aucune voie trouvée pour cette difficulté.' : 'Aucune voie disponible dans cette salle.'}
          </div>
        ) : (
          <div className={styles.voiesGrid}>
            {filteredVoies.map((voie) => (
              <div key={voie.id} className={styles.voieCard}>
                <div className={styles.voieHeader}>
                  <h3 className={styles.voieName}>{voie.nom ? voie.nom : `Voie #${voie.id}`}</h3>
                  {voie.cotation && (
                    <span 
                      className={styles.difficulty}
                      style={{ backgroundColor: getDifficultyColor(voie.cotation) }}
                    >
                      {voie.cotation}
                    </span>
                  )}
                </div>
                
                {voie.ouvreur && (
                  <div className={styles.voieInfo}>
                    <span className={styles.infoLabel}>Ouvreur:</span>
                    <span className={styles.infoValue}>{voie.ouvreur}</span>
                  </div>
                )}
                
                {voie.type_de_voie && (
                  <div className={styles.voieInfo}>
                    <span className={styles.infoLabel}>Type:</span>
                    <span className={styles.infoValue}>{voie.type_de_voie}</span>
                  </div>
                )}
                
                {voie.description && (
                  <p className={styles.voieDescription}>{voie.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 