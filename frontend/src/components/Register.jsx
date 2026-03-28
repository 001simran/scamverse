// Register.jsx
import React, { useState } from 'react'
import { useAuth } from '../game/useAuth'

function Register({ onSwitchToLogin }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    const result = await register(username, email, password)
    setLoading(false)

    if (!result.success) {
      setError(result.error)
    } else {
      onSwitchToLogin?.(result.username || username)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h2 style={styles.title}>Register for ScamVerse</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          {error && <div style={styles.error}>{error}</div>}
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p style={styles.switchText}>
          Already have an account?{' '}
          <button type="button" onClick={() => onSwitchToLogin?.()} style={styles.linkButton}>Login</button>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(circle at center, #1a1a3a 0%, #050510 100%)'
  },
  form: {
    width: '100%',
    maxWidth: '360px',
    padding: '40px 30px',
    background: '#0a0a1a',
    borderRadius: '24px',
    border: '1px solid #2a2a4a',
    textAlign: 'center',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
  },
  title: {
    fontSize: '28px',
    margin: '0 0 20px',
    fontWeight: '900',
    letterSpacing: '1px',
    color: '#4fc3f7'
  },
  inputGroup: {
    marginBottom: '20px',
    textAlign: 'left'
  },
  label: {
    display: 'block',
    fontSize: '12px',
    color: '#4fc3f7',
    marginBottom: '8px',
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    padding: '14px',
    background: '#12122a',
    border: '1px solid #2a2a4a',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '16px',
    outline: 'none'
  },
  error: {
    color: '#ff4444',
    fontSize: '14px',
    marginBottom: '20px'
  },
  button: {
    width: '100%',
    padding: '16px',
    background: '#4fc3f7',
    color: '#000',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '20px'
  },
  switchText: {
    fontSize: '14px',
    color: '#666'
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#4fc3f7',
    cursor: 'pointer',
    textDecoration: 'underline'
  }
}

export default Register