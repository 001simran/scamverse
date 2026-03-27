/*
 * ScamVerse - HackMol 7.0
 * SpinWheel.jsx - Daily scam awareness spin wheel
 * Jasmeen built this
 * the confetti took forever to get right lol
 */

import { useRef, useEffect, useState } from 'react'
import { getSpinSegments } from '../utils/api'

const FALLBACK_SEGMENTS = [
  { type: 'DIGITAL_ARREST',   icon: '🚔', color: '#e53935', label: 'Digital Arrest' },
  { type: 'UPI_TRAP',         icon: '💸', color: '#f57c00', label: 'UPI Trap' },
  { type: 'OTP_SCAM',         icon: '📱', color: '#1976d2', label: 'OTP Scam' },
  { type: 'INVESTMENT_FRAUD', icon: '📈', color: '#388e3c', label: 'Investment Trap' },
  { type: 'DEEPFAKE',         icon: '🎭', color: '#7b1fa2', label: 'Deepfake Call' },
  { type: 'JOB_SCAM',         icon: '💼', color: '#00838f', label: 'Fake Job' },
  { type: 'LOTTERY',          icon: '🎰', color: '#f9a825', label: 'Lottery Scam' },
  { type: 'KYC_SCAM',         icon: '🪪', color: '#d84315', label: 'KYC Fraud' },
]

