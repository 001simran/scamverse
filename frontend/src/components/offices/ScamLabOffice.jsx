// ScamVerse - HackMol 7.0
// ScamLabOffice.jsx - Research and analysis lab

import { useState } from 'react'
import ScenarioModal from '../ScenarioModal'

export default function ScamLabOffice({ building, onClose }) {
  const [selectedNPC, setSelectedNPC] = useState(null)
  const [showScenario, setShowScenario] = useState(false)

  const NPCs = ['Researcher', 'Analyst', 'Data Expert']

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
            <div style={{ color: '#880e4f', fontSize: '12px', fontWeight: 'bold' }}>
              🔬 RESEARCH LAB
            </div>
            <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>
              Scam Lab
            </div>
            <div style={{ color: '#aaa', fontSize: '11px', marginTop: '4px' }}>
              Advanced fraud analysis center
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {/* Lab Scene */}
        <div style={styles.labScene}>
          {/* Lab Equipment */}
          <div style={styles.equipment}>
            <div style={styles.equipItem}>🧪</div>
            <div style={styles.equipItem}>🔭</div>
            <div style={styles.equipItem}>📊</div>
            <div style={styles.equipItem}>💾</div>
          </div>

          {/* Researchers */}
          <div style={styles.researchersGrid}>
            {NPCs.map((npc, idx) => {
              const icons = ['👨‍🔬', '👩‍💼', '🧑‍💻']
              const roles = ['Pattern Detection', 'Data Science', 'AI Training']
              
              return (
                <div
                  key={idx}
                  onClick={() => handleNPCClick(npc)}
                  style={{
                    ...styles.researcherCard,
                    borderColor: selectedNPC === npc ? '#880e4f' : '#560027 40',
                    background: selectedNPC === npc ? '#880e4f20' : '#0a0a1a',
                    cursor: 'pointer',
                    transform: selectedNPC === npc ? 'scale(1.08)' : 'scale(1)'
                  }}
                >
                  <div style={{ fontSize: '44px', marginBottom: '8px' }}>
                    {icons[idx]}
                  </div>
                  <div style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>
                    {npc}
                  </div>
                  <div style={{ color: '#c2185b', fontSize: '10px', marginTop: '4px' }}>
                    {roles[idx]}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Analysis Stations */}
          <div style={styles.stations}>
            <div style={styles.station}>🖥️ Station 1</div>
            <div style={styles.station}>🖥️ Station 2</div>
            <div style={styles.station}>🖥️ Station 3</div>
          </div>

          {/* Data Display */}
          <div style={styles.dataDisplay}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#c2185b', marginBottom: '8px' }}>
              📈 FRAUD PATTERNS
            </div>
            <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: '#aaa' }}>
              <span>Phishing: 42%</span>
              <span>OTP Scam: 38%</span>
              <span>Other: 20%</span>
            </div>
          </div>
        </div>

        {/* Research Notice */}
        <div style={styles.noticeBox}>
          <div style={{ color: '#880e4f', fontSize: '10px', fontWeight: 'bold', marginBottom: '4px' }}>
            🎓 RESEARCH MISSION
          </div>
          <div style={{ color: '#aaa', fontSize: '10px', lineHeight: '1.4' }}>
            Help us analyze scam patterns and train AI models. Your interaction data improves fraud detection for everyone.
          </div>
        </div>

        {/* Exit Button */}
        <button onClick={onClose} style={styles.exitBtn}>
          ← Exit Lab
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
    background: 'linear-gradient(135deg, #2a0a2a 0%, #1a0a2a 100%)',
    border: '3px solid #880e4f',
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
    borderBottom: '2px solid #880e4f40'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#666',
    fontSize: '20px',
    cursor: 'pointer'
  },
  labScene: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    alignItems: 'center'
  },
  equipment: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
    width: '100%',
    padding: '16px',
    background: '#880e4f15',
    border: '2px dashed #560027',
    borderRadius: '12px'
  },
  equipItem: {
    fontSize: '28px',
    textAlign: 'center',
    opacity: 0.8
  },
  researchersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    width: '100%'
  },
  researcherCard: {
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
  stations: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
    width: '100%'
  },
  station: {
    padding: '12px',
    background: '#880e4f20',
    border: '1px solid #880e4f40',
    borderRadius: '8px',
    fontSize: '12px',
    textAlign: 'center',
    color: '#c2185b'
  },
  dataDisplay: {
    padding: '12px 16px',
    background: '#880e4f10',
    border: '1px solid #880e4f40',
    borderRadius: '10px',
    textAlign: 'center'
  },
  noticeBox: {
    padding: '12px 16px',
    background: '#880e4f15',
    border: '1px solid #880e4f40',
    borderRadius: '10px'
  },
  exitBtn: {
    padding: '12px',
    background: 'linear-gradient(135deg, #880e4f40, #560027 40)',
    border: '2px solid #880e4f',
    borderRadius: '12px',
    color: '#c2185b',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
}
