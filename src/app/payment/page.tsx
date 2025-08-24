'use client';

import { useState } from 'react';
import PaymentForm from '@/components/payment/PaymentForm';
import ProductInfo from '@/components/payment/ProductInfo';


import { SUCCESS_MESSAGE, ERROR_MESSAGE } from '@/lib/payment-config';
import styles from './payment.module.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentPage() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async () => {
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
            Un seul achat pour accéder à vie à toutes les fonctionnalités de ClimbHelp
          </p>
        </div>

        <div className={styles.purchaseContainer}>
          <ProductInfo />
          <Elements stripe={stripePromise}>
            <PaymentForm onSubmit={handlePurchase} isProcessing={isProcessing} />
          </Elements>
        </div>
      </div>
      <Footer />
    </>
  );
}

 