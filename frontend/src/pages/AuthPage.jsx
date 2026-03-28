// AuthPage.jsx
import React, { useState } from 'react'
import Login from '../components/Login'
import Register from '../components/Register'

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [loginUsernameHint, setLoginUsernameHint] = useState('')

  return (
    <div className="auth-page">
      {isLogin ? (
        <Login
          initialUsername={loginUsernameHint}
          onSwitchToRegister={() => setIsLogin(false)}
        />
      ) : (
        <Register
          onSwitchToLogin={(name) => {
            if (name) setLoginUsernameHint(name)
            setIsLogin(true)
          }}
        />
      )}
    </div>
  )
}

export default AuthPage