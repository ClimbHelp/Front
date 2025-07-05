export const PAYMENT_CONFIG = {
  PRICE: 89,
  CURRENCY: '€',
  PRODUCT_NAME: 'ClimbHelp - Licence complète',
  DESCRIPTION: 'Obtenez un accès à vie à ClimbHelp avec toutes les fonctionnalités incluses.',
  GUARANTEE_DAYS: 30,
  FEATURES: [
    'Suivi de progression illimité',
    'Recherche et découverte de salles',
    'Gestion complète des voies',
    'Statistiques avancées',
    'Historique complet des ascensions',
    'Comparaison avec amis',
    'Notifications personnalisées',
    'Export de vos données',
    'Mises à jour gratuites à vie',
    'Support technique inclus'
  ]
} as const;

export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'L\'email est requis',
  EMAIL_INVALID: 'Email invalide',
  FIRST_NAME_REQUIRED: 'Le prénom est requis',
  LAST_NAME_REQUIRED: 'Le nom est requis',
  CARD_NUMBER_INVALID: 'Numéro de carte invalide',
  EXPIRY_INVALID: 'Date d\'expiration invalide',
  CVV_INVALID: 'CVV invalide'
} as const;

export const SUCCESS_MESSAGE = '🎉 Achat réussi !\n\nBienvenue dans ClimbHelp ! Vous allez recevoir vos identifiants de connexion par e-mail dans quelques minutes.\n\nMerci pour votre confiance !';

export const ERROR_MESSAGE = 'Une erreur est survenue lors de l\'achat. Veuillez réessayer.'; 