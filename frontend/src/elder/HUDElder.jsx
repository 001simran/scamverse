// ScamVerse - HackMol 7.0
// HUDElder.jsx - simplified large HUD for seniors
// Jaspreet's part
// big text, simple info, no confusing numbers

import ElderVoice from './ElderVoice'
import { ElderStopVoice } from './ElderControls'

export default function HUDElder({ playerName, score, level, rank }) {

  return (
    <div style={styles.hud}>

      {/* left - player info */}
      <div style={styles.playerSection}>
        <div style={styles.avatar}>🛡️</div>
        <div>
          <div style={styles.playerName}>{playerName}</div>
          <div style={styles.rankText}>{rank}</div>
        </div>
      </div>

      {/* center - level big */}
      <div style={styles.centerSection}>
        <div style={styles.levelCircle}>
          <div style={styles.levelNumber}>{level}</div>
          <div style={styles.levelLabel}>Level</div>
        </div>
      </div>

      {/* right - score */}
      <div style={styles.rightSection}>
        <div style={styles.scoreNumber}>
          {score.toLocaleString()}
        </div>
        <div style={styles.scoreLabel}>अंक (Score)</div>

        {/* stop voice button */}
        <ElderStopVoice />
      </div>

    </div>
  )
}

const styles = {
  hud: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '70px',
    background: '#0d0d2a',
    borderBottom: '2px solid #ff9800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    zIndex: 100
  },

  playerSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },

  avatar: {
    fontSize: '28px'
  },

  playerName: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold'
  },

  rankText: {
    color: '#ff9800',
    fontSize: '12px',
    marginTop: '2px'
  },

  centerSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },

  levelCircle: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    background: '#ff980020',
    border: '2px solid #ff9800',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },

  levelNumber: {
    color: '#ff9800',
    fontSize: '20px',
    fontWeight: 'bold',
    lineHeight: 1
  },

  levelLabel: {
    color: '#ff980080',
    fontSize: '9px',
    marginTop: '1px'
  },

  rightSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px'
  },

  scoreNumber: {
    color: '#ffd700',
    fontSize: '20px',
    fontWeight: 'bold'
  },

  scoreLabel: {
    color: '#666',
    fontSize: '11px'
  }
}