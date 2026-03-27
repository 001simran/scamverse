/*
 * ScamVerse - HackMol 7.0
 * App.jsx - Main Router & Entry Point
 * Handles switching between Title, GameWorld, and other views
 */

import { useState, useEffect, useRef } from 'react'
import { useGame } from './game/GameContext'
import { AuthProvider, useAuth } from './game/AuthContext'
import GameWorld from './pages/GameWorld'
import SpinWheelPage from './pages/SpinWheelPage'
import ScamDNA from './pages/ScamDNA'
import AnalysisPage from './pages/AnalysisPage'
import AuthPage from './pages/AuthPage'
import BuildingInterior from './pages/BuildingInterior'
import ElderScenarioModal from './elder/ElderScenarioModal'
import HUDElder from './elder/HUDElder'
import MinecraftEnterTitle from './components/MinecraftEnterTitle'

function AppContent() {
  const { isAuthenticated, logout } = useAuth()
  const { state, dispatch } = useGame()
  const [activeBuilding, setActiveBuilding] = useState(null)
  const [enterTitle, setEnterTitle] = useState(null)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const prevLevelRef = useRef(state.level)

  // Select the right office component based on building ID
  function getOfficeComponent() {
    if (!activeBuilding) return null
    return BuildingInterior
  }

  // level up detection
  useEffect(() => {
    if (state.level > prevLevelRef.current) {
      setShowLevelUp(true)
      playLevelUpSound()
      setTimeout(() => setShowLevelUp(false), 3000)
    }
    prevLevelRef.current = state.level
  }, [state.level])

  // level up sound
  function playLevelUpSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const notes = [523, 659, 784, 1047]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = freq
        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.12)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.2)
        osc.start(ctx.currentTime + i * 0.12)
        osc.stop(ctx.currentTime + i * 0.12 + 0.2)
      })
    } catch (e) { console.log('level up sound failed') }
  }

  if (!isAuthenticated) {
    return <AuthPage />
  }

  // ── ROUTING ────────────────────────────────────────────────
  const renderView = () => {
    switch (state.currentView) {
      case 'title':
        return <TitleScreen onStart={(name, elder) => {
          dispatch({ type: 'SET_PLAYER', payload: { name, elderMode: elder } })
        }} />

      case 'game':
        return (
          <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <button
              onClick={logout}
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                zIndex: 1000,
                padding: '8px 12px',
                background: '#ff4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
            {state.isElderMode && (
              <HUDElder 
                playerName={state.playerName} 
                score={state.score} 
                level={state.level} 
                rank={state.rank} 
              />
            )}
            <MinecraftEnterTitle
              title={enterTitle?.title || ''}
              subtitle={enterTitle?.subtitle || ''}
              durationMs={2600}
            />
            <GameWorld 
              playerName={state.playerName} 
              isElderMode={state.isElderMode}
              onEnterBuilding={(b) => {
                setEnterTitle({
                  title: b?.label ? b.label.replace(/^[^\s]+\s*/, '').trim() : 'Building',
                  subtitle: 'Entering...'
                })
                setActiveBuilding(b)
              }}
            />
            {activeBuilding && (
              state.isElderMode 
                ? (
                  <div style={styles.fullscreenOverlay}>
                    <ElderScenarioModal building={activeBuilding} onClose={() => setActiveBuilding(null)} />
                  </div>
                )
                : (() => {
                    const OfficeComponent = getOfficeComponent()
                    return (
                      <div style={styles.fullscreenOverlay}>
                        <OfficeComponent building={activeBuilding} onClose={() => setActiveBuilding(null)} />
                      </div>
                    )
                  })()
            )}

            {/* HUD Quick Access Buttons - Normal Mode */}
            {!state.isElderMode && (
              <div style={styles.hudButtons}>
                <button
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'analysis' })}
                  style={{ ...styles.hudBtn, borderColor: '#4fc3f7' }}
                  title="Analysis Hub"
                >
                  🔍
                </button>
                <button
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'spin' })}
                  style={{ ...styles.hudBtn, borderColor: '#9c27b0' }}
                  title="Spin Wheel"
                >
                  🎡
                </button>
                <button
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'dna' })}
                  style={{ ...styles.hudBtn, borderColor: '#4caf50' }}
                  title="Scam DNA"
                >
                  🧬
                </button>
              </div>
            )}

            {/* Elder Mode Floating Buttons */}
            {state.isElderMode && (
              <div style={styles.elderButtons}>
                <button
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'analysis' })}
                  style={styles.elderBtn}
                >
                  🔍 Analysis
                </button>
                <button
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'spin' })}
                  style={styles.elderBtn}
                >
                  🎡 Spin Wheel
                </button>
                <button
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'dna' })}
                  style={styles.elderBtn}
                >
                  🧬 Scam DNA
                </button>
              </div>
            )}
          </div>
        )

      case 'spin':
        return <SpinWheelPage onBack={() => dispatch({ type: 'SET_VIEW', payload: 'game' })} />

      case 'dna':
        return <ScamDNA onClose={() => dispatch({ type: 'SET_VIEW', payload: 'game' })} />

      case 'analysis':
        return <AnalysisPage onClose={() => dispatch({ type: 'SET_VIEW', payload: 'game' })} />

      default:
        return <div style={{ color: '#fff', padding: '20px' }}>Unknown View: {state.currentView}</div>
    }
  }

  return (
    <div className="app-container" style={{ background: '#000', minHeight: '100vh', color: '#fff', overflow: 'hidden' }}>
      {renderView()}

      {/* Level Up Popup */}
      {showLevelUp && (
        <div style={styles.levelUpPopup}>
          <div style={styles.levelUpContent}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>⭐</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffd700' }}>
              LEVEL UP!
            </div>
            <div style={{ fontSize: '16px', color: '#4fc3f7' }}>
              {state.rank}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

// ── INTERNAL COMPONENTS ───────────────────────────────────

function TitleScreen({ onStart }) {
  const [name, setName] = useState('')
  const [isElder, setIsElder] = useState(false)

  return (
    <div style={ts.ov}>
      <div style={ts.card}>
        <h1 style={ts.h1}>SCAM<span style={{ color: '#4fc3f7' }}>VERSE</span></h1>
        <p style={ts.p}>Master the Art of Detection</p>
        
        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <label style={ts.label}>Your Name:</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={ts.input}
            placeholder="Enter Agent Name..."
          />
        </div>

        <div 
          onClick={() => setIsElder(!isElder)}
          style={{ 
            ...ts.modeBox, 
            borderColor: isElder ? '#ff9800' : '#2a2a4a',
            background: isElder ? '#ff980015' : '#12122a'
          }}
        >
          <div style={{ fontSize: '24px' }}>👴</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 'bold', color: isElder ? '#ff9800' : '#fff' }}>Elder Mode</div>
            <div style={{ fontSize: '11px', color: '#666' }}>Bigger text, voice-guided experience</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            {isElder ? '✅' : '☐'}
          </div>
        </div>

        <button 
          onClick={() => name.trim() && onStart(name, isElder)}
          disabled={!name.trim()}
          style={{
            ...ts.btn,
            opacity: name.trim() ? 1 : 0.5,
            cursor: name.trim() ? 'pointer' : 'not-allowed'
          }}
        >
          START MISSION
        </button>
      </div>
    </div>
  )
}

const ts = {
  ov: {
    height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'radial-gradient(circle at center, #1a1a3a 0%, #050510 100%)'
  },
  card: {
    width: '100%', maxWidth: '360px', padding: '40px 30px', background: '#0a0a1a',
    borderRadius: '24px', border: '1px solid #2a2a4a', textAlign: 'center',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
  },
  h1: { fontSize: '42px', margin: '0 0 10px', fontWeight: '900', letterSpacing: '2px' },
  p: { color: '#666', fontSize: '14px', marginBottom: '30px', textTransform: 'uppercase' },
  label: { display: 'block', fontSize: '12px', color: '#4fc3f7', marginBottom: '8px', fontWeight: 'bold' },
  input: {
    width: '100%', padding: '14px', background: '#12122a', border: '1px solid #2a2a4a',
    borderRadius: '12px', color: '#fff', fontSize: '16px', outline: 'none'
  },
  modeBox: {
    display: 'flex', alignItems: 'center', gap: '15px', padding: '15px',
    borderRadius: '12px', border: '1px solid', cursor: 'pointer', marginBottom: '30px',
    transition: 'all 0.2s'
  },
  btn: {
    width: '100%', padding: '16px', background: '#4fc3f7', color: '#000',
    border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold'
  }
}

// additional styles for new features
const styles = {
  fullscreenOverlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 1100,
    width: '100%',
    height: '100%',
    background: '#000'
  },
  hudButtons: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    zIndex: 100
  },
  hudBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '2px solid',
    background: 'rgba(10, 10, 26, 0.8)',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(4px)'
  },
  elderButtons: {
    position: 'absolute',
    left: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    zIndex: 100
  },
  elderBtn: {
    padding: '12px 16px',
    background: '#4fc3f7',
    border: 'none',
    borderRadius: '8px',
    color: '#000',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  levelUpPopup: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(8px)'
  },
  levelUpContent: {
    background: '#12122a',
    border: '2px solid #ffd700',
    borderRadius: '20px',
    padding: '30px',
    textAlign: 'center',
    animation: 'popIn 0.5s ease-out'
  }
}

// add level up animation
const styleTag = document.createElement('style')
styleTag.textContent = `
  @keyframes popIn {
    0% { transform: scale(0.5); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
`
document.head.appendChild(styleTag)