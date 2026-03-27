/*
 * ScamVerse - HackMol 7.0
 * SpinWheelPage.jsx - full spin wheel page
 * Jasmeen built this
 * the confetti was the hardest part lol
 */

import { useState, useEffect, useRef } from 'react'
import { useGame } from '../game/GameContext'
import { getSpinSegments } from '../utils/api'

// fallback data if backend is down
const FALLBACK_SEGMENTS = [
  {
    type: 'DIGITAL_ARREST', icon: '🚔', color: '#e53935',
    label: 'Digital Arrest',
    today_stat: '92,334 cases in India in 2024',
    real_case: {
      name: 'Ramesh Gupta', age: 58, city: 'Lucknow',
      occupation: 'Retired teacher',
      amount_lost: '₹14 lakh', duration: '6 hours on call',
      what_happened: 'Got call from CBI Inspector Sharma. Told his Aadhaar was linked to drug money. Kept on video call for 6 hours. Transferred ₹14 lakh to government escrow. Lost entire retirement savings.',
      date: 'November 2024'
    },
    how_it_works: 'Scammer poses as CBI or ED officer on video call. Claims your Aadhaar is linked to crime. Demands money to clear your name.',
    red_flags: [
      'CBI never arrests anyone digitally — no such law exists',
      'Real agencies send official written notices only',
      'Any caller who says dont tell family is manipulating you',
      'Government never takes payment on UPI'
    ],
    safety_tip: 'Hang up immediately. Call 1930. Tell your family right away.',
    total_loss_2024: '₹2,140 crore',
    source: 'MHA Cyber Crime Report 2024'
  },
  {
    type: 'UPI_TRAP', icon: '💸', color: '#f57c00',
    label: 'UPI Trap',
    today_stat: '8,923 cases last quarter alone',
    real_case: {
      name: 'Sunita Sharma', age: 34, city: 'Pune',
      occupation: 'Homemaker',
      amount_lost: '₹38,000', duration: '15 minutes',
      what_happened: 'Received ₹1 credit from unknown UPI ID. Got call saying Amazon refund of ₹1,299 needs OTP. Shared OTP. ₹38,000 debited from account within seconds.',
      date: 'October 2024'
    },
    how_it_works: 'Scammer credits ₹1 to gain trust. Then calls asking for OTP to receive a larger refund. OTP actually authorises them to debit your full balance.',
    red_flags: [
      'You NEVER need OTP to receive money — ever',
      '₹1 credit is bait to make the scam feel real',
      'Legitimate refunds are automatic — no call needed',
      'Time pressure to expire is manipulation'
    ],
    safety_tip: 'OTP only sends money OUT of your account. Never share OTP to receive money.',
    total_loss_2024: '₹340 crore',
    source: 'NPCI Fraud Report 2024'
  },
  {
    type: 'OTP_SCAM', icon: '📱', color: '#1976d2',
    label: 'OTP Scam',
    today_stat: 'Most common — 4,521 cases last month',
    real_case: {
      name: 'Mohan Lal', age: 67, city: 'Jaipur',
      occupation: 'Retired clerk',
      amount_lost: '₹1.2 lakh', duration: '20 minutes',
      what_happened: 'Got call from SBI officer. Told account would be blocked. Asked for OTP to verify. Shared 3 OTPs in panic. ₹1.2 lakh transferred in 3 transactions.',
      date: 'December 2024'
    },
    how_it_works: 'Scammer poses as bank employee. Creates urgency that account will be blocked. Asks for OTP to verify identity. Each OTP authorises a separate bank transfer.',
    red_flags: [
      'Banks NEVER ask for OTP — this is official RBI policy',
      'Real bank calls come from toll-free numbers only',
      'Account block threats are designed to cause panic',
      'Never share OTP with anyone including bank staff'
    ],
    safety_tip: 'Hang up. Call bank directly on the number printed on your debit card.',
    total_loss_2024: '₹890 crore',
    source: 'RBI Annual Report 2024'
  },
  {
    type: 'INVESTMENT_FRAUD', icon: '📈', color: '#388e3c',
    label: 'Investment Trap',
    today_stat: '2,341 fake SEBI groups shut down this year',
    real_case: {
      name: 'Priya Nair', age: 29, city: 'Bengaluru',
      occupation: 'Software Engineer',
      amount_lost: '₹4.5 lakh', duration: '3 months',
      what_happened: 'Joined WhatsApp investment group. Got real ₹12,000 profit in first month. Invested ₹4.5 lakh in month 2. Group disappeared overnight. Money completely gone.',
      date: 'September 2024'
    },
    how_it_works: 'Fake SEBI certified traders show fabricated profit screenshots. Give small real profits initially to build trust. After trust is built victim invests large amount which disappears.',
    red_flags: [
      'SEBI prohibits guaranteed return promises — illegal',
      'Real investments always carry risk — no exceptions',
      'Screenshots of profits are trivially easy to fake',
      'Pressure to invest more after initial small gains'
    ],
    safety_tip: 'Verify any advisor at sebi.gov.in before investing a single rupee.',
    total_loss_2024: '₹2,300 crore',
    source: 'SEBI Investor Bulletin 2024'
  },
  {
    type: 'DEEPFAKE', icon: '🎭', color: '#7b1fa2',
    label: 'Deepfake Call',
    today_stat: 'AI voice cloning attacks up 156% in 2024',
    real_case: {
      name: 'Kavitha Menon', age: 61, city: 'Kochi',
      occupation: 'Retired professor',
      amount_lost: '₹87,000', duration: '45 minutes',
      what_happened: 'Received WhatsApp video call from son number. Son face and voice said he was detained at Dubai airport and needed money immediately. She transferred. Son was in Bengaluru the whole time.',
      date: 'October 2024'
    },
    how_it_works: 'AI tools clone voice from 3 seconds of audio from social media. Scammers create convincing video calls targeting elderly parents of the person being impersonated.',
    red_flags: [
      'Lip sync is slightly delayed in AI generated video',
      'Any request for money plus secrecy is always red flag',
      'Real emergency means real person accepts a callback',
      'Hair edges and face boundaries look slightly unnatural'
    ],
    safety_tip: 'Hang up. Call back on the real saved number. Ask a personal question only they know.',
    total_loss_2024: '₹156 crore reported only',
    source: 'Delhi Cyber Cell Report 2024'
  },
  {
    type: 'JOB_SCAM', icon: '💼', color: '#00838f',
    label: 'Fake Job',
    today_stat: 'Peak placement season — targeting freshers now',
    real_case: {
      name: 'Arjun Patel', age: 23, city: 'Ahmedabad',
      occupation: 'Engineering graduate',
      amount_lost: '₹45,000', duration: '2 weeks',
      what_happened: 'Got WhatsApp message with Infosys offer letter. 6 LPA package. Paid ₹2,500 doc fee then ₹8,000 training fee then ₹15,000 background check. Total ₹45,000 lost. Never joined.',
      date: 'March 2024'
    },
    how_it_works: 'Fake offer letters with real company logos. Starts with small fee. Builds trust then asks for more fees. Multiple escalating charges until victim stops paying.',
    red_flags: [
      'Real companies NEVER charge any fees for joining',
      'Infosys TCS Wipro HR use company email not Gmail',
      'No legitimate company asks for UPI payment from candidates',
      'Offer without any interview process is always suspicious'
    ],
    safety_tip: 'Verify jobs only on official company career portals. Never pay any fees.',
    total_loss_2024: '₹89 crore',
    source: 'NCCRP Job Fraud Report 2024'
  },
  {
    type: 'LOTTERY', icon: '🎰', color: '#f9a825',
    label: 'Lottery Scam',
    today_stat: '12,450 cases — highest in rural areas',
    real_case: {
      name: 'Bharti Devi', age: 52, city: 'Gorakhpur',
      occupation: 'Farmer',
      amount_lost: '₹32,000', duration: '1 week',
      what_happened: 'Got SMS saying KBC Season 15 lucky winner ₹25 lakh prize. Called the number. Paid ₹5,000 GST then ₹8,000 legal fee then ₹11,000 customs fee then ₹8,000 more. Total ₹32,000 lost.',
      date: 'August 2024'
    },
    how_it_works: 'Fake KBC or government lottery SMS. Asks for small processing fee first. Each payment generates a new excuse for another fee. Victim keeps paying hoping to get the prize.',
    red_flags: [
      'You cannot win a lottery you never entered',
      'KBC selects contestants only through official registration',
      'Any prize that requires upfront payment is always fraud',
      'Government schemes never ask for GST or fees via SMS'
    ],
    safety_tip: 'Block and report the number. No legitimate prize ever requires upfront payment.',
    total_loss_2024: '₹105 crore',
    source: 'Cybercrime.gov.in Database 2024'
  },
  {
    type: 'KYC_SCAM', icon: '🪪', color: '#d84315',
    label: 'KYC Fraud',
    today_stat: 'Paytm and HDFC KYC scam links spreading now',
    real_case: {
      name: 'Deepak Mishra', age: 41, city: 'Bhopal',
      occupation: 'Shopkeeper',
      amount_lost: '₹67,000', duration: '30 minutes',
      what_happened: 'Got SMS with Paytm KYC link. Clicked and it looked exactly like Paytm. Entered Aadhaar and OTP on the fake site. ₹67,000 from linked bank account transferred within minutes.',
      date: 'November 2024'
    },
    how_it_works: 'Fake KYC websites that look identical to real apps. SMS with link claims account will be blocked. Victim enters Aadhaar plus OTP on fake site. Scammer uses these to complete fraudulent transactions.',
    red_flags: [
      'Paytm KYC is always done inside the official app only',
      'Check URL carefully — paytm-kyc.tk is NOT paytm.com',
      'Never enter Aadhaar on any link received via SMS',
      'Real KYC never needs OTP and Aadhaar together'
    ],
    safety_tip: 'KYC is only done inside official apps. Never click SMS links for KYC updates.',
    total_loss_2024: '₹456 crore',
    source: 'NPCI KYC Fraud Alert 2024'
  }
]

