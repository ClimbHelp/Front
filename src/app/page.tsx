'use client'

import React, { useEffect, useRef } from "react";
import {
  Hero, Container, HeroContent, Logo, Tagline, Desc, Stats, Stat, StatNumber, StatLabel,
  FeaturesGrid, FeatureCard, FeatureIcon, FeatureTitle, FeatureText, CtaSection, CtaButton,
  FloatingElements, FloatingElement
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
    text: 'Visualisez votre évolution avec des statistiques détaillées et un historique complet de vos ascensions.',
  },
  {
    icon: '🗺️',
    title: 'Recherche de salles',
    text: 'Trouvez facilement les salles d\'escalade près de chez vous avec horaires, niveaux et informations actualisées.',
  },
  {
    icon: '🎯',
    title: 'Gestion des voies',
    text: 'Pour les gestionnaires : mettez à jour vos voies, consultez les statistiques d\'usage et gérez votre salle efficacement.',
  },
];

export default function Home() {
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
    statRefs.forEach((ref, i) => {
      if (!ref.current) return;
      let current = 0;
      const target = statsData[i].target;
      const increment = target / 100;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        if (ref.current) ref.current.textContent = Math.floor(current).toLocaleString();
      }, 20);
      return () => clearInterval(timer);
    });
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
    alert("Bienvenue sur ClimbHelp ! 🧗‍♂️\n\nRejoignez notre communauté de grimpeurs passionnés.");
  }

  return (
    <Hero>
      <FloatingElements>
        <FloatingElement ref={floatRefs[0]} $top="20%" $left="10%">🧗‍♂️</FloatingElement>
        <FloatingElement ref={floatRefs[1]} $top="60%" $right="15%">⛰️</FloatingElement>
        <FloatingElement ref={floatRefs[2]} $bottom="30%" $left="20%">🏔️</FloatingElement>
      </FloatingElements>
      <Container>
        <HeroContent>
          <Logo>ClimbHelp</Logo>
          <Tagline>Votre compagnon d'escalade intelligent</Tagline>
          <Desc>
            Centralisez vos informations d'escalade, suivez votre progression et découvrez de nouvelles voies.<br />
            La plateforme qui connecte grimpeurs et salles d'escalade pour une expérience optimisée.
          </Desc>
          <Stats>
            {statsData.map((stat, i) => (
              <Stat key={stat.label}>
                <StatNumber ref={statRefs[i]}>0</StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </Stat>
            ))}
          </Stats>
          <FeaturesGrid>
            {features.map((f, i) => (
              <FeatureCard key={f.title}>
                <FeatureIcon>{f.icon}</FeatureIcon>
                <FeatureTitle>{f.title}</FeatureTitle>
                <FeatureText>{f.text}</FeatureText>
              </FeatureCard>
            ))}
          </FeaturesGrid>
          <CtaSection>
            <CtaButton onClick={handleCtaClick}>
              Commencer l'aventure
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
