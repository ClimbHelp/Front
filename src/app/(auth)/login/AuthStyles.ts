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

export const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  overflow: hidden;
  padding: 2rem;
  
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

export const AuthCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  padding: 4rem;
  width: 100%;
  max-width: 600px;
  position: relative;
  z-index: 2;
  animation: ${fadeInUp} 0.8s ease-out;
  border: 1px solid rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
`;

export const AuthHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

export const AuthLogo = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  letter-spacing: -1px;
  
  &::after {
    content: '';
    display: block;
    width: 50px;
    height: 3px;
    background: linear-gradient(90deg, #e74c3c, #f39c12);
    margin: 0.5rem auto;
    border-radius: 2px;
  }
`;

export const AuthSubtitle = styled.p`
  font-size: 1.1rem;
  color: #7f8c8d;
  font-weight: 400;
  margin-top: 0.5rem;
`;

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

export const FormLabel = styled.label`
  font-weight: 600;
  font-size: 0.95rem;
  color: #2c3e50;
  margin-bottom: 0.25rem;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e1e8ed;
  border-radius: 12px;
  background: #f8f9fa;
  font-size: 1rem;
  transition: all 0.3s ease;
  color: #2c3e50;
  
  &:focus {
    outline: none;
    border-color: #e74c3c;
    background: white;
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
  }
  
  &::placeholder {
    color: #95a5a6;
  }
`;

export const PrimaryButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
  margin-top: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
    background: linear-gradient(135deg, #c0392b, #a93226);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const SecondaryButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: white;
  color: #2c3e50;
  border: 2px solid #e1e8ed;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  
  &:hover {
    border-color: #bdc3c7;
    background: #f8f9fa;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }
  
  img {
    width: 20px;
    height: 20px;
  }
`;

export const Separator = styled.div`
  display: flex;
  align-items: center;
  margin: 2rem 0;
  gap: 1rem;
`;

export const SeparatorLine = styled.div`
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e1e8ed, transparent);
`;

export const SeparatorText = styled.span`
  color: #95a5a6;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0 1rem;
`;

export const AuthFooter = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e1e8ed;
`;

export const AuthLink = styled.a`
  color: #e74c3c;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
  
  &:hover {
    color: #c0392b;
    text-decoration: underline;
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
  opacity: 0.08;
  font-size: 6rem;
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
  opacity: 0.2;
  z-index: 1;
`;

export const Hold = styled.div<{ $delay: number }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation: ${pulse} 3s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
  
  &:nth-child(1) { background: #e74c3c; }
  &:nth-child(2) { background: #f39c12; }
  &:nth-child(3) { background: #27ae60; }
  &:nth-child(4) { background: #3498db; }
`;

// Styles pour la page de profil
export const ProfileContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
  position: relative;
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

export const ProfileContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

export const ProfileHeader = styled.div`
  background: white;
  border-radius: 20px;
  padding: 3rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  text-align: center;
  animation: ${fadeInUp} 0.8s ease-out;
`;

export const ProfileAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e74c3c, #f39c12);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 3rem;
  color: white;
  font-weight: 700;
`;

export const ProfileName = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

export const ProfileEmail = styled.p`
  font-size: 1.1rem;
  color: #7f8c8d;
  margin-bottom: 2rem;
`;

export const ProfileStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

export const ProfileStat = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #e74c3c;
`;

export const ProfileStatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

export const ProfileStatLabel = styled.div`
  font-size: 0.9rem;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
`;

export const ProfileSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  animation: ${slideInUp} 0.6s ease-out;
`;

export const ProfileSectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  &::before {
    content: '';
    width: 4px;
    height: 24px;
    background: linear-gradient(135deg, #e74c3c, #f39c12);
    border-radius: 2px;
  }
`;

export const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

export const ProfileCard = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  border-left: 3px solid #e74c3c;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  }
`;

export const ProfileCardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

export const ProfileCardValue = styled.p`
  color: #7f8c8d;
  font-size: 0.95rem;
`;

export const LogoutButton = styled.button`
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
    background: linear-gradient(135deg, #c0392b, #a93226);
  }
`;

// Responsive design
export const mediaQueries = `
  @media (max-width: 768px) {
    .auth-card {
      padding: 2rem;
      margin: 1rem;
    }
    
    .auth-logo {
      font-size: 2rem;
    }
    
    .profile-header {
      padding: 2rem;
    }
    
    .profile-name {
      font-size: 2rem;
    }
    
    .profile-stats {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .profile-section {
      padding: 1.5rem;
    }
    
    .floating-elements {
      display: none;
    }
  }
  
  @media (max-width: 480px) {
    .auth-container {
      padding: 1rem;
    }
    
    .profile-stats {
      grid-template-columns: 1fr;
    }
    
    .profile-grid {
      grid-template-columns: 1fr;
    }
  }
`; 