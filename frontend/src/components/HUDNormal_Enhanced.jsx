// HUDNormal_Enhanced.jsx - Enhanced HUD with visual improvements
// Add this as an enhanced version with more animations and visual feedback

import { useGame, RANKS } from '../game/GameContext'
import { useState, useEffect } from 'react'

export default function HUDNormalEnhanced({ onAction }) {
  const { state } = useGame()
  const [floatingXP, setFloatingXP] = useState([])
  const [hoveredCard, setHoveredCard] = useState(null)

  // Add floating XP particles effect
  useEffect(() => {
    if (state.xp > 0) {
      const id = Date.now()
      setFloatingXP(prev => [...prev, { id, xp: state.xp }])
      setTimeout(() => {
        setFloatingXP(prev => prev.filter(p => p.id !== id))
      }, 2000)
    }
  }, [state.xp])

  // Calculate percentage of city security
  const securityWidth = `${Math.max(0, Math.min(100, state.citySecurity))}%`
  const getSecurityColor = (val) => {
    if (val >= 80) return '#4caf50' // green
    if (val >= 40) return '#ff9800' // orange
    return '#f44336' // red
  }
  const secColor = getSecurityColor(state.citySecurity)

  // Calculate XP progress to next level
  const currentRankIndex = RANKS.findIndex(r => r.level === state.level)
  const currentRank = RANKS[currentRankIndex]
  const nextRank = RANKS[currentRankIndex + 1]
  
  let xpProgress = 100
  if (nextRank) {
    const range = nextRank.xp - currentRank.xp
    const progress = state.xp - currentRank.xp
    xpProgress = Math.min(100, Math.max(0, (progress / range) * 100))
  }

  // Security alert level
  const getSecurityStatus = (val) => {
    if (val >= 80) return { status: '✅ SECURE', color: '#4caf50' }
    if (val >= 60) return { status: '⚠️ CAUTION', color: '#ff9800' }
    if (val >= 40) return { status: '🚨 ALERT', color: '#ff6f00' }
    if (val >= 20) return { status: '🔴 CRITICAL', color: '#d32f2f' }
    return { status: '⛔ CATASTROPHE', color: '#990000' }
  }
  const securityStatus = getSecurityStatus(state.citySecurity)

  return (
    <div style={styles.container}>
      {/* Top Left: Player Stats */}
      <div style={styles.topLeft}>
        <div style={styles.playerCard}>
          <div style={styles.avatarBox}>
            <div style={styles.avatarGlow}>🕵️</div>
          </div>
          <div>
            <div style={styles.playerName}>{state.playerName || 'Agent'}</div>
            <div style={styles.playerRank}>{state.rank} - Lvl {state.level}</div>
            <div style={styles.playerStats}>
              💾 Caught: {state.caught} | Fell: {state.fellFor}
            </div>
          </div>
        </div>

        {/* XP Progress Bar with Enhanced Animation */}
        <div style={styles.xpBox}>
          <div style={styles.xpLabel}>
            <span>XP PROGRESS</span>
            <span style={{ color: '#00d9ff', fontWeight: 'bold' }}>{xpProgress.toFixed(0)}%</span>
          </div>
          <div style={{...styles.xpBar, position: 'relative', overflow: 'hidden'}}>
            <div 
              style={{
                ...styles.xpBarFill,
                width: `${xpProgress}%`,
                boxShadow: '0 0 15px rgba(0, 217, 255, 0.8)',
                transition: 'width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            ></div>
            <div style={styles.xpBarShimmer}></div>
          </div>
          <div style={styles.xpText}>
            {state.xp} / {nextRank ? nextRank.xp : '∞'} XP
          </div>
        </div>
      </div>

      {/* Top Center: City Security Meter with Enhanced Visuals */}
      <div style={styles.topCenter}>
        <div style={styles.secTitle}>
          <span style={{color: securityStatus.color}}>⚔️ CITY SECURITY</span>
        </div>
        
        {/* Enhanced Security Meter */}
        <div style={styles.secMeterContainer}>
          <div style={{...styles.secMeterBg, borderColor: securityStatus.color}}>
            <div 
              style={{
                ...styles.secMeterFill,
                width: securityWidth,
                background: `linear-gradient(90deg, ${securityStatus.color}, ${securityStatus.color}dd)`,
                boxShadow: `0 0 20px ${securityStatus.color}`,
                transition: 'width 0.3s ease-out, box-shadow 0.3s ease-out'
              }}
            ></div>
          </div>
        </div>

        {/* Status Indicator */}
        <div style={{...styles.secValue, color: securityStatus.color}}>
          {securityStatus.status} — {state.citySecurity}%
        </div>

        {/* Mini Stats */}
        <div style={styles.miniStats}>
          <div>🛡️ Safe: {100 - state.fellFor}</div>
          <div>💰 Saved: {state.caught}</div>
        </div>
      </div>

      {/* Top Right: Achievements & Combo */}
      <div style={styles.topRight}>
        {/* Combo Counter */}
        {state.combo > 0 && (
          <div style={{...styles.comboBox, animation: 'comboPulse 0.5s ease-out'}}>
            <div style={styles.comboLabel}>COMBO</div>
            <div style={styles.comboNumber}>{state.combo}x</div>
            <div style={styles.comboMult}>
              {state.combo >= 5 ? '3x' : state.combo >= 3 ? '2x' : '1x'} BONUS
            </div>
          </div>
        )}

        {/* Powered Up Indicators */}
        <div style={styles.powerups}>
          {state.shields > 0 && (
            <div style={{...styles.powerupItem, borderColor: '#4caf50'}}>
              🛡️ ×{state.shields}
            </div>
          )}
          {state.scanners > 0 && (
            <div style={{...styles.powerupItem, borderColor: '#ff9800'}}>
              🔍 ×{state.scanners}
            </div>
          )}
          {state.hints > 0 && (
            <div style={{...styles.powerupItem, borderColor: '#9c27b0'}}>
              💡 ×{state.hints}
            </div>
          )}
        </div>
      </div>

      {/* Mission Card Navigation with Enhanced Hover */}
      <div style={styles.missionCards}>
        <div 
          onMouseEnter={() => setHoveredCard('analysis')}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => onAction('analysis')}
          style={{
            ...styles.missionCard,
            borderColor: hoveredCard === 'analysis' ? '#4fc3f7' : '#4fc3f740',
            background: hoveredCard === 'analysis' ? 'rgba(79, 195, 247, 0.1)' : 'rgba(79, 195, 247, 0.05)',
            transform: hoveredCard === 'analysis' ? 'translateY(-4px)' : 'translateY(0)',
            boxShadow: hoveredCard === 'analysis' ? '0 8px 25px rgba(79, 195, 247, 0.3)' : 'none',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          <div style={{...styles.missionCardIcon, fontSize: hoveredCard === 'analysis' ? '32px' : '28px'}}>🔍</div>
          <div style={{flex: 1}}>
            <div style={styles.missionCardTitle}>Analysis Hub</div>
            <div style={styles.missionCardDesc}>Review evidence & patterns</div>
          </div>
          <div style={styles.missionCardArrow}>→</div>
        </div>

        <div 
          onMouseEnter={() => setHoveredCard('dna')}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => onAction('dna')}
          style={{
            ...styles.missionCard,
            borderColor: hoveredCard === 'dna' ? '#4caf50' : '#4caf5040',
            background: hoveredCard === 'dna' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.05)',
            transform: hoveredCard === 'dna' ? 'translateY(-4px)' : 'translateY(0)',
            boxShadow: hoveredCard === 'dna' ? '0 8px 25px rgba(76, 175, 80, 0.3)' : 'none',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          <div style={{...styles.missionCardIcon, fontSize: hoveredCard === 'dna' ? '32px' : '28px'}}>🧬</div>
          <div style={{flex: 1}}>
            <div style={styles.missionCardTitle}>Scam DNA</div>
            <div style={styles.missionCardDesc}>Threat intelligence & patterns</div>
          </div>
          <div style={styles.missionCardArrow}>→</div>
        </div>

        <div 
          onMouseEnter={() => setHoveredCard('spin')}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => onAction('spin')}
          style={{
            ...styles.missionCard,
            borderColor: hoveredCard === 'spin' ? '#ff9800' : '#ff980040',
            background: hoveredCard === 'spin' ? 'rgba(255, 152, 0, 0.1)' : 'rgba(255, 152, 0, 0.05)',
            transform: hoveredCard === 'spin' ? 'translateY(-4px)' : 'translateY(0)',
            boxShadow: hoveredCard === 'spin' ? '0 8px 25px rgba(255, 152, 0, 0.3)' : 'none',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          <div style={{...styles.missionCardIcon, fontSize: hoveredCard === 'spin' ? '32px' : '28px'}}>🎡</div>
          <div style={{flex: 1}}>
            <div style={styles.missionCardTitle}>Awareness Spin</div>
            <div style={styles.missionCardDesc}>Daily knowledge boost</div>
          </div>
          <div style={styles.missionCardArrow}>→</div>
        </div>
      </div>

      {/* Floating XP Particles */}
      {floatingXP.map(particle => (
        <div key={particle.id} style={{
          ...styles.floatingXP,
          animation: `floatUp 2s ease-out forwards`
        }}>
          +{particle.xp} XP
        </div>
      ))}

      {/* Global Animations */}
      <style>{`
        @keyframes comboPulse {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translateY(0) translateX(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px) translateX(40px);
          }
        }
      `}</style>
    </div>
  )
}

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    fontFamily: "'Courier New', monospace",
    zIndex: 100
  },

  topLeft: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    pointerEvents: 'auto'
  },

  playerCard: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    background: 'linear-gradient(135deg, rgba(10, 10, 27, 0.9), rgba(20, 20, 50, 0.9))',
    border: '2px solid rgba(0, 217, 255, 0.5)',
    borderRadius: '12px',
    padding: '12px 16px',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
    transition: 'all 0.3s ease'
  },

  avatarBox: {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.2), rgba(157, 0, 255, 0.2))',
    border: '2px solid #00d9ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px'
  },

  avatarGlow: {
    textShadow: '0 0 15px rgba(0, 217, 255, 0.8)',
    animation: 'playerGlow 2s ease-in-out infinite'
  },

  playerName: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold',
    letterSpacing: '1px'
  },

  playerRank: {
    color: '#00d9ff',
    fontSize: '12px',
    fontWeight: 'bold',
    marginTop: '2px'
  },

  playerStats: {
    color: '#888',
    fontSize: '10px',
    marginTop: '4px'
  },

  xpBox: {
    background: 'linear-gradient(135deg, rgba(10, 10, 27, 0.9), rgba(20, 20, 50, 0.9))',
    border: '2px solid rgba(255, 179, 0, 0.5)',
    borderRadius: '10px',
    padding: '12px',
    backdropFilter: 'blur(10px)',
    width: '280px'
  },

  xpLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '10px',
    color: '#aaa',
    fontWeight: 'bold',
    marginBottom: '6px',
    letterSpacing: '1px'
  },

  xpBar: {
    height: '12px',
    background: 'rgba(255, 179, 0, 0.1)',
    border: '1px solid rgba(255, 179, 0, 0.4)',
    borderRadius: '6px',
    overflow: 'hidden',
    marginBottom: '6px'
  },

  xpBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #ff9800, #ffb300)',
    borderRadius: '6px'
  },

  xpBarShimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
    animation: 'shimmer 2s infinite'
  },

  xpText: {
    fontSize: '10px',
    color: '#ffb300',
    fontWeight: 'bold',
    textAlign: 'center'
  },

  topCenter: {
    position: 'absolute',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'center',
    maxWidth: '300px',
    pointerEvents: 'auto'
  },

  secTitle: {
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    textTransform: 'uppercase'
  },

  secMeterContainer: {
    width: '280px'
  },

  secMeterBg: {
    height: '16px',
    background: 'rgba(10, 10, 27, 0.8)',
    border: '2px solid',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative'
  },

  secMeterFill: {
    height: '100%',
    transition: 'width 0.3s ease-out, box-shadow 0.3s ease-out'
  },

  secValue: {
    fontSize: '12px',
    fontWeight: 'bold',
    marginTop: '4px',
    textShadow: '0 0 10px rgba(255, 100, 100, 0.3)'
  },

  miniStats: {
    display: 'flex',
    gap: '16px',
    fontSize: '11px',
    color: '#999',
    marginTop: '4px'
  },

  topRight: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'flex-end',
    pointerEvents: 'auto'
  },

  comboBox: {
    background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(0, 217, 255, 0.2))',
    border: '2px solid #4caf50',
    borderRadius: '10px',
    padding: '12px 16px',
    textAlign: 'center',
    boxShadow: '0 0 20px rgba(76, 175, 80, 0.4)',
    backdropFilter: 'blur(10px)'
  },

  comboLabel: {
    fontSize: '10px',
    color: '#4caf50',
    fontWeight: 'bold',
    letterSpacing: '2px'
  },

  comboNumber: {
    fontSize: '24px',
    color: '#4caf50',
    fontWeight: 'bold',
    lineHeight: '1'
  },

  comboMult: {
    fontSize: '10px',
    color: '#4caf5080',
    fontWeight: 'bold'
  },

  powerups: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },

  powerupItem: {
    background: 'rgba(10, 10, 27, 0.9)',
    border: '2px solid',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '11px',
    fontWeight: 'bold',
    backdropFilter: 'blur(10px)',
    textAlign: 'center',
    minWidth: '80px'
  },

  missionCards: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '12px',
    pointerEvents: 'auto'
  },

  missionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'linear-gradient(135deg, rgba(10, 10, 27, 0.95), rgba(20, 20, 50, 0.95))',
    border: '2px solid',
    borderRadius: '12px',
    padding: '12px 16px',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    maxWidth: '280px'
  },

  missionCardIcon: {
    fontSize: '28px',
    transition: 'font-size 0.3s ease'
  },

  missionCardTitle: {
    color: '#fff',
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '0.5px'
  },

  missionCardDesc: {
    color: '#aaa',
    fontSize: '10px',
    marginTop: '2px'
  },

  missionCardArrow: {
    color: '#4fc3f7',
    fontSize: '14px',
    fontWeight: 'bold',
    opacity: 0
  },

  floatingXP: {
    position: 'fixed',
    pointerEvents: 'none',
    color: '#ffeb3b',
    fontWeight: 'bold',
    fontSize: '14px',
    textShadow: '0 0 10px rgba(255, 235, 59, 0.8)',
    left: 'calc(50% - 50px)',
    top: 'calc(50% - 100px)',
    zIndex: 200
  }
}
