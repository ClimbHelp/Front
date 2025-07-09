'use client';

import { useState, FormEvent } from 'react';
import { PurchaseFormData } from '@/types/payment';
import { usePaymentValidation } from '@/hooks/usePaymentValidation';
import { usePaymentFormatting } from '@/hooks/usePaymentFormatting';
import { PAYMENT_CONFIG } from '@/lib/payment-config';
import styles from './PaymentForm.module.css';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '@/app/contexts/AuthContext';

interface PaymentFormProps {
  isProcessing: boolean;
}

export default function PaymentForm({ isProcessing }: PaymentFormProps) {
  const [formData, setFormData] = useState<PurchaseFormData>({
    email: '',
    firstName: '',
    lastName: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);
  const { errors, validateForm, clearError } = usePaymentValidation();
  const { formatCardNumber, formatExpiry, formatCVV } = usePaymentFormatting();
  const stripe = useStripe();
  const elements = useElements();
  const { userInfo } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!validateForm(formData)) return;
    setLoading(true);
    try {
      // 1. Créer le PaymentIntent côté backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/api/payments/payment-intents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: PAYMENT_CONFIG.PRICE * 100, // Stripe attend les montants en centimes
          currency: 'eur',
          description: PAYMENT_CONFIG.DESCRIPTION,
          metadata: {
            userId: userInfo?.id,
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName
          },
          payment_method_types: ['card']
        })
      });
      const data = await res.json();
      if (!data.success || !data.data?.client_secret) throw new Error('Erreur lors de la création du paiement');
      const clientSecret = data.data.client_secret;

      // 2. Confirmer le paiement avec Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Champ carte introuvable');
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email
          }
        }
      });
      if (error) {
        alert(error.message || 'Erreur lors du paiement');
        return;
      }
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        alert('🎉 Paiement réussi !\n\nMerci pour votre achat.\n\nVeuillez vous reconnecter pour profiter de vos nouvelles fonctionnalités.');
        // Optionnel : reset le formulaire ou rediriger
      } else {
        alert('Le paiement n\'a pas pu être confirmé.');
      }
    } catch (err: any) {
      alert(err.message || 'Erreur inattendue lors du paiement.');
    } finally {
      setLoading(false);
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
            {/* Champ carte Stripe sécurisé */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="cardElement">
                Numéro de carte *
              </label>
              <div id="cardElement" className={styles.stripeCardElement}>
                <CardElement options={{ hidePostalCode: true }} />
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
          disabled={isProcessing || loading}
        >
          {(isProcessing || loading) ? 'Traitement en cours...' : `Acheter ClimbHelp - ${PAYMENT_CONFIG.PRICE}${PAYMENT_CONFIG.CURRENCY}`}
        </button>
      </form>
    </div>
  );
} 