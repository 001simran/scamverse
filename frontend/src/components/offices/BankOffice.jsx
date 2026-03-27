// ScamVerse - HackMol 7.0
// BankOffice.jsx - Professional bank interface

import { useState } from 'react'
import ScenarioModal from '../ScenarioModal'

export default function BankOffice({ building, onClose }) {
  const [selectedNPC, setSelectedNPC] = useState(null)
  const [showScenario, setShowScenario] = useState(false)

  const NPCs = ['Bank Manager', 'Clerk', 'Security Guard']

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
            <div style={{ color: '#2e7d32', fontSize: '12px', fontWeight: 'bold' }}>
              🏦 SECURE BANKING
            </div>
            <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>
              City Bank Headquarters
            </div>
            <div style={{ color: '#aaa', fontSize: '11px', marginTop: '4px' }}>
              Banking professionals on duty
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {/* Bank Interior */}
        <div style={styles.bankInterior}>
          {/* Counter */}
          <div style={styles.counter}>
            <div style={{ fontSize: '24px', color: '#2e7d32' }}>💳 💰 🏧</div>
          </div>

          {/* Staff Grid */}
          <div style={styles.staffGrid}>
            {NPCs.map((npc, idx) => {
              const icons = ['👨‍💼', '👩‍💻', '🧑‍✈️']
              const workstations = ['desk', 'computer', 'checkpoint']
              
              return (
                <div
                  key={idx}
                  onClick={() => handleNPCClick(npc)}
                  style={{
                    ...styles.staffCard,
                    borderColor: selectedNPC === npc ? '#2e7d32' : '#1b5e2040',
                    background: selectedNPC === npc ? '#2e7d3220' : '#0a0a1a',
                    cursor: 'pointer',
                    transform: selectedNPC === npc ? 'translateY(-4px)' : 'translateY(0)'
                  }}
                >
                  <div style={{ fontSize: '44px', marginBottom: '8px' }}>
                    {icons[idx]}
                  </div>
                  <div style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>
                    {npc}
                  </div>
                  <div style={{ color: '#2e7d32', fontSize: '10px', marginTop: '4px' }}>
                    {workstations[idx]}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Safe/Security Elements */}
          <div style={styles.securityElements}>
            <div style={styles.secElement}>🔐</div>
            <div style={styles.secElement}>📊</div>
            <div style={styles.secElement}>🔒</div>
            <div style={styles.secElement}>📈</div>
          </div>
        </div>

        {/* Compliance Notice */}
        <div style={styles.complianceBox}>
          <div style={{ color: '#2e7d32', fontSize: '10px', fontWeight: 'bold', marginBottom: '4px' }}>
            ⚠️ SECURITY ALERT
          </div>
          <div style={{ color: '#aaa', fontSize: '10px', lineHeight: '1.4' }}>
            Our staff are trained to recognize fraudulent communications. Help them identify phishing and scam attempts targeting bank customers.
          </div>
        </div>

        {/* Exit Button */}
        <button onClick={onClose} style={styles.exitBtn}>
          ← Leave Bank
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
    background: 'linear-gradient(135deg, #1a2a1a 0%, #0a1a2a 100%)',
    border: '3px solid #2e7d32',
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
    borderBottom: '2px solid #2e7d3240'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#666',
    fontSize: '20px',
    cursor: 'pointer'
  },
  bankInterior: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'center'
  },
  counter: {
    width: '100%',
    padding: '20px',
    background: '#2e7d3220',
    border: '2px solid #2e7d32',
    borderRadius: '12px',
    textAlign: 'center',
    fontSize: '32px'
  },
  staffGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    width: '100%'
  },
  staffCard: {
    padding: '16px',
    borderRadius: '12px',
    border: '2px solid',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s',
    minHeight: '120px'
  },
  securityElements: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    padding: '16px',
    background: '#2e7d3215',
    borderRadius: '12px',
    fontSize: '28px',
    opacity: 0.7
  },
  secElement: {
    flex: 1,
    textAlign: 'center'
  },
  complianceBox: {
    padding: '12px 16px',
    background: '#2e7d3215',
    border: '1px solid #2e7d3240',
    borderRadius: '10px'
  },
  exitBtn: {
    padding: '12px',
    background: 'linear-gradient(135deg, #2e7d3240, #1b5e2040)',
    border: '2px solid #2e7d32',
    borderRadius: '12px',
    color: '#2e7d32',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
}
