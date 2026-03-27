// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../utils/api'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // In a real app, you'd validate the token with the server
      setUser({ token })
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      const response = await apiLogin(username, password)
      setUser({ username, token: response.access_token })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Login failed' }
    }
  }

  const register = async (username, email, password) => {
    try {
      await apiRegister(username, email, password)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Registration failed' }
    }
  }

  const logout = () => {
    apiLogout()
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}