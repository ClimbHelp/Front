import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.section}>
          <h3 className={styles.title}>ClimbHelp</h3>
          <p className={styles.description}>
            © 2025 Tous droits réservés
          </p>
        </div>
        <div className={styles.linksContainer}>
          <div className={styles.section}>
            <h4 className={styles.subtitle}>Liens utiles</h4>
            <ul className={styles.links}>
              <li><Link href="/" className={styles.link}>Accueil</Link></li>
              <li><Link href="/login" className={styles.link}>Connexion</Link></li>
              <li><Link href="/register" className={styles.link}>Inscription</Link></li>
            </ul>
          </div>
          <div className={styles.section}>
            <h4 className={styles.subtitle}>Support</h4>
            <ul className={styles.links}>
              <li><Link href="#" className={styles.link}>Aide</Link></li>
              <li><Link href="#" className={styles.link}>Contact</Link></li>
              <li><Link href="#" className={styles.link}>Confidentialité</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
} 