// ScamVerse - HackMol 7.0
// CyberCellOffice.jsx - Police cyber headquarters

import { useState } from 'react'
import ScenarioModal from '../ScenarioModal'

export default function CyberCellOffice({ building, onClose }) {
  const [selectedNPC, setSelectedNPC] = useState(null)
  const [showScenario, setShowScenario] = useState(false)

  const NPCs = ['Officer', 'Detective', 'Tech Specialist']

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
        {/* Security Background */}
        <div style={styles.securityBg} />

        {/* Header */}
        <div style={styles.header}>
          <div>
            <div style={{ color: '#4a148c', fontSize: '12px', fontWeight: 'bold' }}>
              🚔 LAW ENFORCEMENT
            </div>
            <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>
              Cyber Cell HQ
            </div>
            <div style={{ color: '#aaa', fontSize: '11px', marginTop: '4px' }}>
              Digital crime investigation unit
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {/* Command Center */}
        <div style={styles.commandCenter}>
          {/* Monitor wall */}
          <div style={styles.monitorWall}>
            <div style={styles.monitor}>📊</div>
            <div style={styles.monitor}>🔴</div>
            <div style={styles.monitor}>📱</div>
          </div>

          {/* Officers Grid */}
          <div style={styles.officersGrid}>
            {NPCs.map((npc, idx) => {
              const icons = ['👮‍♂️', '👩‍🔬', '👨‍💻']
              const roles = ['Field Officer', 'Investigator', 'Analyst']
              
              return (
                <div
                  key={idx}
                  onClick={() => handleNPCClick(npc)}
                  style={{
                    ...styles.officerCard,
                    borderColor: selectedNPC === npc ? '#4a148c' : '#38006b40',
                    background: selectedNPC === npc ? '#4a148c20' : '#0a0a1a',
                    cursor: 'pointer',
                    transform: selectedNPC === npc ? 'translateX(4px)' : 'translateX(0)'
                  }}
                >
                  <div style={{ fontSize: '44px', marginBottom: '8px' }}>
                    {icons[idx]}
                  </div>
                  <div style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>
                    {npc}
                  </div>
                  <div style={{ color: '#9c27b0', fontSize: '10px', marginTop: '4px' }}>
                    {roles[idx]}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Equipment */}
          <div style={styles.equipment}>
            <div style={styles.equip}>🖥️</div>
            <div style={styles.equip}>📡</div>
            <div style={styles.equip}>🔐</div>
            <div style={styles.equip}>🎯</div>
          </div>
        </div>

        {/* Alert Box */}
        <div style={styles.alertBox}>
          <div style={{ color: '#4a148c', fontSize: '10px', fontWeight: 'bold', marginBottom: '4px' }}>
            🔍 ACTIVE INVESTIGATION
          </div>
          <div style={{ color: '#aaa', fontSize: '10px', lineHeight: '1.4' }}>
            Report suspicious messages to help us track cybercriminals. Your information assists digital crime investigation.
          </div>
        </div>

        {/* Exit Button */}
        <button onClick={onClose} style={styles.exitBtn}>
          ← Exit Cyber Cell
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
    background: 'linear-gradient(135deg, #1a0a2a 0%, #0a1a2a 100%)',
    border: '3px solid #4a148c',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '540px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxHeight: '85vh',
    overflow: 'auto',
    position: 'relative'
  },
  securityBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100px',
    background: 'linear-gradient(180deg, #4a148c15, transparent)',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    pointerEvents: 'none'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: '12px',
    borderBottom: '2px solid #4a148c40',
    position: 'relative',
    zIndex: 10
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#666',
    fontSize: '20px',
    cursor: 'pointer'
  },
  commandCenter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    alignItems: 'center',
    position: 'relative',
    zIndex: 5
  },
  monitorWall: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
    width: '100%'
  },
  monitor: {
    padding: '16px',
    background: '#4a148c20',
    border: '2px solid #4a148c',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '28px',
    opacity: 0.8
  },
  officersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    width: '100%'
  },
  officerCard: {
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
  equipment: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    padding: '16px',
    background: '#4a148c15',
    borderRadius: '10px',
    fontSize: '32px'
  },
  equip: {
    flex: 1,
    textAlign: 'center',
    opacity: 0.7
  },
  alertBox: {
    padding: '12px 16px',
    background: '#4a148c15',
    border: '1px solid #4a148c40',
    borderRadius: '10px'
  },
  exitBtn: {
    padding: '12px',
    background: 'linear-gradient(135deg, #4a148c40, #38006b40)',
    border: '2px solid #4a148c',
    borderRadius: '12px',
    color: '#9c27b0',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
}
