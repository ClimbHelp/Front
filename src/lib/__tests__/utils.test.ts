import {
  cn,
  formatPrice,
  formatDate,
  formatRelativeDate,
  isValidEmail,
  generateId,
  debounce,
  capitalize,
  truncate,
  formatPhoneNumber,
  formatCardNumber
} from '../utils'

describe('Utils', () => {
  describe('cn', () => {
    it('combines class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('filters out falsy values', () => {
      expect(cn('class1', null, undefined, false, 'class2')).toBe('class1 class2')
    })

    it('handles empty inputs', () => {
      expect(cn()).toBe('')
    })

    it('handles single class', () => {
      expect(cn('single-class')).toBe('single-class')
    })
  })

  describe('formatPrice', () => {
    it('formats price with default currency', () => {
      expect(formatPrice(100)).toBe('100€')
    })

    it('formats price with custom currency', () => {
      expect(formatPrice(100, '$')).toBe('100$')
    })

    it('handles decimal prices', () => {
      expect(formatPrice(99.99)).toBe('99.99€')
    })

    it('handles zero price', () => {
      expect(formatPrice(0)).toBe('0€')
    })
  })

  describe('formatDate', () => {
    it('formats date in French', () => {
      const date = new Date('2023-12-25')
      const formatted = formatDate(date)
      expect(formatted).toContain('2023')
      expect(formatted).toContain('décembre')
    })

    it('handles different dates', () => {
      const date = new Date('2023-01-15')
      const formatted = formatDate(date)
      expect(formatted).toContain('2023')
      expect(formatted).toContain('janvier')
    })
  })

  describe('formatRelativeDate', () => {
    beforeEach(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2023-12-25'))
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('returns "Aujourd\'hui" for today', () => {
      const today = new Date('2023-12-25')
      expect(formatRelativeDate(today)).toBe('Aujourd\'hui')
    })

    it('returns "Hier" for yesterday', () => {
      const yesterday = new Date('2023-12-24')
      expect(formatRelativeDate(yesterday)).toBe('Hier')
    })

    it('returns days ago for recent dates', () => {
      const threeDaysAgo = new Date('2023-12-22')
      expect(formatRelativeDate(threeDaysAgo)).toBe('Il y a 3 jours')
    })

    it('returns weeks ago for dates within a month', () => {
      const twoWeeksAgo = new Date('2023-12-11')
      expect(formatRelativeDate(twoWeeksAgo)).toBe('Il y a 2 semaines')
    })

    it('returns months ago for dates within a year', () => {
      const threeMonthsAgo = new Date('2023-09-25')
      expect(formatRelativeDate(threeMonthsAgo)).toBe('Il y a 3 mois')
    })

    it('returns years ago for old dates', () => {
      const twoYearsAgo = new Date('2021-12-25')
      expect(formatRelativeDate(twoYearsAgo)).toBe('Il y a 2 ans')
    })
  })

  describe('isValidEmail', () => {
    it('validates correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
      expect(isValidEmail('test+tag@example.org')).toBe(true)
    })

    it('rejects invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('test@.com')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })
  })

  describe('generateId', () => {
    it('generates a string', () => {
      const id = generateId()
      expect(typeof id).toBe('string')
      expect(id.length).toBeGreaterThan(0)
    })

    it('generates different IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('debounces function calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 1000)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(1000)

      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('passes arguments correctly', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 1000)

      debouncedFn('arg1', 'arg2')

      jest.advanceTimersByTime(1000)

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
    })
  })

  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
      expect(capitalize('world')).toBe('World')
    })

    it('handles empty string', () => {
      expect(capitalize('')).toBe('')
    })

    it('handles single character', () => {
      expect(capitalize('a')).toBe('A')
    })

    it('handles already capitalized string', () => {
      expect(capitalize('Hello')).toBe('Hello')
    })
  })

  describe('truncate', () => {
    it('truncates long strings', () => {
      expect(truncate('This is a very long string', 10)).toBe('This is a ...')
    })

    it('returns original string if shorter than limit', () => {
      expect(truncate('Short', 10)).toBe('Short')
    })

    it('handles exact length', () => {
      expect(truncate('Exactly', 7)).toBe('Exactly')
    })

    it('handles empty string', () => {
      expect(truncate('', 10)).toBe('')
    })
  })

  describe('formatPhoneNumber', () => {
    it('formats French phone number correctly', () => {
      expect(formatPhoneNumber('0123456789')).toBe('01 23 45 67 89')
    })

    it('handles phone number with spaces', () => {
      expect(formatPhoneNumber('01 23 45 67 89')).toBe('01 23 45 67 89')
    })

    it('handles phone number with dashes', () => {
      expect(formatPhoneNumber('01-23-45-67-89')).toBe('01 23 45 67 89')
    })

    it('returns original if not valid format', () => {
      expect(formatPhoneNumber('123')).toBe('123')
      expect(formatPhoneNumber('invalid')).toBe('invalid')
    })
  })

  describe('formatCardNumber', () => {
    it('formats card number with spaces', () => {
      expect(formatCardNumber('1234567890123456')).toBe('1234 5678 9012 3456')
    })

    it('removes non-numeric characters', () => {
      expect(formatCardNumber('1234-5678-9012-3456')).toBe('1234 5678 9012 3456')
    })

    it('handles partial card numbers', () => {
      expect(formatCardNumber('1234')).toBe('1234')
      expect(formatCardNumber('12345678')).toBe('1234 5678')
    })

    it('limits to 19 characters', () => {
      expect(formatCardNumber('123456789012345678901234')).toBe('1234 5678 9012 3456')
    })
  })
})
