// ScamVerse - HackMol 7.0
// ScenarioModal.jsx - the scam scenario popup
// shows when player enters a building
// has AI analysis panel

import { useState, useEffect, useRef } from 'react'
import { useGame } from '../game/GameContext'
import { getScenario, analyzeMessage, saveProgress } from '../utils/api'
import playSound from '../utils/sounds'


// fallback scenarios if backend is down
const FALLBACK_SCENARIOS = [
  {
    id: 1,
    type: 'OTP_SCAM',
    sender: 'SBI-ALERT',
    message: 'Dear Player, Your SBI account will be blocked in 24 hours. Call 09876543210 and share OTP immediately. Ref: SBI/2024/KYC/4521',
    is_scam: true,
    clues: [
      'SBI never includes a phone number in official SMS',
      'Banks NEVER ask for OTP — RBI official policy',
      'Urgency tactic designed to cause panic'
    ],
    explanation: 'This is a KYC scam. Real SBI KYC is done at branch or through official app only.',
    reported_cases: 4521,
    avg_loss: 45000,
    source: 'RBI Annual Cyber Fraud Report 2024'
  },
  {
    id: 2,
    type: 'LOTTERY',
    sender: 'KBC-HQ-Mumbai',
    message: 'Congratulations! Your number won KBC Lucky Draw Rs 25 lakh! Call 09123456789 within 48 hours to claim prize.',
    is_scam: true,
    clues: [
      'You cannot win a lottery you never entered',
      'KBC never runs SMS lucky draws',
      '48 hour deadline is artificial pressure'
    ],
    explanation: 'KBC lottery scam. There is no SMS lucky draw from KBC.',
    reported_cases: 12450,
    avg_loss: 8500,
    source: 'Cybercrime.gov.in 2024'
  }
]

