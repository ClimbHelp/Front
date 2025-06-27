'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

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
  cursor: 'pointer',
};
const activeLinkStyle: React.CSSProperties = {
  ...linkStyle,
  color: '#2563eb',
  fontWeight: 700,
};
const logoutButtonStyle: React.CSSProperties = {
  ...linkStyle,
  background: 'none',
  border: 'none',
  padding: 0,
  fontFamily: 'inherit',
  cursor: 'pointer',
};

export default function Header() {
  const pathname = usePathname();
  const { isAuthenticated, userInfo, logout } = useAuth();

  return (
    <header style={headerStyle}>
      <div>
        <Link href="/" style={{ textDecoration: 'none', color: '#333', fontSize: '1.5rem', fontWeight: 'bold' }}>
          ClimbHelp
        </Link>
      </div>
      <nav style={navStyle}>
        {/* <Link href="/" style={pathname === '/' ? activeLinkStyle : linkStyle}>
          Accueil
        </Link> */}
        
        {isAuthenticated ? (
          <>
            <Link href="/profile" style={pathname === '/profile' ? activeLinkStyle : linkStyle}>
              Profil {userInfo?.username && `(${userInfo.username})`}
            </Link>
            <button onClick={logout} style={logoutButtonStyle}>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={pathname === '/login' ? activeLinkStyle : linkStyle}>
              Connexion
            </Link>
            <Link href="/register" style={pathname === '/register' ? activeLinkStyle : linkStyle}>
              Inscription
            </Link>
          </>
        )}
      </nav>
    </header>
  );
} 