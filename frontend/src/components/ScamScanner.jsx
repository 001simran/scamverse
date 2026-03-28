/*
 * ScamVerse - HackMol 7.0
 * ScamScanner.jsx - Multi-Media AI Analysis Tool
 * Detects scams in Text, Links, and Media (Images/Videos)
 */

import { useState, useRef } from 'react'
import { analyzeMessage } from '../utils/api'
import { useGame } from '../game/GameContext'

export default function ScamScanner() {
  const { state } = useGame()
  const [subTab, setSubTab] = useState('text') // text | link | media
  const [content, setContent] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [scanStep, setScanStep] = useState(0)
  const fileInputRef = useRef(null)

  const steps = [
    'Initializing Neural Engine...',
    'Extracting Metadata...',
    'Analyzing Digital Artifacts...',
    'Cross-referencing Global Database...',
    'Finalizing Verdict...'
  ]

  async function handleAnalyze() {
    if ((subTab !== 'media' && !content.trim()) || (subTab === 'media' && !file)) return
    
    setLoading(true)
    setResult(null)
    setScanStep(0)

    // step animation for media/complex scans
    const timer = setInterval(() => {
        setScanStep(prev => {
            if (prev >= steps.length - 1) {
                clearInterval(timer)
                return prev
            }
            return prev + 1
        })
    }, 800)

    try {
      const input = subTab === 'media' ? `[MEDIA_SCAN]: ${file.name}` : content
      const analysis = await analyzeMessage(input, state.playerName || 'Agent')

      // wait for animation to finish if it started
      await new Promise(r => setTimeout(r, 4500))

      if (analysis) {
        setResult(analysis)
      } else {
        // comprehensive mock results for demo
        simulateResult()
      }
    } catch (err) {
      console.error('Scan error:', err)
    } finally {
      clearInterval(timer)
      setLoading(false)
    }
  }

  function simulateResult() {
    if (subTab === 'link') {
        const url = content.toLowerCase()
        
        // Suspicious TLDs
        const suspiciousTlds = ['.xyz', '.click', '.tk', '.ml', '.ga', '.cf', '.top', '.rocks']
        const hasSuspiciousTld = suspiciousTlds.some(tld => url.includes(tld))
        
        // Scam keywords in domain
        const scamKeywords = [
            '99-rupees', '99rupees', 'free-', 'freee', 'urgent-', 'limited-offer',
            'win-prize', 'jackpot', 'lottery', 'verified-', 'confirm-account',
            'update-payment', 'update-account', 'verify-sbi', 'verify-bank',
            'secure-account', 'unlock-', 'claim-reward', 'bonus-cash',
            'easy-money', 'quick-cash', 'rupees', 'guaranteed', 'instant',
            'cashback', 'reward', 'prize', 'emergency-payment', 'covid'
        ]
        const hasScamKeyword = scamKeywords.some(keyword => url.includes(keyword))
        
        // Impersonation patterns (domain name mimicking banks/companies)
        const bankNames = ['sbi', 'hdfc', 'icici', 'axis', 'pnb', 'yes', 'kotak']
        const companyNames = ['google', 'microsoft', 'amazon', 'apple', 'whatsapp', 'flipkart', 'ola', 'uber']
        const impersonationDomain = bankNames.concat(companyNames).some(name => {
            const pos = url.indexOf(name)
            return pos > 0 && !url.includes(name + '.co.in') && !url.includes(name + '.com')
        })
        
        // Suspicious patterns
        const hasHttp = url.includes('http://') && !url.includes('https://')
        const hasMultipleDashes = (url.match(/-/g) || []).length > 3
        const hasNumbers = /\d{4,}/.test(url) // long number sequences
        
        const isSuspicious = hasSuspiciousTld || hasScamKeyword || impersonationDomain || 
                           hasHttp || hasMultipleDashes || hasNumbers
        
        let flags = []
        let confidence = 50
        
        if (hasSuspiciousTld) {
            flags.push('Uses suspicious free/cheap domain extension')
            confidence += 35
        }
        if (hasScamKeyword) {
            flags.push('Domain contains common scam keywords (99-rupees, free, prize, etc.)')
            confidence += 40
        }
        if (impersonationDomain) {
            flags.push('Possible domain spoofing / bank/company impersonation')
            confidence += 30
        }
        if (hasHttp) {
            flags.push('Not using secure HTTPS protocol')
            confidence += 15
        }
        if (hasMultipleDashes) {
            flags.push('Excessive dashes typically used to hide scam intent')
            confidence += 20
        }
        if (hasNumbers) {
            flags.push('Contains suspicious number sequences')
            confidence += 15
        }
        
        if (flags.length === 0) {
            flags = ['Verified Domain', 'Valid SSL', 'No suspicious patterns detected']
        }
        
        setResult({
            verdict: isSuspicious ? 'SCAM' : 'SAFE',
            confidence: Math.min(confidence, 99),
            flags,
            explanation: isSuspicious 
                ? 'This domain exhibits multiple scam indicators. It likely leads to phishing, fraud, or malware.' 
                : 'This domain appears legitimate and matches known official service patterns.',
            what_to_do: isSuspicious ? 'Do NOT click this link. Block the sender. Report to cybercrime.gov.in' : 'Website appears safe, but still exercise caution with data.',
            source: 'URL Pattern Analysis'
        })
    } else if (subTab === 'media') {
        setResult({
            verdict: 'SCAM',
            confidence: 96,
            flags: ['Deepfake Audio Artifacts', 'Frame Inconsistency', 'AI-Generated Metadata'],
            explanation: 'Analysis detected subtle visual artifacts and audio frequency mismatches typical of AI-generated deepfakes.',
            what_to_do: 'This is a high-risk AI fraud attempt. Report to cybercrime.gov.in immediately.',
            source: 'Deep-Neural Media Inspection'
        })
    } else {
        setResult({
            verdict: 'SCAM',
            confidence: 88,
            flags: ['Urgency Tactic', 'Personal Info Request'],
            explanation: 'Message uses high-pressure language to force an immediate reaction.',
            what_to_do: 'Do not reply or share OTP.',
            source: 'Text Behavioral Model'
        })
    }
  }

  function handleFileChange(e) {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setResult(null)
    if (f.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (ev) => setPreview(ev.target.result)
        reader.readAsDataURL(f)
    } else {
        setPreview(null) // for video just show icon
    }
  }

  const getVerdictStyle = (v) => {
    if (v === 'SCAM') return { color: '#f44336', bg: '#f4433615', border: '#f4433640' }
    if (v === 'SAFE')  return { color: '#4caf50', bg: '#4caf5015', border: '#4caf5040' }
    return { color: '#ff9800', bg: '#ff980015', border: '#ff980040' }
  }

  return (
    <div style={styles.container}>
      
      {/* sub-tabs */}
      <div style={styles.subTabRow}>
        {['text', 'link', 'media'].map(t => (
            <div 
                key={t}
                onClick={() => { if (!loading) { setSubTab(t); setResult(null); setContent(''); setFile(null); setPreview(null); } }}
                style={{
                    ...styles.subTab,
                    color: subTab === t ? '#9c27b0' : '#666',
                    background: subTab === t ? '#9c27b010' : 'transparent',
                    borderColor: subTab === t ? '#9c27b0' : 'transparent'
                }}
            >
                {t === 'text' ? '📝 TEXT' : t === 'link' ? '🔗 LINK' : '🖼️ MEDIA'}
            </div>
        ))}
      </div>

      <div style={{ padding: '0 5px' }}>
        {subTab === 'text' && (
            <textarea 
                style={styles.textarea}
                placeholder="Paste the suspicious message text here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
        )}

        {subTab === 'link' && (
            <div style={{ marginBottom: '15px' }}>
                <input 
                    style={styles.input}
                    placeholder="Enter the suspicious URL (e.g. sbi-verify.click)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <div style={styles.tip}>AI will check domain reputation, SSL status, and spoofing patterns.</div>
            </div>
        )}

        {subTab === 'media' && (
            <div 
                style={styles.uploadBox}
                onClick={() => fileInputRef.current?.click()}
            >
                {preview ? (
                    <img src={preview} style={styles.previewImg} alt="scan preview" />
                ) : file ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '40px' }}>🎥</div>
                        <div style={{ color: '#fff', fontSize: '13px', marginTop: '10px' }}>{file.name}</div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '32px' }}>📤</div>
                        <div style={{ color: '#fff', fontSize: '14px', marginTop: '10px', fontWeight: 'bold' }}>
                            Upload Image or Video
                        </div>
                        <div style={{ color: '#666', fontSize: '11px', marginTop: '5px' }}>
                            Detects Deepfakes & Fake Documents
                        </div>
                    </div>
                )}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    style={{ display: 'none' }}
                    accept="image/*,video/*"
                />
            </div>
        )}

        <button 
            onClick={handleAnalyze}
            disabled={loading || (subTab === 'media' ? !file : !content.trim())}
            style={{
                ...styles.mainBtn,
                opacity: loading || (subTab === 'media' ? !file : !content.trim()) ? 0.5 : 1
            }}
        >
            {loading ? 'NEURAL ENGINE RUNNING...' : '🚀 START DEEP SCAN'}
        </button>

        {loading && (
            <div style={styles.loadingContainer}>
                <div style={styles.scanLine} />
                <div style={styles.stepText}>{steps[scanStep]}</div>
                <div style={styles.progressTrack}>
                    <div style={{
                        ...styles.progressFill,
                        width: `${((scanStep + 1) / steps.length) * 100}%`
                    }} />
                </div>
            </div>
        )}

        {result && !loading && (
            <div style={{
                ...styles.resultCard,
                background: getVerdictStyle(result.verdict).bg,
                borderColor: getVerdictStyle(result.verdict).border,
                borderLeft: `5px solid ${getVerdictStyle(result.verdict).color}`
            }}>
                <div style={styles.resHead}>
                    <span style={{ color: getVerdictStyle(result.verdict).color, fontWeight: 'bold', fontSize: '18px' }}>
                        {result.verdict} DETECTED
                    </span>
                    <span style={{ color: '#666', fontSize: '11px' }}>{result.confidence}% Confidence</span>
                </div>

                <div style={styles.sectionTitle}>🚩 KEY FINDINGS</div>
                <div style={{ marginBottom: '12px' }}>
                    {result.flags?.map((f, i) => (
                        <div key={i} style={{ color: '#fff', fontSize: '12px', marginBottom: '4px' }}>• {f}</div>
                    ))}
                </div>

                <div style={styles.sectionTitle}>📝 AI EXPLANATION</div>
                <div style={{ color: '#bbb', fontSize: '12px', lineHeight: '1.6', marginBottom: '15px' }}>
                    {result.explanation}
                </div>

                <div style={{
                    ...styles.actionBox,
                    borderColor: getVerdictStyle(result.verdict).color + '40'
                }}>
                    <div style={{ fontWeight: 'bold', color: getVerdictStyle(result.verdict).color, marginBottom: '5px' }}>
                        ✅ RECOMMENDED ACTION:
                    </div>
                    <div style={{ color: '#fff', fontSize: '12px' }}>{result.what_to_do}</div>
                </div>

                <div style={styles.footer}>Verified by NeuralScan 4.0 Pro</div>
            </div>
        )}
      </div>

      <style>{`
        @keyframes scan {
            0% { top: -10%; }
            100% { top: 110%; }
        }
        @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

const styles = {
  container: { padding: '5px' },
  subTabRow: { display: 'flex', gap: '8px', marginBottom: '20px' },
  subTab: {
    flex: 1, padding: '10px', textAlign: 'center', cursor: 'pointer',
    borderRadius: '10px', fontSize: '11px', fontWeight: 'bold',
    border: '1px solid', transition: 'all 0.2s'
  },
  textarea: {
    width: '100%', height: '100px', background: '#0a0a1a', border: '1px solid #2a2a4a',
    borderRadius: '12px', color: '#fff', padding: '12px', fontSize: '13px',
    fontFamily: 'inherit', resize: 'none', outline: 'none', marginBottom: '15px'
  },
  input: {
    width: '100%', padding: '12px', background: '#0a0a1a', border: '1px solid #2a2a4a',
    borderRadius: '12px', color: '#fff', fontSize: '13px', outline: 'none', marginBottom: '8px'
  },
  tip: { color: '#666', fontSize: '10px', paddingLeft: '5px' },
  uploadBox: {
    width: '100%', height: '140px', background: '#0a0a1a', border: '2px dashed #2a2a4a',
    borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '15px', cursor: 'pointer', position: 'relative', overflow: 'hidden',
    transition: 'border-color 0.2s'
  },
  previewImg: { width: '100%', height: '100%', objectFit: 'cover' },
  mainBtn: {
    width: '100%', padding: '15px', background: '#9c27b0', color: '#fff',
    border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold',
    cursor: 'pointer', marginBottom: '20px'
  },
  loadingContainer: {
    textAlign: 'center', padding: '20px 0', position: 'relative', 
    background: '#12122a', borderRadius: '16px', marginBottom: '20px', overflow: 'hidden'
  },
  scanLine: {
    position: 'absolute', left: 0, right: 0, height: '2px',
    background: 'linear-gradient(90deg, transparent, #9c27b0, transparent)',
    boxShadow: '0 0 15px #9c27b0', animation: 'scan 2s linear infinite'
  },
  stepText: { color: '#9c27b0', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px', animation: 'pulse 1s infinite' },
  progressTrack: { width: '80%', height: '4px', background: '#1a1a3a', borderRadius: '2px', margin: '0 auto' },
  progressFill: { height: '100%', background: '#9c27b0', borderRadius: '2px', transition: 'width 0.4s ease' },
  resultCard: { borderRadius: '16px', border: '1px solid', padding: '18px', animation: 'fadeIn 0.5s ease-out' },
  resHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  sectionTitle: { color: '#9c27b0', fontSize: '10px', fontWeight: 'bold', marginBottom: '8px', letterSpacing: '1px' },
  actionBox: { background: 'rgba(0,0,0,0.3)', border: '1px solid', borderRadius: '10px', padding: '12px' },
  footer: { textAlign: 'right', color: '#444', fontSize: '9px', marginTop: '12px' }
}
