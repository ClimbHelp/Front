'use client';

import { useState } from 'react';
import PaymentForm from '@/components/payment/PaymentForm';
import ProductInfo from '@/components/payment/ProductInfo';
import PaymentHeader from '@/components/payment/PaymentHeader';
import { PurchaseFormData } from '@/types/payment';
import { SUCCESS_MESSAGE, ERROR_MESSAGE } from '@/lib/payment-config';
import styles from './payment.module.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PaymentPage() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async (formData: PurchaseFormData) => {
    setIsProcessing(true);
    
    try {
      // Simulation du processus d'achat
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(SUCCESS_MESSAGE);
    } catch (error) {
      console.error('Erreur lors de l\'achat:', error);
      alert(ERROR_MESSAGE);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Achetez ClimbHelp</h1>
          <p className={styles.subtitle}>
            {/* Un seul achat pour accéder à vie à toutes les fonctionnalités de ClimbHelp */}
            TODO: Problème de paiement avec Stripe, besoin de revoir l'intégration et le processus du service
          </p>
        </div>

        <div className={styles.purchaseContainer}>
          <ProductInfo />
          <PaymentForm onSubmit={handlePurchase} isProcessing={isProcessing} />
        </div>
      </div>
      <Footer />
    </>
  );
}

 