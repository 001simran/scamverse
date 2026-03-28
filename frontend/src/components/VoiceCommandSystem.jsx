/*
 * VoiceCommandSystem.jsx
 * Voice-First Interface for Elderly Users
 * Uses Web Speech API for Hindi and English support
 */

import React, { useState, useEffect, useRef } from 'react';

const VoiceCommandSystem = ({ onCommand, enabled = true }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [language, setLanguage] = useState('hi-IN');
  const [supportedBrowser, setSupportedBrowser] = useState(true);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      setSupportedBrowser(false);
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = language;

    recognitionRef.current.onstart = () => {
      console.log('Speech recognition started');
    };

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(interimTranscript || finalTranscript);

      if (finalTranscript) {
        processCommand(finalTranscript.trim().toLowerCase());
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognitionRef.current.onend = () => {
      if (isListening && enabled) {
        recognitionRef.current.start();
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, isListening, enabled]);

  // Command mapping (Hindi + English)
  const commandMap = {
    // Start/Stop
    'शुरू करो': 'START',
    'start': 'START',
    'begin': 'START',
    'शुरू': 'START',
    
    'बंद करो': 'STOP',
    'stop': 'STOP',
    'रुको': 'STOP',
    
    // Navigation
    'आगे': 'NEXT',
    'next': 'NEXT',
    'अगला': 'NEXT',
    
    'पीछे': 'BACK',
    'back': 'BACK',
    'वापस': 'BACK',
    
    // Choices
    'हाँ': 'YES',
    'yes': 'YES',
    'ठीक है': 'YES',
    'okay': 'YES',
    
    'नहीं': 'NO',
    'no': 'NO',
    'ना': 'NO',
    
    // Scam detection
    'स्कैम': 'SCAM_DETECTED',
    'scam': 'SCAM_DETECTED',
    'धोखा': 'SCAM_DETECTED',
    
    'सही है': 'TRUST',
    'trust': 'TRUST',
    'विश्वास': 'TRUST',
    
    // Help
    'मदद': 'HELP',
    'help': 'HELP',
    'मदद चाहिए': 'HELP',
    
    // Family alert
    'परिवार': 'CALL_FAMILY',
    'family': 'CALL_FAMILY',
    'बेटे को बुलाओ': 'CALL_FAMILY',
    
    // Repeat
    'दोबारा': 'REPEAT',
    'repeat': 'REPEAT',
    'फिर से': 'REPEAT',
    
    // Explain
    'समझाओ': 'EXPLAIN',
    'explain': 'EXPLAIN',
    'क्या है': 'EXPLAIN'
  };

  const processCommand = (text) => {
    let matchedCommand = null;
    
    for (const [phrase, command] of Object.entries(commandMap)) {
      if (text.includes(phrase)) {
        matchedCommand = command;
        break;
      }
    }

    if (matchedCommand) {
      setLastCommand(matchedCommand);
      onCommand(matchedCommand);
      speakFeedback(matchedCommand);
    } else {
      speakFeedback('NOT_UNDERSTOOD');
    }
  };

  const speakFeedback = (command) => {
    const feedbackMap = {
      'START': language === 'hi-IN' ? 'शुरू कर रहे हैं' : 'Starting',
      'STOP': language === 'hi-IN' ? 'रुक रहे हैं' : 'Stopping',
      'NEXT': language === 'hi-IN' ? 'अगला' : 'Next',
      'BACK': language === 'hi-IN' ? 'पीछे जा रहे हैं' : 'Going back',
      'YES': language === 'hi-IN' ? 'हाँ, समझे' : 'Yes, understood',
      'NO': language === 'hi-IN' ? 'नहीं, ठीक है' : 'No, okay',
      'SCAM_DETECTED': language === 'hi-IN' ? 'बहुत अच्छे! यह स्कैम है' : 'Good! This is a scam',
      'TRUST': language === 'hi-IN' ? 'ध्यान से सोचिए' : 'Think carefully',
      'HELP': language === 'hi-IN' ? 'मदद के लिए परिवार को अलर्ट भेज रहे हैं' : 'Alerting family',
      'CALL_FAMILY': language === 'hi-IN' ? 'परिवार को बुला रहे हैं' : 'Calling family',
      'REPEAT': language === 'hi-IN' ? 'दोबारा बोल रहे हैं' : 'Repeating',
      'EXPLAIN': language === 'hi-IN' ? 'समझा रहे हैं' : 'Explaining',
      'NOT_UNDERSTOOD': language === 'hi-IN' ? 'समझ नहीं आया। दोबारा बोलिए' : 'Did not understand. Please repeat'
    };

    const text = feedbackMap[command] || feedbackMap['NOT_UNDERSTOOD'];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.8; // Slower for elderly
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  if (!supportedBrowser) {
    return (
      <div style={styles.unsupportedBrowser}>
        <p>⚠️ Voice commands require Chrome, Edge, or Safari browser</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🎤 Voice Commands</h3>

      <button
        onClick={toggleListening}
        style={{
          ...styles.listeningButton,
          background: isListening ? '#ef4444' : '#22c55e',
          boxShadow: isListening ? '0 0 20px rgba(239, 68, 68, 0.5)' : 'none'
        }}
      >
        {isListening ? '🔴 Listening...' : '🎤 Tap to Speak'}
      </button>

      {transcript && (
        <div style={styles.transcriptBox}>
          <p style={styles.transcriptText}>"{transcript}"</p>
        </div>
      )}

      {lastCommand && (
        <div style={styles.commandBox}>
          <p style={styles.commandText}>✅ Command: {lastCommand}</p>
        </div>
      )}

      <div style={styles.languageSection}>
        <p style={styles.languageLabel}>Language:</p>
        <div style={styles.languageButtons}>
          <button
            onClick={() => setLanguage('hi-IN')}
            style={{
              ...styles.langButton,
              background: language === 'hi-IN' ? '#3b82f6' : '#e5e7eb',
              color: language === 'hi-IN' ? 'white' : '#4b5563'
            }}
          >
            हिंदी
          </button>
          <button
            onClick={() => setLanguage('en-IN')}
            style={{
              ...styles.langButton,
              background: language === 'en-IN' ? '#3b82f6' : '#e5e7eb',
              color: language === 'en-IN' ? 'white' : '#4b5563'
            }}
          >
            English
          </button>
        </div>
      </div>

      <div style={styles.helpBox}>
        <p style={styles.helpTitle}>Say these commands:</p>
        <ul style={styles.helpList}>
          <li>"शुरू करो" - Start</li>
          <li>"हाँ" / "नहीं" - Yes/No</li>
          <li>"मदद चाहिए" - Help</li>
          <li>"यह स्कैम है" - Report scam</li>
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    background: 'white',
    padding: '1.5rem',
    borderRadius: '1rem',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    maxWidth: '320px',
    zIndex: 1000
  },
  title: {
    fontSize: '1.25rem',
    marginBottom: '1rem',
    color: '#1f2937',
    fontWeight: 'bold'
  },
  listeningButton: {
    width: '100%',
    padding: '1rem',
    fontSize: '1.1rem',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    marginBottom: '1rem',
    fontWeight: 'bold',
    transition: 'all 0.3s'
  },
  transcriptBox: {
    padding: '0.75rem',
    background: '#f3f4f6',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    minHeight: '50px'
  },
  transcriptText: {
    fontSize: '0.9rem',
    color: '#4b5563',
    fontStyle: 'italic',
    margin: 0
  },
  commandBox: {
    padding: '0.75rem',
    background: '#dcfce7',
    borderRadius: '0.5rem',
    marginBottom: '1rem'
  },
  commandText: {
    fontSize: '0.85rem',
    color: '#166534',
    fontWeight: 'bold',
    margin: 0
  },
  languageSection: {
    marginTop: '1rem',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '1rem'
  },
  languageLabel: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginBottom: '0.5rem',
    margin: 0
  },
  languageButtons: {
    display: 'flex',
    gap: '0.5rem'
  },
  langButton: {
    flex: 1,
    padding: '0.5rem',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    transition: 'all 0.3s'
  },
  helpBox: {
    marginTop: '1rem',
    padding: '0.75rem',
    background: '#fffbeb',
    borderRadius: '0.5rem',
    fontSize: '0.75rem',
    color: '#92400e'
  },
  helpTitle: {
    fontWeight: 'bold',
    marginBottom: '0.25rem',
    margin: 0
  },
  helpList: {
    marginLeft: '1rem',
    lineHeight: '1.5',
    paddingLeft: '1rem'
  },
  unsupportedBrowser: {
    padding: '1rem',
    background: '#fed7aa',
    color: '#92400e',
    borderRadius: '0.5rem',
    fontSize: '0.9rem'
  }
};

export default VoiceCommandSystem;
