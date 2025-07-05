'use client';

import Link from 'next/link';
import styles from './PaymentHeader.module.css';

export default function PaymentHeader() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          ClimbHelp
        </Link>
        <ul className={styles.navLinks}>
          <li><Link href="/">Accueil</Link></li>
          <li><Link href="/#fonctionnalites">Fonctionnalités</Link></li>
          <li><Link href="/payment">Achat</Link></li>
          <li><Link href="/#contact">Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
} 