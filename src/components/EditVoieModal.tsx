'use client'

import { useState, useEffect } from 'react';
import styles from './EditVoieModal.module.css';

interface Voie {
  id: number;
  salle_id: number;
  nom?: string;
  cotation?: string;
  description?: string;
  ouvreur?: string;
  type_de_voie?: string;
}

interface EditVoieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  voie: Voie | null;
}

export default function EditVoieModal({ isOpen, onClose, onSuccess, voie }: EditVoieModalProps) {
  const [mode, setMode] = useState<'edit' | 'delete'>('edit');
  const [formData, setFormData] = useState({
    nom: '',
    cotation: '',
    type_de_voie: '',
    ouvreur: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  useEffect(() => {
    if (voie) {
      setFormData({
        nom: voie.nom || '',
        cotation: voie.cotation || '',
        type_de_voie: voie.type_de_voie || '',
        ouvreur: voie.ouvreur || '',
        description: voie.description || ''
      });
    }
  }, [voie]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);

    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowDeleteSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setShowDeleteSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !voie) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <div className={styles.titleSection}>
              <div className={styles.titleIcon}>✏️</div>
              <div className={styles.titleText}>
                <h1>Modifier la voie</h1>
                <p>{voie.nom || `Voie #${voie.id}`}</p>
              </div>
            </div>
            <div className={styles.routeBadge}>{voie.cotation || 'N/A'}</div>
          </div>
        </div>

        <div className={styles.modalBody}>
          {/* Mode Selector */}
          <div className={styles.modeSelector}>
            <button 
              className={`${styles.modeBtn} ${mode === 'edit' ? styles.active : ''}`}
              onClick={() => setMode('edit')}
            >
              ✏️ Modifier
            </button>
            <button 
              className={`${styles.modeBtn} ${mode === 'delete' ? styles.active : ''}`}
              onClick={() => setMode('delete')}
            >
              🗑️ Supprimer
            </button>
          </div>

          {/* Edit Mode */}
          {mode === 'edit' && !showSuccess && (
            <div className={styles.formSection}>
              <form onSubmit={handleSubmit}>
                {/* Section 1: Informations générales */}
                <div className={styles.formSection}>
                  <div className={styles.sectionTitle}>
                    <div className={styles.sectionIcon}>📋</div>
                    Informations générales
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={`${styles.formLabel} ${styles.required}`}>Nom de la voie</label>
                    <div className={styles.inputGroup}>
                      <span className={styles.inputIcon}>🏔️</span>
                      <input 
                        type="text" 
                        className={styles.formInput}
                        value={formData.nom}
                        onChange={(e) => handleInputChange('nom', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={`${styles.formLabel} ${styles.required}`}>Cotation</label>
                      <select 
                        className={styles.formSelect}
                        value={formData.cotation}
                        onChange={(e) => handleInputChange('cotation', e.target.value)}
                        required
                      >
                        <option value="">Sélectionner une cotation</option>
                        <optgroup label="Débutant">
                          <option value="3a">3a</option>
                          <option value="3b">3b</option>
                          <option value="3c">3c</option>
                          <option value="4a">4a</option>
                          <option value="4b">4b</option>
                          <option value="4c">4c</option>
                        </optgroup>
                        <optgroup label="Intermédiaire">
                          <option value="5a">5a</option>
                          <option value="5b">5b</option>
                          <option value="5c">5c</option>
                          <option value="6a">6a</option>
                          <option value="6a+">6a+</option>
                          <option value="6b">6b</option>
                          <option value="6b+">6b+</option>
                          <option value="6c">6c</option>
                          <option value="6c+">6c+</option>
                        </optgroup>
                        <optgroup label="Avancé">
                          <option value="7a">7a</option>
                          <option value="7a+">7a+</option>
                          <option value="7b">7b</option>
                          <option value="7b+">7b+</option>
                          <option value="7c">7c</option>
                          <option value="7c+">7c+</option>
                        </optgroup>
                        <optgroup label="Expert">
                          <option value="8a">8a</option>
                          <option value="8a+">8a+</option>
                          <option value="8b">8b</option>
                          <option value="8b+">8b+</option>
                          <option value="8c">8c</option>
                          <option value="8c+">8c+</option>
                        </optgroup>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={`${styles.formLabel} ${styles.required}`}>Type de voie</label>
                      <select 
                        className={styles.formSelect}
                        value={formData.type_de_voie}
                        onChange={(e) => handleInputChange('type_de_voie', e.target.value)}
                        required
                      >
                        <option value="">Sélectionner un type</option>
                        <option value="Bloc">🧗‍♀️ Bloc</option>
                        <option value="Voie">⛰️ Voie</option>
                        <option value="Dévers">📐 Dévers</option>
                        <option value="Dalle">🏔️ Dalle</option>
                        <option value="Surplomb">🪨 Surplomb</option>
                        <option value="Dièdre">📏 Dièdre</option>
                        <option value="Fissure">🔍 Fissure</option>
                        <option value="Réglette">📋 Réglette</option>
                        <option value="Pince">🤏 Pince</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Ouvreur</label>
                    <div className={styles.inputGroup}>
                      <span className={styles.inputIcon}>👤</span>
                      <input 
                        type="text" 
                        className={styles.formInput}
                        value={formData.ouvreur}
                        onChange={(e) => handleInputChange('ouvreur', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Description */}
                <div className={styles.formSection}>
                  <div className={styles.sectionTitle}>
                    <div className={styles.sectionIcon}>📝</div>
                    Description
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Description</label>
                    <textarea 
                      className={styles.formTextarea}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                  </div>
                </div>

              </form>
            </div>
          )}

          {/* Delete Mode */}
          {mode === 'delete' && !showDeleteSuccess && (
            <div className={styles.deleteSection}>
              <div className={styles.deleteWarning}>
                <div className={styles.deleteContent}>
                  <div className={styles.deleteIcon}>⚠️</div>
                  <div className={styles.deleteTitle}>Supprimer définitivement cette voie ?</div>
                  <div className={styles.deleteDescription}>
                    Cette action est <strong>irréversible</strong>. Toutes les données associées à cette voie seront perdues.
                  </div>
                </div>
              </div>

              <div className={styles.routeInfoCard}>
                <div className={styles.routeInfoHeader}>
                  <div className={styles.routeNameDisplay}>{voie.nom || `Voie #${voie.id}`}</div>
                  <div className={styles.routeGradeDisplay}>{voie.cotation || 'N/A'}</div>
                </div>
                <div className={styles.routeMeta}>
                  <div className={styles.metaItem}>
                    <span>🏷️</span>
                    <span>Type: {formData.type_de_voie || 'Non spécifié'}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span>👤</span>
                    <span>Ouvreur: {formData.ouvreur || 'Non spécifié'}</span>
                  </div>
                </div>
              </div>

              <div className={styles.consequencesList}>
                <h4>Conséquences de la suppression :</h4>
                <ul>
                  <li>Suppression de tous les historiques d&apos;ascensions</li>
                  <li>Perte des commentaires et évaluations des grimpeurs</li>
                  <li>Suppression des photos associées</li>
                  <li>Perte des statistiques de performance</li>
                </ul>
              </div>
            </div>
          )}

          {/* Success Animations */}
          {showSuccess && (
            <div className={`${styles.successAnimation} ${styles.show}`}>
              <div className={styles.successIcon}>✅</div>
              <h3>Voie modifiée avec succès !</h3>
              <p>Les modifications ont été enregistrées.</p>
            </div>
          )}

          {showDeleteSuccess && (
            <div className={`${styles.deleteAnimation} ${styles.show}`}>
              <div className={styles.deleteSuccessIcon}>🗑️</div>
              <h3>Voie supprimée avec succès !</h3>
              <p>La voie a été définitivement supprimée.</p>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button type="button" className={styles.btnSecondary} onClick={onClose}>
            ❌ Annuler
          </button>
          {mode === 'edit' && !showSuccess && (
            <button 
              type="submit" 
              className={styles.createVoieBtn} 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? '⏳ Modification...' : '💾 Enregistrer'}
            </button>
          )}
          {mode === 'delete' && !showDeleteSuccess && (
            <button 
              type="button" 
              className={styles.btnDanger} 
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? '⏳ Suppression...' : '🗑️ Supprimer définitivement'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
