import { useState } from 'react';
import { PurchaseFormData, PaymentValidationErrors } from '@/types/payment';
import { VALIDATION_MESSAGES } from '@/lib/payment-config';

export const usePaymentValidation = () => {
  const [errors, setErrors] = useState<PaymentValidationErrors>({});

  const validateForm = (formData: PurchaseFormData): boolean => {
    const newErrors: PaymentValidationErrors = {};

    // Validation email
    if (!formData.email) {
      newErrors.email = VALIDATION_MESSAGES.EMAIL_REQUIRED;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = VALIDATION_MESSAGES.EMAIL_INVALID;
    }

    // Validation prénom
    if (!formData.firstName) {
      newErrors.firstName = VALIDATION_MESSAGES.FIRST_NAME_REQUIRED;
    }

    // Validation nom
    if (!formData.lastName) {
      newErrors.lastName = VALIDATION_MESSAGES.LAST_NAME_REQUIRED;
    }

    // Validation des détails de carte si méthode de paiement = carte
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = VALIDATION_MESSAGES.CARD_NUMBER_INVALID;
      }
      if (!formData.expiry || !/^\d{2}\/\d{2}$/.test(formData.expiry)) {
        newErrors.expiry = VALIDATION_MESSAGES.EXPIRY_INVALID;
      }
      if (!formData.cvv || formData.cvv.length < 3) {
        newErrors.cvv = VALIDATION_MESSAGES.CVV_INVALID;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: keyof PaymentValidationErrors) => {
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateForm,
    clearError,
    clearAllErrors
  };
}; 