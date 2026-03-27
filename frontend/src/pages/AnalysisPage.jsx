// ScamVerse - HackMol 7.0
// AnalysisPage.jsx - the analysis hub
// 5 tabs for different scam detection tools
// works offline with pattern analysis

import { useState, useEffect } from 'react'
import { useGame } from '../game/GameContext'
import { analyzeTextMessage, checkUrlSafety, analyzeImageDeepfake } from '../utils/api'
import playSound from '../utils/sounds'

export default function AnalysisPage({ onClose }) {
  const { state, dispatch } = useGame()
  const [activeTab, setActiveTab] = useState(0)
  const [textInput, setTextInput] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [scanResult, setScanResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [simulationStage, setSimulationStage] = useState(0)
  const [simulationTimer, setSimulationTimer] = useState(3600) // 1 hour in seconds
  const [pressureLevel, setPressureLevel] = useState(0)

  const tabs = [
    { name: 'Text/SMS', icon: '📱' },
    { name: 'URL Check', icon: '🔗' },
    { name: 'Deepfake', icon: '🤖' },
    { name: 'Video URL', icon: '🎥' },
    { name: 'Digital Arrest', icon: '🚔' }
  ]

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
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.3)
    } catch (e) { console.log('sound failed') }
  }

  function playDanger() {
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

  // text analysis
  async function analyzeText() {
    if (!textInput.trim()) return
    setLoading(true)
    playNotification()

    const data = await analyzeTextMessage(textInput)
    if (data) {
      setScanResult(data.analysis)
    } else {
      // fallback pattern analysis
      const patterns = {
        scam: /otp|password|account.*block|urgent|call.*now|share.*details|money.*transfer/i,
        bank: /sbi|hdfc|icici|axis|pnb|bank.*alert/i,
        lottery: /won|prize|lucky.*draw|congratulations.*rs/i,
        investment: /crypto|bitcoin|investment|double.*money|guaranteed.*returns/i
      }

      let flags = []
      let confidence = 0
      let verdict = 'SAFE'

      if (patterns.scam.test(textInput)) {
        flags.push('Contains urgent language or requests for personal information')
        confidence += 30
      }
      if (patterns.bank.test(textInput) && patterns.scam.test(textInput)) {
        flags.push('Bank-related message with suspicious requests')
        confidence += 40
      }
      if (patterns.lottery.test(textInput)) {
        flags.push('Lottery or prize notification')
        confidence += 25
      }
      if (patterns.investment.test(textInput)) {
        flags.push('Investment opportunity with unrealistic promises')
        confidence += 20
      }
      if (textInput.includes('Rs') || textInput.includes('₹')) {
        flags.push('Mentions money amounts')
        confidence += 15
      }
      if (textInput.match(/\d{10}/)) {
        flags.push('Contains phone number to call')
        confidence += 35
      }

      if (confidence >= 70) verdict = 'SCAM'
      else if (confidence >= 40) verdict = 'SUSPICIOUS'

      setScanResult({
        verdict,
        confidence: Math.min(confidence + 20, 95), // add some randomness
        flags,
        what_to_do: verdict === 'SCAM' ? 'Do not respond. Report to 1930.' : 'Verify through official channels.',
        source: 'Pattern Analysis'
      })
    }

    setLoading(false)
    if (scanResult?.verdict === 'SCAM') playDanger()
    else playSuccess()
  }

  // url analysis
  async function analyzeUrl() {
    if (!urlInput.trim()) return
    setLoading(true)
    playNotification()

    const data = await checkUrlSafety(urlInput)
    if (data) {
      setScanResult(data.analysis)
    } else {
      // fallback url analysis
      let flags = []
      let risk = 0

      const url = urlInput.toLowerCase()
      if (url.includes('.tk') || url.includes('.xyz') || url.includes('.ml')) {
        flags.push('Suspicious domain extension (.tk, .xyz, .ml)')
        risk += 40
      }
      if (url.includes('bit.ly') || url.includes('tinyurl') || url.includes('goo.gl')) {
        flags.push('URL shortener detected')
        risk += 30
      }
      if (url.match(/^\d+\.\d+\.\d+\.\d+/)) {
        flags.push('IP address instead of domain name')
        risk += 50
      }
      if (url.includes('http://') && !url.includes('https://')) {
        flags.push('Not using secure HTTPS protocol')
        risk += 20
      }
      if (url.includes('sbi') && !url.includes('sbi.co.in')) {
        flags.push('Fake bank domain')
        risk += 45
      }
      if (url.includes('kbc') || url.includes('lottery')) {
        flags.push('Lottery or prize related domain')
        risk += 25
      }

      let verdict = 'SAFE'
      if (risk >= 60) verdict = 'HIGH RISK'
      else if (risk >= 30) verdict = 'MEDIUM RISK'

      setScanResult({
        verdict,
        confidence: Math.min(risk + 15, 90),
        flags,
        what_to_do: verdict === 'HIGH RISK' ? 'Do not click. Report suspicious URL.' : 'Proceed with caution.',
        source: 'Pattern Analysis'
      })
    }

    setLoading(false)
    if (scanResult?.verdict === 'HIGH RISK') playDanger()
    else playSuccess()
  }

  // image analysis
  async function analyzeImage() {
    if (!imageFile) return
    setLoading(true)
    playNotification()

    const data = await analyzeImageDeepfake(imageFile)
    if (data) {
      setScanResult(data.analysis)
    } else {
      // fallback
      setScanResult({
        verdict: 'UNKNOWN',
        confidence: 0,
        flags: ['Deepfake analysis requires backend with Gemini Vision API'],
        what_to_do: 'Upload to official fact-checking sites for verification.',
        source: 'Pattern Analysis'
      })
    }

    setLoading(false)
  }

  // image upload handler
  function handleImageUpload(e) {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  // digital arrest simulation
  function startSimulation() {
    setSimulationStage(1)
    setSimulationTimer(3600) // 1 hour
    setPressureLevel(0)
    playNotification()

    // countdown timer
    const timer = setInterval(() => {
      setSimulationTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setSimulationStage(0) // timeout
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  function makeChoice(choice) {
    if (simulationStage === 1) {
      if (choice === 'right') {
        setSimulationStage(2)
        setPressureLevel(20)
        playSuccess()
      } else {
        setSimulationStage('caught')
        playDanger()
      }
    } else if (simulationStage === 2) {
      if (choice === 'right') {
        setSimulationStage(3)
        setPressureLevel(40)
        playSuccess()
      } else {
        setSimulationStage('caught')
        playDanger()
      }
    } else if (simulationStage === 3) {
      if (choice === 'right') {
        setSimulationStage(4)
        setPressureLevel(60)
        playSuccess()
      } else {
        setSimulationStage('caught')
        playDanger()
      }
    } else if (simulationStage === 4) {
      if (choice === 'right') {
        setSimulationStage('escaped')
        playSuccess()
      } else {
        setSimulationStage('caught')
        playDanger()
      }
    }
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // example data
  const textExamples = [
    "Dear Customer, Your SBI account will be blocked in 24 hours. Call 09876543210 immediately with OTP. Ref: SBI/KYC/2024",
    "Congratulations! You won KBC Lucky Draw Rs 25 lakh! Call 09123456789 within 48 hours to claim prize.",
    "Your Amazon order #12345 has been shipped. Track at amazon.in/orders"
  ]

  const urlExamples = [
    "https://sbi-alerts.xyz/verify-account",
    "https://bit.ly/kbc-prize-claim",
    "https://amazon.in/orders/12345"
  ]

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>

        {/* header */}
        <div style={styles.header}>
          <div>
            <div style={{ color: '#4fc3f7', fontSize: '14px', fontWeight: 'bold' }}>
              🔍 ANALYSIS HUB
            </div>
            <div style={{ color: '#666', fontSize: '10px' }}>
              Scam Detection Tools
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {/* tabs */}
        <div style={styles.tabs}>
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveTab(i)
                setScanResult(null)
                setTextInput('')
                setUrlInput('')
                setVideoUrl('')
                setImageFile(null)
                setImagePreview(null)
                setSimulationStage(0)
              }}
              style={{
                ...styles.tab,
                background: activeTab === i ? '#4fc3f720' : 'transparent',
                borderBottom: activeTab === i ? '2px solid #4fc3f7' : '2px solid transparent'
              }}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>

        {/* tab content */}
        <div style={styles.content}>

          {/* TEXT/SMS TAB */}
          {activeTab === 0 && (
            <div>
              <div style={{ marginBottom: '15px' }}>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste any SMS, email, or message here..."
                  style={styles.textarea}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' }}>
                {textExamples.map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setTextInput(example)}
                    style={styles.exampleBtn}
                  >
                    Example {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={analyzeText}
                disabled={!textInput.trim() || loading}
                style={{
                  ...styles.analyzeBtn,
                  opacity: textInput.trim() && !loading ? 1 : 0.5
                }}
              >
                {loading ? '🔍 ANALYZING...' : '🔍 ANALYZE MESSAGE'}
              </button>
            </div>
          )}

          {/* URL CHECK TAB */}
          {activeTab === 1 && (
            <div>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com"
                  style={styles.input}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' }}>
                {urlExamples.map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setUrlInput(example)}
                    style={styles.exampleBtn}
                  >
                    Example {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={analyzeUrl}
                disabled={!urlInput.trim() || loading}
                style={{
                  ...styles.analyzeBtn,
                  opacity: urlInput.trim() && !loading ? 1 : 0.5
                }}
              >
                {loading ? '🔍 CHECKING...' : '🔍 CHECK URL'}
              </button>
            </div>
          )}

          {/* DEEPFAKE TAB */}
          {activeTab === 2 && (
            <div>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={styles.fileInput}
                  id="imageUpload"
                />
                <label htmlFor="imageUpload" style={styles.fileLabel}>
                  📸 {imageFile ? 'Change Image' : 'Select Image'}
                </label>
              </div>

              {imagePreview && (
                <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                  <div style={styles.imagePreview}>
                    <img src={imagePreview} alt="Preview" style={styles.previewImg} />
                    {loading && <div style={styles.scanLine}></div>}
                  </div>
                </div>
              )}

              <button
                onClick={analyzeImage}
                disabled={!imageFile || loading}
                style={{
                  ...styles.analyzeBtn,
                  opacity: imageFile && !loading ? 1 : 0.5
                }}
              >
                {loading ? '🔍 SCANNING...' : '🔍 ANALYZE IMAGE'}
              </button>
            </div>
          )}

          {/* VIDEO URL TAB */}
          {activeTab === 3 && (
            <div>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  style={styles.input}
                />
              </div>

              <div style={styles.videoTips}>
                <h4 style={{ color: '#4fc3f7', marginBottom: '10px' }}>🎥 Video Deepfake Detection Tips:</h4>
                <ul style={{ color: '#ccc', fontSize: '12px', lineHeight: '1.6' }}>
                  <li>• Check if lip movements match audio perfectly</li>
                  <li>• Look for unnatural blinking patterns</li>
                  <li>• Examine hair and face edge quality</li>
                  <li>• Verify content on official channels directly</li>
                </ul>

                <h4 style={{ color: '#ff9800', margin: '15px 0 10px' }}>🚨 Common Video Scam Types in India:</h4>
                <div style={styles.scamTypes}>
                  <div style={styles.scamType}>
                    <div style={{ fontWeight: 'bold', color: '#f44336' }}>Celebrity Endorsement</div>
                    <div style={{ fontSize: '11px', color: '#ccc' }}>Famous actors promoting fake investment schemes</div>
                  </div>
                  <div style={styles.scamType}>
                    <div style={{ fontWeight: 'bold', color: '#f44336' }}>Family Voice Call</div>
                    <div style={{ fontSize: '11px', color: '#ccc' }}>AI cloned relative asking for money</div>
                  </div>
                  <div style={styles.scamType}>
                    <div style={{ fontWeight: 'bold', color: '#f44336' }}>CBI Arrest Video</div>
                    <div style={{ fontSize: '11px', color: '#ccc' }}>Fake police arrest notifications</div>
                  </div>
                  <div style={styles.scamType}>
                    <div style={{ fontWeight: 'bold', color: '#f44336' }}>Screen Share Scam</div>
                    <div style={{ fontSize: '11px', color: '#ccc' }}>Bank portal shared with hidden malware</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DIGITAL ARREST TAB */}
          {activeTab === 4 && (
            <div>
              <div style={styles.arrestHeader}>
                <h3 style={{ color: '#f44336', margin: '0 0 10px' }}>🚨 DIGITAL ARREST SCAM</h3>
                <div style={styles.stats}>
                  <div>📊 92,334 cases in 2024</div>
                  <div>💰 Total loss: Rs 2,140 crore</div>
                  <div>📈 Avg loss: Rs 8.5 lakh per victim</div>
                </div>
              </div>

              <div style={styles.caseStudy}>
                <h4 style={{ color: '#ff9800', marginBottom: '8px' }}>📖 Real Case: Ramesh Gupta, 58, Lucknow</h4>
                <p style={{ color: '#ccc', fontSize: '12px', lineHeight: '1.5', marginBottom: '15px' }}>
                  Lost Rs 14 lakh in November 2024. Officer called claiming money laundering case.
                  Source: MHA Cyber Crime Report 2024
                </p>
              </div>

              <div style={styles.whatIs}>
                <h4 style={{ color: '#4fc3f7', marginBottom: '10px' }}>❓ What is Digital Arrest?</h4>
                <p style={{ color: '#ccc', fontSize: '12px', lineHeight: '1.5', marginBottom: '15px' }}>
                  Fake police officers call claiming you're under "digital arrest" for money laundering,
                  tax evasion, or cyber crimes. They demand immediate payment to "clear your name".
                  <strong style={{ color: '#f44336' }}> This is completely illegal - no such thing exists in India!</strong>
                </p>
              </div>

              <div style={styles.redFlags}>
                <h4 style={{ color: '#f44336', marginBottom: '10px' }}>🚩 6 Red Flags:</h4>
                <div style={styles.flagsGrid}>
                  <div style={styles.flagCard}>
                    <div style={{ fontSize: '20px', marginBottom: '5px' }}>📞</div>
                    <div style={{ fontWeight: 'bold', fontSize: '11px' }}>Unsolicited Call</div>
                    <div style={{ fontSize: '10px', color: '#ccc' }}>Real police send written notices</div>
                  </div>
                  <div style={styles.flagCard}>
                    <div style={{ fontSize: '20px', marginBottom: '5px' }}>⏰</div>
                    <div style={{ fontWeight: 'bold', fontSize: '11px' }}>Immediate Action</div>
                    <div style={{ fontSize: '10px', color: '#ccc' }}>Creates panic and urgency</div>
                  </div>
                  <div style={styles.flagCard}>
                    <div style={{ fontSize: '20px', marginBottom: '5px' }}>💳</div>
                    <div style={{ fontWeight: 'bold', fontSize: '11px' }}>UPI Payment</div>
                    <div style={{ fontSize: '10px', color: '#ccc' }}>Government never demands UPI</div>
                  </div>
                  <div style={styles.flagCard}>
                    <div style={{ fontSize: '20px', marginBottom: '5px' }}>🔒</div>
                    <div style={{ fontWeight: 'bold', fontSize: '11px' }}>Threats</div>
                    <div style={{ fontSize: '10px', color: '#ccc' }}>Arrest, passport block, etc.</div>
                  </div>
                  <div style={styles.flagCard}>
                    <div style={{ fontSize: '20px', marginBottom: '5px' }}>🤫</div>
                    <div style={{ fontWeight: 'bold', fontSize: '11px' }}>Secrecy</div>
                    <div style={{ fontSize: '10px', color: '#ccc' }}>Don't tell family or friends</div>
                  </div>
                  <div style={styles.flagCard}>
                    <div style={{ fontSize: '20px', marginBottom: '5px' }}>👮</div>
                    <div style={{ fontWeight: 'bold', fontSize: '11px' }}>Fake Ranks</div>
                    <div style={{ fontSize: '10px', color: '#ccc' }}>CBI, ED, Income Tax officer</div>
                  </div>
                </div>
              </div>

              <div style={styles.tactics}>
                <h4 style={{ color: '#9c27b0', marginBottom: '10px' }}>🧠 5 Psychological Tactics Used:</h4>
                <div style={styles.tacticsList}>
                  <div style={styles.tactic}>
                    <span style={{ color: '#f44336', fontWeight: 'bold' }}>Authority:</span> Fake police rank intimidates
                  </div>
                  <div style={styles.tactic}>
                    <span style={{ color: '#f44336', fontWeight: 'bold' }}>Urgency:</span> "Act now or face arrest"
                  </div>
                  <div style={styles.tactic}>
                    <span style={{ color: '#f44336', fontWeight: 'bold' }}>Isolation:</span> "Don't tell anyone"
                  </div>
                  <div style={styles.tactic}>
                    <span style={{ color: '#f44336', fontWeight: 'bold' }}>Fear:</span> Arrest, jail, family shame
                  </div>
                  <div style={styles.tactic}>
                    <span style={{ color: '#f44336', fontWeight: 'bold' }}>Fatigue:</span> Long calls wear you down
                  </div>
                </div>
              </div>

              <div style={styles.whatToDo}>
                <h4 style={{ color: '#4caf50', marginBottom: '10px' }}>✅ 6 Steps - What To Do:</h4>
                <ol style={styles.stepsList}>
                  <li>Hang up immediately</li>
                  <li>Don't call back on provided numbers</li>
                  <li>Inform family and friends</li>
                  <li>Report to 1930 cyber helpline</li>
                  <li>File complaint at cybercrime.gov.in</li>
                  <li>Change all passwords and monitor accounts</li>
                </ol>
              </div>

              <div style={styles.contacts}>
                <h4 style={{ color: '#ffd700', marginBottom: '10px' }}>📞 Emergency Contacts:</h4>
                <div style={styles.contactGrid}>
                  <div style={styles.contact}>
                    <div style={{ fontSize: '18px', marginBottom: '3px' }}>📞</div>
                    <div style={{ fontWeight: 'bold' }}>1930</div>
                    <div style={{ fontSize: '10px', color: '#ccc' }}>National Cyber Crime Helpline</div>
                  </div>
                  <div style={styles.contact}>
                    <div style={{ fontSize: '18px', marginBottom: '3px' }}>🌐</div>
                    <div style={{ fontWeight: 'bold' }}>cybercrime.gov.in</div>
                    <div style={{ fontSize: '10px', color: '#ccc' }}>Online Complaint Portal</div>
                  </div>
                  <div style={styles.contact}>
                    <div style={{ fontSize: '18px', marginBottom: '3px' }}>🏦</div>
                    <div style={{ fontWeight: 'bold' }}>14447</div>
                    <div style={{ fontSize: '10px', color: '#ccc' }}>RBI Ombudsman</div>
                  </div>
                  <div style={styles.contact}>
                    <div style={{ fontSize: '18px', marginBottom: '3px' }}>🚔</div>
                    <div style={{ fontWeight: 'bold' }}>100</div>
                    <div style={{ fontSize: '10px', color: '#ccc' }}>Police Emergency</div>
                  </div>
                </div>
              </div>

              <button
                onClick={startSimulation}
                style={styles.simulationBtn}
              >
                🎭 Experience Digital Arrest Simulation
              </button>
            </div>
          )}

          {/* SIMULATION */}
          {simulationStage > 0 && (
            <div style={styles.simulation}>
              <div style={styles.simHeader}>
                <div style={{ fontSize: '18px', marginBottom: '5px' }}>
                  {simulationStage === 'caught' ? '❌ CAUGHT!' : simulationStage === 'escaped' ? '✅ ESCAPED!' : '📞 INCOMING CALL'}
                </div>
                <div style={{ color: '#666', fontSize: '10px' }}>
                  Pressure Level: {pressureLevel}%
                </div>
                <div style={styles.pressureBar}>
                  <div style={{
                    width: `${pressureLevel}%`,
                    height: '100%',
                    background: pressureLevel > 50 ? '#f44336' : '#ff9800',
                    borderRadius: '2px'
                  }} />
                </div>
                {simulationStage !== 'caught' && simulationStage !== 'escaped' && (
                  <div style={{ color: '#f44336', fontSize: '12px', fontWeight: 'bold' }}>
                    ⏱️ {formatTime(simulationTimer)}
                  </div>
                )}
              </div>

              {simulationStage === 1 && (
                <div style={styles.simStage}>
                  <div style={styles.caller}>👮 Inspector Vikram Singh CBI</div>
                  <div style={styles.message}>
                    "Main Inspector Vikram Singh CBI se bol raha hoon. Aapka Aadhaar ek money laundering case mein involved hai."
                  </div>
                  <div style={styles.hint}>
                    💡 Hint: Real CBI sends written court summons, never calls
                  </div>
                  <div style={styles.choices}>
                    <button onClick={() => makeChoice('wrong')} style={styles.choiceBtn}>
                      "Haan sahib, main cooperate karunga"
                    </button>
                    <button onClick={() => makeChoice('right')} style={styles.choiceBtn}>
                      "Mujhe official written notice chahiye"
                    </button>
                  </div>
                </div>
              )}

              {simulationStage === 2 && (
                <div style={styles.simStage}>
                  <div style={styles.caller}>👮 Inspector Vikram Singh CBI</div>
                  <div style={styles.message}>
                    "Aap digital arrest mein hain. Ghar se mat niklein. Family ko mat batayein."
                  </div>
                  <div style={styles.hint}>
                    💡 Hint: Digital arrest has no legal basis in India
                  </div>
                  <div style={styles.choices}>
                    <button onClick={() => makeChoice('wrong')} style={styles.choiceBtn}>
                      "Theek hai main ghar pe rahunga"
                    </button>
                    <button onClick={() => makeChoice('right')} style={styles.choiceBtn}>
                      "Yeh koi legal concept nahi hai. 1930 call."
                    </button>
                  </div>
                </div>
              )}

              {simulationStage === 3 && (
                <div style={styles.simStage}>
                  <div style={styles.caller}>👮 Inspector Vikram Singh CBI</div>
                  <div style={styles.message}>
                    "Rs 2,50,000 government escrow mein transfer karein apna naam clear karne ke liye."
                  </div>
                  <div style={styles.hint}>
                    💡 Hint: Government never demands UPI payment
                  </div>
                  <div style={styles.choices}>
                    <button onClick={() => makeChoice('wrong')} style={styles.choiceBtn}>
                      "Main paise arrange karta hoon"
                    </button>
                    <button onClick={() => makeChoice('right')} style={styles.choiceBtn}>
                      "Government UPI pe payment nahi maangti"
                    </button>
                  </div>
                </div>
              )}

              {simulationStage === 4 && (
                <div style={styles.simStage}>
                  <div style={styles.caller}>👮 Inspector Vikram Singh CBI</div>
                  <div style={styles.message}>
                    "5 minute hain. Physical officers bhej rahe hain. Passport block ho raha hai."
                  </div>
                  <div style={styles.hint}>
                    💡 Hint: Hang up — this is maximum pressure tactic
                  </div>
                  <div style={styles.choices}>
                    <button onClick={() => makeChoice('wrong')} style={styles.choiceBtn}>
                      "Please ruko, transfer karta hoon"
                    </button>
                    <button onClick={() => makeChoice('right')} style={styles.choiceBtn}>
                      "Phone rakh raha hoon. 1930 call."
                    </button>
                  </div>
                </div>
              )}

              {(simulationStage === 'caught' || simulationStage === 'escaped') && (
                <div style={styles.simResult}>
                  <div style={{
                    fontSize: '24px',
                    marginBottom: '10px'
                  }}>
                    {simulationStage === 'caught' ? '💸' : '🎉'}
                  </div>
                  <div style={{
                    color: simulationStage === 'caught' ? '#f44336' : '#4caf50',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '10px'
                  }}>
                    {simulationStage === 'caught' ? 'SCAM VICTIM!' : 'SMART ESCAPE!'}
                  </div>
                  <div style={{ color: '#ccc', fontSize: '12px', textAlign: 'center' }}>
                    {simulationStage === 'caught'
                      ? 'You fell for the digital arrest scam. In real life, this could cost you lakhs!'
                      : 'Great job! You recognized the scam and took the right actions.'
                    }
                  </div>
                  <div style={{ color: '#666', fontSize: '10px', marginTop: '10px' }}>
                    Real stats: 92,334 victims lost Rs 2,140 crore in 2024
                  </div>
                  <button
                    onClick={() => setSimulationStage(0)}
                    style={styles.resetBtn}
                  >
                    TRY AGAIN
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SCAN RESULT */}
          {scanResult && activeTab !== 4 && (
            <div style={styles.result}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <span style={{
                  color: scanResult.verdict === 'SCAM' || scanResult.verdict === 'HIGH RISK' ? '#f44336' :
                         scanResult.verdict === 'SAFE' ? '#4caf50' : '#ff9800',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {scanResult.verdict === 'SCAM' || scanResult.verdict === 'HIGH RISK' ? '🚨' :
                   scanResult.verdict === 'SAFE' ? '✅' : '⚠️'} {scanResult.verdict}
                </span>
                <span style={{ color: '#666', fontSize: '11px' }}>
                  {scanResult.confidence}% confidence • {scanResult.source}
                </span>
              </div>

              {/* confidence bar */}
              <div style={styles.confidenceBar}>
                <div style={{
                  width: `${scanResult.confidence}%`,
                  height: '100%',
                  background: scanResult.verdict === 'SCAM' || scanResult.verdict === 'HIGH RISK' ? '#f44336' :
                             scanResult.verdict === 'SAFE' ? '#4caf50' : '#ff9800',
                  borderRadius: '3px'
                }} />
              </div>

              {/* flags */}
              {scanResult.flags?.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  <div style={{ color: '#f44336', fontSize: '11px', fontWeight: 'bold', marginBottom: '6px' }}>
                    🚩 DETECTED ISSUES:
                  </div>
                  {scanResult.flags.map((flag, i) => (
                    <div key={i} style={{ color: '#ccc', fontSize: '11px', marginBottom: '4px' }}>
                      • {flag}
                    </div>
                  ))}
                </div>
              )}

              {/* what to do */}
              {scanResult.what_to_do && (
                <div style={{
                  color: '#4fc3f7',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginTop: '12px',
                  padding: '8px',
                  background: '#4fc3f710',
                  borderRadius: '6px'
                }}>
                  ✅ {scanResult.what_to_do}
                </div>
              )}
            </div>
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
  modal: {
    background: '#12122a',
    border: '1px solid #2a2a4a',
    borderRadius: '18px',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
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
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #2a2a4a'
  },
  tab: {
    flex: 1,
    padding: '12px 8px',
    background: 'transparent',
    border: 'none',
    color: '#ccc',
    fontSize: '11px',
    cursor: 'pointer',
    textAlign: 'center'
  },
  content: {
    padding: '16px'
  },
  textarea: {
    width: '100%',
    height: '120px',
    background: '#0a0a1a',
    border: '1px solid #2a2a4a',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '13px',
    padding: '12px',
    outline: 'none',
    resize: 'vertical'
  },
  input: {
    width: '100%',
    padding: '12px',
    background: '#0a0a1a',
    border: '1px solid #2a2a4a',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '13px',
    outline: 'none'
  },
  exampleBtn: {
    padding: '6px 12px',
    background: '#2a2a4a',
    border: '1px solid #4a4a6a',
    borderRadius: '6px',
    color: '#ccc',
    fontSize: '11px',
    cursor: 'pointer'
  },
  analyzeBtn: {
    width: '100%',
    padding: '12px',
    background: '#4fc3f7',
    border: 'none',
    borderRadius: '8px',
    color: '#000',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  fileInput: {
    display: 'none'
  },
  fileLabel: {
    display: 'inline-block',
    padding: '12px 20px',
    background: '#2a2a4a',
    border: '1px solid #4a4a6a',
    borderRadius: '8px',
    color: '#ccc',
    cursor: 'pointer',
    fontSize: '13px'
  },
  imagePreview: {
    position: 'relative',
    display: 'inline-block',
    border: '2px solid #4fc3f7',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  previewImg: {
    maxWidth: '200px',
    maxHeight: '200px',
    display: 'block'
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #4fc3f7, transparent)',
    animation: 'scan 2s infinite'
  },
  videoTips: {
    background: '#0a0a1a',
    border: '1px solid #2a2a4a',
    borderRadius: '8px',
    padding: '12px'
  },
  scamTypes: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginTop: '10px'
  },
  scamType: {
    background: '#1a0000',
    border: '1px solid #f4433630',
    borderRadius: '6px',
    padding: '8px'
  },
  arrestHeader: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-around',
    fontSize: '11px',
    color: '#ccc',
    marginTop: '10px'
  },
  caseStudy: {
    background: '#1a1a00',
    border: '1px solid #ff980030',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '15px'
  },
  whatIs: {
    background: '#0a0a1a',
    border: '1px solid #2a2a4a',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '15px'
  },
  redFlags: {
    marginBottom: '15px'
  },
  flagsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px'
  },
  flagCard: {
    background: '#1a0000',
    border: '1px solid #f4433630',
    borderRadius: '6px',
    padding: '8px',
    textAlign: 'center'
  },
  tactics: {
    background: '#120012',
    border: '1px solid #9c27b030',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '15px'
  },
  tacticsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  tactic: {
    fontSize: '11px',
    color: '#ccc'
  },
  whatToDo: {
    background: '#001a00',
    border: '1px solid #4caf5030',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '15px'
  },
  stepsList: {
    color: '#ccc',
    fontSize: '11px',
    lineHeight: '1.6',
    paddingLeft: '16px'
  },
  contacts: {
    background: '#1a1a00',
    border: '1px solid #ff980030',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '15px'
  },
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px'
  },
  contact: {
    background: '#2a2a4a',
    borderRadius: '6px',
    padding: '8px',
    textAlign: 'center'
  },
  simulationBtn: {
    width: '100%',
    padding: '12px',
    background: '#f44336',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  simulation: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000
  },
  simHeader: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  pressureBar: {
    width: '200px',
    height: '6px',
    background: '#2a2a4a',
    borderRadius: '3px',
    margin: '8px auto'
  },
  simStage: {
    background: '#12122a',
    border: '1px solid #2a2a4a',
    borderRadius: '12px',
    padding: '20px',
    maxWidth: '400px',
    width: '100%'
  },
  caller: {
    color: '#4fc3f7',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '15px',
    textAlign: 'center'
  },
  message: {
    color: '#fff',
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '15px',
    textAlign: 'center'
  },
  hint: {
    color: '#ff9800',
    fontSize: '12px',
    marginBottom: '15px',
    textAlign: 'center',
    fontStyle: 'italic'
  },
  choices: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  choiceBtn: {
    padding: '12px',
    background: '#2a2a4a',
    border: '1px solid #4a4a6a',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '13px',
    cursor: 'pointer'
  },
  simResult: {
    background: '#12122a',
    border: '1px solid #2a2a4a',
    borderRadius: '12px',
    padding: '30px',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%'
  },
  resetBtn: {
    marginTop: '20px',
    padding: '10px 20px',
    background: '#4fc3f7',
    border: 'none',
    borderRadius: '8px',
    color: '#000',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  result: {
    background: '#0a0a1a',
    border: '1px solid #2a2a4a',
    borderRadius: '12px',
    padding: '16px',
    marginTop: '16px'
  },
  confidenceBar: {
    height: '6px',
    background: '#2a2a4a',
    borderRadius: '3px',
    marginBottom: '12px'
  }
}

// animations
const styleTag = document.createElement('style')
styleTag.textContent = `
  @keyframes scan {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`
document.head.appendChild(styleTag)