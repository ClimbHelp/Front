import styled, { keyframes } from "styled-components";

export const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
`;
export const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

export const Hero = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  overflow: hidden;
`;
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 2;
  width: 100%;
`;
export const HeroContent = styled.div`
  text-align: center;
  color: white;
  animation: ${fadeInUp} 1s ease-out;
`;
export const Logo = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #ffffff, #f8f9fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 4px 8px rgba(0,0,0,0.3);
  animation: ${pulse} 2s infinite;
`;
export const Tagline = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  font-weight: 300;
`;
export const Desc = styled.p`
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto 3rem;
  line-height: 1.6;
  opacity: 0.8;
`;
export const Stats = styled.div`
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin: 3rem 0;
  flex-wrap: wrap;
`;
export const Stat = styled.div`
  text-align: center;
`;
export const StatNumber = styled.span`
  font-size: 2.5rem;
  font-weight: 700;
  display: block;
  margin-bottom: 0.5rem;
`;
export const StatLabel = styled.span`
  opacity: 0.8;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;
export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 4rem 0;
`;
export const FeatureCard = styled.div`
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255,255,255,0.2);
  transition: all 0.3s;
  color: #fff;
`;
export const FeatureIcon = styled.span`
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
`;
export const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;
export const FeatureText = styled.p`
  opacity: 0.9;
  line-height: 1.5;
`;
export const CtaSection = styled.div`
  margin-top: 4rem;
`;
export const CtaButton = styled.button`
  display: inline-block;
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 1rem 3rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s;
  box-shadow: 0 10px 30px rgba(238, 90, 36, 0.4);
  border: none;
  cursor: pointer;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(238, 90, 36, 0.6);
    background: linear-gradient(45deg, #ff5252, #d63031);
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
  color: rgba(255,255,255,0.1);
  font-size: 2rem;
  transition: transform 0.2s;
  ${({$top}) => $top && `top: ${$top};`}
  ${({$left}) => $left && `left: ${$left};`}
  ${({$right}) => $right && `right: ${$right};`}
  ${({$bottom}) => $bottom && `bottom: ${$bottom};`}
`;
