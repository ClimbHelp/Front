import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import styles from './layout.module.css';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthProvider>
      <div className={styles.dashboardLayout}>
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </AuthProvider>
  );
} 