import { useGame, RANKS } from '../game/GameContext'

export default function HUDNormal({ onAction }) {
  const { state } = useGame()

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

  return (
    <div style={styles.container}>
      {/* Top Left: Player Stats */}
      <div style={styles.topLeft}>
        <div style={styles.playerCard}>
          <div style={styles.avatarBox}>🕵️</div>
          <div>
            <div style={styles.playerName}>{state.playerName || 'Agent'}</div>
            <div style={styles.playerRank}>{state.rank} - Lvl {state.level}</div>
          </div>
        </div>
        <div style={styles.xpBox}>
          <div style={{...styles.xpBar, width: `${xpProgress}%`}}></div>
          <div style={styles.xpText}>{state.xp} XP</div>
        </div>
      </div>

      {/* Top Center: City Security Meter */}
      <div style={styles.topCenter}>
        <div style={styles.secTitle}>CITY SECURITY</div>
        <div style={styles.secMeterContainer}>
          <div style={{...styles.secMeterFill, width: securityWidth, background: secColor}}></div>
        </div>
        <div style={{...styles.secValue, color: secColor}}>{state.citySecurity}%</div>
      </div>

      {/* Top Right: Mission Board & MiniMap */}
      <div style={styles.topRight}>
        {/* Simple Mini Map */}
        <div style={styles.minimap}>
          <div style={styles.minimapDot}></div>
          <div style={{...styles.buildingDot, top: '20%', left: '30%'}}></div>
          <div style={{...styles.buildingDot, top: '70%', left: '70%'}}></div>
          <div style={{...styles.buildingDot, top: '40%', left: '80%'}}></div>
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div style={styles.missionCards}>
        <div 
          onClick={() => onAction('analysis')}
          style={{...styles.missionCard, borderColor: '#4fc3f7'}}
        >
          <div style={styles.missionCardIcon}>🔍</div>
          <div>
            <div style={styles.missionCardTitle}>Analysis Hub</div>
            <div style={styles.missionCardDesc}>Review evidence</div>
          </div>
        </div>

        <div 
          onClick={() => onAction('dna')}
          style={{...styles.missionCard, borderColor: '#4caf50'}}
        >
          <div style={styles.missionCardIcon}>🧬</div>
          <div>
            <div style={styles.missionCardTitle}>Scam DNA</div>
            <div style={styles.missionCardDesc}>Threat intel</div>
          </div>
        </div>

        <div 
          onClick={() => onAction('spin')}
          style={{...styles.missionCard, borderColor: '#ff9800'}}
        >
          <div style={styles.missionCardIcon}>🎡</div>
          <div>
            <div style={styles.missionCardTitle}>Awareness</div>
            <div style={styles.missionCardDesc}>Daily spin</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 100, // Below modal, above canvas
  },
  topLeft: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    pointerEvents: 'auto',
  },
  playerCard: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(10, 10, 26, 0.85)',
    border: '1px solid #9c27b0',
    borderRadius: '12px',
    padding: '8px 12px',
    gap: '12px',
    backdropFilter: 'blur(5px)',
    boxShadow: '0 4px 15px rgba(156, 39, 176, 0.3)',
    marginBottom: '8px'
  },
  avatarBox: {
    background: '#1a1a3a',
    borderRadius: '8px',
    padding: '6px',
    fontSize: '20px'
  },
  playerName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  playerRank: {
    color: '#4fc3f7',
    fontSize: '11px',
    fontWeight: 'bold'
  },
  xpBox: {
    background: 'rgba(0,0,0,0.6)',
    height: '14px',
    borderRadius: '7px',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid #4fc3f730'
  },
  xpBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    background: 'linear-gradient(90deg, #4fc3f7, #2196f3)',
    transition: 'width 0.5s ease-out'
  },
  xpText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontSize: '9px',
    color: '#fff',
    lineHeight: '14px',
    fontWeight: 'bold',
    textShadow: '0px 0px 2px #000'
  },
  topCenter: {
    position: 'absolute',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(10, 10, 26, 0.85)',
    padding: '10px 20px',
    borderRadius: '16px',
    border: '1px solid #4fc3f7',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 0 20px rgba(79, 195, 247, 0.2)',
    backdropFilter: 'blur(5px)',
  },
  secTitle: {
    color: '#4fc3f7',
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    marginBottom: '6px'
  },
  secMeterContainer: {
    width: '200px',
    height: '8px',
    background: '#1a1a3a',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  secMeterFill: {
    height: '100%',
    transition: 'all 0.5s ease-out',
    boxShadow: '0 0 10px currentColor'
  },
  secValue: {
    marginTop: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    textShadow: '0 0 5px currentColor'
  },
  topRight: {
    position: 'absolute',
    top: '20px',
    right: '20px',
  },
  minimap: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'rgba(10, 10, 26, 0.9)',
    border: '3px solid #4fc3f7',
    position: 'relative',
    boxShadow: '0 0 20px rgba(79, 195, 247, 0.3), inset 0 0 20px rgba(79, 195, 247, 0.2)',
    overflow: 'hidden',
    backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(79, 195, 247, 0.1) 0%, transparent 70%), repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(79, 195, 247, 0.1) 19px, rgba(79, 195, 247, 0.1) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(79, 195, 247, 0.1) 19px, rgba(79, 195, 247, 0.1) 20px)',
  },
  minimapDot: {
    width: '6px',
    height: '6px',
    background: '#fff',
    borderRadius: '50%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 0 8px #fff'
  },
  buildingDot: {
    width: '8px',
    height: '8px',
    background: '#ff9800',
    borderRadius: '2px',
    position: 'absolute',
    boxShadow: '0 0 5px #ff9800'
  },
  missionCards: {
    position: 'absolute',
    right: '20px',
    top: '160px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    pointerEvents: 'auto'
  },
  missionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(10, 10, 26, 0.85)',
    padding: '10px 14px',
    borderRadius: '12px',
    borderLeft: '4px solid',
    cursor: 'pointer',
    width: '160px',
    backdropFilter: 'blur(5px)',
    transition: 'transform 0.2s, background 0.2s',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  },
  missionCardIcon: {
    fontSize: '20px'
  },
  missionCardTitle: {
    color: '#fff',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  missionCardDesc: {
    color: '#aaa',
    fontSize: '10px',
    marginTop: '2px'
  }
}
