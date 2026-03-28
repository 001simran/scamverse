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
import DeepfakeChallenge from './components/DeepfakeChallenge'
import ImpactDashboard from './components/ImpactDashboard'
import FailureCutscene from './components/FailureCutscene'
import PanicButton from './components/PanicButton'
import CyberAmbassadorLeaderboard from './components/CyberAmbassadorLeaderboard'
import VoiceCommandSystem from './utils/voiceCommands'
import soundManager from './utils/sounds'
import './App.css'

function App() {
  const { 
    state, 
    progression,
    progressionData, 
    setView, 
    startMission, 
    completeMission, 
    closeLearnMode,
    closeFailureCutscene,
    toggleElderMode,
    toggleLanguage
  } = useGame()

  const [voiceSystem] = useState(() => new VoiceCommandSystem())
  
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Handle view transitions with smooth overlay
  const handleViewChange = (newView) => {
    soundManager.playClick()
    setIsTransitioning(true)
    setTimeout(() => {
      setView(newView)
      setIsTransitioning(false)
    }, 500)
  }

  // Voice Command & Language Integration
  useEffect(() => {
    voiceSystem.setLanguage(state.language);
    
    if (state.isElderMode) {
      voiceSystem.startListening();
      
      const handleVoiceStart = () => setView('game');
      const handleVoiceSelect = (e) => {
        if (state.currentMission) {
          const isYes = e.detail.choice === 'yes';
          completeMission({ 
            isCorrect: isYes === state.currentMission.isScam,
            xpGain: 100,
            securityGain: 5,
            feedback: state.language === 'en' ? "Voice choice recorded." : "आवाज़ से चुनाव दर्ज किया गया।"
          });
        }
      };

      window.addEventListener('voice-start-game', handleVoiceStart);
      window.addEventListener('voice-select', handleVoiceSelect);
      
      return () => {
        window.removeEventListener('voice-start-game', handleVoiceStart);
        window.removeEventListener('voice-select', handleVoiceSelect);
      };
    } else {
      voiceSystem.stopListening();
    }
  }, [state.isElderMode, state.currentMission, state.language]);

  // Sound triggers for mission completion
  useEffect(() => {
    if (state.lastMissionResult) {
      if (state.lastMissionResult.isCorrect) {
        soundManager.playSuccess();
      } else {
        soundManager.playFailure();
      }
    }
  }, [state.lastMissionResult]);

  // Handle building proximity for voice guide
  const handleNearBuilding = (id, label) => {
    if (state.isElderMode) {
      voiceSystem.speakProximity(label);
    }
  };

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
        handleViewChange('deepfake')
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
            onNearBuilding={handleNearBuilding}
            isElderMode={state.isElderMode}
          />
        )}
        
        {state.currentView === 'spin' && (
          <SpinWheelPage onViewChange={handleViewChange} />
        )}
        
        {state.currentView === 'dna' && (
          <ScamDNA onClose={() => setView('game')} />
        )}

        {state.currentView === 'deepfake' && (
          <DeepfakeChallenge 
            onClose={() => setView('game')} 
            onComplete={() => {
              progression.addXP(200);
              setView('game');
            }}
          />
        )}

        {state.currentView === 'dashboard' && (
          <ImpactDashboard onClose={() => setView('game')} />
        )}

        {state.currentView === 'leaderboard' && (
          <CyberAmbassadorLeaderboard onClose={() => setView('game')} />
        )}
      </div>

      {/* Professional HUD Overlay */}
      {(state.currentView === 'game' || state.currentView === 'title') && (
        <NetGuardianHUD 
          progression={progression}
          currentMission={state.currentMission}
          onMissionDecision={completeMission}
          setView={handleViewChange}
          isElderMode={state.isElderMode}
          toggleElderMode={toggleElderMode}
          language={state.language}
          toggleLanguage={toggleLanguage}
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

      {/* Emotional Failure Overlay */}
      {state.showFailureCutscene && (
        <FailureCutscene 
          scamType={state.failureData?.scamType}
          amountLost={state.failureData?.amountLost}
          onContinue={closeFailureCutscene}
        />
      )}

      {/* Elder Mode Accessability - Global Panic Button */}
      {state.isElderMode && <PanicButton />}

      {/* Transition Effect */}
      {isTransitioning && <TransitionOverlay />}
    </div>
  )
}

export default App

