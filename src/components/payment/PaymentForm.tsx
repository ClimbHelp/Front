'use client';

import { useState, FormEvent } from 'react';
import { PurchaseFormData } from '@/types/payment';
import { usePaymentValidation } from '@/hooks/usePaymentValidation';
import { usePaymentFormatting } from '@/hooks/usePaymentFormatting';
import { PAYMENT_CONFIG } from '@/lib/payment-config';
import styles from './PaymentForm.module.css';

interface PaymentFormProps {
  onSubmit: (data: PurchaseFormData) => Promise<void>;
  isProcessing: boolean;
}

export default function PaymentForm({ onSubmit, isProcessing }: PaymentFormProps) {
  const [formData, setFormData] = useState<PurchaseFormData>({
    email: '',
    firstName: '',
    lastName: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const { errors, validateForm, clearError } = usePaymentValidation();
  const { formatCardNumber, formatExpiry, formatCVV } = usePaymentFormatting();



  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm(formData)) {
      await onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof PurchaseFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      clearError(field as keyof typeof errors);
    }
  };

  return (
    <div className={styles.purchaseForm}>
      <h3 className={styles.formTitle}>Finaliser votre achat</h3>
      
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="email">
            Adresse e-mail *
          </label>
          <input
            type="email"
            id="email"
            className={`${styles.formInput} ${errors.email ? styles.error : ''}`}
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="votre@email.com"
            required
          />
          {errors.email && <span className={styles.errorText}>{errors.email}</span>}
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="firstName">
              Prénom *
            </label>
            <input
              type="text"
              id="firstName"
              className={`${styles.formInput} ${errors.firstName ? styles.error : ''}`}
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="Prénom"
              required
            />
            {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="lastName">
              Nom *
            </label>
            <input
              type="text"
              id="lastName"
              className={`${styles.formInput} ${errors.lastName ? styles.error : ''}`}
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Nom"
              required
            />
            {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Méthode de paiement</label>
          <div className={styles.paymentMethods}>
            <div
              className={`${styles.paymentMethod} ${formData.paymentMethod === 'card' ? styles.active : ''}`}
              onClick={() => handleInputChange('paymentMethod', 'card')}
            >
              <div className={styles.paymentIcon}>💳</div>
              <div>Carte</div>
            </div>
            <div
              className={`${styles.paymentMethod} ${formData.paymentMethod === 'paypal' ? styles.active : ''}`}
              onClick={() => handleInputChange('paymentMethod', 'paypal')}
            >
              <div className={styles.paymentIcon}>🅿️</div>
              <div>PayPal</div>
            </div>
          </div>
        </div>

        {formData.paymentMethod === 'card' && (
          <div className={styles.cardDetails}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="cardNumber">
                Numéro de carte *
              </label>
              <input
                type="text"
                id="cardNumber"
                className={`${styles.formInput} ${errors.cardNumber ? styles.error : ''}`}
                value={formData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                required
              />
              {errors.cardNumber && <span className={styles.errorText}>{errors.cardNumber}</span>}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="expiry">
                  Date d'expiration *
                </label>
                <input
                  type="text"
                  id="expiry"
                  className={`${styles.formInput} ${errors.expiry ? styles.error : ''}`}
                  value={formData.expiry}
                  onChange={(e) => handleInputChange('expiry', formatExpiry(e.target.value))}
                  placeholder="MM/AA"
                  required
                />
                {errors.expiry && <span className={styles.errorText}>{errors.expiry}</span>}
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="cvv">
                  CVV *
                </label>
                <input
                  type="text"
                  id="cvv"
                  className={`${styles.formInput} ${errors.cvv ? styles.error : ''}`}
                  value={formData.cvv}
                  onChange={(e) => handleInputChange('cvv', formatCVV(e.target.value))}
                  placeholder="123"
                  required
                />
                {errors.cvv && <span className={styles.errorText}>{errors.cvv}</span>}
              </div>
            </div>
          </div>
        )}

        <div className={styles.securityInfo}>
          <span className={styles.securityIcon}>🔒</span>
          <span className={styles.securityText}>
            Paiement sécurisé SSL. Vos données sont protégées et ne sont jamais stockées.
          </span>
        </div>

        <button
          type="submit"
          className={styles.purchaseButton}
          disabled={isProcessing}
        >
          {isProcessing ? 'Traitement en cours...' : `Acheter ClimbHelp - ${PAYMENT_CONFIG.PRICE}${PAYMENT_CONFIG.CURRENCY}`}
        </button>
      </form>
    </div>
  );
} 