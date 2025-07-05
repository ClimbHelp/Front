import { ReactNode } from 'react';
import styles from './layout.module.css';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.authLayout}>
      <div className={styles.authContainer}>
        <div className={styles.authHeader}>
          <h1 className={styles.logo}>ClimbHelp</h1>
          <p className={styles.subtitle}>Votre compagnon d'escalade</p>
        </div>
        <div className={styles.authContent}>
          {children}
        </div>
      </div>
    </div>
  );
} 