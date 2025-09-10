'use client'

import { useState } from 'react';
import styles from './CreateVoieModal.module.css';

interface CreateVoieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  salleId: number;
}

export default function CreateVoieModal({ isOpen, onClose, onSuccess, salleId }: CreateVoieModalProps) {
  const [formData, setFormData] = useState({
    nom: '',
    cotation: '',
    type_de_voie: '',
    ouvreur: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_BDD_SERVICE_URL || 'http://localhost:3001';
      
      const response = await fetch(`${API_BASE_URL}/api/voies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          salle_id: salleId,
          nom: formData.nom,
          cotation: formData.cotation,
          type_de_voie: formData.type_de_voie,
          ouvreur: formData.ouvreur,
          description: formData.description
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
          setShowSuccess(false);
          setFormData({
            nom: '',
            cotation: '',
            type_de_voie: '',
            ouvreur: '',
            description: ''
          });
        }, 2000);
      } else {
        throw new Error(result.error || 'Erreur lors de la création de la voie');
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Erreur lors de la création de la voie. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <div className={styles.titleIcon}>🧗</div>
            <div className={styles.titleText}>
                             <h1>Créer une nouvelle voie</h1>
               <p>Ajoutez un nouveau parcours d&apos;escalade</p>
            </div>
          </div>
        </div>

        <div className={styles.modalBody}>
          {!showSuccess ? (
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
                      placeholder="Ex: Surplomb du Diable" 
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
                      <option value="Goutte d'eau">💧 Goutte d'eau</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={`${styles.formLabel} ${styles.required}`}>Ouvreur</label>
                  <div className={styles.inputGroup}>
                    <span className={styles.inputIcon}>👤</span>
                    <input 
                      type="text" 
                      className={styles.formInput} 
                      placeholder="Ex: Marie Dubois"
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
                    placeholder="Décrivez la voie, ses particularités techniques, les conseils pour la réussir..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
              </div>

            </form>
          ) : (
            <div className={`${styles.successAnimation} ${styles.show}`}>
              <div className={styles.successIcon}>✅</div>
              <h3>Voie créée avec succès !</h3>
              <p>La nouvelle voie a été ajoutée à votre liste.</p>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button type="button" className={styles.btnSecondary} onClick={onClose}>
            ❌ Annuler
          </button>
          {!showSuccess && (
            <button 
              type="submit" 
              className={styles.createVoieBtn} 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? '⏳ Création...' : '✨ Créer la voie'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