export default function SpinWheelPage({ playerName }) {
  const { dispatch } = useGame()
  const canvasRef   = useRef(null)
  const confettiRef = useRef(null)

  const [segments, setSegments]       = useState(FALLBACK_SEGMENTS)
  const [spinning, setSpinning]       = useState(false)
  const [rotation, setRotation]       = useState(0)
  const [result, setResult]           = useState(null)
  const [showCard, setShowCard]       = useState(false)
  const [confetti, setConfetti]       = useState([])
  const rotationRef                   = useRef(0)
  const animRef                       = useRef(null)

  // load real segments from backend
  useEffect(() => {
    getSpinSegments().then(data => {
      if (data && data.length === 8) setSegments(data)
    }).catch(() => {})
  }, [])

  // draw wheel on canvas
  useEffect(() => {
    drawWheel(rotation)
  }, [rotation, segments])

  function drawWheel(rot) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx  = canvas.getContext('2d')
    const cx   = canvas.width / 2
    const cy   = canvas.height / 2
    const r    = cx - 10
    const seg  = (2 * Math.PI) / segments.length

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // outer ring shadow
    ctx.shadowColor = 'rgba(0,0,0,0.5)'
    ctx.shadowBlur  = 15
    ctx.beginPath()
    ctx.arc(cx, cy, r + 4, 0, 2 * Math.PI)
    ctx.fillStyle = '#1a1a2e'
    ctx.fill()
    ctx.shadowBlur = 0

    // draw each segment
    segments.forEach((seg_data, i) => {
      const startAngle = rot + i * seg
      const endAngle   = rot + (i + 1) * seg
      const midAngle   = rot + (i + 0.5) * seg

      // segment fill
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = seg_data.color
      ctx.fill()

      // segment border
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, startAngle, endAngle)
      ctx.closePath()
      ctx.strokeStyle = 'rgba(0,0,0,0.3)'
      ctx.lineWidth   = 2
      ctx.stroke()

      // icon text
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(midAngle)
      ctx.textAlign    = 'right'
      ctx.textBaseline = 'middle'
      ctx.font         = '20px Arial'
      ctx.fillText(seg_data.icon, r - 12, 0)
      ctx.restore()

      // label text
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(midAngle)
      ctx.textAlign    = 'right'
      ctx.textBaseline = 'middle'
      ctx.font         = 'bold 11px Arial'
      ctx.fillStyle    = 'rgba(255,255,255,0.9)'
      ctx.fillText(seg_data.label, r - 38, 0)
      ctx.restore()
    })

    // center circle
    ctx.beginPath()
    ctx.arc(cx, cy, 32, 0, 2 * Math.PI)
    ctx.fillStyle = '#0a0a1a'
    ctx.fill()
    ctx.strokeStyle = '#ffd700'
    ctx.lineWidth   = 3
    ctx.stroke()

    // center text
    ctx.fillStyle    = '#ffd700'
    ctx.font         = 'bold 12px Arial'
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('SPIN', cx, cy)

    // outer border ring
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, 2 * Math.PI)
    ctx.strokeStyle = '#ffd700'
    ctx.lineWidth   = 4
    ctx.stroke()
  }

  function spin() {
    if (spinning) return
    setSpinning(true)
    setShowCard(false)
    setResult(null)

    // random 5-10 full rotations + random landing
    const extraSpins  = (5 + Math.floor(Math.random() * 5)) * 2 * Math.PI
    const randomLand  = Math.random() * 2 * Math.PI
    const targetRot   = rotationRef.current + extraSpins + randomLand
    const startRot    = rotationRef.current
    const duration    = 4000
    const startTime   = performance.now()

    function easeOut(t) {
      return 1 - Math.pow(1 - t, 3)
    }

    function animFrame(now) {
      const elapsed  = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased    = easeOut(progress)
      const current  = startRot + (targetRot - startRot) * eased

      rotationRef.current = current
      setRotation(current)
      drawWheel(current)

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animFrame)
      } else {
        // spin finished
        rotationRef.current = targetRot
        setSpinning(false)

        // figure out which segment landed
        const segAngle    = (2 * Math.PI) / segments.length
        const normalized  = (((-targetRot % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI))
        const index       = Math.floor(normalized / segAngle) % segments.length
        const landed      = segments[index]

        setResult(landed)

        // give xp for spinning
        dispatch({ type: 'CORRECT_ANSWER', payload: 50 })

        // confetti
        launchConfetti()

        // show card after small delay
        setTimeout(() => setShowCard(true), 600)
      }
    }

    animRef.current = requestAnimationFrame(animFrame)
  }

  // cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  function launchConfetti() {
    const pieces = []
    const colors = [
      '#f44336','#ff9800','#ffd700','#4caf50',
      '#4fc3f7','#9c27b0','#e91e63','#00bcd4'
    ]
    for (let i = 0; i < 60; i++) {
      pieces.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 8,
        speed: 2 + Math.random() * 4,
        drift: (Math.random() - 0.5) * 2,
        rotation: Math.random() * 360
      })
    }
    setConfetti(pieces)
    setTimeout(() => setConfetti([]), 3000)
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 52px)',
      background: '#0a0a1a',
      fontFamily: 'Arial, sans-serif',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* confetti overlay */}
      {confetti.map(p => (
        <div
          key={p.id}
          style={{
            position: 'fixed',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            borderRadius: '2px',
            transform: `rotate(${p.rotation}deg)`,
            animation: `fall ${3 / p.speed}s linear forwards`,
            zIndex: 999,
            pointerEvents: 'none'
          }}
        />
      ))}

      <style>{`
        @keyframes fall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* header */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ color: '#ffd700', fontSize: '22px', fontWeight: 'bold' }}>
          🎡 Daily Scam Awareness
        </div>
        <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
          Spin to learn about today's scam alert
        </div>
      </div>

      {/* today's stat bar */}
      <div style={{
        background: '#1a0a0a',
        border: '1px solid #f4433630',
        borderRadius: '10px',
        padding: '8px 14px',
        textAlign: 'center',
        marginBottom: '16px',
        fontSize: '12px',
        color: '#f44336'
      }}>
        ⚠️ India lost <strong style={{ color: '#ff9800' }}>₹11,333 crore</strong> to cyber fraud in 2023 — Source: MHA Annual Report
      </div>

      {/* wheel + button */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '20px'
      }}>

        {/* pointer triangle */}
        <div style={{
          width: 0, height: 0,
          borderLeft: '12px solid transparent',
          borderRight: '12px solid transparent',
          borderTop: '22px solid #ffd700',
          filter: 'drop-shadow(0 0 6px #ffd700)',
          zIndex: 10
        }} />

        {/* canvas wheel */}
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          style={{
            borderRadius: '50%',
            boxShadow: '0 0 30px rgba(255,215,0,0.2)',
            cursor: spinning ? 'default' : 'pointer'
          }}
          onClick={spin}
        />

        {/* spin button */}
        <button
          onClick={spin}
          disabled={spinning}
          style={{
            padding: '14px 40px',
            background: spinning ? '#1a1a2e' : '#ffd700',
            border: 'none',
            borderRadius: '30px',
            color: spinning ? '#666' : '#0a0a1a',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: spinning ? 'not-allowed' : 'pointer',
            boxShadow: spinning ? 'none' : '0 0 20px rgba(255,215,0,0.4)',
            transition: 'all 0.2s',
            fontFamily: 'Arial, sans-serif'
          }}
        >
          {spinning ? '🌀 Spinning...' : '🎡 SPIN NOW'}
        </button>

        <div style={{ color: '#666', fontSize: '11px' }}>
          +50 XP for spinning • Learn a new scam every day
        </div>

      </div>

      {/* result education card */}
      {showCard && result && (
        <div style={{
          background: '#12122a',
          border: `2px solid ${result.color}`,
          borderRadius: '18px',
          padding: '20px',
          maxWidth: '480px',
          margin: '0 auto',
          animation: 'slideUp 0.4s ease-out',
          boxShadow: `0 0 20px ${result.color}33`
        }}>

          {/* card header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '14px',
            paddingBottom: '14px',
            borderBottom: `1px solid ${result.color}40`
          }}>
            <div style={{ fontSize: '36px' }}>{result.icon}</div>
            <div>
              <div style={{
                color: '#ff9800',
                fontSize: '11px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                🚨 TODAY'S SCAM ALERT
              </div>
              <div style={{
                color: '#fff',
                fontSize: '20px',
                fontWeight: 'bold'
              }}>
                {result.label}
              </div>
              <div style={{ color: result.color, fontSize: '12px' }}>
                {result.today_stat}
              </div>
            </div>
          </div>

          {/* real case */}
          <div style={{
            background: '#0a0a1a',
            border: '1px solid #2a2a4a',
            borderRadius: '12px',
            padding: '14px',
            marginBottom: '14px'
          }}>
            <div style={{
              color: '#f44336',
              fontSize: '11px',
              fontWeight: 'bold',
              marginBottom: '8px',
              textTransform: 'uppercase'
            }}>
              📰 Real Case — {result.real_case.date}
            </div>
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '8px',
              flexWrap: 'wrap'
            }}>
              <span style={tagStyle('#4fc3f7')}>
                👤 {result.real_case.name}, {result.real_case.age}
              </span>
              <span style={tagStyle('#ff9800')}>
                📍 {result.real_case.city}
              </span>
              <span style={tagStyle('#f44336')}>
                💸 Lost {result.real_case.amount_lost}
              </span>
              <span style={tagStyle('#9c27b0')}>
                ⏱️ {result.real_case.duration}
              </span>
            </div>
            <div style={{
              color: '#ccc',
              fontSize: '13px',
              lineHeight: '1.6'
            }}>
              {result.real_case.what_happened}
            </div>
          </div>

          {/* how it works */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{
              color: '#4fc3f7',
              fontSize: '12px',
              fontWeight: 'bold',
              marginBottom: '6px'
            }}>
              HOW THIS SCAM WORKS:
            </div>
            <div style={{
              color: '#aaa',
              fontSize: '13px',
              lineHeight: '1.6'
            }}>
              {result.how_it_works}
            </div>
          </div>

          {/* red flags */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{
              color: '#f44336',
              fontSize: '12px',
              fontWeight: 'bold',
              marginBottom: '8px'
            }}>
              🚩 RED FLAGS:
            </div>
            {result.red_flags.map((flag, i) => (
              <div key={i} style={{
                background: '#1a0505',
                border: '1px solid #f4433630',
                borderRadius: '8px',
                padding: '7px 12px',
                color: '#f44336',
                fontSize: '12px',
                marginBottom: '5px'
              }}>
                ⚠️ {flag}
              </div>
            ))}
          </div>

          {/* safety tip */}
          <div style={{
            background: '#0a1a0a',
            border: '1px solid #4caf5040',
            borderRadius: '12px',
            padding: '12px',
            marginBottom: '14px'
          }}>
            <div style={{
              color: '#4caf50',
              fontSize: '12px',
              fontWeight: 'bold',
              marginBottom: '4px'
            }}>
              🛡️ STAY SAFE:
            </div>
            <div style={{ color: '#ccc', fontSize: '13px' }}>
              {result.safety_tip}
            </div>
          </div>

          {/* total loss + source */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 0',
            borderTop: '1px solid #2a2a4a',
            marginBottom: '14px'
          }}>
            <div>
              <div style={{ color: '#666', fontSize: '10px' }}>
                Total loss in India 2024
              </div>
              <div style={{
                color: '#f44336',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                {result.total_loss_2024}
              </div>
            </div>
            <div style={{
              color: '#555',
              fontSize: '10px',
              textAlign: 'right'
            }}>
              Source:<br />
              {result.source}
            </div>
          </div>

          {/* action buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShowCard(false)}
              style={{
                flex: 1,
                padding: '12px',
                background: '#ffd70020',
                border: '1px solid #ffd70040',
                borderRadius: '12px',
                color: '#ffd700',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'Arial, sans-serif'
              }}
            >
              🎡 Spin Again
            </button>
            <button
              onClick={() => {
                // go back to game
                dispatch({ type: 'SET_VIEW', payload: 'game' })
              }}
              style={{
                flex: 1,
                padding: '12px',
                background: '#4fc3f720',
                border: '1px solid #4fc3f740',
                borderRadius: '12px',
                color: '#4fc3f7',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'Arial, sans-serif'
              }}
            >
              🏙️ Back to City
            </button>
          </div>

          {/* emergency */}
          <div style={{
            marginTop: '12px',
            textAlign: 'center',
            padding: '10px',
            background: '#1a0a0a',
            border: '1px solid #f4433630',
            borderRadius: '10px'
          }}>
            <span style={{ color: '#f44336', fontSize: '12px', fontWeight: 'bold' }}>
              🆘 Cyber fraud helpline:
            </span>
            <span style={{
              color: '#ffd700',
              fontSize: '18px',
              fontWeight: 'bold',
              marginLeft: '8px'
            }}>
              1930
            </span>
          </div>

        </div>
      )}

      {/* segment list at bottom */}
      {!showCard && (
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div style={{
            color: '#666',
            fontSize: '11px',
            textAlign: 'center',
            marginBottom: '12px'
          }}>
            8 types of scams you might face today
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px'
          }}>
            {segments.map(seg => (
              <div key={seg.type} style={{
                background: seg.color + '15',
                border: `1px solid ${seg.color}40`,
                borderRadius: '10px',
                padding: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '20px' }}>{seg.icon}</div>
                <div style={{
                  color: '#ccc',
                  fontSize: '9px',
                  marginTop: '4px',
                  lineHeight: '1.3'
                }}>
                  {seg.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

// small helper for tags
function tagStyle(color) {
  return {
    background: color + '20',
    border: `1px solid ${color}40`,
    borderRadius: '20px',
    padding: '3px 10px',
    color: color,
    fontSize: '11px'
  }
}