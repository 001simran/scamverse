/*
 * DeepfakeDetectionModule.jsx
 * AI-Powered Deepfake Challenge Component
 * Trains players to identify AI-generated deepfakes
 */

import React, { useState, useEffect } from 'react';

const DeepfakeDetectionModule = ({ onComplete }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [answered, setAnswered] = useState(false);

  // Deepfake scenarios with red flags
  const scenarios = [
    {
      id: 1,
      title: "Your Son in Accident",
      audioFile: "/audio/son_accident.mp3",
      isDeepfake: true,
      redFlags: [
        "Unnatural pauses mid-sentence",
        "Background noise inconsistency",
        "Voice pitch changes unnaturally"
      ],
      explanation: "This was AI-generated using voice cloning. Notice the robotic pauses and sudden background noise changes.",
      script: "Hello mom, I had an accident near the highway. I'm in police custody. Please send ₹50,000 immediately."
    },
    {
      id: 2,
      title: "Bank Manager Call",
      audioFile: "/audio/bank_manager.mp3",
      isDeepfake: false,
      redFlags: [],
      explanation: "This is a real recording. Natural breathing patterns and consistent background.",
      script: "Hi Mr. Sharma, this is HDFC Bank. Your credit card transaction limits have been updated."
    },
    {
      id: 3,
      title: "KBC Winner Notification",
      audioFile: "/audio/kbc_lottery.mp3",
      isDeepfake: true,
      redFlags: [
        "Identical tone throughout - no emotion variation",
        "No lip-smacking or natural mouth sounds",
        "Perfect pronunciation (AI doesn't make human mistakes)"
      ],
      explanation: "AI clones are TOO perfect. Real humans stumble, breathe, have imperfect speech.",
      script: "Congratulations! You have been selected as the winner of 25 lakh rupees in the KBC lottery draw."
    },
    {
      id: 4,
      title: "Police Inspector Warning",
      audioFile: "/audio/police_warning.mp3",
      isDeepfake: true,
      redFlags: [
        "No room echo (AI removes natural reverb)",
        "Voice doesn't match supposed age (claims 50, sounds 30)",
        "Urgency feels scripted"
      ],
      explanation: "Scammers use AI to sound authoritative. Real police officers rarely call like this.",
      script: "This is CBI Inspector Rajesh. Your Aadhaar has been linked to a fraudulent transaction. Action within 2 hours."
    },
    {
      id: 5,
      title: "Relative Emergency",
      audioFile: "/audio/relative_emergency.mp3",
      isDeepfake: false,
      redFlags: [],
      explanation: "Real call with genuine panic. Notice the imperfect speech and emotional variation.",
      script: "*nervously* Hey mom, I... I need help. The car broke down. There's some problem with cash."
    }
  ];

  const playAudio = () => {
    setIsPlaying(true);
    const audio = new Audio(scenarios[currentScenario].audioFile);
    audio.play().catch(err => {
      console.warn('Audio playback error:', err);
      setIsPlaying(false);
    });
    audio.onended = () => setIsPlaying(false);
  };

  const handleChoice = (userSaysDeepfake) => {
    const scenario = scenarios[currentScenario];
    const correct = userSaysDeepfake === scenario.isDeepfake;

    if (correct) {
      setScore(score + 1);
      setFeedback('✅ CORRECT! ' + scenario.explanation);
    } else {
      setFeedback('❌ WRONG! ' + scenario.explanation);
    }

    setAnswered(true);

    // Auto-advance after feedback
    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(currentScenario + 1);
        setFeedback('');
        setAnswered(false);
      } else {
        // Module complete
        const accuracy = ((score + (correct ? 1 : 0)) / scenarios.length * 100).toFixed(0);
        onComplete({
          score: score + (correct ? 1 : 0),
          total: scenarios.length,
          accuracy: accuracy,
          passStatus: accuracy >= 80 ? 'EXPERT' : accuracy >= 60 ? 'AWARE' : 'NEEDS_PRACTICE'
        });
      }
    }, 5000);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎭 Deepfake Detection Challenge</h2>
      
      <div style={styles.progressBar}>
        <div style={{
          ...styles.progressFill,
          width: `${((currentScenario + 1) / scenarios.length) * 100}%`
        }}></div>
      </div>

      <div style={styles.scenarioCard}>
        <h3 style={styles.scenarioNumber}>
          Scenario {currentScenario + 1} of {scenarios.length}
        </h3>
        <p style={styles.scenarioTitle}>📞 {scenarios[currentScenario].title}</p>

        {/* Script preview */}
        <div style={styles.scriptBox}>
          <p style={styles.scriptText}>
            "{scenarios[currentScenario].script}"
          </p>
        </div>

        <button
          onClick={playAudio}
          disabled={isPlaying}
          style={{
            ...styles.playButton,
            opacity: isPlaying ? 0.7 : 1,
            cursor: isPlaying ? 'not-allowed' : 'pointer'
          }}
        >
          {isPlaying ? '▶ Playing...' : '🔊 Play Audio'}
        </button>

        {!answered && (
          <div style={styles.choiceButtons}>
            <button
              onClick={() => handleChoice(true)}
              style={styles.deepfakeButton}
            >
              🚨 DEEPFAKE
            </button>
            <button
              onClick={() => handleChoice(false)}
              style={styles.realButton}
            >
              ✅ REAL
            </button>
          </div>
        )}
      </div>

      {feedback && (
        <div style={{
          ...styles.feedback,
          background: feedback.includes('CORRECT') ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          borderColor: feedback.includes('CORRECT') ? '#22c55e' : '#ef4444'
        }}>
          <p style={styles.feedbackText}>{feedback}</p>
          
          {scenarios[currentScenario].redFlags.length > 0 && (
            <div style={styles.redFlags}>
              <p style={styles.redFlagsLabel}>🚩 Red Flags:</p>
              <ul style={styles.flagsList}>
                {scenarios[currentScenario].redFlags.map((flag, idx) => (
                  <li key={idx} style={styles.flagItem}>{flag}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div style={styles.scoreDisplay}>
        Score: {score} / {scenarios.length}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '1rem',
    color: 'white',
    maxWidth: '700px',
    margin: '0 auto'
  },
  title: {
    fontSize: '1.75rem',
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  progressBar: {
    height: '10px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '5px',
    marginBottom: '2rem',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: '#4ade80',
    transition: 'width 0.5s ease'
  },
  scenarioCard: {
    background: 'rgba(0,0,0,0.2)',
    padding: '2rem',
    borderRadius: '1rem',
    marginBottom: '2rem',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  scenarioNumber: {
    fontSize: '1rem',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: '0.5rem'
  },
  scenarioTitle: {
    fontSize: '1.3rem',
    marginBottom: '1rem',
    fontWeight: 'bold'
  },
  scriptBox: {
    background: 'rgba(0,0,0,0.3)',
    padding: '1rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    borderLeft: '3px solid #3b82f6'
  },
  scriptText: {
    fontSize: '1rem',
    fontStyle: 'italic',
    lineHeight: '1.5'
  },
  playButton: {
    width: '100%',
    padding: '1rem',
    fontSize: '1.1rem',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    marginBottom: '1.5rem',
    fontWeight: 'bold',
    transition: 'background 0.3s'
  },
  choiceButtons: {
    display: 'flex',
    gap: '1rem'
  },
  deepfakeButton: {
    flex: 1,
    padding: '1rem',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  realButton: {
    flex: 1,
    padding: '1rem',
    background: '#22c55e',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  feedback: {
    background: 'rgba(34, 197, 94, 0.15)',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    marginBottom: '1.5rem',
    border: '2px solid #22c55e',
    borderLeft: '5px solid #22c55e'
  },
  feedbackText: {
    fontSize: '1.1rem',
    marginBottom: '1rem',
    fontWeight: 'bold'
  },
  redFlags: {
    marginTop: '1rem'
  },
  redFlagsLabel: {
    fontWeight: 'bold',
    marginBottom: '0.5rem'
  },
  flagsList: {
    marginLeft: '1.5rem',
    fontSize: '0.95rem'
  },
  flagItem: {
    marginBottom: '0.3rem'
  },
  scoreDisplay: {
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginTop: '1rem'
  }
};

export default DeepfakeDetectionModule;
