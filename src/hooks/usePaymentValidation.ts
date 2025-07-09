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