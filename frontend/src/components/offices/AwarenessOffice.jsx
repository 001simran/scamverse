// ScamVerse - HackMol 7.0
// AwarenessOffice.jsx - Awareness center/training hub

import { useState } from 'react'
import ScenarioModal from '../ScenarioModal'

export default function AwarenessOffice({ building, onClose }) {
  const [selectedNPC, setSelectedNPC] = useState(null)
  const [showScenario, setShowScenario] = useState(false)

  const NPCs = ['Guide', 'Trainer']

  function handleNPCClick(npcName) {
    setSelectedNPC(npcName)
    setShowScenario(true)
  }

  function handleScenarioClose() {
    setShowScenario(false)
    setSelectedNPC(null)
  }

  if (showScenario && selectedNPC) {
    return (
      <ScenarioModal
        building={building}
        onClose={handleScenarioClose}
        npcName={selectedNPC}
      />
    )
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <div style={{ color: '#f57f17', fontSize: '12px', fontWeight: 'bold' }}>
              🎡 AWARENESS CENTER
            </div>
            <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>
              Education Hub
            </div>
            <div style={{ color: '#aaa', fontSize: '11px', marginTop: '4px' }}>
              Learn and share scam prevention
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {/* Training Area */}
        <div style={styles.trainingArea}>
          {/* Bulletin Board */}
          <div style={styles.bulletinBoard}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#f57f17', marginBottom: '8px' }}>
              📢 TODAY'S DANGERS
            </div>
            <div style={{ fontSize: '11px', color: '#aaa', lineHeight: '1.6' }}>
              ✓ Phishing Emails<br/>
              ✓ OTP Theft<br/>
              ✓ UPI Payment Fraud
            </div>
          </div>

          {/* Facilitators */}
          <div style={styles.facilitatorsGrid}>
            {NPCs.map((npc, idx) => {
              const icons = ['👩‍🏫', '👨‍🏫']
              const roles = ['Community Guide', 'Security Trainer']
              
              return (
                <div
                  key={idx}
                  onClick={() => handleNPCClick(npc)}
                  style={{
                    ...styles.facilitatorCard,
                    borderColor: selectedNPC === npc ? '#f57f17' : '#e65100 40',
                    background: selectedNPC === npc ? '#f57f1720' : '#0a0a1a',
                    cursor: 'pointer',
                    transform: selectedNPC === npc ? 'translateY(-6px)' : 'translateY(0)'
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>
                    {icons[idx]}
                  </div>
                  <div style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>
                    {npc}
                  </div>
                  <div style={{ color: '#f57f17', fontSize: '10px', marginTop: '4px' }}>
                    {roles[idx]}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Learning Resources */}
          <div style={styles.resources}>
            <div style={styles.resource}>📻 Awareness</div>
            <div style={styles.resource}>📚 Guide</div>
            <div style={styles.resource}>🎥 Videos</div>
            <div style={styles.resource}>📖 Stories</div>
          </div>

          {/* Statistics */}
          <div style={styles.stats}>
            <div style={{ color: '#f57f17', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
              📊 IMPACT
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: '#f57f1715', padding: '8px', borderRadius: '8px', textAlign: 'center', fontSize: '11px', color: '#aaa' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#f57f17' }}>2.5M</div>
                <div>People Reached</div>
              </div>
              <div style={{ background: '#f57f1715', padding: '8px', borderRadius: '8px', textAlign: 'center', fontSize: '11px', color: '#aaa' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#f57f17' }}>₹500Cr</div>
                <div>Saved</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div style={styles.missionBox}>
          <div style={{ color: '#f57f17', fontSize: '10px', fontWeight: 'bold', marginBottom: '4px' }}>
            🎯 OUR MISSION
          </div>
          <div style={{ color: '#aaa', fontSize: '10px', lineHeight: '1.4' }}>
            Empower communities to recognize and prevent digital scams. Every educated person helps protect others.
          </div>
        </div>

        {/* Exit Button */}
        <button onClick={onClose} style={styles.exitBtn}>
          ← Exit Center
        </button>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.88)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(8px)'
  },
  container: {
    background: 'linear-gradient(135deg, #2a1a0a 0%, #1a2a1a 100%)',
    border: '3px solid #f57f17',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '540px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxHeight: '85vh',
    overflow: 'auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: '12px',
    borderBottom: '2px solid #f57f1740'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#666',
    fontSize: '20px',
    cursor: 'pointer'
  },
  trainingArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'center'
  },
  bulletinBoard: {
    width: '100%',
    padding: '16px',
    background: '#f57f1715',
    border: '2px solid #f57f17',
    borderRadius: '12px'
  },
  facilitatorsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    width: '100%'
  },
  facilitatorCard: {
    padding: '16px',
    borderRadius: '12px',
    border: '2px solid',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s',
    minHeight: '130px'
  },
  resources: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    width: '100%'
  },
  resource: {
    padding: '12px 8px',
    background: '#f57f1715',
    border: '1px solid #f57f1740',
    borderRadius: '8px',
    fontSize: '11px',
    textAlign: 'center',
    color: '#f57f17'
  },
  stats: {
    width: '100%',
    padding: '16px',
    background: '#f57f1705',
    border: '1px solid #f57f1740',
    borderRadius: '12px'
  },
  missionBox: {
    padding: '12px 16px',
    background: '#f57f1715',
    border: '1px solid #f57f1740',
    borderRadius: '10px'
  },
  exitBtn: {
    padding: '12px',
    background: 'linear-gradient(135deg, #f57f1740, #e6510040)',
    border: '2px solid #f57f17',
    borderRadius: '12px',
    color: '#f57f17',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
}
