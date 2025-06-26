'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const headerStyle: React.CSSProperties = {
  background: '#f8f9fa',
  padding: '1rem 2rem',
  borderBottom: '1px solid #e9ecef',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};
const navStyle: React.CSSProperties = {
  display: 'flex',
  gap: '2rem',
};
const linkStyle: React.CSSProperties = {
  textDecoration: 'none',
  color: '#666',
  fontWeight: 500,
  fontSize: '1rem',
  transition: 'color 0.2s',
};
const activeLinkStyle: React.CSSProperties = {
  ...linkStyle,
  color: '#2563eb',
  fontWeight: 700,
};

export default function Header() {
  const pathname = usePathname();

  return (
    <header style={headerStyle}>
      <div>
        <Link href="/" style={{ textDecoration: 'none', color: '#333', fontSize: '1.5rem', fontWeight: 'bold' }}>
          ClimbHelp
        </Link>
      </div>
      <nav style={navStyle}>
        <Link href="/" style={pathname === '/' ? activeLinkStyle : linkStyle}>Accueil</Link>
        <Link href="/login" style={pathname === '/login' ? activeLinkStyle : linkStyle}>Connexion</Link>
        <Link href="/register" style={pathname === '/register' ? activeLinkStyle : linkStyle}>Inscription</Link>
        <Link href="/profile" style={pathname === '/profile' ? activeLinkStyle : linkStyle}>Profil</Link>
      </nav>
    </header>
  );
} 