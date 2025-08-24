import { ReactNode } from 'react';
import { AuthProvider } from '@/app/contexts/AuthContext';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
