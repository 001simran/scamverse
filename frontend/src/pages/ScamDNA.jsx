/*
 * ScamVerse - HackMol 7.0
 * ScamDNA.jsx - Expanded Scam Lab
 * Includes: DNA Report (Vulnerability Profile) + AI Scam Scanner (Text Analysis)
 */

import { useGame } from '../game/GameContext'
import { useState, useEffect, useRef } from 'react'
import ScamScanner from '../components/ScamScanner'

export default function ScamDNA({ onClose }) {
  const { state, progressionData } = useGame()
  const canvasRef = useRef(null)
  const [activeTab, setActiveTab] = useState('dna') // dna | scanner

  // Derive stats from professional progression system
  const caught   = progressionData?.stats?.successfulMissions || 0
  const fellFor  = progressionData?.stats?.failedMissions || 0
  const reported = progressionData?.stats?.successfulMissions || 0 // Recommending reported as successful missions for DNA
  const total    = Math.max(1, caught + fellFor)
  const accuracy = Math.round(((caught) / total) * 100)

  // protection score calculation based on city security
  const protection = progressionData?.citySecurity || 50
  
  const protColor = protection > 70 ? '#4caf50'
                  : protection > 40 ? '#ff9800'
                  : '#f44336'

  const protLabel = protection > 70 ? 'Well Protected'
                  : protection > 40 ? 'Moderately Vulnerable'
                  : 'High Risk'

  const biases = [
    {
      key:   'urgency',
      label: '⏰ Urgency Susceptibility',
      color: '#ff9800',
      tip:   'You tend to act fast under time pressure. Always pause 10 minutes before any financial decision.'
    },
    {
      key:   'authority',
      label: '🎖️ Authority Compliance',
      color: '#9c27b0',
      tip:   'You comply when someone claims to be CBI or RBI. Real agencies always send written notices.'
    },
    {
      key:   'greed',
      label: '💰 Greed Vulnerability',
      color: '#4caf50',
      tip:   'High return promises lower your guard. If returns sound too good — they always are.'
    },
    {
      key:   'fear',
      label: '😰 Fear Response',
      color: '#f44336',
      tip:   'Fear of consequences makes you vulnerable. Real legal actions use official written notices.'
    },
  ]

  // draw protection score gauge on canvas
  useEffect(() => {
    if (activeTab !== 'dna') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const cx  = canvas.width  / 2
    const cy  = canvas.height / 2
    const r   = 60

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // background arc
    ctx.beginPath()
    ctx.arc(cx, cy, r, -Math.PI * 0.75, Math.PI * 0.75)
    ctx.strokeStyle = '#1a1a3a'
    ctx.lineWidth   = 12
    ctx.lineCap     = 'round'
    ctx.stroke()

    // filled arc
    const pct   = protection / 100
    const start = -Math.PI * 0.75
    const end   = start + (Math.PI * 1.5 * pct)

    ctx.beginPath()
    ctx.arc(cx, cy, r, start, end)
    ctx.strokeStyle = protColor
    ctx.lineWidth   = 12
    ctx.lineCap     = 'round'
    ctx.stroke()

    // score text
    ctx.font         = 'bold 28px Arial'
    ctx.fillStyle    = protColor
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(protection, cx, cy - 4)

    ctx.font      = '11px Arial'
    ctx.fillStyle = '#666'
    ctx.fillText('/100', cx, cy + 18)
  }, [protection, activeTab])

  async function downloadPDF() {
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageW = doc.internal.pageSize.getWidth()

      // page 1
      doc.setFillColor(10, 10, 26)
      doc.rect(0, 0, pageW, 297, 'F')
      doc.setTextColor(79, 195, 247)
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.text('NETGUARDIAN', pageW / 2, 25, { align: 'center' })
      doc.setTextColor(255, 152, 0)
      doc.setFontSize(13)
      doc.text('Professional Cyber Security Training — HackMol 7.0', pageW / 2, 34, { align: 'center' })
      doc.setDrawColor(42, 42, 74)
      doc.line(20, 40, pageW - 20, 40)

      doc.setTextColor(156, 39, 176)
      doc.setFontSize(18)
      doc.text('SCAM DNA REPORT', pageW / 2, 52, { align: 'center' })
      doc.setTextColor(200, 200, 200)
      doc.setFontSize(12)
      doc.text(`Agent: ${state?.playerName || 'Guardian'}`, pageW / 2, 62, { align: 'center' })
      doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, pageW / 2, 70, { align: 'center' })
      doc.line(20, 76, pageW - 20, 76)

      // protection score
      doc.setFontSize(48)
      doc.setTextColor(protection > 70 ? [76, 175, 80] : protection > 40 ? [255, 152, 0] : [244, 67, 54])
      doc.text(`${protection}`, pageW / 2, 110, { align: 'center' })
      doc.setFontSize(14)
      doc.text('/ 100 Protection Score', pageW / 2, 122, { align: 'center' })
      doc.setFontSize(12)
      doc.text(protLabel, pageW / 2, 132, { align: 'center' })

      doc.setTextColor(150, 150, 150)
      const betterThan = Math.min(95, Math.max(5, protection))
      doc.text(`Better than ${betterThan}% of Indian internet users`, pageW / 2, 142, { align: 'center' })
      doc.line(20, 150, pageW - 20, 150)

      // stats
      doc.setFontSize(14)
      doc.setTextColor(255, 215, 0)
      doc.text('YOUR GAMEPLAY STATS', 20, 162)
      const statsList = [
        ['Total XP', (progressionData?.xp || 0).toLocaleString()],
        ['Level',       `${progressionData?.level || 1} — ${progressionData?.rank?.name || 'Trainee'}`],
        ['Scams Caught', caught.toString()],
        ['Fell For',    fellFor.toString()],
        ['Accuracy',    `${accuracy}%`],
      ]
      doc.setFontSize(11)
      statsList.forEach(([label, value], i) => {
        const yLine = 172 + i * 10
        doc.setTextColor(150, 150, 150)
        doc.text(label, 25, yLine)
        doc.setTextColor(255, 255, 255)
        doc.text(value, 120, yLine)
      })

      doc.save(`NetGuardian_DNA_${state?.playerName || 'Guardian'}_${Date.now()}.pdf`)
    } catch (err) {
      console.error('PDF generation collapsed:', err)
      alert('PDF generation failed.')
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>

        {/* header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🔬</span>
            <div style={{ color: '#9c27b0', fontSize: '18px', fontWeight: 'bold' }}>
              SCAM LAB
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {/* tabs */}
        <div style={styles.tabHeader}>
          <div 
            onClick={() => setActiveTab('dna')}
            style={{ 
              ...styles.tab, 
              borderBottomColor: activeTab === 'dna' ? '#9c27b0' : 'transparent',
              color: activeTab === 'dna' ? '#9c27b0' : '#666',
              background: activeTab === 'dna' ? 'rgba(156, 39, 176, 0.05)' : 'transparent'
            }}
          >
            🧬 DNA Report
          </div>
          <div 
            onClick={() => setActiveTab('scanner')}
            style={{ 
              ...styles.tab, 
              borderBottomColor: activeTab === 'scanner' ? '#9c27b0' : 'transparent',
              color: activeTab === 'scanner' ? '#9c27b0' : '#666',
              background: activeTab === 'scanner' ? 'rgba(156, 39, 176, 0.05)' : 'transparent'
            }}
          >
            🤖 AI Scanner
          </div>
        </div>

        <div style={{ padding: '16px' }}>

          {activeTab === 'dna' ? (
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              {/* agent info */}
              <div style={styles.agentCard}>
                <div style={{ fontSize: '32px' }}>🕵️</div>
                <div>
                  <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '15px' }}>
                    {state?.playerName || 'Guardian'}
                  </div>
                  <div style={{ color: '#9c27b0', fontSize: '12px' }}>
                    Level {progressionData?.level || 1} — {progressionData?.rank?.name || 'Trainee'}
                  </div>
                </div>
              </div>

              {/* gauge */}
              <div style={styles.gaugeBox}>
                <canvas ref={canvasRef} width={160} height={120} style={{ display: 'block', margin: '0 auto' }} />
                <div style={{ textAlign: 'center', marginTop: '-10px' }}>
                  <div style={{ color: protColor, fontWeight: 'bold', fontSize: '15px' }}>{protLabel}</div>
                  <div style={{ color: '#666', fontSize: '11px' }}>Security Index: {protection}/100</div>
                </div>
              </div>

              {/* stats grid */}
              <div style={styles.statsGrid}>
                {[
                  [(progressionData?.xp || 0).toLocaleString(), 'XP',    '🏆', '#ffd700'],
                  [caught,                             'Caught',   '🎯', '#4caf50'],
                  [reported,                           'Reported', '🚨', '#4fc3f7'],
                  [fellFor,                            'Fell For', '😰', '#f44336'],
                  [`${accuracy}%`,                    'Accuracy', '📊', '#9c27b0'],
                  [progressionData?.stats?.totalMissions || 0, 'Total','🏙️', '#ff9800'],
                ].map(([val, label, icon, color]) => (
                  <div key={label} style={styles.statCard}>
                    <div style={{ fontSize: '18px' }}>{icon}</div>
                    <div style={{ color, fontWeight: 'bold', fontSize: '14px' }}>{val}</div>
                    <div style={{ color: '#666', fontSize: '10px' }}>{label}</div>
                  </div>
                ))}
              </div>


              {/* biases list */}
              <div style={styles.sectionTitle}>🧬 VULNERABILITY PROFILE</div>
              {biases.map(b => {
                const bVal = state?.biasProfile?.[b.key] || 0
                const bPct = Math.min(100, Math.round((bVal / total) * 100))
                return (
                  <div key={b.key} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#ddd', fontSize: '12px' }}>{b.label}</span>
                      <span style={{ color: b.color, fontSize: '12px', fontWeight: 'bold' }}>{bPct}%</span>
                    </div>
                    <div style={styles.barTrack}><div style={{ height: '100%', borderRadius: '4px', background: b.color, width: `${bPct}%` }} /></div>
                  </div>
                )
              })}

              {/* actions */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button onClick={downloadPDF} style={styles.pdfBtn}>📥 Download PDF</button>
                <button onClick={onClose} style={styles.closeActBtn}>🔄 Return to Field</button>
              </div>
            </div>
          ) : (
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <ScamScanner />
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.92)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: '16px',
    backdropFilter: 'blur(10px)'
  },
  modal: {
    background: '#0d0d2a',
    border: '1px solid #2a2a4a',
    borderRadius: '24px',
    width: '100%', maxWidth: '420px',
    maxHeight: '94vh', overflowY: 'auto',
    fontFamily: 'system-ui, sans-serif',
    boxShadow: '0 30px 60px rgba(0,0,0,0.8)'
  },
  header: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid #2a2a4a',
    position: 'sticky', top: 0, background: '#0d0d2a', zIndex: 10
  },
  closeBtn: { background: 'none', border: 'none', color: '#666', fontSize: '20px', cursor: 'pointer' },
  tabHeader: { display: 'flex', borderBottom: '1px solid #2a2a4a', background: '#12122a' },
  tab: {
    flex: 1, padding: '14px', textAlign: 'center', cursor: 'pointer',
    fontSize: '13px', fontWeight: 'bold', borderBottom: '3px solid',
    transition: 'all 0.3s ease'
  },
  agentCard: {
    display: 'flex', alignItems: 'center', gap: '15px',
    background: '#12122a', border: '1px solid #2a2a4a',
    borderRadius: '16px', padding: '16px', marginBottom: '20px'
  },
  gaugeBox: {
    background: '#12122a', border: '1px solid #2a2a4a',
    borderRadius: '16px', padding: '20px', marginBottom: '20px'
  },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' },
  statCard: {
    background: '#16163a', border: '1px solid #2a2a4a',
    borderRadius: '12px', padding: '12px', textAlign: 'center'
  },
  sectionTitle: { color: '#9c27b0', fontSize: '11px', fontWeight: 'bold', marginBottom: '12px', letterSpacing: '1px' },
  barTrack: { height: '8px', background: '#1a1a3a', borderRadius: '4px', overflow: 'hidden', marginBottom: '4px' },
  pdfBtn: {
    flex: 1, padding: '14px', background: '#9c27b020',
    border: '1px solid #9c27b040', borderRadius: '12px',
    color: '#9c27b0', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer'
  },
  closeActBtn: {
    flex: 1, padding: '14px', background: '#4fc3f720',
    border: '1px solid #4fc3f740', borderRadius: '12px',
    color: '#4fc3f7', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer'
  }
}