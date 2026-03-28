/**
 * translations.js
 * Central translation map for ScamVerse / NetGuardian UI
 *
 * UPDATED:
 *  - Added full `elder` section in both languages covering:
 *      language-selection prompts, voice-command labels, building names,
 *      big-button labels, safety tips, keyboard hint, status strings
 *  - Building name map now lives here (used by VoiceCommandSystem._translateBuilding)
 *  - nearBuilding() helper added to both locales
 *  - All voice-feedback strings (yes, no, start, callingFamily, etc.) centralised here
 */

export const TRANSLATIONS = {
  en: {
    // ── 3D Interior ────────────────────────────────────────────────────────────
    exitHint: "WASD to move • E to exit",
    talkTo: "Click to talk",
    peopleHere: "People Here",
    loading: "Loading scenario...",
    incoming: "Incoming message",
    received: "RECEIVED A MESSAGE",
    scamAnalysis: "SCAM ANALYSIS",
    redFlags: "RED FLAGS DETECTED",
    aiAnalysis: "🤖 AI ANALYSIS",
    confidence: "confident",
    learnMode: "🧠 LEARN MODE: Why was this a scam?",
    keyIndicators: "Key Indicators:",
    source: "Source:",
    response: "Choose your response:",
    continue: "CONTINUE MISSION →",
    trust: "✅ TRUST",
    ignore: "🤔 IGNORE",
    report: "🚨 REPORT",
    scan: "🔍 Scan",
    hint: "💡 Hint",
    ai: "🤖 AI",
    neutralized: "✅ THREAT NEUTRALIZED",
    breach: "❌ SECURITY BREACH",

    // ── Office components ──────────────────────────────────────────────────────
    bankTitle: "City Bank Headquarters",
    bankSub: "Banking professionals on duty",
    secureBanking: "🏦 SECURE BANKING",
    securityAlert: "⚠️ SECURITY ALERT",
    bankPolicy: "Our staff are trained to recognize fraudulent communications. Help them identify phishing and scam attempts targeting bank customers.",
    leaveBank: "← Leave Bank",
    homeTitle: "Your Private Apartment",
    homeSub: "Safe and secure living space",
    personalSpace: "🏠 PERSONAL SPACE",
    privacyAlert: "⚠️ PRIVACY ALERT",
    leaveHome: "← Leave Home",

    // ── Building names (used by VoiceCommandSystem & proximity labels) ─────────
    buildings: {
      Home: "Home",
      Bank: "Bank",
      Bazaar: "Bazaar",
      "Cyber Cell": "Cyber Cell",
      "Awareness Center": "Awareness Center",
      "Scam Lab": "Scam Lab",
      "Police Station": "Police Station",
      Hospital: "Hospital",
      Market: "Market",
      School: "School",
    },

    /** Returns the proximity announcement string for a given building. */
    nearBuilding: (name) => `You are near the ${name}. Press E to enter.`,

    // ── Elder Mode UI ──────────────────────────────────────────────────────────
    elder: {
      // Screen labels
      headerTitle: "🌟 Elder Mode — बड़ों के लिए",
      backBtn: "← Back / वापस जाएं",
      keyboardHint: "⌨️ Press H = हिंदी  |  Press E = English",

      // Language selector
      langSelectorTitle: "Choose Your Language / भाषा चुनें",
      btnHindi: "🇮🇳 हिंदी",
      btnEnglish: "🇬🇧 English",

      // Voice section
      voiceReadyStatus: "🎤 Voice Commands Ready",
      voiceOnStatus: "🔊 Listening...",
      voiceOffBtn: "🎤 Voice Commands: OFF",
      voiceOnBtn: "🎤 Voice Commands: ON ✅",
      listenPrompt: "🔊 Listening... Say:",

      // Voice command list (shown in grid when mic is active)
      commandList: [
        { cmd: '"start"', desc: "— Start Game" },
        { cmd: '"help"', desc: "— Call Family" },
        { cmd: '"yes"', desc: "— Select Yes" },
        { cmd: '"no"', desc: "— Select No" },
        { cmd: '"repeat"', desc: "— Repeat again" },
        { cmd: '"stop"', desc: "— Pause" },
      ],

      // Big action buttons
      bigBtnGame: "🎮\nStart Game",
      bigBtnGameSub: "खेलना शुरू करें",
      bigBtnExplain: "ℹ️\nWhat is this?",
      bigBtnExplainSub: "यह क्या है?",
      bigBtnHelp: "🚨\nI Need Help!",
      bigBtnHelpSub: "मदद चाहिए!",

      // Safety tips
      tipsHeader: "⚠️ याद रखें — Remember",
      tip1: "📵 No real police officer can arrest you over the phone.",
      tip1sub: "कोई भी सरकारी अधिकारी फोन पर गिरफ्तार नहीं कर सकता।",
      tip2: "🔒 Never share your OTP with anyone.",
      tip2sub: "OTP कभी किसी को न बताएं।",
      tip3: "💳 Never send money over the phone.",
      tip3sub: "फोन पर कोई पैसे नहीं भेजें।",

      // Voice feedback strings (spoken aloud by TTS)
      voice: {
        langSelected: "English selected.",
        activated: "Voice commands activated. Listening.",
        deactivated: "Voice commands deactivated.",
        notRecognized: "Command not recognized. Say help for options.",
        callingFamily: "Calling your registered family member now.",
        gameStarting: "Starting the game.",
        paused: "Paused.",
        yesSelected: "Yes selected.",
        noSelected: "No selected.",
        goingHome: "Going to home screen.",
        recognized: (cmd) => `Command recognized: ${cmd}`,
        openPrompt: "Welcome to Elder Mode. Press H for Hindi. Press E for English.",
      },
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  hi: {
    // ── 3D Interior ────────────────────────────────────────────────────────────
    exitHint: "चलने के लिए WASD • निकलने के लिए E",
    talkTo: "बात करने के लिए क्लिक करें",
    peopleHere: "यहाँ मौजूद लोग",
    loading: "मिशन लोड हो रहा है...",
    incoming: "एक नया संदेश आया है",
    received: "कॉल/मैसेज प्राप्त हुआ",
    scamAnalysis: "स्कैम की जाँच",
    redFlags: "खतरे के निशान (Red Flags)",
    aiAnalysis: "🤖 AI द्वारा जाँच",
    confidence: "भरोसेमंद",
    learnMode: "🧠 जानकारी: यह स्कैम कैसे था?",
    keyIndicators: "मुख्य चीज़ें:",
    source: "स्रोत (Source):",
    response: "अपनी प्रतिक्रिया चुनें:",
    continue: "मिशन जारी रखें →",
    trust: "✅ भरोसा करें",
    ignore: "🤔 नज़रअंदाज़ करें",
    report: "🚨 रिपोर्ट करें",
    scan: "🔍 जाँचें",
    hint: "💡 संकेत",
    ai: "🤖 AI",
    neutralized: "✅ खतरा टल गया",
    breach: "❌ सुरक्षा में सेंध",

    // ── Office components ──────────────────────────────────────────────────────
    bankTitle: "सिटी बैंक मुख्यालय",
    bankSub: "बैंकिंग अधिकारी ड्यूटी पर",
    secureBanking: "🏦 सुरक्षित बैंकिंग",
    securityAlert: "⚠️ सुरक्षा चेतावनी",
    bankPolicy: "हमारा स्टाफ फ्रॉड को पहचानने के लिए प्रशिक्षित है। बैंक ग्राहकों को निशाना बनाने वाले फिशिंग और स्कैम को पहचानने में उनकी मदद करें।",
    leaveBank: "← बैंक से निकलें",
    homeTitle: "आपका घर",
    homeSub: "सुरक्षित निजी स्थान",
    personalSpace: "🏠 व्यक्तिगत स्थान",
    privacyAlert: "⚠️ गोपनीयता चेतावनी",
    leaveHome: "← घर से निकलें",

    // ── Building names ─────────────────────────────────────────────────────────
    buildings: {
      Home: "घर",
      Bank: "बैंक",
      Bazaar: "बाज़ार",
      "Cyber Cell": "साइबर सेल",
      "Awareness Center": "जागरूकता केंद्र",
      "Scam Lab": "स्कैम लैब",
      "Police Station": "पुलिस थाना",
      Hospital: "अस्पताल",
      Market: "बाज़ार",
      School: "विद्यालय",
    },

    /** Returns the proximity announcement string for a given building in Hindi. */
    nearBuilding: (name, buildings) => {
      const hn = (buildings || TRANSLATIONS.hi.buildings)[name] || name;
      return `आप ${hn} के पास हैं। अंदर जाने के लिए E दबाएं।`;
    },

    // ── Elder Mode UI ──────────────────────────────────────────────────────────
    elder: {
      // Screen labels
      headerTitle: "🌟 Elder Mode — बड़ों के लिए",
      backBtn: "← वापस जाएं",
      keyboardHint: "⌨️ H दबाएं = हिंदी  |  E दबाएं = English",

      // Language selector
      langSelectorTitle: "भाषा चुनें / Choose Language",
      btnHindi: "🇮🇳 हिंदी",
      btnEnglish: "🇬🇧 English",

      // Voice section
      voiceReadyStatus: "🎤 आवाज़ सहायता तैयार है",
      voiceOnStatus: "🔊 सुन रहे हैं...",
      voiceOffBtn: "🎤 आवाज़ सहायता: बंद",
      voiceOnBtn: "🎤 आवाज़ सहायता: चालू ✅",
      listenPrompt: "🔊 सुन रहे हैं... बोलें:",

      // Voice command list (shown in grid when mic is active)
      commandList: [
        { cmd: '"शुरू करो"', desc: "— खेल शुरू करें" },
        { cmd: '"मदद चाहिए"', desc: "— परिवार को बुलाएं" },
        { cmd: '"हाँ"', desc: "— हाँ चुनें" },
        { cmd: '"नहीं"', desc: "— नहीं चुनें" },
        { cmd: '"दोबारा बोलो"', desc: "— फिर से सुनें" },
        { cmd: '"रुको"', desc: "— रोकें" },
      ],

      // Big action buttons
      bigBtnGame: "🎮\nखेलना शुरू करें",
      bigBtnGameSub: "Start Game",
      bigBtnExplain: "ℹ️\nयह क्या है?",
      bigBtnExplainSub: "What is this?",
      bigBtnHelp: "🚨\nमदद चाहिए!",
      bigBtnHelpSub: "I Need Help!",

      // Safety tips
      tipsHeader: "⚠️ याद रखें — Remember",
      tip1: "📵 कोई भी सरकारी अधिकारी फोन पर गिरफ्तार नहीं कर सकता।",
      tip1sub: "No real police officer can arrest you over the phone.",
      tip2: "🔒 OTP कभी किसी को न बताएं।",
      tip2sub: "Never share your OTP with anyone.",
      tip3: "💳 फोन पर कोई पैसे नहीं भेजें।",
      tip3sub: "Never send money over the phone.",

      // Voice feedback strings (spoken aloud by TTS)
      voice: {
        langSelected: "हिंदी भाषा चुनी गई। अब आप हिंदी में बात कर सकते हैं।",
        activated: "आवाज़ सहायता शुरू हो गई है। हम सुन रहे हैं।",
        deactivated: "आवाज़ सहायता बंद हो गई है।",
        notRecognized: "माफ़ करें, समझ नहीं आया। सहायता के लिए मदद बोलें।",
        callingFamily: "आपके परिवार को अभी फोन किया जा रहा है।",
        gameStarting: "खेल शुरू हो रहा है।",
        paused: "रोक दिया गया।",
        yesSelected: "हाँ चुना गया।",
        noSelected: "नहीं चुना गया।",
        goingHome: "मुख्य पृष्ठ पर जा रहे हैं।",
        recognized: (cmd) => `आदेश मिला: ${cmd}`,
        openPrompt: "एल्डर मोड में आपका स्वागत है। हिंदी के लिए H दबाएं। English के लिए E दबाएं।",
      },
    },
  },
};

/**
 * Convenience accessor — returns the translation value at a dot-separated path
 * for the given language, falling back to English if missing.
 *
 * Example:
 *   t('hi', 'elder.voice.activated')   // → "आवाज़ सहायता शुरू हो गई है।..."
 *   t('en', 'elder.commandList')       // → [{cmd,desc}, ...]
 *   t('hi', 'nearBuilding')('Bank')    // → "आप बैंक के पास हैं।..."
 *
 * @param {'en'|'hi'} lang
 * @param {string} path  dot-separated key path
 * @returns {*}
 */
export function t(lang, path) {
  const keys = path.split('.');
  let node = TRANSLATIONS[lang] ?? TRANSLATIONS.en;
  let enNode = TRANSLATIONS.en;

  for (const key of keys) {
    node = node?.[key];
    enNode = enNode?.[key];
  }

  return node ?? enNode;
}