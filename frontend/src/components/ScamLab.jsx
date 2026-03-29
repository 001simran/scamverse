import React, { useState, useEffect } from 'react';
import './ScamLab.css';

const ScamLab = ({ onClose, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);
  const [isScanning, setIsScanning] = useState(true);

  const labScenarios = [
    {
      id: 1,
      type: 'voice',
      title: "📞 AI Voice Cloning: Grandson",
      description: "A recording of an elderly man's grandson asking for emergency money transfer from another city.",
      specimen: "VOICE_SAMPLE_A19.mp3",
      isScam: true,
      analysis: {
        pattern: "AI Synth Splicing Detected at 0:04",
        frequency: "Non-natural waveform in emotional peaks",
        confidence: 96
      },
      redFlags: [
        "Robotic inflection on emotional words",
        "Background noise cuts off suddenly",
        "Refusal to call back on saved mobile number"
      ],
      explanation: "Scammers clone voices from social media reels. Real family members don't mind a callback on their usual number."
    },
    {
      id: 2,
      type: 'image',
      title: "🖼️ Morphed Document: Police ID",
      description: "A photo of a police officer's identification card sent over WhatsApp as proof of authority during a 'Digital Arrest'.",
      specimen: "https://images.unsplash.com/photo-1596755094514-f87034a7a988?q=80&w=1000&auto=format&fit=crop",
      isScam: true,
      analysis: {
        pattern: "Pixel discontinuities in ID number badge",
        frequency: "EXIF metadata stripped entirely",
        confidence: 98
      },
      redFlags: [
        "Inconsistent font matching near the name",
        "The seal has blurred edges suggesting a cut-paste",
        "Official IDs are never sent via non-official apps"
      ],
      explanation: "This is a classic 'Digital Arrest' setup. True police officers will never send their ID via WhatsApp to prove they are real."
    },
    {
      id: 3,
      type: 'voice',
      title: "📞 Real Call: Tech Support",
      description: "A representative from your internet service provider calling to confirm a real outage scheduled for tonight.",
      specimen: "VOICE_SAMPLE_B07.wav",
      isScam: false,
      analysis: {
        pattern: "Natural respiratory cadence found",
        frequency: "Consistent ambient office background",
        confidence: 12
      },
      redFlags: [],
      explanation: "This is a legitimate verification call. Notice they asked for no money and no OTP code during the context."
    },
    {
      id: 4,
      type: 'image',
      title: "🖼️ Deepfake Image: Fake Winner",
      description: "A photo showing a common citizen winning a luxury car from a government welfare scheme.",
      specimen: "https://images.unsplash.com/photo-1549813069-f95e44d7f498?q=80&w=1000&auto=format&fit=crop",
      isScam: true,
      analysis: {
        pattern: "Irregular shadows on the car hood",
        frequency: "Face warping around the jawline",
        confidence: 91
      },
      redFlags: [
        "Lighting on the person doesn't match the background",
        "The winning check has blurred text compared to the car",
        "Government schemes don't notify winners via random DMs"
      ],
      explanation: "AI-generated images often struggle with consistent lighting and text on 3D surfaces. This was a bait to collect 'KYC fees'."
    }
  ];

  const currentScenario = labScenarios[currentIdx];

  // Auto-scan animation
  useEffect(() => {
    setIsScanning(true);
    const timer = setTimeout(() => {
      setIsScanning(false);
      // Announce title when scan completes (Accessibility)
      speak(`Analysis ready. Specimen: ${currentScenario.title}`);
    }, 2000);
    return () => clearTimeout(timer);
  }, [currentIdx]);

  const speak = (msg) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(msg);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleDecision = (wasFake) => {
    const correct = wasFake === currentScenario.isScam;
    if (correct) setScore(s => s + 1);
    setShowFeedback(true);
    
    // Accessibility for Elder Mode
    const feedbackMsg = correct 
      ? `Correct. ${currentScenario.isScam ? "AI pattern detected successfully." : "This is a legitimate file."}`
      : `Incorrect. ${currentScenario.isScam ? "This was actually a sophisticated deepfake." : "This was a real file."}`;
    
    speak(feedbackMsg);
  };

  const goNext = () => {
    setShowFeedback(false);
    if (currentIdx < labScenarios.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setFinished(true);
      if (onComplete) onComplete({ score, total: labScenarios.length });
    }
  };

  if (finished) {
    return (
      <div className="scam-lab-overlay">
        <div className="lab-container animate-slide-up" style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center', height: 'auto', padding: '50px' }}>
          <h2 style={{ color: '#00FF41', fontSize: '32px' }}>RESEARCH COMPLETE</h2>
          <div style={{ fontSize: '80px', margin: '30px 0' }}>📂</div>
          <p style={{ fontSize: '24px', color: '#E8E8E8' }}>Analysis Accuracy: {Math.round((score/labScenarios.length)*100)}%</p>
          <button className="next-lab-btn" style={{ float: 'none', marginTop: '30px', background: '#FFB300', color: 'black' }} onClick={onClose}>
            🏙️ GO TO CITY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="scam-lab-overlay">
      <div className="lab-container animate-slide-up">
        <div className="lab-header">
           <div className="flex items-center gap-4">
             <h2>🧪 CYBER SCAM FORENSICS LAB</h2>
             <button className="next-lab-btn" onClick={onClose} style={{
               float: 'none',
               margin: 0,
               background: '#FFB300',
               color: 'black',
               fontSize: '12px',
               padding: '6px 12px',
               fontWeight: 'bold',
               borderRadius: '6px',
               boxShadow: '0 0 10px rgba(255, 179, 0, 0.4)'
             }}>
               🏙️ GO TO CITY
             </button>
           </div>
           <div style={{ color: '#E8E8E8', fontSize: '14px', background: 'rgba(0,0,0,0.5)', padding: '5px 15px', borderRadius: '20px' }}>
              Specimen: {currentIdx + 1} / {labScenarios.length} | Security Points: {score * 100}
           </div>
        </div>

        <div className="lab-content">
          {currentScenario.type === 'voice' && (
            <div className="ai-cloning-badge animate-pulse" style={{
              position: 'absolute',
              top: '80px',
              left: '30px',
              background: '#FF0055',
              color: 'white',
              padding: '6px 15px',
              borderRadius: '20px',
              fontWeight: 'black',
              fontSize: '14px',
              zIndex: 10,
              boxShadow: '0 0 20px rgba(255, 0, 85, 0.5)',
              border: '2px solid white'
            }}>
              🚨 AI VOICE CLONING DETECTED
            </div>
          )}
          <div className="specimen-display">
            {isScanning && <div className="scan-line"></div>}
            
            {currentScenario.type === 'image' ? (
              <img src={currentScenario.specimen} alt="Specimen" className="specimen-image" />
            ) : (
              <div className="waveform-container">
                {[...Array(15)].map((_, i) => (
                  <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.1}s`, height: `${20 + Math.random() * 40}px` }}></div>
                ))}
              </div>
            )}
            
            <p style={{ color: isScanning ? '#00D9FF' : '#A8A8C8', marginTop: '20px', textAlign: 'center' }}>
              {isScanning ? "INITIATING DIGITAL AUTO-SCAN..." : "SCAN COMPLETE: WAITING FOR OPERATOR VERDICT"}
            </p>
          </div>

          <div className="analysis-panel">
            <h3 style={{ color: 'white', margin: '0 0 10px 0' }}>{currentScenario.title}</h3>
            <p style={{ color: '#A8A8C8', fontSize: '12px', lineHeight: '1.4' }}>{currentScenario.description}</p>

            <div className="data-module" style={{ borderLeftColor: '#FF0055' }}>
              <div className="module-title" style={{ color: '#FF0055' }}>Source Type</div>
              <div style={{ fontSize: '16px', color: '#FF0055', fontWeight: '900' }}>
                {currentScenario.type === 'voice' ? '🚨 AI VOICE CLONING' : '🖼️ DEEPFAKE IMAGE'}
              </div>
            </div>

            <div className="data-module">
              <div className="module-title">Digital Signature Analysis</div>
              <div style={{ fontSize: '13px', color: '#E8E8E8' }}>{currentScenario.analysis.pattern}</div>
              <div style={{ fontSize: '11px', color: '#9D00FF', marginTop: '5px' }}>Sync Confidence: {currentScenario.analysis.confidence}%</div>
            </div>

            <div className="data-module" style={{ borderLeftColor: '#00D9FF' }}>
              <div className="module-title" style={{ color: '#00D9FF' }}>Spectral Frequency</div>
              <div style={{ fontSize: '13px', color: '#E8E8E8' }}>{currentScenario.analysis.frequency}</div>
            </div>

            {!showFeedback ? (
              <div className="decision-buttons">
                <button className="lab-btn fake" onClick={() => handleDecision(true)}>🚨 FLAG AS FAKE</button>
                <button className="lab-btn real" onClick={() => handleDecision(false)}>✅ IDENTIFIED REAL</button>
              </div>
            ) : (
              <div className="feedback-section animate-fade-in">
                <div style={{ fontWeight: 'bold', fontSize: '18px', color: currentScenario.isScam ? '#FF0055' : '#00FF41', marginBottom: '10px' }}>
                  {currentScenario.isScam ? "SCAM CONFIRMED" : "LEGITIMATE SOURCE"}
                </div>
                <p style={{ color: '#E8E8E8', fontSize: '13px', marginBottom: '15px' }}>{currentScenario.explanation}</p>
                
                {currentScenario.redFlags.length > 0 && (
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ fontSize: '10px', color: '#FFB300', marginBottom: '5px' }}>OBSERVED ANOMALIES:</div>
                    {currentScenario.redFlags.map((flag, i) => (
                      <div key={i} className="red-flag-item"><span>🚩</span> {flag}</div>
                    ))}
                  </div>
                )}

                <button className="next-lab-btn" onClick={goNext}>
                  {currentIdx < labScenarios.length - 1 ? "NEXT SPECIMEN →" : "FINISH FORENSICS"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: '15px 30px', color: '#6a8aaa', fontSize: '10px', textTransform: 'uppercase' }}>
          * Caution: This lab simulates state-of-the-art forensic detection for educational purposes.
        </div>
      </div>
    </div>
  );
};

export default ScamLab;
