"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import styles from "../profile.module.css";

export default function EditProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validation
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = "Le nom est requis";
    if (!formData.email) newErrors.email = "L'email est requis";
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = "Le mot de passe doit contenir au moins 6 caractères";
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    try {
      // Simulation de mise à jour du profil
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Profil mis à jour avec succès !");
      router.push("/profile");
    } catch {
      setErrors({ general: "Erreur lors de la mise à jour" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!user) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className={styles.profile}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Éditer le profil</h1>
          <p className={styles.subtitle}>Modifiez vos informations personnelles</p>
        </div>
        <div className={styles.content}>
          <div className={styles.profileCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formSection}>
                <h3>Informations personnelles</h3>
                <Input
                  type="text"
                  label="Nom complet"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  error={errors.name}
                  required
                />
                <Input
                  type="email"
                  label="Adresse e-mail"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  error={errors.email}
                  required
                />
              </div>
              <div className={styles.formSection}>
                <h3>Changer le mot de passe</h3>
                <Input
                  type="password"
                  label="Nouveau mot de passe"
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange("newPassword", e.target.value)}
                  error={errors.newPassword}
                  placeholder="Laissez vide pour ne pas changer"
                />
                <Input
                  type="password"
                  label="Confirmer le nouveau mot de passe"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  error={errors.confirmPassword}
                  placeholder="Confirmez le nouveau mot de passe"
                />
              </div>
              {errors.general && (
                <div className={styles.errorMessage}>{errors.general}</div>
              )}
              <div className={styles.actions}>
                <Button type="submit" variant="primary" disabled={isLoading}>
                  {isLoading ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push("/profile")}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 