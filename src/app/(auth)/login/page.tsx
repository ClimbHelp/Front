'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import styles from './login.module.css';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validation basique
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) newErrors.email = 'L\'email est requis';
    if (!formData.password) newErrors.password = 'Le mot de passe est requis';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await login(formData.email, formData.password);
      router.push('/dashboard');
    } catch (error) {
      setErrors({ general: 'Email ou mot de passe incorrect' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>Connexion</h2>
      <p className={styles.subtitle}>
        Connectez-vous à votre compte ClimbHelp
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          type="email"
          label="Adresse e-mail"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          required
          placeholder="votre@email.com"
        />

        <Input
          type="password"
          label="Mot de passe"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          error={errors.password}
          required
          placeholder="Votre mot de passe"
        />

        {errors.general && (
          <div className={styles.errorMessage}>
            {errors.general}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isLoading}
          className={styles.submitButton}
        >
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>

      <div className={styles.links}>
        <Link href="/register" className={styles.link}>
          Pas encore de compte ? S'inscrire
        </Link>
        <Link href="/forgot-password" className={styles.link}>
          Mot de passe oublié ?
        </Link>
      </div>
    </div>
  );
} 