'use client'

import { useState, useEffect } from 'react';
import styles from './VoiesModal.module.css';
import CreateVoieModal from './CreateVoieModal';
import EditVoieModal from './EditVoieModal';

interface Voie {
  id: number;
  salle_id: number;
  nom?: string;
  cotation?: string;
  description?: string;
  ouvreur?: string;
  type_de_voie?: string;
}

interface VoiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  voies: Voie[];
  salleName: string;
  salleId: number;
}

export default function VoiesModal({ isOpen, onClose, voies, salleName, salleId }: VoiesModalProps) {
  const [filterCotation, setFilterCotation] = useState('');
  const [filterSort, setFilterSort] = useState('Par nom');
  const [filterOrder, setFilterOrder] = useState('Croissant');
  const [filterTypeVoie, setFilterTypeVoie] = useState('Tous');
  const [selectedOuvreurs, setSelectedOuvreurs] = useState<string[]>([]);
  const [isClimbersDropdownOpen, setIsClimbersDropdownOpen] = useState(false);
  
  // États pour les modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVoie, setSelectedVoie] = useState<Voie | null>(null);

  // Générer la liste unique des ouvreurs
  const ouvreurs = Array.from(new Set(voies.map(v => v.ouvreur).filter((ouvreur): ouvreur is string => Boolean(ouvreur))));

  // Filtrage et tri des voies
  const filteredVoies = voies
    .filter(voie => {
      // Filtre par cotation
      if (filterCotation && filterCotation !== 'Toutes les cotations') {
        if (voie.cotation && voie.cotation !== filterCotation) {
          return false;
        }
      }
      
      // Filtre par type de voie
      if (filterTypeVoie && filterTypeVoie !== 'Tous') {
        if (voie.type_de_voie && voie.type_de_voie !== filterTypeVoie.toLowerCase()) {
          return false;
        }
      }
      
      // Filtre par ouvreur
      if (selectedOuvreurs.length > 0 && (!voie.ouvreur || !selectedOuvreurs.includes(voie.ouvreur))) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (filterSort) {
        case 'Par nom':
          comparison = (a.nom || `Voie #${a.id}`).localeCompare(b.nom || `Voie #${b.id}`);
          break;
        case 'Par cotation':
          if (a.cotation && b.cotation) {
            const aLevel = parseInt(a.cotation.replace(/[^0-9]/g, ''));
            const aLetter = a.cotation.replace(/[0-9]/g, '');
            const bLevel = parseInt(b.cotation.replace(/[^0-9]/g, ''));
            const bLetter = b.cotation.replace(/[0-9]/g, '');
            
            const aValue = aLevel * 10 + (aLetter.charCodeAt(0) - 97);
            const bValue = bLevel * 10 + (bLetter.charCodeAt(0) - 97);
            comparison = aValue - bValue;
          }
          break;
        case 'Par difficulté':
          if (a.cotation && b.cotation) {
            const aLevel = parseInt(a.cotation.replace(/[^0-9]/g, ''));
            const aLetter = a.cotation.replace(/[0-9]/g, '');
            const bLevel = parseInt(b.cotation.replace(/[^0-9]/g, ''));
            const bLetter = b.cotation.replace(/[0-9]/g, '');
            
            const aValue = aLevel * 10 + (aLetter.charCodeAt(0) - 97);
            const bValue = bLevel * 10 + (bLetter.charCodeAt(0) - 97);
            comparison = aValue - bValue;
          }
          break;
        case 'Par date':
          comparison = a.id - b.id; // Utilise l'ID comme proxy pour la date
          break;
      }
      
      return filterOrder === 'Croissant' ? comparison : -comparison;
    });

  const getDifficultyColor = (difficulte: string) => {
    const colors: { [key: string]: string } = {
      '3a': '#00ff00', '3b': '#00ff00', '3c': '#00ff00',
      '4a': '#ffff00', '4b': '#ffff00', '4c': '#ffff00',
      '5a': '#ff8000', '5b': '#ff8000', '5c': '#ff8000',
      '6a': '#ff0000', '6b': '#ff0000', '6c': '#ff0000',
      '7a': '#800080', '7b': '#800080', '7c': '#800080',
      '8a': '#000000', '8b': '#000000', '8c': '#000000',
    };
    const base = difficulte.toLowerCase().replace('+', '');
    return colors[base] || '#666';
  };

  const toggleOuvreur = (ouvreur: string) => {
    setSelectedOuvreurs(prev => 
      prev.includes(ouvreur) 
        ? prev.filter(o => o !== ouvreur)
        : [...prev, ouvreur]
    );
  };

  const removeOuvreur = (ouvreur: string) => {
    setSelectedOuvreurs(prev => prev.filter(o => o !== ouvreur));
  };

  const handleCreateVoie = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditVoie = (voie: Voie) => {
    setSelectedVoie(voie);
    setIsEditModalOpen(true);
  };

  const handleModalSuccess = () => {
    // Ici on pourrait rafraîchir les données
    console.log('Modal action successful');
  };

  // Fermer le modal avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <div className={styles.titleSection}>
                <div className={styles.mountainIcon}>⛰️</div>
                <div className={styles.titleText}>
                  <h1>Voies d&apos;Escalade</h1>
                  <div className={styles.subtitle}>{salleName}</div>
                </div>
              </div>
              <div className={styles.headerActions}>
                <button className={styles.createButton} onClick={handleCreateVoie}>
                  ✨ Créer une voie
                </button>
                <div className={styles.routeCount}>{filteredVoies.length} voies</div>
              </div>
            </div>
          </div>

          <div className={styles.controls}>
            <div className={styles.controlsGrid}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Cotation</label>
                <select 
                  className={styles.filterSelect}
                  value={filterCotation}
                  onChange={(e) => setFilterCotation(e.target.value)}
                >
                  <option value="">Toutes les cotations</option>
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
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Tri</label>
                <select 
                  className={styles.filterSelect}
                  value={filterSort}
                  onChange={(e) => setFilterSort(e.target.value)}
                >
                  <option>Par nom</option>
                  <option>Par cotation</option>
                  <option>Par difficulté</option>
                  <option>Par date</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Ordre</label>
                <select 
                  className={styles.filterSelect}
                  value={filterOrder}
                  onChange={(e) => setFilterOrder(e.target.value)}
                >
                  <option>Croissant</option>
                  <option>Décroissant</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Type de voie</label>
                <select 
                  className={styles.filterSelect}
                  value={filterTypeVoie}
                  onChange={(e) => setFilterTypeVoie(e.target.value)}
                >
                  <option>Tous</option>
                  <option>Ouvertes</option>
                  <option>Fermées</option>
                  <option>En maintenance</option>
                </select>
              </div>

              <div className={`${styles.filterGroup} ${styles.climbersSection}`}>
                <label className={styles.filterLabel}>Ouvreurs</label>
                <div 
                  className={`${styles.climbersDropdown} ${isClimbersDropdownOpen ? styles.open : ''}`}
                  onClick={() => setIsClimbersDropdownOpen(!isClimbersDropdownOpen)}
                >
                  <div className={styles.selectedClimbers}>
                    {selectedOuvreurs.length === 0 ? (
                      <span className={styles.placeholder}>Sélectionner des ouvreurs</span>
                    ) : (
                      selectedOuvreurs.map(ouvreur => (
                        <div key={ouvreur} className={styles.climberTag}>
                          {ouvreur}
                          <span 
                            className={styles.remove} 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeOuvreur(ouvreur);
                            }}
                          >
                            ×
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className={styles.dropdownArrow}>▼</div>
                </div>
                {isClimbersDropdownOpen && (
                  <div className={styles.climbersList}>
                    {ouvreurs.map(ouvreur => (
                      <div 
                        key={ouvreur}
                        className={`${styles.climberOption} ${selectedOuvreurs.includes(ouvreur) ? styles.selected : ''}`}
                        onClick={() => toggleOuvreur(ouvreur)}
                      >
                        {ouvreur}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.content}>
            {filteredVoies.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.icon}>🧗‍♀️</div>
                <h3>Aucune voie trouvée</h3>
                <p>Aucune voie ne correspond aux critères de filtrage sélectionnés.</p>
              </div>
            ) : (
              <div className={styles.voiesGrid}>
                {filteredVoies.map((voie) => (
                  <div key={voie.id} className={styles.voieCard}>
                    <div className={styles.voieHeader}>
                      <h3 className={styles.voieName}>
                        {voie.nom ? voie.nom : `Voie #${voie.id}`}
                      </h3>
                      <div className={styles.voieActions}>
                        {voie.cotation && (
                          <span 
                            className={styles.difficulty}
                            style={{ backgroundColor: getDifficultyColor(voie.cotation) }}
                          >
                            {voie.cotation}
                          </span>
                        )}
                        <button 
                          className={styles.editButton}
                          onClick={() => handleEditVoie(voie)}
                          title="Modifier cette voie"
                        >
                          ✏️
                        </button>
                      </div>
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
                        <span className={styles.infoValue}>
                          {voie.type_de_voie === 'ouverte' ? '🟢 Ouverte' : 
                           voie.type_de_voie === 'fermee' ? '🔴 Fermée' : 
                           voie.type_de_voie === 'maintenance' ? '🟡 En maintenance' : voie.type_de_voie}
                        </span>
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

          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
      </div>

      {/* Modal de création */}
      <CreateVoieModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleModalSuccess}
        salleId={salleId}
      />

      {/* Modal de modification */}
      <EditVoieModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedVoie(null);
        }}
        onSuccess={handleModalSuccess}
        voie={selectedVoie}
      />
    </>
  );
}
