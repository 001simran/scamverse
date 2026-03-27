// ScamVerse - HackMol 7.0
// HomeOffice.jsx - Family home living room interface

import { useState } from 'react'
import ScenarioModal from '../ScenarioModal'

export default function HomeOffice({ building, onClose }) {
  const [selectedNPC, setSelectedNPC] = useState(null)
  const [showScenario, setShowScenario] = useState(false)

  const NPCs = ['Mom', 'Sister']

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
        {/* Wall decoration */}
        <div style={styles.wall} />
        
        {/* Header */}
        <div style={styles.header}>
          <div>
            <div style={{ color: '#1565c0', fontSize: '12px', fontWeight: 'bold' }}>
              🏠 HOME SAFETY
            </div>
            <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>
              Your Apartment
            </div>
            <div style={{ color: '#aaa', fontSize: '11px', marginTop: '4px' }}>
              Help your family stay safe
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {/* Living Room Scene */}
        <div style={styles.roomContent}>
          {/* Sofa */}
          <div style={styles.sofa}>
            <div style={{ fontSize: '28px' }}>🛋️</div>
          </div>

          {/* Family members */}
          <div style={styles.familyGrid}>
            {NPCs.map((npc, idx) => (
              <div
                key={idx}
                onClick={() => handleNPCClick(npc)}
                style={{
                  ...styles.familyMember,
                  borderColor: selectedNPC === npc ? '#ff69b4' : '#daa520',
                  background: selectedNPC === npc ? '#ff69b420' : '#ffa50020'
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>
                  {npc === 'Mom' ? '👩' : '👧'}
                </div>
                <div style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>
                  {npc}
                </div>
                <div style={{ color: '#daa520', fontSize: '10px', marginTop: '4px' }}>
                  Tap to help
                </div>
              </div>
            ))}
          </div>

          {/* Room decorations */}
          <div style={styles.decorations}>
            <div style={styles.decItem}>📺</div>
            <div style={styles.decItem}>🪟</div>
            <div style={styles.decItem}>📸</div>
            <div style={styles.decItem}>🎨</div>
          </div>
        </div>

        {/* Info Box */}
        <div style={styles.infoBox}>
          <div style={{ color: '#ff69b4', fontSize: '11px', fontWeight: 'bold', marginBottom: '6px' }}>
            💡 FAMILY PROTECTION
          </div>
          <div style={{ color: '#aaa', fontSize: '11px', lineHeight: '1.5' }}>
            Your family may receive suspicious messages. Help them identify scams and stay safe. Your guidance matters!
          </div>
        </div>

        {/* Exit Button */}
        <button onClick={onClose} style={styles.exitBtn}>
          ← Exit Home
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
    background: 'linear-gradient(135deg, #2a1a3a 0%, #1a2a3a 100%)',
    border: '3px solid #1565c0',
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
  wall: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '120px',
    background: 'linear-gradient(180deg, #1565c020, transparent)',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    pointerEvents: 'none'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 10,
    paddingBottom: '12px',
    borderBottom: '2px solid #1565c040'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#666',
    fontSize: '20px',
    cursor: 'pointer'
  },
  roomContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'center',
    zIndex: 5
  },
  sofa: {
    padding: '16px 24px',
    background: '#ffa50030',
    border: '2px solid #daa520',
    borderRadius: '12px',
    fontSize: '40px',
    textAlign: 'center',
    opacity: 0.7
  },
  familyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    width: '100%'
  },
  familyMember: {
    padding: '20px',
    borderRadius: '14px',
    border: '2px solid',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s',
    background: '#0a0a1a'
  },
  decorations: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    padding: '12px',
    background: '#12122a40',
    borderRadius: '12px',
    fontSize: '28px'
  },
  decItem: {
    opacity: 0.6
  },
  infoBox: {
    padding: '12px 16px',
    background: '#ff69b415',
    border: '1px solid #ff69b430',
    borderRadius: '10px'
  },
  exitBtn: {
    padding: '12px',
    background: 'linear-gradient(135deg, #1565c040, #0d47a140)',
    border: '2px solid #1565c0',
    borderRadius: '12px',
    color: '#1565c0',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
}