export default function ScenarioModal({ building, onClose, npcName }) {
  const { state, dispatch } = useGame()
  const [scenario, setScenario] = useState(null)
  const [loading, setLoading] = useState(true)
  const [decision, setDecision] = useState(null)
  const [revealedClues, setRevealedClues] = useState([])
  const [aiResult, setAiResult] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [typedMessage, setTypedMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showFlash, setShowFlash] = useState(false)
  const [showXpFloat, setShowXpFloat] = useState(false)
  const typingTimeoutRef = useRef(null)
  const clueTimeoutsRef = useRef([])

  // sound effects
  function playNotification() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 800
      gain.gain.setValueAtTime(0.1, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.2)
    } catch (e) { console.log('sound failed') }
  }

  function playSuccess() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(523, ctx.currentTime)
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1)
      gain.gain.setValueAtTime(0.2, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.3)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.3)
    } catch (e) { console.log('sound failed') }
  }

  function playWrong() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(150, ctx.currentTime)
      osc.frequency.setValueAtTime(120, ctx.currentTime + 0.2)
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.4)
    } catch (e) { console.log('sound failed') }
  }

  // typing animation
  function startTyping(text) {
    setIsTyping(true)
    setTypedMessage('')
    let i = 0
    const typeChar = () => {
      if (i < text.length) {
        setTypedMessage(prev => prev + text[i])
        i++
        typingTimeoutRef.current = setTimeout(typeChar, 18) // 18ms per char
      } else {
        setIsTyping(false)
        setShowStats(true) // show stats after typing
        // start revealing clues one by one
        revealCluesOneByOne()
      }
    }
    typeChar()
  }

  // reveal clues with animation
  function revealCluesOneByOne() {
    if (!scenario?.clues?.length) return
    scenario.clues.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setRevealedClues(prev => [...prev, index])
      }, index * 300) // 300ms delay between each clue
      clueTimeoutsRef.current.push(timeout)
    })
  }

  // load scenario when modal opens
  useEffect(() => {
    loadScenario()
    return () => {
      // cleanup timeouts
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      clueTimeoutsRef.current.forEach(clearTimeout)
    }
  }, [])

  async function loadScenario() {
    setLoading(true)

    // map building to scam type
    const typeMap = {
      home: 'OTP_SCAM',
      bank: 'PHISHING',
      bazaar: 'UPI_TRAP',
      cybercell: 'DIGITAL_ARREST',
      scamlab: 'DEEPFAKE',
    }

    const scamType = typeMap[building?.id] || null

    // try backend first
    const data = await getScenario(state.playerName, scamType)

    if (data && data.message) {
      setScenario(data)
    } else {
      // use fallback
      const random = FALLBACK_SCENARIOS[
        Math.floor(Math.random() * FALLBACK_SCENARIOS.length)
      ]
      // personalise with player name
      const personalised = {
        ...random,
        message: random.message.replace('Player', state.playerName)
      }
      setScenario(personalised)
    }

    setLoading(false)
    // start typing animation after loading
    setTimeout(() => {
      playNotification()
      startTyping(scenario?.message || personalised?.message || '')
    }, 500)
  }

  async function handleDecision(choice) {
    if (decision || isTyping) return // don't allow decisions while typing
    setDecision(choice)

    // reveal all clues after decision
    setRevealedClues(scenario.clues.map((_, i) => i))

    const isCorrect = scenario.is_scam
      ? (choice === 'report' || choice === 'ignore')
      : choice === 'trust'

    if (isCorrect) {
      dispatch({ type: 'CORRECT_ANSWER', payload: 100 })
      playSuccess()
      setShowXpFloat(true)
      setTimeout(() => setShowXpFloat(false), 2000)
    } else {
      dispatch({ type: 'WRONG_ANSWER' })
      playWrong()
      setShowFlash(true)
      setTimeout(() => setShowFlash(false), 500)
    }

    // Save progress
    try {
      await saveProgress(scenario.id, isCorrect, isCorrect ? 100 : 0, `Decision: ${choice}`)
    } catch (error) {
      console.log('Failed to save progress:', error)
    }
  }

  async function handleAIAnalysis() {
    if (!scenario || aiLoading || aiResult) return
    setAiLoading(true)

    const result = await analyzeMessage(
      scenario.message,
      state.playerName
    )

    if (result) {
      setAiResult(result)
    } else {
      // fallback AI result
      setAiResult({
        verdict: scenario.is_scam ? 'SCAM' : 'SAFE',
        confidence: scenario.is_scam ? 94 : 88,
        flags: scenario.clues,
        explanation: scenario.explanation,
        what_to_do: 'Call 1930 if you suspect fraud.',
        source: 'Pattern Analysis'
      })
    }
    setAiLoading(false)
  }

  function useScanner() {
    if (state.scanners <= 0) return
    dispatch({ type: 'USE_POWERUP', payload: 'scanners' })
    // reveal 2 clues at a time
    const nextTwo = [
      ...revealedClues,
      revealedClues.length,
      revealedClues.length + 1
    ].filter(i => i < (scenario?.clues?.length || 0))
    setRevealedClues([...new Set(nextTwo)])
  }

  function useHint() {
    if (state.hints <= 0) return
    dispatch({ type: 'USE_POWERUP', payload: 'hints' })
    setShowHint(true)
  }

  if (loading) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚙️</div>
            <div style={{ color: '#4fc3f7', fontSize: '14px' }}>Loading scenario...</div>
          </div>
        </div>
      </div>
    )
  }

  const isCorrect = decision && (
    scenario.is_scam
      ? (decision === 'report' || decision === 'ignore')
      : decision === 'trust'
  )

  return (
    <div style={styles.overlay}>
      {/* flash overlay for wrong answers */}
      {showFlash && <div style={styles.flashOverlay}></div>}

      {/* XP float animation */}
      {showXpFloat && (
        <div style={styles.xpFloat}>
          +100 XP
        </div>
      )}

      <div style={styles.modal}>

        {/* header */}
        <div style={styles.header}>
          <div>
            <div style={{ color: '#4fc3f7', fontSize: '11px', fontWeight: 'bold' }}>
              {npcName ? `📞 ${npcName} RECEIVED A MESSAGE` : 'SCAM ANALYSIS'}
            </div>
            <div style={{ color: '#666', fontSize: '10px' }}>
              📋 {scenario.mission || 'Mission'}
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {/* message card - looks like real phone */}
        <div style={styles.phoneCard}>
          <div style={styles.senderRow}>
            <div style={styles.avatar}>📱</div>
            <div>
              <div style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>
                {scenario.sender}
              </div>
              <div style={{ color: '#666', fontSize: '10px' }}>
                Incoming message
              </div>
            </div>
          </div>
          <div style={{
            color: '#ddd',
            fontSize: '13px',
            lineHeight: '1.6',
            minHeight: '40px'
          }}>
            {typedMessage}
            {isTyping && <span style={styles.cursor}>|</span>}
          </div>
        </div>

        {/* real stats row - fade in after typing */}
        {showStats && scenario.reported_cases > 0 && (
          <div style={{
            ...styles.statsRow,
            animation: 'slideIn 0.5s ease-out'
          }}>
            <span style={{ color: '#f44336' }}>
              ⚠️ {scenario.reported_cases?.toLocaleString()} cases/month
            </span>
            <span style={{ color: '#ff9800' }}>
              Avg loss: ₹{scenario.avg_loss?.toLocaleString()}
            </span>
          </div>
        )}

        {/* clues revealed with slide animation */}
        {revealedClues.length > 0 && (
          <div style={{ marginBottom: '10px' }}>
            <div style={{ color: '#f44336', fontSize: '10px', fontWeight: 'bold', marginBottom: '4px' }}>
              🚩 RED FLAGS DETECTED
            </div>
            {scenario.clues.map((clue, i) =>
              revealedClues.includes(i) && (
                <div key={i} style={{
                  ...styles.clue,
                  animation: 'slideIn 0.3s ease-out'
                }}>
                  ⚠️ {clue}
                </div>
              )
            )}
          </div>
        )}

        {/* AI analysis panel */}
        {aiResult && (
          <div style={styles.aiPanel}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ color: '#9c27b0', fontSize: '11px', fontWeight: 'bold' }}>
                🤖 AI ANALYSIS
              </span>
              <span style={{
                color: aiResult.verdict === 'SCAM' ? '#f44336' :
                       aiResult.verdict === 'SAFE' ? '#4caf50' : '#ff9800',
                fontSize: '11px', fontWeight: 'bold'
              }}>
                {aiResult.verdict} — {aiResult.confidence}% confident
              </span>
              <span style={{ color: '#666', fontSize: '10px', marginLeft: 'auto' }}>
                {aiResult.source}
              </span>
            </div>

            {/* confidence bar */}
            <div style={{ height: '4px', background: '#1a1a2e', borderRadius: '2px', marginBottom: '8px' }}>
              <div style={{
                height: '100%',
                width: `${aiResult.confidence}%`,
                background: aiResult.verdict === 'SCAM' ? '#f44336' :
                            aiResult.verdict === 'SAFE' ? '#4caf50' : '#ff9800',
                borderRadius: '2px',
                transition: 'width 1s'
              }} />
            </div>

            {/* flags */}
            {aiResult.flags?.map((flag, i) => (
              <div key={i} style={{ color: '#aaa', fontSize: '11px', marginBottom: '3px' }}>
                • {flag}
              </div>
            ))}

            {/* what to do */}
            {aiResult.what_to_do && (
              <div style={{ color: '#4fc3f7', fontSize: '11px', marginTop: '6px', fontWeight: 'bold' }}>
                ✅ {aiResult.what_to_do}
              </div>
            )}
          </div>
        )}

        {/* hint */}
        {showHint && (
          <div style={styles.hint}>
            {scenario.is_scam
              ? '🚨 This message shows signs of being a SCAM. REPORT is the safest choice.'
              : '✅ This appears to be a legitimate message. TRUST is appropriate here.'
            }
          </div>
        )}

        {/* Learn Mode / Result after decision */}
        {decision && (
          <div style={{
            ...styles.result,
            background: isCorrect ? '#0a1a0a' : '#1a0a0a',
            border: `1px solid ${isCorrect ? '#4caf5040' : '#f4433640'}`
          }}>
            <div style={{
              background: isCorrect ? '#4caf5020' : '#f4433620',
              padding: '8px 12px',
              borderRadius: '8px',
              color: isCorrect ? '#4caf50' : '#f44336',
              fontWeight: 'bold',
              fontSize: '13px',
              marginBottom: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>{isCorrect ? '✅ THREAT NEUTRALIZED' : '❌ SECURITY BREACH'}</span>
              <span style={{ fontSize: '11px' }}>{isCorrect ? '+100 XP' : '-15 Security'}</span>
            </div>
            
            <div style={{ color: '#4fc3f7', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
              🧠 LEARN MODE: Why was this a scam?
            </div>
            
            <div style={{ color: '#ccc', fontSize: '12px', lineHeight: '1.5', paddingLeft: '12px', borderLeft: '2px solid #4fc3f7' }}>
              {scenario.explanation}
            </div>
            
            {scenario.clues && scenario.clues.length > 0 && (
              <div style={{ marginTop: '12px' }}>
                <div style={{ color: '#aaa', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>Key Indicators:</div>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#ccc', fontSize: '11px', lineHeight: '1.4' }}>
                  {scenario.clues.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {scenario.source && (
              <div style={{ color: '#666', fontSize: '10px', marginTop: '10px', fontStyle: 'italic' }}>
                Source: {scenario.source}
              </div>
            )}
          </div>
        )}

        {/* action buttons */}
        <div style={{ padding: '0 14px 14px' }}>
          {!decision ? (
            <>
              {/* powerup row */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                <button
                  onClick={useScanner}
                  disabled={state.scanners <= 0}
                  style={styles.powerupBtn}
                >
                  🔍 Scan ({state.scanners})
                </button>
                <button
                  onClick={useHint}
                  disabled={state.hints <= 0}
                  style={styles.powerupBtn}
                >
                  💡 Hint ({state.hints})
                </button>
                <button
                  onClick={handleAIAnalysis}
                  disabled={aiLoading || !!aiResult}
                  style={styles.powerupBtn}
                >
                  {aiLoading ? '⏳' : '🤖'} AI
                </button>
              </div>

              {/* decision buttons - chat style wrapper */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ color: '#aaa', fontSize: '10px', textAlign: 'center', marginBottom: '2px' }}>
                  Choose your response:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <button
                    onClick={() => handleDecision('trust')}
                    disabled={isTyping}
                    style={{
                      ...styles.decBtn,
                      color: '#4caf50',
                      background: 'rgba(76, 175, 80, 0.1)',
                      borderColor: '#4caf5040',
                      opacity: isTyping ? 0.5 : 1,
                      cursor: isTyping ? 'not-allowed' : 'pointer'
                    }}
                  >
                    ✅ TRUST
                  </button>
                  <button
                    onClick={() => handleDecision('ignore')}
                    disabled={isTyping}
                    style={{
                      ...styles.decBtn,
                      color: '#ff9800',
                      background: 'rgba(255, 152, 0, 0.1)',
                      borderColor: '#ff980040',
                      opacity: isTyping ? 0.5 : 1,
                      cursor: isTyping ? 'not-allowed' : 'pointer'
                    }}
                  >
                    🤔 IGNORE
                  </button>
                  <button
                    onClick={() => handleDecision('report')}
                    disabled={isTyping}
                    style={{
                      ...styles.decBtn,
                      color: '#f44336',
                      background: 'rgba(244, 67, 54, 0.1)',
                      borderColor: '#f4433640',
                      opacity: isTyping ? 0.5 : 1,
                      cursor: isTyping ? 'not-allowed' : 'pointer'
                    }}
                  >
                    🚨 REPORT
                  </button>
                </div>
              </div>
            </>
          ) : (
            <button onClick={onClose} style={styles.continueBtn}>
              CONTINUE MISSION →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
    backdropFilter: 'blur(6px)'
  },
  flashOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(244, 67, 54, 0.3)',
    zIndex: 1001,
    animation: 'flash 0.5s ease-out'
  },
  xpFloat: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#4caf50',
    fontSize: '24px',
    fontWeight: 'bold',
    zIndex: 1002,
    animation: 'floatUp 2s ease-out forwards'
  },
  modal: {
    background: '#12122a',
    border: '1px solid #2a2a4a',
    borderRadius: '18px',
    width: '100%',
    maxWidth: '420px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px',
    borderBottom: '1px solid #2a2a4a'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#666',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '4px 8px'
  },
  phoneCard: {
    background: '#0a0a1a',
    border: '1px solid #2a2a4a',
    borderRadius: '12px',
    padding: '14px',
    margin: '12px 14px'
  },
  senderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
    paddingBottom: '10px',
    borderBottom: '1px solid #2a2a4a'
  },
  avatar: {
    width: '34px',
    height: '34px',
    background: '#2a2a4a',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px'
  },
  cursor: {
    animation: 'blink 1s infinite',
    color: '#4fc3f7'
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 14px',
    fontSize: '11px',
    background: '#0a0a1a',
    margin: '0 14px 10px',
    borderRadius: '8px',
    border: '1px solid #2a2a4a'
  },
  clue: {
    background: '#1a0000',
    border: '1px solid #f4433630',
    borderRadius: '8px',
    padding: '6px 10px',
    fontSize: '12px',
    color: '#f44336',
    marginBottom: '4px',
    marginLeft: '14px',
    marginRight: '14px'
  },
  aiPanel: {
    background: '#12003a',
    border: '1px solid #9c27b030',
    borderRadius: '12px',
    padding: '12px',
    margin: '0 14px 10px'
  },
  hint: {
    background: '#1a1400',
    border: '1px solid #ff980030',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '12px',
    color: '#ff9800',
    margin: '0 14px 10px'
  },
  result: {
    borderRadius: '12px',
    padding: '12px',
    margin: '0 14px 10px'
  },
  powerupBtn: {
    flex: 1,
    padding: '7px',
    background: '#0a0a1a',
    border: '1px solid #2a2a4a',
    borderRadius: '8px',
    color: '#9c27b0',
    fontSize: '11px',
    cursor: 'pointer'
  },
  decBtn: {
    padding: '10px',
    background: 'transparent',
    border: '1px solid',
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: 'bold'
  },
  continueBtn: {
    width: '100%',
    padding: '12px',
    background: '#4fc3f720',
    border: '1px solid #4fc3f740',
    borderRadius: '12px',
    color: '#4fc3f7',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
}

// add CSS animations
const styleTag = document.createElement('style')
styleTag.textContent = `
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
  @keyframes flash {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }
  @keyframes floatUp {
    0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -80%) scale(1.2); }
  }
  @keyframes slideIn {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
`
document.head.appendChild(styleTag)

