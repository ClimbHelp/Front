'use client'

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Hero, Container, HeroContent, Logo, Tagline, Desc, Stats, Stat, StatNumber, StatLabel,
  FeaturesGrid, FeatureCard, FeatureIcon, FeatureTitle, FeatureText, CtaSection, CtaButton,
  FloatingElements, FloatingElement, HoldsPattern, Hold, SectionSubtitle
} from "./components/landing/LandingStyles";

const statsData = [
  { target: 100, label: 'Salles partenaires' },
  { target: 5000, label: 'Voies référencées' },
  { target: 1200, label: 'Grimpeurs actifs' },
];

const features = [
  {
    icon: '📊',
    title: 'Suivi de progression',
    text: 'Visualisez votre évolution avec des statistiques claires et un historique détaillé de vos ascensions pour rester motivé.',
  },
  {
    icon: '🗺️',
    title: 'Recherche de salles',
    text: 'Trouvez facilement les salles d\'escalade près de chez vous avec informations actualisées et détails des voies disponibles.',
  },
  {
    icon: '⚙️',
    title: 'Gestion simplifiée',
    text: 'Outils dédiés aux gestionnaires pour mettre à jour les voies, consulter les statistiques et communiquer avec les grimpeurs.',
  },
];

export default function Home() {
  const router = useRouter();
  const statRefs = [
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
  ];
  const floatRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  // Animation des statistiques
  useEffect(() => {
    const timer = setTimeout(() => {
      statRefs.forEach((ref, i) => {
        if (!ref.current) return;
        let current = 0;
        const target = statsData[i].target;
        const increment = target / 60;
        const intervalTimer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(intervalTimer);
          }
          if (ref.current) ref.current.textContent = Math.floor(current).toLocaleString();
        }, 30);
        return () => clearInterval(intervalTimer);
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Parallaxe emojis flottants
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      floatRefs.forEach((ref, i) => {
        if (!ref.current) return;
        const speed = (i + 1) * 0.5;
        const xPos = (x - 0.5) * speed * 50;
        const yPos = (y - 0.5) * speed * 50;
        ref.current.style.transform = `translate(${xPos}px, ${yPos}px)`;
      });
    }
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  function handleCtaClick() {
    const button = document.querySelector('.cta-button') as HTMLElement;
    if (button) {
      button.style.transform = 'scale(0.98)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
        alert('Bienvenue sur ClimbHelp ! 🧗‍♂️\n\nDécouvrez une nouvelle façon de vivre votre passion de l\'escalade.');
      }, 150);
    }
  }

  function handleRegisterClick() {
    router.push('/register');
  }

  return (
    <Hero>
      <FloatingElements>
        <FloatingElement ref={floatRefs[0]} $top="20%" $right="5%">🧗‍♂️</FloatingElement>
      </FloatingElements>
      
      <HoldsPattern>
        <Hold $delay={0} />
        <Hold $delay={0.5} />
        <Hold $delay={1} />
        <Hold $delay={1.5} />
      </HoldsPattern>

      <Container>
        <HeroContent>
          <Logo>ClimbHelp</Logo>
          <Tagline>Votre compagnon d'escalade intelligent</Tagline>
          <Desc>
            Suivez votre progression, découvrez de nouvelles voies et connectez-vous avec votre communauté d'escalade. La plateforme qui simplifie la gestion des salles et accompagne les grimpeurs.
          </Desc>
          <Stats>
            {statsData.map((stat, i) => (
              <Stat key={stat.label}>
                <StatNumber ref={statRefs[i]}>0</StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </Stat>
            ))}
          </Stats>
          
          <SectionSubtitle>Fonctionnalités principales</SectionSubtitle>
          
          <FeaturesGrid>
            {features.map((f, i) => (
              <FeatureCard key={f.title} style={{ animationDelay: `${i * 0.1}s` }}>
                <FeatureIcon>{f.icon}</FeatureIcon>
                <FeatureTitle>{f.title}</FeatureTitle>
                <FeatureText>{f.text}</FeatureText>
              </FeatureCard>
            ))}
          </FeaturesGrid>
          <CtaSection>
            <CtaButton onClick={handleRegisterClick} className="cta-button">
              Inscris-toi maintenant !
            </CtaButton>
          </CtaSection>
        </HeroContent>
      </Container>
    </Hero>
  );
}

// export default function Home() {
//   return (
//     <div className="bg-red-500 text-white p-8 rounded-xl">
//       Test Tailwind
//     </div>
//   );
// }
