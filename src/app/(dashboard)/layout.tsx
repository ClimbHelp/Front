import { ReactNode } from 'react';
import { AuthProvider } from '@/app/contexts/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
