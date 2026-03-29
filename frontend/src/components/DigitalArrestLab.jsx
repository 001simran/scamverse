import React, { useState, useEffect } from 'react';
import './DigitalArrestLab.css';

const DigitalArrestLab = ({ onClose, onComplete }) => {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [verdict, setVerdict] = useState(null); // 'correct' or 'wrong'
  const [isCalling, setIsCalling] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  const scenarios = [
    {
      id: 1,
      title: "📞 VIDEO CALL: CYBER POLICE CENTER",
      caller: "Inspector Verma",
      message: "Listen carefully! Your Aadhar number was found linked to a money laundering case in Mumbai. We have already frozen your bank accounts. Do NOT tell anyone or you will be jailed immediately. We are recording you now.",
      threat: "Pay ₹1,50,000 as 'security deposit' to prove you are innocent.",
      options: [
        { text: "Hang up. Real police don't investigate via WhatsApp video calls.", isCorrect: true, feedback: "✅ Correct! This is a professional scare tactic to isolate you." },
        { text: "Ask for their ID and Pay. It's better than going to jail.", isCorrect: false, feedback: "❌ Wrong! Once you pay, they'll demand more. Real police don't use UPI." }
      ]
    },
    {
      id: 2,
      title: "📞 CALL: NARCOTICS DEPT",
      caller: "CBI Officer Singh",
      message: "A courier package containing illegal drugs was caught in your name. We are issuing a Digital Arrest warrant. Stay on this video call for the next 4 hours for 'Digital Investigation'.",
      threat: "Transfer your entire savings to the 'escrow' account for verification.",
      options: [
        { text: "Stay on call and follow instructions. Don't risk arrest.", isCorrect: false, feedback: "❌ Wrong! This isolation is their main weapon. They will drain you dry." },
        { text: "Ask to visit the nearest real police station yourself.", isCorrect: true, feedback: "✅ Correct! Scammers will never meet you in a real police station." }
      ]
    },
    {
      id: 3,
      title: "📞 CALL: TRAFFIC DEPT",
      caller: "Traffic E-Challan Office",
      message: "We found your car was used in a hit-and-run case. Your DL is cancelled. Pay the pending challan of ₹25,000 immediately or your car will be seized by evening.",
      threat: "We are sending a 'safe link' to your WhatsApp for payment.",
      options: [
        { text: "Report the link to 1930 and verify on official Parivahan site.", isCorrect: true, feedback: "✅ Correct! E-challans are only paid through official government portals." },
        { text: "Click the link and pay once. It's safer to avoid police home visit.", isCorrect: false, feedback: "❌ Wrong! That link will clone your phone and steal all OTPs." }
      ]
    }
  ];

  const current = scenarios[scenarioIdx];

  const handleChoice = (opt) => {
    if (verdict) return;
    setVerdict(opt.isCorrect ? 'correct' : 'wrong');
    if (opt.isCorrect) setScore(s => s + 1);
    
    // Voice Feedback
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(opt.feedback);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const goNext = () => {
    setVerdict(null);
    if (scenarioIdx < scenarios.length - 1) {
      setScenarioIdx(s => s + 1);
      setIsCalling(true);
    } else {
      setIsFinished(true);
      if (onComplete) onComplete({ score, total: scenarios.length });
    }
  };

  if (isFinished) {
    return (
      <div className="digital-arrest-overlay">
        <div className="arrest-container" style={{ textAlign: 'center', justifyContent: 'center', padding: '50px' }}>
          <h2 style={{ color: '#00FF41', fontSize: '32px' }}>FORENSIC REPORT GENERATED</h2>
          <div style={{ fontSize: '100px', margin: '30px 0' }}>📂</div>
          <p style={{ fontSize: '24px', color: '#E8E8E8' }}>Survival Rate: {Math.round((score/scenarios.length)*100)}%</p>
          <button className="external-link-btn" style={{ margin: '30px auto', background: '#00D9FF', color: 'black' }} onClick={onClose}>
             🏙️ GO TO CITY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="digital-arrest-overlay">
      <div className="arrest-container">
        <div className="arrest-header">
           <span>🚨 DIGITAL ARREST SIMULATOR</span>
          <span>SCORE: {score}/{scenarios.length}</span>
          <button className="next-lab-btn" onClick={onClose} style={{ float: 'none', background: '#00D9FF', color: 'black' }}>
            🏙️ GO TO CITY
          </button>
        </div>
        
        <div className="arrest-content">
          <div className="status-badge">SCENARIO {scenarioIdx + 1}/{scenarios.length}</div>
          
          <div className="video-call-window">
             {isCalling ? (
               <div className="flex flex-col items-center justify-center h-full">
                  <div className="officer-avatar animate-pulse">👮</div>
                  <h3 style={{ color: 'white', marginTop: '20px' }}>{current.caller} Calling...</h3>
                  <div className="call-overlay">
                     <button className="call-btn accept" onClick={() => setIsCalling(false)}>📞</button>
                     <button className="call-btn decline" onClick={onClose}>🏙️ CITY</button>
                  </div>
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center h-full">
                  <div style={{ fontSize: '100px' }}>👮</div>
                  <div style={{ color: '#FF0055', fontWeight: 'bold' }}>LIVE CALL: RECORDING IN PROGRESS</div>
               </div>
             )}
          </div>

          {!isCalling && (
            <>
              <div className="dialogue-box">
                 <h4 style={{ color: '#FF0055', marginBottom: '8px' }}>FROM: {current.caller}</h4>
                 <p style={{ color: '#E8E8E8', lineHeight: '1.5' }}>{current.message}</p>
                 <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(255,0,85,0.1)', border: '1px dashed #FF0055', color: '#FF0055', fontWeight: 'bold' }}>
                    🚨 THE THREAT: {current.threat}
                 </div>
              </div>

              <div className="response-grid">
                 {!verdict ? (
                   current.options.map((opt, i) => (
                     <div key={i} className="response-card" onClick={() => handleChoice(opt)}>
                        {opt.text}
                     </div>
                   ))
                 ) : (
                   <div className="feedback animate-fade-in" style={{ gridColumn: 'span 2' }}>
                      <div className={`response-card ${verdict === 'correct' ? 'correct' : 'wrong'}`} style={{ cursor: 'default' }}>
                         {current.options.find(o => (o.isCorrect && verdict === 'correct') || (!o.isCorrect && verdict === 'wrong')).feedback}
                      </div>
                      <button className="external-link-btn" onClick={goNext} style={{ background: '#00D9FF', margin: '20px auto', display: 'block' }}>
                         {scenarioIdx < scenarios.length - 1 ? "CONTINUE INVESTIGATION →" : "GENERATE FINAL REPORT ⚖️"}
                      </button>
                   </div>
                 )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DigitalArrestLab;
