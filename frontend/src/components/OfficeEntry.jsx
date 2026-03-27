// ScamVerse - HackMol 7.0
// OfficeEntry.jsx - Office/Building Interior Entry Point
// Shows NPCs in their offices before encountering scam

import { useState, useEffect } from 'react'
import ScenarioModal from './ScenarioModal'

const OFFICE_CONFIGS = {
  home: {
    name: 'Your Apartment',
    roofColor: '#0d47a1',
    primaryColor: '#1565c0',
    npcs: ['Mom', 'Sister'],
    description: 'Your family awaits...'
  },
  bank: {
    name: 'City Bank',
    roofColor: '#1b5e20',
    primaryColor: '#2e7d32',
    npcs: ['Bank Manager', 'Clerk', 'Security Guard'],
    description: 'Banking staff are on duty'
  },
  bazaar: {
    name: 'Local Bazaar',
    roofColor: '#bf360c',
    primaryColor: '#e65100',
    npcs: ['Vendor', 'Shopkeeper', 'Customer'],
    description: 'Bustling marketplace energy'
  },
  cybercell: {
    name: 'Cyber Cell Office',
    roofColor: '#38006b',
    primaryColor: '#4a148c',
    npcs: ['Officer', 'Detective', 'Tech Specialist'],
    description: 'Law enforcement headquarters'
  },
  scamlab: {
    name: 'Scam Lab',
    roofColor: '#560027',
    primaryColor: '#880e4f',
    npcs: ['Researcher', 'Analyst', 'Data Expert'],
    description: 'Safe zone for learning'
  },
  awareness: {
    name: 'Awareness Center',
    roofColor: '#e65100',
    primaryColor: '#f57f17',
    npcs: ['Guide', 'Trainer'],
    description: 'Educational hub'
  }
}

export default function OfficeEntry({ building, onClose, onSelectNPC }) {
  const [selectedNPC, setSelectedNPC] = useState(null)
  const [showScenario, setShowScenario] = useState(false)
  const config = OFFICE_CONFIGS[building?.id] || OFFICE_CONFIGS.home

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
      <div style={{
        ...styles.officeContainer,
        borderColor: config.primaryColor + '60'
      }}>
        {/* Header */}
        <div style={{
          ...styles.header,
          background: `linear-gradient(135deg, ${config.primaryColor}40, ${config.roofColor}40)`
        }}>
          <div>
            <div style={{ color: config.primaryColor, fontSize: '12px', fontWeight: 'bold' }}>
              ENTERING BUILDING
            </div>
            <div style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>
              {config.name}
            </div>
            <div style={{ color: '#aaa', fontSize: '12px', marginTop: '4px' }}>
              {config.description}
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {/* Office Room Visual */}
        <div style={{
          ...styles.officeRoom,
          background: `linear-gradient(180deg, #12122a 0%, ${config.primaryColor}15 100%)`
        }}>
          <div style={styles.roomDeco}>
            <div style={{
              ...styles.decorElement,
              background: `${config.primaryColor}30`,
              borderColor: config.primaryColor
            }}>🪟</div>
            <div style={{
              ...styles.decorElement,
              background: `${config.roofColor}30`,
              borderColor: config.roofColor
            }}>🚪</div>
            <div style={{
              ...styles.decorElement,
              background: `${config.primaryColor}30`,
              borderColor: config.primaryColor
            }}>📚</div>
          </div>

          {/* NPCs Grid */}
          <div style={styles.npcGrid}>
            {config.npcs.map((npc, idx) => (
              <div
                key={idx}
                onClick={() => handleNPCClick(npc)}
                style={{
                  ...styles.npcCard,
                  borderColor: selectedNPC === npc ? config.primaryColor : '#2a2a4a',
                  background: selectedNPC === npc
                    ? `${config.primaryColor}20`
                    : '#0a0a1a',
                  cursor: 'pointer',
                  transform: selectedNPC === npc ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>
                  {['👨‍💼', '👩‍💼', '🧑‍✈️', '👮', '🔬'][idx % 5]}
                </div>
                <div style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>
                  {npc}
                </div>
                <div style={{ color: '#666', fontSize: '11px', marginTop: '4px' }}>
                  Click to interact
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Panel */}
        <div style={{
          ...styles.infoPanel,
          borderColor: config.primaryColor + '40'
        }}>
          <div style={{ color: '#4fc3f7', fontSize: '11px', fontWeight: 'bold', marginBottom: '6px' }}>
            💡 HOW IT WORKS
          </div>
          <ul style={{ margin: '0', paddingLeft: '16px', color: '#aaa', fontSize: '12px', lineHeight: '1.6' }}>
            <li>Click on any person to interact</li>
            <li>They'll receive a message</li>
            <li>You must detect if it's a scam</li>
            <li>Your analysis helps protect them</li>
          </ul>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <button onClick={onClose} style={{
            ...styles.exitBtn,
            borderColor: config.primaryColor
          }}>
            ← Exit Building
          </button>
          <div style={{ color: '#666', fontSize: '10px' }}>
            Select someone to help ⚡
          </div>
        </div>
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
    backdropFilter: 'blur(8px)',
    animation: 'fadeIn 0.3s ease-out'
  },
  officeContainer: {
    background: '#12122a',
    border: '2px solid',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '560px',
    maxHeight: '88vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    padding: '20px',
    borderBottom: '1px solid #2a2a4a',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#666',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '4px 8px',
    transition: 'color 0.2s'
  },
  officeRoom: {
    flex: 1,
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    overflowY: 'auto'
  },
  roomDeco: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: '12px',
    marginBottom: '12px'
  },
  decorElement: {
    flex: 1,
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid',
    textAlign: 'center',
    fontSize: '28px',
    opacity: 0.6
  },
  npcGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px'
  },
  npcCard: {
    padding: '16px',
    borderRadius: '14px',
    border: '2px solid',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '140px',
    transition: 'all 0.3s ease'
  },
  infoPanel: {
    margin: '0 20px 16px',
    padding: '12px 16px',
    background: '#0a0a1a',
    borderRadius: '12px',
    border: '1px solid'
  },
  footer: {
    padding: '16px 20px',
    borderTop: '1px solid #2a2a4a',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'center'
  },
  exitBtn: {
    padding: '10px 20px',
    background: 'transparent',
    border: '1px solid',
    borderRadius: '12px',
    color: '#4fc3f7',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
}

// Add fade-in animation
const styleTag = document.createElement('style')
styleTag.textContent = `
  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
`
if (!document.head.querySelector('style[data-office-entry]')) {
  styleTag.setAttribute('data-office-entry', 'true')
  document.head.appendChild(styleTag)
}
