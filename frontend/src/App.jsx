// NetGuardian - Hackathon Integration
// App.jsx - Professional shell for 3D world, missions, and analytics

import React, { useState, useEffect } from 'react'
import { useGame } from './game/GameContext'
import GameWorld from './pages/GameWorld'
import NetGuardianHUD from './components/NetGuardianHUD'
import LearnMode from './components/LearnMode'
import SpinWheelPage from './pages/SpinWheelPage'
import ScamDNA from './pages/ScamDNA'
import TransitionOverlay from './components/TransitionOverlay'
import './App.css'

function App() {
  const { 
    state, 
    progression,
    progressionData, 
    setView, 
    startMission, 
    completeMission, 
    closeLearnMode 
  } = useGame()
  
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Handle view transitions with smooth overlay
  const handleViewChange = (newView) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setView(newView)
      setIsTransitioning(false)
    }, 500)
  }

  // Handle building entry from 3D world
  const handleEnterBuilding = (buildingId) => {
    switch(buildingId) {
      case 'home':
        startMission('phishing_email')
        break
      case 'bazaar':
        startMission('rupee_scam')
        break
      case 'bank':
        startMission('refund_scam')
        break
      case 'cybercell':
        startMission('digital_arrest')
        break
      case 'awareness':
        handleViewChange('spin')
        break
      case 'scamlab':
        handleViewChange('dna')
        break
      default:
        console.log("No mission for building:", buildingId)
    }
  }

  return (
    <div className="app-container">
      {/* 3D Game World Layers */}
      <div className={`view-container ${isTransitioning ? 'transitioning' : ''}`}>
        {(state.currentView === 'game' || state.currentView === 'title') && (
          <GameWorld 
            playerName={state.playerName}
            onEnterBuilding={handleEnterBuilding} 
          />
        )}
        
        {state.currentView === 'spin' && (
          <SpinWheelPage onViewChange={handleViewChange} />
        )}
        
        {state.currentView === 'dna' && (
          <ScamDNA onClose={() => setView('game')} />
        )}
      </div>

      {/* Professional HUD Overlay */}
      {(state.currentView === 'game' || state.currentView === 'title') && (
        <NetGuardianHUD 
          progression={progression}
          currentMission={state.currentMission}
          onMissionDecision={completeMission}
        />
      )}

      {/* Educational Learn Mode Modal */}
      {state.showLearnMode && (
        <LearnMode 
          scamContent={state.lastMissionResult?.learnMode || state.lastMissionResult}
          missionResult={state.lastMissionResult}
          onClose={closeLearnMode}
        />
      )}

      {/* Transition Effect */}
      {isTransitioning && <TransitionOverlay />}
    </div>
  )
}

export default App

