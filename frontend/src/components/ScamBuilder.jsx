import React, { useState } from 'react';
import './ScamBuilder.css';

export default function ScamBuilder({ onClose, language = 'en' }) {
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({
    sender: '',
    hook: '',
    link: ''
  });
  const [showResult, setShowResult] = useState(false);

  const t = {
    en: {
      title: '🎭 REVERSE SCAM ENGINEERING LAB',
      subtitle: 'To defeat a scammer, you must learn how they think. Build your own scam to see how easily fake messages are created.',
      step1: 'STEP 1: Choose Your Disguise',
      step2: 'STEP 2: Choose The Hook (Bait)',
      step3: 'STEP 3: Add a Fake Link',
      send: '🚀 SEND FAKE SCAM',
      resultTitle: '🚨 SCAM DEPLOYED SUCCESSFULLY 🚨',
      resultDesc: 'Look at the phone below. See how REAL it looks? It took you 10 seconds to create this. Scammers use robots to send MILLIONS of these every hour.',
      lesson: '💡 THE LESSON: Never trust a message just because the Sender Name looks official.',
      close: 'CLOSE LAB',
      options: {
        sender: [
          { id: 'bank', text: 'SBI Bank Official' },
          { id: 'police', text: 'India Cyber Police' },
          { id: 'elec', text: 'Electricity Board' }
        ],
        hook: [
          { id: 'fear', text: 'FEAR: "Your account is blocked. Verify KYC immediately."' },
          { id: 'greed', text: 'GREED: "You have won ₹10,00,000 lottery! Congrats!"' },
          { id: 'urgency', text: 'URGENCY: "Your electricity will be cut in 10 minutes."' }
        ],
        link: [
          { id: 'link1', text: 'http://sbi-kyc-update.xyz' },
          { id: 'link2', text: 'http://win-jio-prizes.in' },
          { id: 'link3', text: 'http://power-bill-pay.site' }
        ]
      }
    },
    hi: {
      title: '🎭 रिवर्स स्कैम इंजीनियरिंग लैब',
      subtitle: 'एक स्कैमर को हराने के लिए, आपको उसकी तरह सोचना होगा। खुद एक स्कैम बनाएं और देखें कि फर्जी संदेश कितनी आसानी से बनते हैं।',
      step1: 'चरण 1: अपना भेष चुनें (Sender Name)',
      step2: 'चरण 2: लालच या डर चुनें (The Hook)',
      step3: 'चरण 3: एक फर्जी लिंक जोड़ें',
      send: '🚀 फर्जी स्कैम भेजें',
      resultTitle: '🚨 स्कैम सफलतापूर्वक भेजा गया 🚨',
      resultDesc: 'नीचे फोन पर देखें। यह कितना असली लग रहा है? इसे बनाने में आपको 10 सेकंड लगे। ठग ऐसे करोड़ों मैसेज हर घंटे रोबोट से भेजते हैं।',
      lesson: '💡 सीख: केवल सेंडर का नाम देखकर कभी भरोसा न करें, क्योंकि वह आसानी से बदला जा सकता है।',
      close: 'लैब बंद करें',
      options: {
        sender: [
          { id: 'bank', text: 'SBI बैंक अधिकारी' },
          { id: 'police', text: 'इंडिया साइबर पुलिस' },
          { id: 'elec', text: 'बिजली विभाग' }
        ],
        hook: [
          { id: 'fear', text: 'डर: "आपका खाता ब्लॉक हो गया है। तुरंत KYC करें।"' },
          { id: 'greed', text: 'लालच: "आपने ₹10,00,000 की लॉटरी जीती है! बधाई!"' },
          { id: 'urgency', text: 'जल्दबाज़ी: "आपकी बिजली 10 मिनट में काट दी जाएगी।"' }
        ],
        link: [
          { id: 'link1', text: 'http://sbi-kyc-update.xyz' },
          { id: 'link2', text: 'http://win-jio-prizes.in' },
          { id: 'link3', text: 'http://power-bill-pay.site' }
        ]
      }
    }
  }[language];

  const handleSelect = (category, value) => {
    setSelections(prev => ({ ...prev, [category]: value }));
    setTimeout(() => {
      if (step < 3) setStep(step + 1);
    }, 400);
  };

  const handleDeploy = () => {
    if (selections.sender && selections.hook && selections.link) {
      setShowResult(true);
    }
  };

  return (
    <div className="scam-builder-overlay">
      <div className="scam-builder-wrapper">
        <button className="sb-close-btn" onClick={onClose}>✕</button>
        
        <div className="sb-header">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        {!showResult ? (
          <div className="sb-steps-container">
            {/* Step 1 */}
            <div className={`sb-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <h3>{t.step1}</h3>
              {step === 1 && (
                <div className="sb-options">
                  {t.options.sender.map(opt => (
                    <button key={opt.id} onClick={() => handleSelect('sender', opt.text)}>{opt.text}</button>
                  ))}
                </div>
              )}
              {step > 1 && <div className="sb-chosen">✓ {selections.sender}</div>}
            </div>

            {/* Step 2 */}
            <div className={`sb-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <h3>{t.step2}</h3>
              {step === 2 && (
                <div className="sb-options">
                  {t.options.hook.map(opt => (
                    <button key={opt.id} onClick={() => handleSelect('hook', opt.text)}>{opt.text}</button>
                  ))}
                </div>
              )}
              {step > 2 && <div className="sb-chosen">✓ {selections.hook}</div>}
            </div>

            {/* Step 3 */}
            <div className={`sb-step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
              <h3>{t.step3}</h3>
              {step === 3 && (
                <div className="sb-options">
                  {t.options.link.map(opt => (
                    <button key={opt.id} onClick={() => handleSelect('link', opt.text)}>{opt.text}</button>
                  ))}
                </div>
              )}
              {step > 3 && <div className="sb-chosen">✓ {selections.link}</div>}
            </div>

            {step === 3 && selections.link && (
              <button className="sb-deploy-btn pulse-anim" onClick={handleDeploy}>
                {t.send}
              </button>
            )}
          </div>
        ) : (
          <div className="sb-result-container animate-slide-up">
            <h2 className="text-danger">{t.resultTitle}</h2>
            <p className="sb-explain">{t.resultDesc}</p>
            
            <div className="sb-fake-phone">
              <div className="sb-phone-header">{selections.sender}</div>
              <div className="sb-phone-body">
                <div className="sb-phone-bubble">
                  {selections.hook.split(':')[1] ? selections.hook.split(':')[1].replace(/"/g, '') : selections.hook}
                  <br /><br />
                  <span className="text-link">{selections.link}</span>
                </div>
              </div>
            </div>

            <div className="sb-lesson">
              {t.lesson}
            </div>

            <button className="sb-finish-btn" onClick={onClose}>🏙️ GO TO CITY</button>
          </div>
        )}
      </div>
    </div>
  );
}
