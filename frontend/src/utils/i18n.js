/*
 * i18n.js
 * Internationalization (Hindi & English) support
 */

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    game: 'Start Game',
    leaderboard: 'Leaderboard',
    impact: 'Impact',
    settings: 'Settings',

    // Common
    start: 'Start',
    stop: 'Stop',
    next: 'Next',
    back: 'Back',
    submit: 'Submit',
    cancel: 'Cancel',
    skip: 'Skip',
    loading: 'Loading...',

    // Game
    mission: 'Mission',
    level: 'Level',
    xp: 'XP',
    score: 'Score',
    choice1: 'Report to CBI',
    choice2: 'Hang Up',
    choice3: 'Transfer Money',

    // Scams
    digitalArrest: 'Digital Arrest',
    kbcLottery: 'KBC Lottery',
    fakeLoanApp: 'Fake Loan App',
    investmentScam: 'Investment Scam',
    phishing: 'Phishing',

    // Verdicts
    correct: 'Correct!',
    incorrect: 'Incorrect',
    scamDetected: 'Scam Detected',
    safe: 'Safe',

    // Elder Mode
    elderMode: 'Elder Mode',
    voiceCommands: 'Voice Commands',
    callFamily: 'Call Family',

    // Messages
    welcome: 'Welcome to NetGuardian',
    selectLevel: 'Select your level',
    gameOver: 'Game Over',
    congratulations: 'Congratulations!',
    tryAgain: 'Try Again',

    // Stats
    playersTrained: 'Players Trained',
    familyProtected: 'Family Protected',
    moneyProtected: 'Money Protected',
    scamsSpotted: 'Scams Spotted'
  },

  hi: {
    // Navigation
    home: 'होम',
    game: 'खेल शुरू करें',
    leaderboard: 'लीडरबोर्ड',
    impact: 'प्रभाव',
    settings: 'सेटिंग्स',

    // Common
    start: 'शुरू करें',
    stop: 'रुकें',
    next: 'अगला',
    back: 'वापस',
    submit: 'जमा करें',
    cancel: 'रद्द करें',
    skip: 'छोड़ें',
    loading: 'लोड हो रहा है...',

    // Game
    mission: 'मिशन',
    level: 'स्तर',
    xp: 'XP',
    score: 'स्कोर',
    choice1: 'CBI को रिपोर्ट करें',
    choice2: 'कॉल बंद करें',
    choice3: 'पैसे भेजें',

    // Scams
    digitalArrest: 'डिजिटल गिरफ्तारी',
    kbcLottery: 'KBC लॉटरी',
    fakeLoanApp: 'नकली ऋण ऐप',
    investmentScam: 'निवेश स्कैम',
    phishing: 'फिशिंग',

    // Verdicts
    correct: 'सही है!',
    incorrect: 'गलत है',
    scamDetected: 'स्कैम पकड़ा गया',
    safe: 'सुरक्षित है',

    // Elder Mode
    elderMode: 'बड़ों के लिए मोड',
    voiceCommands: 'आवाज कमांड',
    callFamily: 'परिवार को बुलाएं',

    // Messages
    welcome: 'नेटगार्डियन में आपका स्वागत है',
    selectLevel: 'अपना स्तर चुनें',
    gameOver: 'खेल खत्म',
    congratulations: 'बधाई हो!',
    tryAgain: 'फिर से कोशिश करें',

    // Stats
    playersTrained: 'खिलाड़ी प्रशिक्षित',
    familyProtected: 'परिवार सुरक्षित',
    moneyProtected: 'पैसे बचाए',
    scamsSpotted: 'स्कैम पकड़े'
  }
};

export const useTranslation = (language = 'en') => {
  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return { t };
};

// Usage example:
// const { t } = useTranslation('en');
// <button>{t('start')}</button>
