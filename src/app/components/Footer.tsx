const footerStyle: React.CSSProperties = {
  background: '#222',
  color: '#fff',
  padding: '2rem',
  marginTop: 'auto',
  textAlign: 'center',
};
const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: 1200,
  margin: '0 auto',
};
const sectionStyle: React.CSSProperties = {
  textAlign: 'left',
};
const linksStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  fontSize: '0.95rem',
};
const linkStyle: React.CSSProperties = {
  color: '#fff',
  textDecoration: 'none',
  opacity: 0.8,
  display: 'block',
  marginBottom: 4,
};
const linkHoverStyle: React.CSSProperties = {
  ...linkStyle,
  opacity: 1,
};

export default function Footer() {
  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={sectionStyle}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: 700 }}>ClimbHelp</h3>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
            © 2024 Tous droits réservés
          </p>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={sectionStyle}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 600 }}>Liens utiles</h4>
            <ul style={linksStyle}>
              <li><a href="/" style={linkStyle}>Accueil</a></li>
              <li><a href="/login" style={linkStyle}>Connexion</a></li>
              <li><a href="/register" style={linkStyle}>Inscription</a></li>
            </ul>
          </div>
          <div style={sectionStyle}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 600 }}>Support</h4>
            <ul style={linksStyle}>
              <li><a href="#" style={linkStyle}>Aide</a></li>
              <li><a href="#" style={linkStyle}>Contact</a></li>
              <li><a href="#" style={linkStyle}>Confidentialité</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
} 