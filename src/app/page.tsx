'use client'

import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Votre compagnon d&apos;escalade
            </h1>
            <p className={styles.heroSubtitle}>
              Suivez votre progression, découvrez de nouvelles voies et connectez-vous avec la communauté d&apos;escalade
            </p>
            <div className={styles.heroActions}>
              <Link href="/register">
                <Button variant="primary" size="lg">
                  Commencer gratuitement
                </Button>
              </Link>
              <Link href="/payment">
                <Button variant="outline" size="lg">
                  Acheter ClimbHelp
                </Button>
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.placeholderImage}>
              🧗‍♂️
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features} id="fonctionnalites">
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Fonctionnalités principales</h2>
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📊</div>
                <h3>Suivi de progression</h3>
                <p>Enregistrez vos ascensions et suivez votre évolution dans le temps</p>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🗺️</div>
                <h3>Découverte de salles</h3>
                <p>Trouvez de nouvelles salles d&apos;escalade près de chez vous</p>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>👥</div>
                <h3>Communauté</h3>
                <p>Connectez-vous avec d&apos;autres grimpeurs et partagez vos expériences</p>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🤖</div>
                <h3>Assistant IA</h3>
                <p>Obtenez des conseils personnalisés grâce à notre chatbot intelligent</p>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📈</div>
                <h3>Statistiques avancées</h3>
                <p>Analysez vos performances avec des graphiques détaillés</p>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🔔</div>
                <h3>Notifications</h3>
                <p>Restez informé des nouvelles voies et événements</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.cta}>
          <div className={styles.container}>
            <h2>Prêt à commencer votre aventure ?</h2>
            <p>Rejoignez des milliers de grimpeurs qui utilisent déjà ClimbHelp</p>
            <div className={styles.ctaActions}>
              <Link href="/register">
                <Button variant="primary" size="lg">
                  Créer un compte
                </Button>
              </Link>
              <Link href="/payment">
                <Button variant="outline" size="lg">
                  Voir les prix
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        {/* <section className={styles.contact} id="contact">
          <div className={styles.container}>
            <h2>Contactez-nous</h2>
            <p>Des questions ? Nous sommes là pour vous aider</p>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📧</span>
                <span>contact@climbhelp.com</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📱</span>
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📍</span>
                <span>Paris, France</span>
              </div>
            </div>
          </div>
        </section> */}
      </main>
      <Footer />
    </>
  );
}