// real education data for each scam type
const EDUCATION_DATA = {
  DIGITAL_ARREST: {
    todayStat: '92,334 cases reported in India in 2024',
    realCase: {
      name: 'Ramesh Gupta', age: 58, city: 'Lucknow',
      occupation: 'Retired teacher', amountLost: '₹14 lakh',
      duration: '6 hours on call',
      whatHappened: 'Got call from CBI Inspector Sharma. Told his Aadhaar was linked to drug money. Kept on video call for 6 hours. Transferred ₹14 lakh to government escrow. Lost entire retirement savings.',
      date: 'November 2024'
    },
    redFlags: [
      'CBI never arrests anyone digitally — no such law in India',
      'Real agencies send official written notices only',
      'Any caller who says dont tell family is manipulating you'
    ],
    safetyTip: 'Hang up immediately. Call 1930. Tell your family right away.',
    totalLoss: '₹2,140 crore',
    source: 'MHA Cyber Crime Report 2024'
  },
  UPI_TRAP: {
    todayStat: '8,923 cases in last quarter alone',
    realCase: {
      name: 'Sunita Sharma', age: 34, city: 'Pune',
      occupation: 'Homemaker', amountLost: '₹38,000',
      duration: '15 minutes',
      whatHappened: 'Received ₹1 credit from unknown UPI ID. Got call saying Amazon refund of ₹1,299 needs OTP. Shared OTP. ₹38,000 debited within seconds.',
      date: 'October 2024'
    },
    redFlags: [
      'You NEVER need OTP to receive money — ever',
      '₹1 credit is bait to make scam feel real',
      'Legitimate refunds are automatic — no call needed'
    ],
    safetyTip: 'OTP only sends money OUT. Never share OTP to receive money.',
    totalLoss: '₹340 crore',
    source: 'NPCI Fraud Report 2024'
  },
  OTP_SCAM: {
    todayStat: 'Most common scam — 4,521 cases last month',
    realCase: {
      name: 'Mohan Lal', age: 67, city: 'Jaipur',
      occupation: 'Retired clerk', amountLost: '₹1.2 lakh',
      duration: '20 minutes',
      whatHappened: 'Got call from SBI officer. Told account would be blocked. Asked for OTP to verify. Shared 3 OTPs in panic. ₹1.2 lakh transferred in 3 transactions.',
      date: 'December 2024'
    },
    redFlags: [
      'Banks NEVER ask for OTP — this is official RBI policy',
      'Real bank calls come from toll-free numbers only',
      'Account block threats are designed to cause panic'
    ],
    safetyTip: 'Hang up. Call bank on number printed on your debit card.',
    totalLoss: '₹890 crore',
    source: 'RBI Annual Report 2024'
  },
  INVESTMENT_FRAUD: {
    todayStat: '2,341 fake SEBI groups shut down this year',
    realCase: {
      name: 'Priya Nair', age: 29, city: 'Bengaluru',
      occupation: 'Software Engineer', amountLost: '₹4.5 lakh',
      duration: '3 months',
      whatHappened: 'Joined WhatsApp investment group. Got real ₹12,000 profit in first month. Invested ₹4.5 lakh in month 2. Group disappeared overnight.',
      date: 'September 2024'
    },
    redFlags: [
      'SEBI prohibits guaranteed return promises — illegal',
      'Real investments always carry risk — no exceptions',
      'Screenshots of profits are trivially easy to fake'
    ],
    safetyTip: 'Verify any advisor at sebi.gov.in before investing.',
    totalLoss: '₹2,300 crore',
    source: 'SEBI Investor Bulletin 2024'
  },
  DEEPFAKE: {
    todayStat: 'AI voice cloning attacks up 156% in 2024',
    realCase: {
      name: 'Kavitha Menon', age: 61, city: 'Kochi',
      occupation: 'Retired professor', amountLost: '₹87,000',
      duration: '45 minutes',
      whatHappened: 'Received WhatsApp video call from son number. Son face and voice said he was detained at Dubai airport. She transferred money. Son was in Bengaluru the whole time.',
      date: 'October 2024'
    },
    redFlags: [
      'Lip sync is slightly delayed in AI generated video',
      'Any request for money plus secrecy is a red flag',
      'Real emergency means real person accepts a callback'
    ],
    safetyTip: 'Hang up. Call back on the real saved number.',
    totalLoss: '₹156 crore reported',
    source: 'Delhi Cyber Cell Report 2024'
  },
  JOB_SCAM: {
    todayStat: 'Peak placement season — targeting freshers now',
    realCase: {
      name: 'Arjun Patel', age: 23, city: 'Ahmedabad',
      occupation: 'Engineering graduate', amountLost: '₹45,000',
      duration: '2 weeks',
      whatHappened: 'Got WhatsApp with Infosys offer letter. 6 LPA package. Paid ₹2,500 document fee then ₹8,000 training fee then ₹15,000 more fees. Total ₹45,000 lost.',
      date: 'March 2024'
    },
    redFlags: [
      'Real companies NEVER charge any joining fees',
      'Infosys TCS Wipro HR use company email not Gmail',
      'Offer without any interview is always suspicious'
    ],
    safetyTip: 'Verify jobs only on official company career portals.',
    totalLoss: '₹89 crore',
    source: 'NCCRP Job Fraud Report 2024'
  },
  LOTTERY: {
    todayStat: '12,450 cases — highest in rural areas',
    realCase: {
      name: 'Bharti Devi', age: 52, city: 'Gorakhpur',
      occupation: 'Farmer', amountLost: '₹32,000',
      duration: '1 week',
      whatHappened: 'Got SMS saying KBC lucky winner ₹25 lakh. Paid ₹5,000 GST then ₹8,000 legal fee then ₹11,000 customs. After ₹32,000 total realized it was fraud.',
      date: 'August 2024'
    },
    redFlags: [
      'You cannot win a lottery you never entered',
      'KBC only selects through official registration',
      'Any prize requiring upfront payment is always fraud'
    ],
    safetyTip: 'Block and report immediately. No real prize needs payment.',
    totalLoss: '₹105 crore',
    source: 'Cybercrime.gov.in 2024'
  },
  KYC_SCAM: {
    todayStat: 'Paytm and HDFC KYC links spreading on WhatsApp',
    realCase: {
      name: 'Deepak Mishra', age: 41, city: 'Bhopal',
      occupation: 'Shopkeeper', amountLost: '₹67,000',
      duration: '30 minutes',
      whatHappened: 'Got SMS with Paytm KYC link. Clicked link — looked exactly like Paytm. Entered Aadhaar and OTP. ₹67,000 transferred within minutes.',
      date: 'November 2024'
    },
    redFlags: [
      'Paytm KYC is always done inside the official app only',
      'paytm-kyc.tk is NOT paytm.com — check URL carefully',
      'Never enter Aadhaar on any SMS link'
    ],
    safetyTip: 'KYC is only done inside official apps. Never click SMS links.',
    totalLoss: '₹456 crore',
    source: 'NPCI KYC Fraud Alert 2024'
  }
}

