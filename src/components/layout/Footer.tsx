import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.title}>ClimbHelp</h3>
            <p className={styles.description}>
              Votre compagnon d'escalade pour suivre votre progression et découvrir de nouvelles voies.
            </p>
          </div>
          
          <div className={styles.section}>
            <h4 className={styles.subtitle}>Navigation</h4>
            <ul className={styles.links}>
              <li><Link href="/">Accueil</Link></li>
              <li><Link href="/#fonctionnalites">Fonctionnalités</Link></li>
              <li><Link href="/payment">Achat</Link></li>
              <li><Link href="/#contact">Contact</Link></li>
            </ul>
          </div>
          
          <div className={styles.section}>
            <h4 className={styles.subtitle}>Support</h4>
            <ul className={styles.links}>
              <li><Link href="/help">Aide</Link></li>
              <li><Link href="/privacy">Confidentialité</Link></li>
              <li><Link href="/terms">Conditions</Link></li>
            </ul>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © 2024 ClimbHelp. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
} 