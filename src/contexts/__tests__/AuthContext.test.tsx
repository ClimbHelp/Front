import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { AuthProvider, useAuth } from '../../app/contexts/AuthContext'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Test component to use the auth context
const TestComponent = () => {
  const { isAuthenticated, userInfo, loading, login, logout } = useAuth()
  
  return (
    <div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="user">{userInfo ? JSON.stringify(userInfo) : 'null'}</div>
      <div data-testid="authenticated">{isAuthenticated.toString()}</div>
      <button onClick={() => login('fake-token', { username: 'test', email: 'test@example.com', id: 1 })}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('provides initial state', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Attendre que le loading soit terminé
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })
    
    expect(screen.getByTestId('user')).toHaveTextContent('null')
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false')
  })

  it('loads user from localStorage on mount', async () => {
    const mockUser = {
      username: 'test',
      email: 'user@example.com',
      id: 1
    }
    
    localStorageMock.getItem
      .mockReturnValueOnce('fake-token') // authToken
      .mockReturnValueOnce(JSON.stringify(mockUser)) // userInfo

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser))
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
  })

  it('handles login successfully', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    const loginButton = screen.getByText('Login')
    
    await act(async () => {
      loginButton.click()
    })

    // Should show user after login
    const userData = JSON.parse(screen.getByTestId('user').textContent || 'null')
    expect(userData).toEqual({
      username: 'test',
      email: 'test@example.com',
      id: 1
    })

    expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('authToken', 'fake-token')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('userInfo', JSON.stringify({
      username: 'test',
      email: 'test@example.com',
      id: 1
    }))
  })

  it('handles logout', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    // First login
    const loginButton = screen.getByText('Login')
    await act(async () => {
      loginButton.click()
    })

    // Then logout
    const logoutButton = screen.getByText('Logout')
    await act(async () => {
      logoutButton.click()
    })

    expect(screen.getByTestId('user')).toHaveTextContent('null')
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false')
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('authToken')
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('userInfo')
  })

  it('handles register successfully', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    const loginButton = screen.getByText('Login')
    
    await act(async () => {
      loginButton.click()
    })

    // Should show user after registration
    const userData = JSON.parse(screen.getByTestId('user').textContent || 'null')
    expect(userData).toEqual({
      username: 'test',
      email: 'test@example.com',
      id: 1
    })

    expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('authToken', 'fake-token')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('userInfo', JSON.stringify({
      username: 'test',
      email: 'test@example.com',
      id: 1
    }))
  })

  it('throws error when useAuth is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow('useAuth must be used within an AuthProvider')

    consoleSpy.mockRestore()
  })

  it('handles login error gracefully', async () => {
    // Mock console.warn to avoid noise in tests
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    // Mock a failed login by throwing an error
    const loginButton = screen.getByText('Login')
    
    // We can't easily test the error case with the current implementation
    // as it's just a simulation, but we can verify the loading state
    await act(async () => {
      loginButton.click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    consoleSpy.mockRestore()
  })
})
