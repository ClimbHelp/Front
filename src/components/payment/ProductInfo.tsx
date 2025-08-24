'use client';

import { PAYMENT_CONFIG } from '@/lib/payment-config';
import styles from './ProductInfo.module.css';

export default function ProductInfo() {
  return (
    <div className={styles.productInfo}>
              <h2 className={styles.productTitle}>{PAYMENT_CONFIG.PRODUCT_NAME}</h2>
        <p className={styles.productDescription}>
          {PAYMENT_CONFIG.DESCRIPTION}
          Suivez votre progression, gérez vos voies d&apos;escalade et connectez-vous avec votre communauté.
        </p>

        <div className={styles.priceSection}>
          <div className={styles.priceLabel}>Prix unique</div>
          <div className={styles.priceAmount}>
            <span className={styles.priceCurrency}>{PAYMENT_CONFIG.CURRENCY}</span>
            <span>{PAYMENT_CONFIG.PRICE}</span>
          </div>
          <div className={styles.priceNote}>Accès à vie - Aucun abonnement</div>
        </div>

        <div className={styles.featuresSection}>
          <h3 className={styles.featuresTitle}>Tout inclus :</h3>
          <ul className={styles.featuresList}>
            {PAYMENT_CONFIG.FEATURES.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>

        <div className={styles.guaranteeSection}>
          <div className={styles.guaranteeTitle}>🛡️ Garantie {PAYMENT_CONFIG.GUARANTEE_DAYS} jours</div>
          <div className={styles.guaranteeText}>
            Satisfait ou remboursé. Vous avez {PAYMENT_CONFIG.GUARANTEE_DAYS} jours pour tester ClimbHelp sans risque.
          </div>
        </div>
    </div>
  );
} 