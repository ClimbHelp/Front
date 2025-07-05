export const usePaymentFormatting = () => {
  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19);
  };

  const formatExpiry = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const formatCVV = (value: string): string => {
    return value.replace(/\D/g, '').substring(0, 3);
  };

  const formatPrice = (amount: number, currency: string = '€'): string => {
    return `${amount}${currency}`;
  };

  return {
    formatCardNumber,
    formatExpiry,
    formatCVV,
    formatPrice
  };
}; 