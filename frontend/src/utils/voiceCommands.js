/**
 * VoiceCommandSystem.js
 * Advanced Web Speech API wrapper for ScamVerse
 * Supports Hindi and English commands for Elderly Accessibility (Elder Mode)
 */

class VoiceCommandSystem {
  // ── Static Shared State (Prevents multiple instances from speaking confirmation twice) ──
  static hasSpokenLangOnce = false;

  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported in this browser.");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.languageMode = 'en';          // 'en' | 'hi'  — set via setLanguage() or H/E key
    this.currentLanguageCode = 'en-US'; // passed to recognition.lang and utterance.lang

    this._setupRecognition();

    // ── Localised UI strings ──────────────────────────────────────────────────
    this.strings = {
      en: {
        activated: "Voice commands activated. Listening.",
        deactivated: "Voice commands deactivated.",
        notRecognized: "Command not recognized. Say help for options.",
        callingFamily: "Calling your registered family member now.",
        gameStarting: "Starting the game.",
        paused: "Paused.",
        yesSelected: "Yes selected.",
        noSelected: "No selected.",
        goingHome: "Going to home screen.",
        langSelected: "English selected.",
        recognized: (cmd) => `Command recognized: ${cmd}`,
        nearBuilding: (name) => `You are near the ${name}. Press E to enter.`,
      },
      hi: {
        activated: "आवाज़ सहायता शुरू हो गई है। हम सुन रहे हैं।",
        deactivated: "आवाज़ सहायता बंद हो गई है।",
        notRecognized: "माफ़ करें, समझ नहीं आया। सहायता के लिए मदद बोलें।",
        callingFamily: "आपके परिवार को अभी फोन किया जा रहा है।",
        gameStarting: "खेल शुरू हो रहा है।",
        paused: "रोक दिया गया।",
        yesSelected: "हाँ चुना गया।",
        noSelected: "नहीं चुना गया।",
        goingHome: "मुख्य पृष्ठ पर जा रहे हैं।",
        langSelected: "हिंदी भाषा चुनी गई।",
        recognized: (cmd) => `आदेश मिला: ${cmd}`,
        nearBuilding: (name) => `आप ${this._translateBuilding(name)} के पास हैं। अंदर जाने के लिए E दबाएं।`,
      },
    };

    // ── Building name map (English → Hindi) ──────────────────────────────────
    this._buildingNames = {
      'Home': 'घर',
      'Bank': 'बैंक',
      'Bazaar': 'बाज़ार',
      'Cyber Cell': 'साइबर सेल',
      'Awareness Center': 'जागरूकता केंद्र',
      'Scam Lab': 'स्कैम लैब',
      'Police Station': 'पुलिस थाना',
      'Hospital': 'अ अस्पताल',
      'Market': 'बाज़ार',
      'School': 'विद्यालय',
    };

    // ── Command map: trigger → action ─────────────────────────────────────────
    this._commands = {
      // Hindi triggers
      'शुरू करो': () => { this.speak(this._s('gameStarting')); this.startGame(); },
      'मदद चाहिए': () => { this.callFamily(); },
      'मदद': () => { this.callFamily(); },
      'यह क्या है': () => { this.explainScenario(); },
      'हाँ': () => { this.speak(this._s('yesSelected')); this.selectYes(); },
      'हां': () => { this.speak(this._s('yesSelected')); this.selectYes(); },
      'नहीं': () => { this.speak(this._s('noSelected')); this.selectNo(); },
      'रुको': () => { this.speak(this._s('paused')); this.pause(); },
      'दोबारा बोलो': () => { this.repeatLastMessage(); },
      'घर': () => { this.speak(this._s('goingHome')); this.goHome(); },
      // English triggers
      'start': () => { this.speak(this._s('gameStarting')); this.startGame(); },
      'begin': () => { this.speak(this._s('gameStarting')); this.startGame(); },
      'help': () => { this.callFamily(); },
      'what is this': () => { this.explainScenario(); },
      'yes': () => { this.speak(this._s('yesSelected')); this.selectYes(); },
      'no': () => { this.speak(this._s('noSelected')); this.selectNo(); },
      'stop': () => { this.speak(this._s('paused')); this.pause(); },
      'repeat': () => { this.repeatLastMessage(); },
      'home': () => { this.speak(this._s('goingHome')); this.goHome(); },
    };
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  /** Current language string bag */
  _s(key) { return this.strings[this.languageMode][key]; }

  /** Translate building name to Hindi if language is hi, else return as-is */
  _translateBuilding(name) {
    return (this.languageMode === 'hi' && this._buildingNames?.[name])
      ? this._buildingNames[name]
      : name;
  }

