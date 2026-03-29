// PhoneSimulator.jsx
// THE "EXCEPTIONAL" FEATURE — ScamVerse's biggest differentiator.
// Simulates EXACTLY how a scam arrives on a real phone:
// WhatsApp, SMS, or Incoming Call. Elders already know these UIs.

import React, { useState, useEffect, useRef } from 'react'
import { useGame } from '../game/GameContext'
import './PhoneSimulator.css'

const SCENARIOS = [
  {
    id: 'whatsapp_otp',
    type: 'whatsapp',
    contact: { name: 'SBI Bank 🏦', number: '+91-80-4567-8901', avatar: '🏦', isVerified: false },
    title: { en: 'OTP Scam via WhatsApp', hi: 'वॉट्सऐप पर OTP स्कैम' },
    messages: [
      { from: 'them', text: { en: 'Dear Customer, your SBI account access is temporarily blocked. Verify NOW to avoid permanent closure.', hi: 'प्रिय ग्राहक, आपका SBI खाता ब्लॉक कर दिया गया है। स्थायी रूप से बंद होने से बचने के लिए अभी वेरिफाई करें।' }, time: '09:12 AM', delay: 0 },
      { from: 'them', text: { en: 'Click here to verify: http://sbi-verify.update/login ⚠️', hi: 'वेरिफाई करने के लिए यहाँ क्लिक करें: http://sbi-verify.update/login ⚠️' }, time: '09:12 AM', delay: 1500 },
      { from: 'them', text: { en: 'Your OTP is: 847293. Share with our officer to unlock.', hi: 'आपका OTP 847293 है। खाता अनलॉक करने के लिए इसे हमारे अधिकारी के साथ शेयर करें।' }, time: '09:13 AM', delay: 3000 },
    ],
    redFlags: {
      en: [
        '🚩 Real banks NEVER ask for OTP over WhatsApp',
        '🚩 The link domain is "sbi-verify.update" — NOT sbi.co.in',
        '🚩 An unverified number (no blue tick) claiming to be SBI',
      ],
      hi: [
        '🚩 असली बैंक वॉट्सऐप पर कभी OTP नहीं मांगते',
        '🚩 लिंक "sbi-verify.update" है, आधिकारिक sbi.co.in नहीं',
        '🚩 बिना ब्लू टिक वाला अनवैरिफाइड नंबर',
      ]
    },
    choices: [
      { text: { en: '✅ Block & Report. Banks never ask OTP on WhatsApp.', hi: '✅ ब्लॉक करें। बैंक कभी OTP नहीं मांगते।' }, correct: true, feedback: { en: 'Perfect! You protected yourself from account takeover.', hi: 'बहुत बढ़िया! आपने अपना खाता सुरक्षित कर लिया।' } },
      { text: { en: '❌ Share the OTP to unblock my account.', hi: '❌ खाता अनलॉक करने के लिए OTP शेयर करें।' }, correct: false, feedback: { en: 'DANGER! Sharing this OTP gives scammers full access to your bank account.', hi: 'खतरा! OTP शेयर करने से ठगों को आपका खाता मिल जाएगा।' } },
    ]
  },
  {
    id: 'incoming_call',
    type: 'call',
    contact: { name: 'CBI Officer (Mumbai)', number: '+91-98765-00012', avatar: '👮', isVerified: false },
    title: { en: 'Digital Arrest — Fake Police Call', hi: 'डिजिटल अरेस्ट — नकली पुलिस कॉल' },
    callScript: [
      { speaker: 'them', line: { en: '"Namaskar! Main CBI Officer Sharma bol raha hoon. Aapka Aadhar number ek money laundering case mein mila hai."', hi: '"नमस्कार! मैं CBI ऑफिसर बोल रहा हूँ। आपका आधार एक मनी लॉन्ड्रिंग केस में मिला है।"' }, time: '0:05' },
      { speaker: 'them', line: { en: '"Aap ab Digital Arrest mein hain. Apna phone mat rakhna, warna FIR darz ho jaayegi."', hi: '"आप अब डिजिटल अरेस्ट में हैं। फोन मत काटना, वरना FIR दर्ज हो जाएगी।"' }, time: '0:22' },
      { speaker: 'them', line: { en: '"Case close karne ke liye abhi ₹50,000 UPI pe bhejo. Baad mein wapas milenge."', hi: '"केस बंद करने के लिए अभी ₹50,000 भेजें। बाद में वापस मिल जाएंगे।"' }, time: '0:41' },
    ],
    redFlags: {
      en: [
        '🚩 Police KABHI phone pe arrest nahi karte (Digital Arrest is FAKE)',
        '🚩 Government officer KABHI UPI payment nahi maangte',
        '🚩 Anjaan number se "CBI/Police" call = 100% scam',
      ],
      hi: [
        '🚩 पुलिस कभी फोन पर अरेस्ट नहीं करती (डिजिटल अरेस्ट झूठ है)',
        '🚩 सरकारी अधिकारी कभी UPI पेमेंट नहीं मांगते',
        '🚩 अनजान नंबर से पुलिस कॉल = 100% स्कैम',
      ]
    },
    choices: [
      { text: { en: '✅ Hang up. Police don\'t call for money. Call 100.', hi: '✅ फोन काट दें। पुलिस पैसे नहीं मांगती। 100 डायल करें।' }, correct: true, feedback: { en: 'Brilliant! Real police issue written notices, never phone calls.', hi: 'शानदार! असली पुलिस लिखित नोटिस भेजती है, फोन नहीं।' } },
      { text: { en: '❌ Transfer ₹50,000 to avoid arrest.', hi: '❌ अरेस्ट से बचने के लिए ₹50,000 भेजें।' }, correct: false, feedback: { en: 'TRAP! You would lose ₹50,000 instantly with zero recovery chance.', hi: 'जाल! आपके पैसे तुरंत कट जाएंगे और वापस नहीं मिलेंगे।' } },
    ]
  },
  {
    id: 'sms_lottery',
    type: 'sms',
    contact: { name: 'WIN-PRIZE', number: 'WIN-PRIZE', avatar: '🎰', isVerified: false },
    title: { en: 'Lottery Scam via SMS', hi: 'SMS के जरिए लॉटरी स्कैम' },
    messages: [
      { from: 'them', text: { en: '🎉CONGRATULATIONS! You have WON ₹15,00,000 in JIOPRIZE LUCKY DRAW! Claim NOW: bit.ly/jiowin24', hi: '🎉बधाई हो! आपने लॉटरी में ₹15,00,000 जीते हैं! अभी क्लेम करें: bit.ly/jiowin24' }, time: '11:45 AM', delay: 0 },
      { from: 'them', text: { en: 'Call IMMEDIATELY: +91-78456XXXX. Offer expires in 2 HOURS ⏰', hi: 'तुरंत कॉल करें: +91-78456XXXX. ऑफर 2 घंटे में समाप्त ⏰' }, time: '11:45 AM', delay: 1200 },
    ],
    redFlags: {
       en: [
        '🚩 You never entered any Jio Lucky Draw',
        '🚩 Real prizes don\'t come via random SMS with bit.ly links',
        '🚩 Calling will lead to "processing fee" request',
      ],
       hi: [
        '🚩 आपने किसी लॉटरी में हिस्सा नहीं लिया था',
        '🚩 असली इनाम अनजान SMS और लिंक से नहीं आते',
        '🚩 कॉल करने पर ठग आपसे "प्रोसेसिंग फीस" मांगेंगे',
       ]
    },
    choices: [
      { text: { en: '✅ Delete it. I never entered any lottery.', hi: '✅ डिलीट करें। मैंने कोई लॉटरी नहीं खरीदी थी।' }, correct: true, feedback: { en: 'Correct! You can\'t win a lottery you never entered.', hi: 'बिल्कुल सही! बिना हिस्सा लिए लॉटरी नहीं जीती जा सकती।' } },
      { text: { en: '❌ Call the number to claim my ₹15 lakh prize.', hi: '❌ ₹15 लाख क्लेम करने के लिए कॉल करें।' }, correct: false, feedback: { en: 'SCAM! They will ask for ₹2,000 "processing fee" and vanish.', hi: 'यह स्कैम है! वे आपसे फीस लेकर भाग जाएंगे।' } },
    ]
  },
  {
    id: 'electricity_whatsapp',
    type: 'whatsapp',
    contact: { name: 'DHBVN Electricity ⚡', number: '+91-98541-XXXXX', avatar: '⚡', isVerified: false },
    title: { en: 'Electricity Disconnection via WhatsApp', hi: 'बिजली कटने का वॉट्सऐप संदेश' },
    messages: [
      { from: 'them', text: { en: '⚠️ URGENT: Your electricity connection will be DISCONNECTED tonight at 9:30 PM due to update failure.', hi: '⚠️ जरूरी सूचना: बिल अपडेट न होने के कारण आज रात 9:30 बजे आपकी बिजली काट दी जाएगी।' }, time: '07:55 PM', delay: 0 },
      { from: 'them', text: { en: 'Contact our helpdesk officer IMMEDIATELY to avoid darkness: +91-9876500XXXXX', hi: 'बिजली कटने से बचने के लिए तुरंत अधिकारी से संपर्क करें: +91-98765XXXXX' }, time: '07:55 PM', delay: 1500 },
      { from: 'them', text: { en: 'To avoid disconnection, click: http://electricity-pay.site/verify', hi: 'असुविधा से बचने के लिए क्लिक करें: http://electricity-pay.site/verify' }, time: '07:56 PM', delay: 2800 },
    ],
    redFlags: {
      en: [
        '🚩 Power boards NEVER disconnect at night (safety regulation)',
        '🚩 Official government SMS never has a random mobile number',
        '🚩 Calling leads to AnyDesk download (remote access scam)',
      ],
      hi: [
        '🚩 बिजली विभाग कभी रात में लाइन नहीं काटता (नियम अनुसार)',
        '🚩 सरकारी संदेश में रैंडम मोबाइल नंबर नहीं होता',
        '🚩 कॉल करने पर वे आपके फोन में AnyDesk डाउनलोड करवाएंगे',
      ]
    },
    choices: [
      { text: { en: '✅ Ignore. Check official portal tomorrow morning.', hi: '✅ इग्नोर करें। सुबह आधिकारिक पोर्टल पर चेक करें।' }, correct: true, feedback: { en: 'Smart! Power boards give multiple official notices, never night cuts.', hi: 'समझदारी! विभाग रात में बिजली नहीं काटते और लिखित नोटिस देते हैं।' } },
      { text: { en: '❌ Call the number to prevent power cut.', hi: '❌ लाइन न कटे इसलिए दिए गए नंबर पर कॉल करें।' }, correct: false, feedback: { en: 'DANGER! They will make you download AnyDesk and empty your bank account.', hi: 'खतरा! वे आपका फोन हैक करके बैंक खाता खाली कर देंगे।' } },
    ]
  }
]

