/*
 * ScamVerse - HackMol 7.0
 * MissionBoard.jsx - all 6 missions
 * Jasmeen built this
 */

import { useGame } from '../game/GameContext'

const MISSIONS = [
  {
    id: 1,
    title: 'The Blocked Account',
    emoji: '📱',
    location: '🏠 Apartment',
    buildingId: 'home',
    type: 'OTP_SCAM',
    difficulty: 2,
    xpReward: 100,
    briefing: 'Mrs. Mehta next door got a call from SBI. Her account is apparently blocked. Help her figure out if this call is real.',
    realStat: '4,521 OTP scam cases reported last month',
    source: 'RBI 2024'
  },
  {
    id: 2,
    title: 'The Lucky Draw',
    emoji: '🎰',
    location: '🛒 Bazaar',
    buildingId: 'bazaar',
    type: 'LOTTERY',
    difficulty: 1,
    xpReward: 80,
    briefing: 'Someone in the bazaar got an SMS saying they won KBC ₹25 lakh. Everyone is excited. But something feels wrong.',
    realStat: '12,450 lottery scam cases in 2024',
    source: 'Cybercrime.gov.in 2024'
  },
  {
    id: 3,
    title: 'The Ghost of CBI',
    emoji: '🚔',
    location: '🚔 Cyber Cell',
    buildingId: 'cybercell',
    type: 'DIGITAL_ARREST',
    difficulty: 5,
    xpReward: 300,
    briefing: 'Inspector Vikram Singh has been calling citizens all over Delhi. 3 retired employees lost ₹45 lakh last week. Face the call. Do not fall for it.',
    realStat: '92,334 digital arrest cases in 2024 — total loss ₹2,140 crore',
    source: 'MHA Cyber Crime Report 2024'
  },
  {
    id: 4,
    title: 'The Refund Trap',
    emoji: '💸',
    location: '🏧 Bazaar',
    buildingId: 'bazaar',
    type: 'UPI_TRAP',
    difficulty: 3,
    xpReward: 200,
    briefing: 'Someone got ₹1 credited from an unknown UPI ID. Now they are being asked for OTP to receive a full refund of ₹18,500. Something is very wrong.',
    realStat: '8,923 UPI trap cases last quarter',
    source: 'NPCI Fraud Database 2024'
  },
  {
    id: 5,
    title: 'The AI Face',
    emoji: '🎭',
    location: '🔬 Scam Lab',
    buildingId: 'scamlab',
    type: 'DEEPFAKE',
    difficulty: 4,
    xpReward: 250,
    briefing: 'Dr. Kavya at the Deepfake Lab received a video call from her daughter asking for ₹87,000. But something looks off about the video.',
    realStat: 'AI voice cloning up 156% in 2024',
    source: 'Delhi Cyber Cell 2024'
  },
  {
    id: 6,
    title: 'The Market Guru',
    emoji: '📈',
    location: '🏦 City Bank',
    buildingId: 'bank',
    type: 'INVESTMENT_FRAUD',
    difficulty: 4,
    xpReward: 250,
    briefing: 'A man at the bank promises 4X returns in 3 months. He has a SEBI certificate. He has profit screenshots. He has 47 WhatsApp testimonials. Is he real?',
    realStat: '2,341 fake SEBI groups shut down this year',
    source: 'SEBI Investor Bulletin 2024'
  }
]

const DIFF_STARS = ['', '⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐']
const DIFF_LABEL = ['', 'Easy', 'Easy', 'Medium', 'Hard', 'Expert']
const DIFF_COLOR = ['', '#4caf50', '#4caf50', '#ff9800', '#f44336', '#9c27b0']

export default function MissionBoard({ onClose, onStartMission }) {
  const { state } = useGame()

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>

        {/* header */}
        <div style={styles.header}>
          <div>
            <div style={{ color: '#4fc3f7', fontSize: '16px', fontWeight: 'bold' }}>
              📋 MISSION BOARD
            </div>
            <div style={{ color: '#666', fontSize: '11px' }}>
              Choose your next mission
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {/* missions list */}
        <div style={{ padding: '10px' }}>
          {MISSIONS.map(mission => (
            <div key={mission.id} style={styles.missionCard}>

              {/* top row */}
              <div style={styles.topRow}>
                <div style={styles.missionEmoji}>{mission.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={styles.missionTitle}>{mission.title}</div>
                  <div style={{ color: '#888', fontSize: '11px' }}>
                    {mission.location}
                  </div>
                </div>
                <div style={{
                  color: DIFF_COLOR[mission.difficulty],
                  fontSize: '10px',
                  textAlign: 'right'
                }}>
                  <div>{DIFF_STARS[mission.difficulty]}</div>
                  <div>{DIFF_LABEL[mission.difficulty]}</div>
                </div>
              </div>

              {/* briefing */}
              <div style={styles.briefing}>
                {mission.briefing}
              </div>

              {/* real stat */}
              <div style={styles.statRow}>
                <span style={{ color: '#f44336' }}>
                  ⚠️ {mission.realStat}
                </span>
              </div>
              <div style={{ color: '#444', fontSize: '10px', marginBottom: '8px' }}>
                Source: {mission.source}
              </div>

              {/* bottom row */}
              <div style={styles.bottomRow}>
                <div style={styles.xpBadge}>
                  +{mission.xpReward} XP
                </div>
                <button
                  onClick={() => {
                    if (onStartMission) onStartMission(mission)
                    onClose()
                  }}
                  style={styles.startBtn}
                >
                  START MISSION →
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* emergency footer */}
        <div style={styles.footer}>
          🆘 Cyber fraud? Call <strong style={{ color: '#ffd700' }}>1930</strong>
        </div>

      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.88)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: '12px',
    backdropFilter: 'blur(6px)'
  },
  modal: {
    background: '#0d0d2a',
    border: '1px solid #2a2a4a',
    borderRadius: '20px',
    width: '100%', maxWidth: '420px',
    maxHeight: '92vh', overflowY: 'auto',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    borderBottom: '1px solid #2a2a4a',
    position: 'sticky', top: 0,
    background: '#0d0d2a', zIndex: 10
  },
  closeBtn: {
    background: 'none', border: 'none',
    color: '#666', fontSize: '18px', cursor: 'pointer'
  },
  missionCard: {
    background: '#12122a',
    border: '1px solid #2a2a4a',
    borderRadius: '14px',
    padding: '12px',
    marginBottom: '10px'
  },
  topRow: {
    display: 'flex', alignItems: 'flex-start',
    gap: '10px', marginBottom: '8px'
  },
  missionEmoji: {
    fontSize: '28px', lineHeight: 1
  },
  missionTitle: {
    color: '#fff', fontWeight: 'bold', fontSize: '14px'
  },
  briefing: {
    color: '#aaa', fontSize: '12px',
    lineHeight: '1.6', marginBottom: '8px'
  },
  statRow: {
    background: '#1a0a0a',
    border: '1px solid #f4433620',
    borderRadius: '6px',
    padding: '5px 10px',
    fontSize: '11px',
    marginBottom: '4px'
  },
  bottomRow: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between'
  },
  xpBadge: {
    background: '#ffd70020',
    border: '1px solid #ffd70040',
    color: '#ffd700',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  startBtn: {
    padding: '8px 16px',
    background: '#4fc3f720',
    border: '1px solid #4fc3f740',
    borderRadius: '8px',
    color: '#4fc3f7',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  footer: {
    padding: '12px 16px',
    borderTop: '1px solid #2a2a4a',
    color: '#666', fontSize: '12px',
    textAlign: 'center'
  }
}