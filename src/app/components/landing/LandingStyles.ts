import styled, { keyframes } from "styled-components";

export const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const slideInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
`;

export const pulse = keyframes`
  0%, 100% { 
    transform: scale(1);
    opacity: 0.3;
  }
  50% { 
    transform: scale(1.2);
    opacity: 0.6;
  }
`;

export const Hero = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.8)), 
                url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><polygon points="0,600 300,400 600,450 900,300 1200,400 1200,600" fill="%23e8e8e8"/><polygon points="0,600 250,450 550,500 850,350 1200,450 1200,600" fill="%23f0f0f0"/></svg>');
    background-size: cover;
    background-position: bottom;
    z-index: 1;
  }
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
  width: 100%;
`;

export const HeroContent = styled.div`
  text-align: center;
  animation: ${fadeInUp} 0.8s ease-out;
`;

export const Logo = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #2c3e50;
  letter-spacing: -1px;
  
  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #e74c3c, #f39c12);
    margin: 0.5rem auto;
    border-radius: 2px;
  }
`;

export const Tagline = styled.p`
  font-size: 1.3rem;
  margin-bottom: 2rem;
  color: #7f8c8d;
  font-weight: 400;
`;

export const Desc = styled.p`
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto 3rem;
  color: #5a6c7d;
  line-height: 1.6;
`;

export const Stats = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin: 3rem 0;
  flex-wrap: wrap;
`;

export const Stat = styled.div`
  text-align: center;
`;

export const StatNumber = styled.span`
  font-size: 2.5rem;
  font-weight: 600;
  display: block;
  color: #2c3e50;
  margin-bottom: 0.3rem;
`;

export const StatLabel = styled.span`
  color: #7f8c8d;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 4rem 0;
`;

export const FeatureCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  border-left: 4px solid #e74c3c;
  animation: ${slideInUp} 0.6s ease-out;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  }
  
  &:nth-child(2) {
    border-left-color: #f39c12;
  }
  
  &:nth-child(3) {
    border-left-color: #27ae60;
  }
`;

export const FeatureIcon = styled.span`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: block;
`;

export const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2c3e50;
`;

export const FeatureText = styled.p`
  color: #5a6c7d;
  line-height: 1.6;
`;

export const CtaSection = styled.div`
  margin-top: 4rem;
`;

export const CtaButton = styled.button`
  display: inline-block;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
  border: none;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
    background: linear-gradient(135deg, #c0392b, #a93226);
  }
`;

export const FloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
`;

export const FloatingElement = styled.div<{
  $top?: string, $left?: string, $right?: string, $bottom?: string
}>`
  position: absolute;
  opacity: 0.1;
  font-size: 8rem;
  color: #e74c3c;
  z-index: 1;
  animation: ${float} 6s ease-in-out infinite;
  transition: transform 0.2s;
  ${({$top}) => $top && `top: ${$top};`}
  ${({$left}) => $left && `left: ${$left};`}
  ${({$right}) => $right && `right: ${$right};`}
  ${({$bottom}) => $bottom && `bottom: ${$bottom};`}
`;

export const HoldsPattern = styled.div`
  position: absolute;
  left: 5%;
  bottom: 10%;
  display: flex;
  gap: 1rem;
  opacity: 0.3;
  z-index: 1;
`;

export const Hold = styled.div<{ $delay: number }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  animation: ${pulse} 3s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
  
  &:nth-child(1) { background: #e74c3c; }
  &:nth-child(2) { background: #f39c12; }
  &:nth-child(3) { background: #27ae60; }
  &:nth-child(4) { background: #3498db; }
`;

export const SectionSubtitle = styled.div`
  text-align: center;
  color: #7f8c8d;
  font-size: 1rem;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
`;

// Media queries pour la responsivité
export const mediaQueries = `
  @media (max-width: 768px) {
    .logo {
      font-size: 2.5rem;
    }
    
    .tagline {
      font-size: 1.1rem;
    }
    
    .description {
      font-size: 1rem;
    }
    
    .stats {
      gap: 2rem;
    }
    
    .feature-card {
      padding: 1.5rem;
    }

    .climbing-accent,
    .holds-pattern {
      display: none;
    }

    .container {
      padding: 0 1rem;
    }
  }
`;
