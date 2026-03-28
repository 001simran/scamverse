// ScamVerse - NetGuardian
// App.jsx - Main routing and app structure

import React, { useState, useEffect } from 'react'
import { useGame } from './game/GameContext'
import AuthPage from './pages/AuthPage'
import GameWorld from './pages/GameWorld'
import SpinWheelPage from './pages/SpinWheelPage'
import ScamDNA from './pages/ScamDNA'
import ImpactDashboard from './components/ImpactDashboard'
import TransitionOverlay from './components/TransitionOverlay'
import LearnMode from './components/LearnMode'
import './App.css'

function App() {
  const { state, setView } = useGame()
  const [showImpactDashboard, setShowImpactDashboard] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Handle view transitions
  const handleViewChange = (newView) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setView(newView)
      setIsTransitioning(false)
    }, 500)
  }

  // Require a player name from login before showing the game shell
  if (!state.playerName || state.currentView === 'auth') {
    return <AuthPage />
  }

  return (
    <div className="app-container">
      {/* Main Game View */}
      <div className={`view-container ${isTransitioning ? 'transitioning' : ''}`}>
        {state.currentView === 'title' && (
          <GameWorld onViewChange={handleViewChange} />
        )}
        {state.currentView === 'game' && (
          <GameWorld onViewChange={handleViewChange} />
        )}
        {state.currentView === 'spin' && (
          <SpinWheelPage onViewChange={handleViewChange} />
        )}
        {state.currentView === 'dna' && (
          <ScamDNA onViewChange={handleViewChange} />
        )}
        {state.currentView === 'learn' && (
          <LearnMode onViewChange={handleViewChange} />
        )}
      </div>

      {/* Impact Dashboard Modal */}
      {showImpactDashboard && (
        <ImpactDashboard 
          userStats={state}
          onClose={() => setShowImpactDashboard(false)}
        />
      )}

      {/* Transition Effect */}
      {isTransitioning && <TransitionOverlay />}

      {/* Impact Dashboard Toggle Button */}
      {state.currentView === 'game' && state.currentView !== 'auth' && (
        <button 
          className="impact-dashboard-btn"
          onClick={() => setShowImpactDashboard(true)}
          title="View your impact statistics"
        >
          📊
        </button>
      )}
    </div>
  )
}

export default App