export default function PhoneSimulator({ onClose, language = 'en', isElderMode = false }) {
  const { openCertificate } = useGame()
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [phase, setPhase] = useState('intro') // intro → playing → choice → result → next
  const [visibleMessages, setVisibleMessages] = useState([])
  const [visibleCallLines, setVisibleCallLines] = useState([])
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [callSeconds, setCallSeconds] = useState(0)
  const [score, setScore] = useState(0)
  const [callActive, setCallActive] = useState(false)
  const messagesEndRef = useRef(null)
  const scenario = SCENARIOS[scenarioIndex]

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [visibleMessages])

  // Start scenario animation
  useEffect(() => {
    if (phase !== 'playing') return
    setVisibleMessages([])
    setVisibleCallLines([])
    setCallSeconds(0)

    if (scenario.type === 'call') {
      setCallActive(true)
      const callTimer = setInterval(() => setCallSeconds(s => s + 1), 1000)
      let delay = 0
      scenario.callScript.forEach((line, i) => {
        delay += i === 0 ? 1500 : 3500
        setTimeout(() => {
          setVisibleCallLines(prev => [...prev, line])
        }, delay)
      })
      setTimeout(() => {
        setCallActive(false)
        setPhase('choice')
      }, delay + 4500)
      return () => clearInterval(callTimer)
    } else {
      // WhatsApp / SMS
      scenario.messages.forEach((msg, i) => {
        setTimeout(() => {
          setVisibleMessages(prev => [...prev, msg])
          if (i === scenario.messages.length - 1) {
            setTimeout(() => setPhase('choice'), 4000)
          }
        }, msg.delay + 800)
      })
    }
  }, [phase, scenarioIndex])

  const handleChoice = (choice) => {
    setSelectedChoice(choice)
    if (choice.correct) setScore(s => s + 1)
    setPhase('result')
    // TTS feedback
    if (window.speechSynthesis) {
      const utt = new SpeechSynthesisUtterance(choice.feedback[language])
      utt.rate = isElderMode ? 0.85 : 0.95
      utt.lang = language === 'en' ? 'en-IN' : 'hi-IN'
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utt)
    }
  }

  const handleNext = () => {
    if (scenarioIndex < SCENARIOS.length - 1) {
      setScenarioIndex(i => i + 1)
      setSelectedChoice(null)
      setPhase('intro')
    } else {
      setPhase('complete')
    }
  }

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="phone-sim-overlay">
      <div className="phone-sim-wrap">

        {/* TOP HEADER */}
        <div className="phone-sim-header">
          <span className="phone-sim-logo">📱 {language === 'en' ? 'SCAM PHONE SIMULATOR' : 'स्कैम फोन सिम्युलेटर'}</span>
          <div className="phone-sim-score">🛡️ {score}/{SCENARIOS.length} {language === 'en' ? 'Safe' : 'सुरक्षित'}</div>
          <button className="phone-sim-city-btn" onClick={onClose} style={{
            background: 'white',
            color: 'black',
            fontWeight: 'bold',
            borderRadius: '6px',
            padding: '6px 12px',
            border: 'none',
            cursor: 'pointer',
            marginRight: '10px'
          }}>
            🏙️ {language === 'en' ? 'GO TO CITY' : 'शहर वापस जाएं'}
          </button>
          <button className="phone-sim-close" onClick={onClose}>✕</button>
        </div>

        {/* SUBTITLE */}
        <div className="phone-sim-subtitle">
          Experience scams <b>exactly</b> as they arrive — WhatsApp, SMS, and Phone Calls.
        </div>

        {/* PHONE DEVICE FRAME */}
        <div className="phone-device">
          <div className="phone-notch" />

          {/* INTRO SCREEN */}
          {phase === 'intro' && (
            <div className="phone-screen intro-screen">
              <div className="intro-badge">{scenario.type === 'call' ? '📞' : scenario.type === 'sms' ? '💬' : '💚'}</div>
              <div className="intro-type">{scenario.type === 'call' ? (language === 'en' ? 'INCOMING CALL SIMULATION' : 'इनकमिंग कॉल सिम्युलेशन') : scenario.type === 'sms' ? (language === 'en' ? 'SMS SIMULATION' : 'SMS सिम्युलेशन') : (language === 'en' ? 'WHATSAPP SIMULATION' : 'वॉट्सऐप सिम्युलेशन')}</div>
              <div className="intro-title">{scenario.title[language]}</div>
              <div className="intro-desc">{language === 'en' ? 'A scam is about to arrive on your phone. Stay alert and identify the red flags!' : 'आपके फोन पर एक स्कैम आने वाला है। सतर्क रहें और खतरे को पहचानें!'}</div>
              <button className="intro-start-btn" onClick={() => setPhase('playing')}>
                ▶ {language === 'en' ? 'Start Simulation' : 'सिम्युलेशन शुरू करें'}
              </button>
            </div>
          )}

          {/* CALL UI */}
          {(phase === 'playing' || phase === 'choice') && scenario.type === 'call' && (
            <div className="phone-screen call-screen">
              <div className="call-status">{callActive ? `⏱ ${formatTime(callSeconds)}` : (language === 'en' ? '📵 Call Ended' : '📵 कॉल कट गई')}</div>
              <div className="caller-avatar">{scenario.contact.avatar}</div>
              <div className="caller-name">{scenario.contact.name}</div>
              <div className="caller-number">{scenario.contact.number}</div>
              <div className="call-transcript">
                {visibleCallLines.map((line, i) => (
                  <div key={i} className={`call-line ${line.speaker}`}>
                    <span className="call-time">[{line.time}]</span>
                    <span className="call-text">{line.line[language]}</span>
                  </div>
                ))}
              </div>
              {callActive && (
                <div className="call-buttons">
                  <button className="call-btn-decline" onClick={() => { setCallActive(false); setPhase('choice') }}>📵 {language === 'en' ? 'Hang Up' : 'काट दें'}</button>
                  <div className="call-btn-accept-fake">📞 {language === 'en' ? 'Listening...' : 'सुन रहे हैं...'}</div>
                </div>
              )}
            </div>
          )}

          {/* WHATSAPP / SMS UI */}
          {(phase === 'playing' || phase === 'choice') && scenario.type !== 'call' && (
            <div className={`phone-screen ${scenario.type === 'sms' ? 'sms-screen' : 'whatsapp-screen'}`}>
              {/* Chat header */}
              <div className="chat-header">
                <div className="chat-avatar">{scenario.contact.avatar}</div>
                <div className="chat-contact-info">
                  <div className="chat-name">{scenario.contact.name}</div>
                  <div className="chat-number">{scenario.contact.number}</div>
                </div>
                {scenario.type === 'whatsapp' && <div className="chat-no-tick">⚠️ {language === 'en' ? 'Not Verified' : 'वेरिफाइड नहीं'}</div>}
              </div>
              {/* Messages */}
              <div className="chat-messages">
                {visibleMessages.map((msg, i) => (
                  <div key={i} className={`chat-bubble ${msg.from}`}>
                    <div className="bubble-text">{msg.text[language]}</div>
                    <div className="bubble-time">{msg.time}</div>
                  </div>
                ))}
                {visibleMessages.length < scenario.messages.length && phase === 'playing' && (
                  <div className="typing-indicator">
                    <span /><span /><span />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          { phase === 'choice' && (
            <div className="choice-overlay">
              <div className="choice-title">🚨 {language === 'en' ? 'RED FLAGS SPOTTED:' : 'खतरे के संकेत (RED FLAGS):'}</div>
              <ul className="red-flags-list">
                {scenario.redFlags[language].map((flag, i) => (
                  <li key={i}>{flag}</li>
                ))}
              </ul>
              <div className="choice-question">{language === 'en' ? 'What do you do?' : 'आप क्या करेंगे?'}</div>
              {scenario.choices.map((choice, i) => (
                <button key={i} className={`choice-btn ${choice.correct ? 'choice-safe' : 'choice-danger'}`}
                  onClick={() => handleChoice(choice)}>
                  {choice.text[language]}
                </button>
              ))}
            </div>
          )}

          {/* RESULT SCREEN */}
          {phase === 'result' && selectedChoice && (
            <div className="result-screen">
              <div className={`result-verdict ${selectedChoice.correct ? 'verdict-safe' : 'verdict-danger'}`}>
                {selectedChoice.correct ? (language === 'en' ? '✅ SAFE!' : '✅ सुरक्षित!') : (language === 'en' ? '❌ SCAMMED!' : '❌ ठगे गए!')}
              </div>
              <div className="result-feedback">{selectedChoice.feedback[language]}</div>
              <div className="result-lesson">
                <b>🎓 {language === 'en' ? 'Remember:' : 'याद रखें:'}</b><br />
                {scenario.redFlags[language][0]}
              </div>
              <button className="result-next-btn" onClick={handleNext}>
                {scenarioIndex < SCENARIOS.length - 1 ? (language === 'en' ? '➡ Next Scam Scenario' : '➡ अगला स्कैम') : (language === 'en' ? '🏆 See My Score' : '🏆 अपना स्कोर देखें')}
              </button>
            </div>
          )}

          {/* COMPLETION SCREEN */}
          {phase === 'complete' && (
            <div className="complete-screen">
              <div className="complete-emoji">🛡️</div>
              <div className="complete-title">CYBER GUARDIAN!</div>
              <div className="complete-score">{score} / {SCENARIOS.length}</div>
              <div className="complete-subtitle">
                {score === SCENARIOS.length ? 'PERFECT SCORE! You are scam-proof! 🏆' :
                  score >= 3 ? 'Great job! Stay alert always 🌟' :
                    'Keep practicing — scammers are clever! 💪'}
              </div>
              <div className="complete-certificate">
                🏅 Cyber Safety Certificate earned!<br />
                <small>You successfully identified {score} out of {SCENARIOS.length} live scam simulations.</small>
              </div>
              <button className="result-next-btn" onClick={() => { setScenarioIndex(0); setScore(0); setPhase('intro') }}>
                🔄 Practice Again
              </button>
              
              <button 
                className="result-next-btn" 
                style={{ background: 'gold', color: 'black', marginTop: '10px' }}
                onClick={() => {
                  onClose();
                  openCertificate({ score, total: SCENARIOS.length });
                }}
              >
                📜 CLAIM MY CERTIFICATE
              </button>
              
              <button className="phone-sim-exit-btn" onClick={onClose}>🚪 Back to City</button>
            </div>
          )}
        </div>

        {/* BOTTOM PROGRESS */}
        <div className="phone-sim-progress">
          {SCENARIOS.map((s, i) => (
            <div key={i} className={`progress-dot ${i < scenarioIndex ? 'done' : i === scenarioIndex ? 'active' : 'pending'}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