  _setupRecognition() {
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = this.currentLanguageCode;

    this.recognition.onresult = (event) => {
      const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log("Voice Command Recognized:", command);
      this.processCommand(command);
    };

    this.recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        try { this.recognition.start(); } catch (e) { }
      }
    };
  }

  /**
   * Keyboard shortcut helper (called from React App.jsx)
   */
  handleKeyDown(e) {
    if (e.key === 'h' || e.key === 'H') this.setLanguage('hi');
    else if (e.key === 'e' || e.key === 'E') this.setLanguage('en');
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  /**
   * Switch active language. Updates recognition lang code, re-starts recognition
   * if already running, and speaks a confirmation in the new language.
   * @param {'en'|'hi'} lang
   * @param {boolean} isElder - NEW: passed to potentially skip speech feedback
   */
  setLanguage(lang, isElder = false) {
    // Only speak once in normal mode per user request: "just once only in normal mode"
    if (!VoiceCommandSystem.hasSpokenLangOnce && !isElder) {
      if (this.strings && this.strings[lang]) {
        this.speak(this.strings[lang].langSelected);
      }
      VoiceCommandSystem.hasSpokenLangOnce = true;
    }

    if (this.languageMode === lang) return; // Skip if no change
    
    this.languageMode = lang;
    this.currentLanguageCode = lang === 'hi' ? 'hi-IN' : 'en-US';

    const wasListening = this.isListening;
    this.stopListening();
    this.recognition.lang = this.currentLanguageCode;
    if (wasListening) this.startListening();

    // Fire event so UI can re-render language pills / command list
    window.dispatchEvent(new CustomEvent('voice-language-changed', { detail: { lang } }));
  }

  /**
   * Process a recognised transcript.
   * @param {string} command - lowercase transcript
   */
  processCommand(command) {
    for (const [trigger, action] of Object.entries(this._commands)) {
      if (command.includes(trigger)) {
        this.speak(this._s('recognized')(trigger));
        action();
        return;
      }
    }
    if (command.length > 2) {
      this.speak(this._s('notRecognized'));
    }
  }

  /**
   * Speak text using the currently active language's voice.
   * @param {string} text
   * @param {object} options - { rate, pitch, volume }
   */
  speak(text, options = {}) {
    if (!this.synthesis || !text) return;
    this.synthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate ?? 0.85;
    utterance.pitch = options.pitch ?? 1.0;
    utterance.volume = options.volume ?? 1.0;
    utterance.lang = this.currentLanguageCode; // ← key change: always matches language
    this.synthesis.speak(utterance);
  }

  /**
   * Announce proximity to a building in the active language.
   * Building name is automatically translated to Hindi when lang = 'hi'.
   * @param {string} buildingName - English building name key
   */
  speakProximity(buildingName) {
    this.speak(this._s('nearBuilding')(buildingName));
  }

  startListening() {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
        this.isListening = true;
      } catch (e) {
        console.error("Failed to start recognition:", e);
      }
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Called when the Elder Mode screen opens.
   * Speaks a bilingual prompt so the user knows to press H or E.
   */
  onElderScreenOpen() {
    setTimeout(() => {
      this.synthesis.cancel();
      const utter = new SpeechSynthesisUtterance(
        'Welcome to Elder Mode. ' +
        'Press H for Hindi. हिंदी के लिए H दबाएं। ' +
        'Press E for English. English के लिए E दबाएं।'
      );
      utter.lang = 'en-US';
      utter.rate = 0.78;
      this.synthesis.speak(utter);
    }, 350);
  }

  // ── Game action dispatchers ─────────────────────────────────────────────────

  startGame() { window.dispatchEvent(new CustomEvent('voice-start-game')); }
  goHome() { window.dispatchEvent(new CustomEvent('voice-go-home')); }
  pause() { window.dispatchEvent(new CustomEvent('voice-pause')); }
  repeatLastMessage() { window.dispatchEvent(new CustomEvent('voice-repeat')); }
  explainScenario() { window.dispatchEvent(new CustomEvent('voice-explain')); }

  callFamily() {
    window.dispatchEvent(new CustomEvent('voice-emergency'));
    this.speak(this._s('callingFamily'));
  }

  selectYes() {
    window.dispatchEvent(new CustomEvent('voice-select', { detail: { choice: 'yes' } }));
  }

  selectNo() {
    window.dispatchEvent(new CustomEvent('voice-select', { detail: { choice: 'no' } }));
  }
}

export default VoiceCommandSystem;