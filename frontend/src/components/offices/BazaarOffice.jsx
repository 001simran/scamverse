// ScamVerse - HackMol 7.0
// BazaarOffice.jsx - Bustling marketplace interface

import { useState, useEffect } from 'react'
import ScenarioModal from '../ScenarioModal'

export default function BazaarOffice({ building, onClose }) {
  const [selectedNPC, setSelectedNPC] = useState(null)
  const [showScenario, setShowScenario] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  const NPCs = ['Vendor', 'Shopkeeper', 'Customer']

  function handleNPCClick(npcName) {
    setSelectedNPC(npcName)
    setShowScenario(true)
  }

  function handleScenarioClose() {
    setShowScenario(false)
    setSelectedNPC(null)
  }

  function handleExit() {
    setIsExiting(true)
    setTimeout(() => {
      onClose()
    }, 300)
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
    <div style={{...styles.overlay, opacity: isExiting ? 0 : 1, transition: 'opacity 0.3s ease-out'}}>
      <div style={{...styles.container, transform: isExiting ? 'scale(0.95)' : 'scale(1)', transition: 'transform 0.3s ease-out'}}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <div style={{ color: '#e65100', fontSize: '12px', fontWeight: 'bold' }}>
              🛒 MARKETPLACE
            </div>
            <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>
              Local Bazaar
            </div>
            <div style={{ color: '#aaa', fontSize: '11px', marginTop: '4px' }}>
              Busy trading hub with merchants
            </div>
          </div>
          <button onClick={handleExit} style={styles.closeBtn}>✕</button>
        </div>

        {/* Market Scene */}
        <div style={styles.marketScene}>
          {/* Stalls */}
          <div style={styles.stallsRow}>
            <div style={styles.stall}>🧅 🥘 🍯</div>
            <div style={styles.stall}>👜 👕 📿</div>
            <div style={styles.stall}>🎁 🛍️ 💎</div>
          </div>

          {/* Traders */}
          <div style={styles.tradersGrid}>
            {NPCs.map((npc, idx) => {
              const icons = ['👨‍🌾', '👩‍🏪', '🧑‍💼']
              const items = ['Spices', 'Textiles', 'Luxury']
              
              return (
                <div
                  key={idx}
                  onClick={() => handleNPCClick(npc)}
                  style={{
                    ...styles.traderCard,
                    borderColor: selectedNPC === npc ? '#e65100' : '#bf360c40',
                    background: selectedNPC === npc ? '#e6510020' : '#0a0a1a',
                    cursor: 'pointer',
                    transform: selectedNPC === npc ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  <div style={{ fontSize: '44px', marginBottom: '8px' }}>
                    {icons[idx]}
                  </div>
                  <div style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>
                    {npc}
                  </div>
                  <div style={{ color: '#e65100', fontSize: '10px', marginTop: '4px' }}>
                    {items[idx]} trader
                  </div>
                </div>
              )
            })}
          </div>

          {/* Market Items */}
          <div style={styles.marketItems}>
            <div style={styles.item}>🍊</div>
            <div style={styles.item}>🛵</div>
            <div style={styles.item}>📱</div>
            <div style={styles.item}>⌚</div>
            <div style={styles.item}>💍</div>
            <div style={styles.item}>🎵</div>
          </div>
        </div>

        {/* Warning Alert */}
        <div style={styles.warningBox}>
          <div style={{ color: '#ff9800', fontSize: '10px', fontWeight: 'bold', marginBottom: '4px' }}>
            ⚠️ MARKETPLACE FRAUD
          </div>
          <div style={{ color: '#aaa', fontSize: '10px', lineHeight: '1.4' }}>
            Scammers often target traders. Help merchants identify fake payment methods and counterfeit schemes.
          </div>
        </div>

        {/* Exit Button */}
        <button onClick={handleExit} style={{...styles.exitBtn, opacity: isExiting ? 0.5 : 1}}>
          ← Exit Bazaar
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
    border: '3px solid #e65100',
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
    borderBottom: '2px solid #e6510040'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#666',
    fontSize: '20px',
    cursor: 'pointer'
  },
  marketScene: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    alignItems: 'center'
  },
  stallsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    width: '100%'
  },
  stall: {
    padding: '16px',
    background: '#e6510015',
    border: '2px dashed #bf360c',
    borderRadius: '10px',
    textAlign: 'center',
    fontSize: '24px',
    opacity: 0.7
  },
  tradersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    width: '100%'
  },
  traderCard: {
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
  marketItems: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '8px',
    width: '100%',
    padding: '12px',
    background: '#e6510010',
    borderRadius: '10px'
  },
  item: {
    fontSize: '24px',
    textAlign: 'center',
    opacity: 0.6
  },
  warningBox: {
    padding: '12px 16px',
    background: '#ff980015',
    border: '1px solid #ff980040',
    borderRadius: '10px'
  },
  exitBtn: {
    padding: '12px',
    background: 'linear-gradient(135deg, #e6510040, #bf360c40)',
    border: '2px solid #e65100',
    borderRadius: '12px',
    color: '#e65100',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
}
