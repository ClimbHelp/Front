import { renderHook } from '@testing-library/react'
import { usePaymentFormatting } from '../usePaymentFormatting'

describe('usePaymentFormatting', () => {
  it('returns all formatting functions', () => {
    const { result } = renderHook(() => usePaymentFormatting())

    expect(result.current.formatCardNumber).toBeDefined()
    expect(result.current.formatExpiry).toBeDefined()
    expect(result.current.formatCVV).toBeDefined()
    expect(result.current.formatPrice).toBeDefined()
  })

  describe('formatCardNumber', () => {
    it('formats card number with spaces', () => {
      const { result } = renderHook(() => usePaymentFormatting())

      expect(result.current.formatCardNumber('1234567890123456')).toBe('1234 5678 9012 3456')
    })

    it('removes non-numeric characters', () => {
      const { result } = renderHook(() => usePaymentFormatting())

      expect(result.current.formatCardNumber('1234-5678-9012-3456')).toBe('1234 5678 9012 3456')
    })

    it('handles partial card numbers', () => {
      const { result } = renderHook(() => usePaymentFormatting())

      expect(result.current.formatCardNumber('1234')).toBe('1234')
      expect(result.current.formatCardNumber('12345678')).toBe('1234 5678')
    })

    it('limits to 19 characters', () => {
      const { result } = renderHook(() => usePaymentFormatting())

      expect(result.current.formatCardNumber('123456789012345678901234')).toBe('1234 5678 9012 3456')
    })

    it('handles empty string', () => {
      const { result } = renderHook(() => usePaymentFormatting())

      expect(result.current.formatCardNumber('')).toBe('')
    })

    it('handles string with only spaces', () => {
      const { result } = renderHook(() => usePaymentFormatting())

      expect(result.current.formatCardNumber('   ')).toBe('')
    })
  })

  describe('formatExpiry', () => {
    it('formats expiry date with slash', () => {
      const { result } = renderHook(() => usePaymentFormatting())

      expect(result.current.formatExpiry('1225')).toBe('12/25')
    })

    it('removes non-numeric characters', () => {
      const { result } = renderHook(() => usePaymentFormatting())

      expect(result.current.formatExpiry('12-25')).toBe('12/25')
    })

    it('handles partial expiry dates', () => {
      const { result } = renderHook(() => usePaymentFormatting())

      expect(result.current.formatExpiry('1')).toBe('1')
      expect(result.current.formatExpiry('12')).toBe('12')
      expect(result.current.formatExpiry('123')).toBe('12')
      expect(result.current.formatExpiry('1234')).toBe('12/34')
    })

    it('limits to 4 digits', () => {
      const { result } = renderHook(() => usePaymentFormatting())

      expect(result.current.formatExpiry('122534')).toBe('12/25')
    })

    it('handles empty string', () => {
      const { result } = renderHook(() => usePaymentFormatting())

      expect(result.current.formatExpiry('')).toBe('')
    })
  })

  describe('formatCVV', () => {
    it('formats CVV correctly', () => {
      const { result } = renderHook(() => usePaymentFormatting())

      expect(result.current.formatCVV('123')).toBe('123')
    })

    it('removes non-numeric characters', () => {
      const { result } = renderHook(() => usePaymentFormatting())

      expect(result.current.formatCVV('12-3')).toBe('123')
    })

    it('limits to 3 digits', () => {
      const { result } = renderHook(() => usePaymentFormatting())

      expect(result.current.formatCVV('1234')).toBe('123')
    })

    it('handles partial CVV', () => {
      const { result } = renderHook(() => usePaymentFormatting())

      expect(result.current.formatCVV('12')).toBe('12')
    })

    it('handles empty string', () => {
      const { result } = renderHook(() => usePaymentFormatting())

      expect(result.current.formatCVV('')).toBe('')
    })
  })

  describe('formatPrice', () => {
    it('formats price with default currency', () => {
      const { result } = renderHook(() => usePaymentFormatting())

      expect(result.current.formatPrice(100)).toBe('100€')
    })

    it('formats price with custom currency', () => {
      const { result } = renderHook(() => usePaymentFormatting())

      expect(result.current.formatPrice(100, '$')).toBe('100$')
    })

    it('handles zero amount', () => {
      const { result } = renderHook(() => usePaymentFormatting())

      expect(result.current.formatPrice(0)).toBe('0€')
    })

    it('handles decimal amounts', () => {
      const { result } = renderHook(() => usePaymentFormatting())

      expect(result.current.formatPrice(99.99)).toBe('99.99€')
    })

    it('handles negative amounts', () => {
      const { result } = renderHook(() => usePaymentFormatting())

      expect(result.current.formatPrice(-50)).toBe('-50€')
    })
  })
})
