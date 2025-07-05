export interface PurchaseFormData {
  email: string;
  firstName: string;
  lastName: string;
  paymentMethod: 'card' | 'paypal';
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
}

export interface PaymentValidationErrors {
  email?: string;
  firstName?: string;
  lastName?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
}

export interface PaymentMethod {
  id: 'card' | 'paypal';
  name: string;
  icon: string;
  description: string;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Carte',
    icon: '💳',
    description: 'Carte bancaire'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: '🅿️',
    description: 'PayPal'
  }
]; 