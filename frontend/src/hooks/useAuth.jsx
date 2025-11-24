import { useState, useEffect, useContext, createContext } from 'react'
import { STORAGE_KEYS } from '../utils/constants'
import * as authService from '../services/authService'

/**
 * Auth Context
 */
const AuthContext = createContext(null)

/**
 * Auth Provider Component
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Initialize auth state from storage
   */
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER)
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)

        if (storedUser && token) {
          setUser(JSON.parse(storedUser))
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  /**
   * Login function
   */
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials)
      setUser(response.user || response)
      setIsAuthenticated(true)
      return response
    } catch (error) {
      throw error
    }
  }

  /**
   * Logout function
   */
  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  /**
   * Register function
   */
  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      setUser(response.user || response)
      setIsAuthenticated(true)
      return response
    } catch (error) {
      throw error
    }
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

