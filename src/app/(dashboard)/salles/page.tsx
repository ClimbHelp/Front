'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './salles.module.css';

interface Salle {
  id: number;
  nom: string;
  description?: string;
  email?: string;
  telephone?: string;
  localisation?: number; // ID de la localisation, pas une string
  nombre_voies?: number; // Nombre de voies dans la salle
}

export default function SallesPage() {
  const [salles, setSalles] = useState<Salle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSalles();
  }, []);

  const fetchSalles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BDD_SERVICE_URL}/api/salles`);
      const data = await response.json();
      
      if (data.success) {
        setSalles(data.data);
      } else {
        setError('Erreur lors du chargement des salles');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const filteredSalles = salles.filter(salle =>
    salle.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (salle.description && salle.description.toLowerCase().includes(searchTerm.toLowerCase()))
    // Note: localisation est un ID, pas une string, donc on ne peut pas rechercher dedans
  );

  // Fonction pour tronquer le texte
  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Chargement des salles...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Salles d'escalade</h1>
        <p className={styles.subtitle}>Découvrez les salles d'escalade disponibles</p>
      </div>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Rechercher une salle..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <div className={styles.sallesGrid}>
        {filteredSalles.length === 0 ? (
          <div className={styles.noResults}>
            {searchTerm ? 'Aucune salle trouvée pour votre recherche.' : 'Aucune salle disponible.'}
          </div>
        ) : (
          filteredSalles.map((salle) => (
            <div key={salle.id} className={styles.salleCard}>
              <div className={styles.salleHeader}>
                <h3 className={styles.salleName}>{salle.nom}</h3>
                {salle.localisation && (
                  <span className={styles.location}>{salle.localisation}</span>
                )}
              </div>
              
              {salle.description && (
                <p className={styles.description}>{truncateText(salle.description, 80)}</p>
              )}
              
              <div className={styles.salleStats}>
                <div className={styles.statItem}>
                  <span className={styles.statIcon}>🧗‍♀️</span>
                  <span className={styles.statValue}>{salle.nombre_voies || 0}</span>
                  <span className={styles.statLabel}>voies</span>
                </div>
              </div>
              
              <Link href={`/salles/${salle.id.toString()}`} className={styles.viewButton}>
                Voir les voies
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 