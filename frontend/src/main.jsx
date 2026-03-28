import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { GameProvider } from './game/GameContext'
import { AuthProvider } from './game/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <GameProvider>
        <App />
      </GameProvider>
    </AuthProvider>
  </React.StrictMode>
)