'use client'

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../app/contexts/AuthContext';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, userInfo, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div>
        <Link href="/" className={styles.logo}>
          ClimbHelp
        </Link>
      </div>
      <nav className={styles.nav}>
        
        {isAuthenticated ? (
          <>
            <Link href="/salles" className={pathname === '/salles' ? styles.activeLink : styles.link}>
              Salles
            </Link>
            {!userInfo?.premium && (
              <Link href="/payment" className={pathname === '/payment' ? styles.activeLink : styles.link}>
                Acheter ClimbHelp
              </Link>
            )}
            <Link href="/profile" className={pathname === '/profile' ? styles.activeLink : styles.link}>
              Profil {userInfo?.username && `(${userInfo.username})`}
            </Link>
            <button 
              onClick={() => {
                logout();
                router.push('/');
              }} 
              className={styles.logoutButton}
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className={pathname === '/login' ? styles.activeLink : styles.link}>
              Connexion
            </Link>
            <Link href="/register" className={pathname === '/register' ? styles.activeLink : styles.link}>
              Inscription
            </Link>
          </>
        )}
      </nav>
    </header>
  );
} 