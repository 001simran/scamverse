// AuthContext.jsx — provider only (hook lives in useAuth.js for Vite Fast Refresh)
import React, { useState, useEffect } from 'react'
import { AuthContext } from './auth-context'
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../utils/api'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setUser({ token })
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      const response = await apiLogin(username, password)
      const resolved = response.username || username
      setUser({ username: resolved, token: response.access_token })
      return { success: true, username: resolved }
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Login failed' }
    }
  }

  const register = async (username, email, password) => {
    try {
      await apiRegister(username, email, password)
      apiLogout()
      setUser(null)
      return { success: true, username }
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
