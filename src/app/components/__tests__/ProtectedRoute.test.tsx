import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProtectedRoute from '../ProtectedRoute'
import { AuthProvider } from '../../contexts/AuthContext'

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: mockPush,
    }
  },
}))

const TestChild = () => <div data-testid="protected-content">Protected Content</div>

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('redirects to login when user is not authenticated', async () => {
    // Mock localStorage pour simuler un utilisateur non authentifié
    const localStorageMock = {
      getItem: jest.fn().mockReturnValue(null),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    }
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    })

    render(
      <AuthProvider>
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      </AuthProvider>
    )

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        '/login?error=Vous devez être connecté pour accéder à cette page'
      )
    })

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('renders children when user is authenticated', async () => {
    // Mock localStorage to simulate authenticated user
    const mockUser = {
      username: 'test',
      email: 'user@example.com',
      id: 1
    }
    
    const localStorageMock = {
      getItem: jest.fn()
        .mockReturnValueOnce('fake-token') // authToken
        .mockReturnValueOnce(JSON.stringify(mockUser)), // userInfo
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    }
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    })

    render(
      <AuthProvider>
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    })

    expect(screen.queryByText('Vérification...')).not.toBeInTheDocument()
    expect(mockPush).not.toHaveBeenCalled()
  })


})
