// AuthPage.jsx
import React, { useState } from 'react'
import Login from '../components/Login'
import Register from '../components/Register'

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="auth-page">
      {isLogin ? (
        <Login onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <Register onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  )
}

export default AuthPage