export default function SpinWheel({ onClose, playerName = 'Agent' }) {
  const canvasRef    = useRef(null)
  const confettiRef  = useRef(null)
  const [segments, setSegments]     = useState(FALLBACK_SEGMENTS)
  const [spinning, setSpinning]     = useState(false)
  const [rotation, setRotation]     = useState(0)
  const [result, setResult]         = useState(null)
  const [showCard, setShowCard]     = useState(false)
  const [confetti, setConfetti]     = useState([])
  const rotationRef = useRef(0)
  const spinRef     = useRef(null)

  useEffect(() => {
    // try to load from backend
    getSpinSegments().then(data => {
      if (data && data.length === 8) setSegments(data)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    drawWheel(rotationRef.current)
  }, [segments])

  function drawWheel(rot) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx    = canvas.getContext('2d')
    const cx     = canvas.width  / 2
    const cy     = canvas.height / 2
    const radius = Math.min(cx, cy) - 10
    const total  = segments.length
    const arc    = (Math.PI * 2) / total

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // outer ring
    ctx.beginPath()
    ctx.arc(cx, cy, radius + 8, 0, Math.PI * 2)
    ctx.fillStyle = '#1a1a3a'
    ctx.fill()
    ctx.strokeStyle = '#3a3a6a'
    ctx.lineWidth   = 3
    ctx.stroke()

    // segments
    segments.forEach((seg, i) => {
      const startAngle = rot + i * arc
      const endAngle   = startAngle + arc

      // fill segment
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = seg.color
      ctx.fill()

      // segment border
      ctx.strokeStyle = 'rgba(0,0,0,0.3)'
      ctx.lineWidth   = 1.5
      ctx.stroke()

      // segment text
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(startAngle + arc / 2)

      // label background
      ctx.fillStyle   = 'rgba(0,0,0,0.35)'
      ctx.fillRect(radius * 0.38, -14, radius * 0.55, 28)

      // icon
      ctx.font      = '16px Arial'
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.fillText(seg.icon, radius * 0.52, 6)

      // label
      ctx.font      = 'bold 9.5px Arial'
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'left'
      ctx.fillText(
        seg.label.length > 12
          ? seg.label.substring(0, 12) + '…'
          : seg.label,
        radius * 0.62,
        5
      )

      ctx.restore()
    })

    // center circle
    ctx.beginPath()
    ctx.arc(cx, cy, 34, 0, Math.PI * 2)
    ctx.fillStyle = '#0a0a1a'
    ctx.fill()
    ctx.strokeStyle = '#4fc3f7'
    ctx.lineWidth   = 2.5
    ctx.stroke()

    ctx.font      = 'bold 13px Arial'
    ctx.fillStyle = '#4fc3f7'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(spinning ? '...' : 'SPIN', cx, cy)

    // pointer triangle at top
    ctx.beginPath()
    ctx.moveTo(cx,      cy - radius - 6)
    ctx.lineTo(cx - 12, cy - radius + 14)
    ctx.lineTo(cx + 12, cy - radius + 14)
    ctx.closePath()
    ctx.fillStyle   = '#ffd700'
    ctx.fill()
    ctx.strokeStyle = '#ff9800'
    ctx.lineWidth   = 1.5
    ctx.stroke()
  }

  function spin() {
    if (spinning) return
    setSpinning(true)
    setResult(null)
    setShowCard(false)

    // random 5-10 full rotations + random offset
    const extraSpins   = (Math.floor(Math.random() * 5) + 5) * Math.PI * 2
    const randomOffset = Math.random() * Math.PI * 2
    const target       = rotationRef.current + extraSpins + randomOffset

    const startTime  = Date.now()
    const duration   = 4200
    const startAngle = rotationRef.current

    if (spinRef.current) cancelAnimationFrame(spinRef.current)

    function animate() {
      const elapsed  = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // cubic ease out — fast start, slow end
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = startAngle + (target - startAngle) * eased

      rotationRef.current = current
      drawWheel(current)

      if (progress < 1) {
        spinRef.current = requestAnimationFrame(animate)
      } else {
        rotationRef.current = target
        setSpinning(false)
        findResult(target)
        launchConfetti()
      }
    }

    spinRef.current = requestAnimationFrame(animate)
  }

  function findResult(finalRotation) {
    const total  = segments.length
    const arc    = (Math.PI * 2) / total

    // normalize rotation
    let norm = finalRotation % (Math.PI * 2)
    if (norm < 0) norm += Math.PI * 2

    // pointer is at top (270 degrees = 3π/2)
    // calculate which segment is under pointer
    const pointerAngle = (Math.PI * 3 / 2 - norm + Math.PI * 2) % (Math.PI * 2)
    const index        = Math.floor(pointerAngle / arc) % total

    const landed  = segments[index]
    const eduData = EDUCATION_DATA[landed.type] || {}

    setResult({ ...landed, ...eduData })
    setTimeout(() => setShowCard(true), 400)
  }

  function launchConfetti() {
    const pieces = Array.from({ length: 45 }, (_, i) => ({
      id:     i,
      x:      Math.random() * 100,
      y:      -10,
      size:   6 + Math.random() * 8,
      color:  ['#f44336','#ff9800','#ffd700','#4caf50','#4fc3f7','#9c27b0'][
        Math.floor(Math.random() * 6)
      ],
      speedX: (Math.random() - 0.5) * 3,
      speedY: 2 + Math.random() * 3,
      rotation: Math.random() * 360
    }))
    setConfetti(pieces)
    setTimeout(() => setConfetti([]), 2800)
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>

        {/* header */}
        <div style={styles.header}>
          <div>
            <div style={{ color: '#ffd700', fontSize: '16px', fontWeight: 'bold' }}>
              🎡 Daily Scam Awareness
            </div>
            <div style={{ color: '#666', fontSize: '11px' }}>
              Spin to learn about today's scam
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {/* confetti layer */}
        <div style={{
          position: 'absolute', inset: 0,
          pointerEvents: 'none', overflow: 'hidden', zIndex: 50
        }}>
          {confetti.map(p => (
            <div key={p.id} style={{
              position: 'absolute',
              left:   `${p.x}%`,
              top:    `${p.y}%`,
              width:  p.size, height: p.size,
              background: p.color,
              borderRadius: '2px',
              transform: `rotate(${p.rotation}deg)`,
              animation: `fall 2.5s ease-in forwards`,
            }} />
          ))}
        </div>

        {/* wheel */}
        <div style={styles.wheelWrap}>
          <canvas
            ref={canvasRef}
            width={320} height={320}
            style={{ display: 'block', cursor: spinning ? 'default' : 'pointer' }}
            onClick={!spinning ? spin : undefined}
          />
        </div>

        {/* spin button */}
        {!showCard && (
          <div style={{ padding: '0 20px 16px', textAlign: 'center' }}>
            <button
              onClick={spin}
              disabled={spinning}
              style={styles.spinBtn}
            >
              {spinning ? '🌀 Spinning...' : '🎡 SPIN NOW'}
            </button>
            <div style={{ color: '#666', fontSize: '11px', marginTop: '6px' }}>
              Click wheel or button to spin
            </div>
          </div>
        )}

        {/* education card */}
        {showCard && result && (
          <div style={styles.card}>

            {/* scam type header */}
            <div style={{
              ...styles.cardHeader,
              background: result.color + '22',
              borderColor: result.color + '60'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '28px' }}>{result.icon}</span>
                <div>
                  <div style={{ color: result.color, fontWeight: 'bold', fontSize: '15px' }}>
                    {result.label}
                  </div>
                  <div style={{ color: '#f44336', fontSize: '11px' }}>
                    🚨 {result.todayStat}
                  </div>
                </div>
              </div>
            </div>

            {/* real case */}
            {result.realCase && (
              <div style={styles.caseBox}>
                <div style={styles.caseTitle}>📰 REAL CASE — {result.realCase.date}</div>
                <div style={styles.casePerson}>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>
                    {result.realCase.name}
                  </span>
                  <span style={{ color: '#aaa' }}>
                    , {result.realCase.age}, {result.realCase.city}
                  </span>
                </div>
                <div style={{ color: '#888', fontSize: '12px', marginBottom: '6px' }}>
                  {result.realCase.occupation}
                </div>
                <div style={styles.lostBox}>
                  <span style={{ color: '#f44336', fontWeight: 'bold' }}>
                    Lost: {result.realCase.amountLost}
                  </span>
                  <span style={{ color: '#888' }}>
                    {' '}in {result.realCase.duration}
                  </span>
                </div>
                <div style={styles.caseText}>
                  {result.realCase.whatHappened}
                </div>
              </div>
            )}

            {/* red flags */}
            {result.redFlags && (
              <div style={{ marginBottom: '10px' }}>
                <div style={styles.sectionTitle}>🚩 RED FLAGS:</div>
                {result.redFlags.map((flag, i) => (
                  <div key={i} style={styles.flagItem}>⚠️ {flag}</div>
                ))}
              </div>
            )}

            {/* safety tip */}
            {result.safetyTip && (
              <div style={styles.safetyBox}>
                <div style={styles.sectionTitle}>🛡️ STAY SAFE:</div>
                <div style={{ color: '#4caf50', fontSize: '13px', lineHeight: '1.5' }}>
                  {result.safetyTip}
                </div>
              </div>
            )}

            {/* source */}
            {result.source && (
              <div style={{ color: '#444', fontSize: '10px', marginBottom: '10px' }}>
                Source: {result.source} • Total loss 2024: {result.totalLoss}
              </div>
            )}

            {/* buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => { setShowCard(false); setResult(null) }}
                style={styles.spinAgainBtn}
              >
                🎡 Spin Again
              </button>
              <button onClick={onClose} style={styles.closeCardBtn}>
                ✅ Got it!
              </button>
            </div>

          </div>
        )}

      </div>

      <style>{`
        @keyframes fall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(600px) rotate(720deg); opacity: 0; }
        }
      `}</style>
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
    width: '100%', maxWidth: '380px',
    maxHeight: '92vh', overflowY: 'auto',
    position: 'relative',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    borderBottom: '1px solid #2a2a4a'
  },
  closeBtn: {
    background: 'none', border: 'none',
    color: '#666', fontSize: '18px', cursor: 'pointer'
  },
  wheelWrap: {
    display: 'flex', justifyContent: 'center',
    padding: '16px 0 8px'
  },
  spinBtn: {
    padding: '12px 32px',
    background: 'linear-gradient(135deg, #ffd700, #ff9800)',
    border: 'none', borderRadius: '25px',
    color: '#000', fontWeight: 'bold',
    fontSize: '15px', cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(255,215,0,0.3)'
  },
  card: {
    padding: '14px 16px',
    borderTop: '1px solid #2a2a4a'
  },
  cardHeader: {
    border: '1px solid',
    borderRadius: '12px',
    padding: '12px',
    marginBottom: '12px'
  },
  caseBox: {
    background: '#12122a',
    border: '1px solid #2a2a4a',
    borderRadius: '10px',
    padding: '12px',
    marginBottom: '10px'
  },
  caseTitle: {
    color: '#ff9800', fontSize: '11px',
    fontWeight: 'bold', marginBottom: '6px'
  },
  casePerson: {
    fontSize: '14px', marginBottom: '2px'
  },
  lostBox: {
    background: '#1a0a0a',
    borderRadius: '6px', padding: '6px 10px',
    fontSize: '13px', marginBottom: '8px'
  },
  caseText: {
    color: '#bbb', fontSize: '12px', lineHeight: '1.6'
  },
  sectionTitle: {
    color: '#f44336', fontSize: '11px',
    fontWeight: 'bold', marginBottom: '6px'
  },
  flagItem: {
    background: '#1a0505',
    border: '1px solid #f4433630',
    borderRadius: '7px',
    padding: '6px 10px',
    color: '#f44336',
    fontSize: '12px',
    marginBottom: '4px'
  },
  safetyBox: {
    background: '#0a1a0a',
    border: '1px solid #4caf5030',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '10px'
  },
  spinAgainBtn: {
    flex: 1, padding: '10px',
    background: '#ffd70020',
    border: '1px solid #ffd70040',
    borderRadius: '10px', color: '#ffd700',
    fontSize: '13px', cursor: 'pointer',
    fontFamily: 'inherit'
  },
  closeCardBtn: {
    flex: 1, padding: '10px',
    background: '#4caf5020',
    border: '1px solid #4caf5040',
    borderRadius: '10px', color: '#4caf50',
    fontSize: '13px', cursor: 'pointer',
    fontFamily: 'inherit'
  }
}