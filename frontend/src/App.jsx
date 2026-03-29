// NetGuardian - Hackathon Integration
// App.jsx - Professional shell for 3D world, missions, and analytics

import React, { useState, useEffect } from 'react'
import { useGame } from './game/GameContext'
import GameWorld from './pages/GameWorld'

class GlobalErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) return <div style={{padding: '50px', color: 'red', background: 'black', height: '100vh', zIndex: 99999, position: 'fixed'}}><h1>Application Crash</h1><p>{this.state.error?.toString()}</p></div>;
    return this.props.children;
  }
}

import NetGuardianHUD from './components/NetGuardianHUD'
import LearnMode from './components/LearnMode'
import SpinWheelPage from './pages/SpinWheelPage'
import ScamDNA from './pages/ScamDNA'
import TransitionOverlay from './components/TransitionOverlay'
import ScamLab from './components/ScamLab'
import ImpactDashboard from './components/ImpactDashboard'
import FailureCutscene from './components/FailureCutscene'
import PanicButton from './components/PanicButton'
import CyberAmbassadorLeaderboard from './components/CyberAmbassadorLeaderboard'
import ScamScanner from './components/ScamScanner'
import VoiceCommandSystem from './utils/voiceCommands'
import DigitalArrestLab from './components/DigitalArrestLab'
import CyberInfoCorner from './components/CyberInfoCorner'
import PhoneSimulator from './components/PhoneSimulator'
import ScamBuilder from './components/ScamBuilder'
import FamilyShield from './components/FamilyShield'
import CyberShieldCertificate from './components/CyberShieldCertificate'
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
    openDigitalArrest,
    closeDigitalArrest,
    openInfoCorner,
    closeInfoCorner,
    openPhoneSim,
    closePhoneSim,
    openScamBuilder,
    closeScamBuilder,
    openFamilyShield,
    closeFamilyShield,
    openCertificate,
    closeCertificate,
    setStress,
    toggleElderMode,
    toggleLanguage,
    setAutoMoveTarget
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

  // Voice Command & Language Keyboard Shortcuts (H/E Keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only fire shortcuts if Elder mode overlay is actually visible or active
      const elderScreen = document.getElementById('screen-elder');
      if (state.isElderMode || (elderScreen && elderScreen.classList.contains('active'))) {
        voiceSystem.handleKeyDown(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.isElderMode, voiceSystem]);

  // Language Synchronization
  useEffect(() => {
    voiceSystem.setLanguage(state.language, state.isElderMode);
  }, [state.language, state.isElderMode, voiceSystem]);

  // Voice Command & Event Listeners
  useEffect(() => {
    // In Elder mode, we don't 'listen' for commands, but we do use the speaker system
    if (state.isElderMode) {
      voiceSystem.stopListening();
      
      const handleVoiceStart = () => setView('game');
      const handleVoiceSelect = (e) => {
        if (state.currentMission) {
          const isYes = e.detail.choice === 'yes';
          completeMission({ 
            isCorrect: isYes === state.currentMission.isScam,
            xpGain: 100,
            securityGain: 5,
            feedback: state.language === 'en' ? "Choice recorded." : "चुनाव दर्ज किया गया।"
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
  }, [state.isElderMode, state.currentMission, state.language, voiceSystem]);

  // Voice confirmation for state changes (Accessibility)
  useEffect(() => {
    if (state.isElderMode) {
      document.body.classList.add('elder-mode-active');
      const msg = state.language === 'en' 
        ? "Elder mode is now active. Text is larger and I will speak whatever you hover over." 
        : "बुजुर्ग मोड अब सक्रिय है। लिखा हुआ बड़ा हो गया है और मैं हर चीज को पढ़कर सुनाऊँगी।";
      voiceSystem.speak(msg);
    } else {
      document.body.classList.remove('elder-mode-active');
    }
  }, [state.isElderMode]);

  /* Redundant language announcement removed per user request: "NO NEED TO SAY english selected evrytime" */

  // Handle TTS on hover globally
  useEffect(() => {
    if (!state.isElderMode) return;

    const handleHover = (e) => {
      const target = e.target;
      // Find the nearest interactive or readable element
      const interactive = target.closest('button, input, a, [data-tts], h1, h2, h3, p, li, span');
      
      if (interactive && interactive !== window._lastSpoken) {
        // Priority: data-tts > aria-label > innerText > placeholder > title
        const textToSpeak = interactive.getAttribute('data-tts') || 
                           interactive.getAttribute('aria-label') || 
                           interactive.innerText || 
                           interactive.placeholder || 
                           interactive.title ||
                           interactive.value;

        if (textToSpeak && textToSpeak.trim().length > 0) {
          voiceSystem.speak(textToSpeak, { rate: 0.95 });
          window._lastSpoken = interactive;
        }
      }
    };

    const handleLeave = () => {
      window._lastSpoken = null;
    };

    document.addEventListener('mouseover', handleHover);
    document.addEventListener('mouseout', handleLeave);
    return () => {
      document.removeEventListener('mouseover', handleHover);
      document.removeEventListener('mouseout', handleLeave);
    };
  }, [state.isElderMode, state.language]);

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
    // Prevent restarting if already in a mission
    if (state.currentMission) return;

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
      case 'forensics':
        openDigitalArrest();
        break
      case 'cybercell':
        startMission('digital_arrest')
        break
      case 'infocenter':
        openInfoCorner();
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
    <GlobalErrorBoundary>
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
          <ScamLab 
            onClose={() => setView('game')} 
            onComplete={() => {
              progression.addXP(300); // 300 XP for advanced lab research
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

        {state.currentView === 'scanner' && (
          <ScamScanner 
            onClose={() => setView('game')} 
            language={state.language}
          />
        )}
      </div>

      {/* Digital Arrest Simulation */}
      {state.showDigitalArrest && (
        <DigitalArrestLab 
          onClose={closeDigitalArrest} 
        />
      )}

      {/* Cyber Info Corner Hub */}
      {state.showInfoCorner && (
        <CyberInfoCorner onClose={closeInfoCorner} />
      )}

      {/* Exceptional Feature: Phone Simulator */}
      {state.showPhoneSim && (
        <PhoneSimulator 
          onClose={closePhoneSim} 
          language={state.language}
          isElderMode={state.isElderMode}
        />
      )}

      {/* Exceptional Feature: Reverse Scam Builder */}
      {state.showScamBuilder && (
        <ScamBuilder 
          onClose={closeScamBuilder} 
          language={state.language}
        />
      )}

      {/* Exceptional Feature: Family Shield (Viral Loop) */}
      {state.showFamilyShield && (
        <FamilyShield 
          onClose={closeFamilyShield} 
          language={state.language}
        />
      )}

      {/* Social Reward: Cyber Shield Certificate */}
      {state.showCertificate && (
        <CyberShieldCertificate 
          playerName={state.playerName}
          score={state.certData.score}
          total={state.certData.total}
          onClose={closeCertificate}
        />
      )}

      {/* Panic Meter Pulse Overlay */}
      {state.stressLevel > 0 && (
        <div 
          className="panic-pulse-overlay" 
          style={{ 
            opacity: state.stressLevel / 100,
            boxShadow: `inset 0 0 ${state.stressLevel * 2}px rgba(255, 0, 85, ${state.stressLevel / 100})`
          }}
        />
      )}

      {/* Professional HUD Overlay */}
      {(state.currentView === 'game' || state.currentView === 'title') && (
        <NetGuardianHUD 
          progression={progression}
          progressionData={progressionData}
          currentMission={state.currentMission}
          onMissionDecision={completeMission}
          onStartMission={handleEnterBuilding}
          setView={handleViewChange}
          isElderMode={state.isElderMode}
          toggleElderMode={toggleElderMode}
          language={state.language}
          toggleLanguage={toggleLanguage}
          openPhoneSim={openPhoneSim}
          openScamBuilder={openScamBuilder}
          openFamilyShield={openFamilyShield}
          setAutoMoveTarget={setAutoMoveTarget}
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
          missionResult={state.lastMissionResult}
          onContinue={closeFailureCutscene}
        />
      )}

      {/* Elder Mode Accessability - Global Panic Button */}
      {state.isElderMode && <PanicButton />}

      {/* Transition Effect */}
      {isTransitioning && <TransitionOverlay />}
    </div>
    </GlobalErrorBoundary>
  )
}

export default App

