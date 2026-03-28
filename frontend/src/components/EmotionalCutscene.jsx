/*
 * EmotionalCutscene.jsx
 * Shows emotional consequences when player makes wrong choice
 * Creates memorable learning through emotional impact
 */

import React, { useState, useEffect } from 'react';

const EmotionalCutscene = ({ scamType = 'digital_arrest', choice = 'right', onComplete }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Cutscene scenarios based on scam type and choice
  const cutscenes = {
    'digital_arrest_wrong': {
      title: "The Consequence: Digital Arrest Scam",
      frames: [
        {
          image: "👵",
          text: "Your grandmother transferred ₹14 lakh to the scammer...",
          emotion: "😰",
          duration: 3000
        },
        {
          image: "💸",
          text: "Her entire pension fund - saved over 30 years - gone in minutes.",
          emotion: "😭",
          duration: 3000
        },
        {
          image: "🏚️",
          text: "She can't afford her medicines now. The family is devastated.",
          emotion: "💔",
          duration: 3000
        },
        {
          image: "😢",
          text: "She blames herself: 'I should have known better...'",
          emotion: "😞",
          duration: 3000
        },
        {
          image: "⚠️",
          text: "This happens to REAL families every day. But YOU can prevent it.",
          emotion: "🛡️",
          duration: 4000
        }
      ],
      impact: {
        moneyLost: "₹14,00,000",
        emotionalDamage: "Severe family trauma",
        recoveryChance: "Less than 5%"
      }
    },
    'digital_arrest_right': {
      title: "Well Done: Scam Prevented!",
      frames: [
        {
          image: "🛡️",
          text: "You hung up immediately. Smart choice!",
          emotion: "✅",
          duration: 2000
        },
        {
          image: "👨‍👩‍👧‍👦",
          text: "You protected your family's ₹14 lakh pension fund.",
          emotion: "🎉",
          duration: 2000
        },
        {
          image: "🏆",
          text: "Your grandmother is safe because you taught her well!",
          emotion: "❤️",
          duration: 2000
        }
      ],
      impact: {
        moneyProtected: "₹14,00,000",
        emotionalWin: "Family trust preserved",
        achievement: "Vigilant Guardian Badge"
      }
    },
    'kbc_lottery_wrong': {
      title: "The Consequence: KBC Lottery Scam",
      frames: [
        {
          image: "💳",
          text: "You paid ₹25,000 as 'processing fee' for your ₹25 lakh prize...",
          emotion: "😰",
          duration: 3000
        },
        {
          image: "❌",
          text: "The scammer blocked your number. There was never a prize.",
          emotion: "😢",
          duration: 3000
        },
        {
          image: "💔",
          text: "That ₹25,000 was meant for your sister's college fees.",
          emotion: "😭",
          duration: 3000
        },
        {
          image: "😞",
          text: "You feel ashamed to tell your family what happened.",
          emotion: "😞",
          duration: 3000
        },
        {
          image: "⚠️",
          text: "Real lotteries NEVER ask for upfront payment. Learn this now.",
          emotion: "🛡️",
          duration: 4000
        }
      ],
      impact: {
        moneyLost: "₹25,000",
        emotionalDamage: "Shame and family trust damaged",
        recoveryChance: "Almost zero"
      }
    },
    'kbc_lottery_right': {
      title: "Well Done: Lottery Scam Spotted!",
      frames: [
        {
          image: "🎯",
          text: "You recognized the red flags immediately!",
          emotion: "✅",
          duration: 2000
        },
        {
          image: "🧠",
          text: "Real lotteries never ask for 'processing fees'.",
          emotion: "💡",
          duration: 2000
        },
        {
          image: "💰",
          text: "You saved ₹25,000 that would have been lost forever!",
          emotion: "🎉",
          duration: 2000
        }
      ],
      impact: {
        moneyProtected: "₹25,000",
        emotionalWin: "Smart decision-making",
        achievement: "Scam Detector Badge"
      }
    },
    'fake_loan_app_wrong': {
      title: "The Consequence: Fake Loan App",
      frames: [
        {
          image: "📱",
          text: "You downloaded the app and gave them access to your contacts...",
          emotion: "😰",
          duration: 3000
        },
        {
          image: "☎️",
          text: "Now they're calling your entire family, threatening them for payment.",
          emotion: "😱",
          duration: 3000
        },
        {
          image: "📸",
          text: "They're sending morphed photos of you to your contacts.",
          emotion: "😭",
          duration: 3000
        },
        {
          image: "💸",
          text: "You paid ₹50,000 in 'interest' on a ₹10,000 loan. The harassment continues.",
          emotion: "😞",
          duration: 3000
        },
        {
          image: "⚠️",
          text: "Fake loan apps destroy lives. Always check RBI's authorized lender list.",
          emotion: "🛡️",
          duration: 4000
        }
      ],
      impact: {
        moneyLost: "₹50,000 + ongoing harassment",
        emotionalDamage: "Social humiliation, family distress",
        recoveryChance: "Low, harassment may continue"
      }
    }
  };

  const getCurrentCutscene = () => {
    const key = `${scamType}_${choice}`;
    return cutscenes[key] || cutscenes['digital_arrest_wrong'];
  };

  const cutscene = getCurrentCutscene();

  useEffect(() => {
    if (!isPlaying || !cutscene) return;

    const frame = cutscene.frames[currentFrame];
    if (!frame) return;

    const timer = setTimeout(() => {
      if (currentFrame < cutscene.frames.length - 1) {
        setCurrentFrame(currentFrame + 1);
      } else {
        setIsPlaying(false);
        setTimeout(() => onComplete && onComplete(cutscene.impact), 1000);
      }
    }, frame.duration);

    return () => clearTimeout(timer);
  }, [currentFrame, isPlaying, cutscene, onComplete]);

  const skipCutscene = () => {
    setIsPlaying(false);
    onComplete && onComplete(cutscene.impact);
  };

  if (!cutscene || !cutscene.frames[currentFrame]) {
    return null;
  }

  const frame = cutscene.frames[currentFrame];
  const isWrongChoice = choice === 'wrong';

  return (
    <div style={styles.overlay}>
      <div style={{
        ...styles.card,
        borderColor: isWrongChoice ? '#ef4444' : '#22c55e'
      }}>
        {/* Skip button */}
        <button
          onClick={skipCutscene}
          style={styles.skipButton}
        >
          Skip →
        </button>

        {/* Title */}
        <h2 style={{
          ...styles.title,
          color: isWrongChoice ? '#ef4444' : '#22c55e'
        }}>
          {cutscene.title}
        </h2>

        {/* Visual representation */}
        <div style={styles.imageBox}>
          {frame.image}
        </div>

        {/* Frame text */}
        <p style={styles.frameText}>
          {frame.text}
        </p>

        {/* Emotion indicator */}
        <div style={styles.emotionBox}>
          {frame.emotion}
        </div>

        {/* Progress dots */}
        <div style={styles.progressDots}>
          {cutscene.frames.map((_, idx) => (
            <div key={idx} style={{
              ...styles.dot,
              background: idx === currentFrame ? '#3b82f6' : 'rgba(255,255,255,0.2)'
            }}></div>
          ))}
        </div>

        {/* Impact summary (shows at end) */}
        {!isPlaying && (
          <div style={{
            ...styles.impactBox,
            background: isWrongChoice ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            borderColor: isWrongChoice ? '#ef4444' : '#22c55e'
          }}>
            <h3 style={{
              color: isWrongChoice ? '#ef4444' : '#22c55e'
            }}>
              {isWrongChoice ? '💔 Impact Summary' : '🎉 Success Summary'}
            </h3>
            {Object.entries(cutscene.impact).map(([key, value]) => (
              <div key={key} style={styles.impactRow}>
                <span>{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                <span style={{ fontWeight: 'bold' }}>{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Continue button (appears at end) */}
        {!isPlaying && (
          <button
            onClick={() => onComplete && onComplete(cutscene.impact)}
            style={{
              ...styles.continueButton,
              background: isWrongChoice ? '#ef4444' : '#22c55e'
            }}
          >
            {isWrongChoice ? 'Try Again →' : 'Continue Mission →'}
          </button>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    animation: 'fadeIn 0.5s'
  },
  card: {
    maxWidth: '700px',
    width: '90%',
    background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
    padding: '2.5rem',
    borderRadius: '1.5rem',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    position: 'relative',
    border: '3px solid #ef4444'
  },
  skipButton: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 'bold'
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  imageBox: {
    fontSize: '5rem',
    textAlign: 'center',
    marginBottom: '1.5rem',
    animation: 'bounce 1s'
  },
  frameText: {
    fontSize: '1.25rem',
    color: 'white',
    textAlign: 'center',
    lineHeight: '1.6',
    marginBottom: '1.5rem',
    minHeight: '80px',
    margin: '0 0 1.5rem 0'
  },
  emotionBox: {
    fontSize: '3rem',
    textAlign: 'center',
    marginBottom: '1.5rem'
  },
  progressDots: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem'
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    transition: 'background 0.3s'
  },
  impactBox: {
    padding: '1.5rem',
    borderRadius: '1rem',
    marginTop: '1.5rem',
    border: '1px solid #ef4444'
  },
  impactRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    color: 'white',
    fontSize: '0.95rem'
  },
  continueButton: {
    width: '100%',
    padding: '1rem',
    marginTop: '1rem',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default EmotionalCutscene;
