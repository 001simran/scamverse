// ScamVerse - HackMol 7.0
// ElderVoice.js - voice system
// no imports needed - uses browser built in speech

const ElderVoice = {

  isSupported: () => {
    return 'speechSynthesis' in window
  },

  stop: () => {
    try {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    } catch(e) {
      console.log('stop voice error', e)
    }
  },

  speak: (text, options = {}) => {
    try {
      if (!ElderVoice.isSupported()) return
      ElderVoice.stop()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate   = options.rate   || 0.8
      utterance.pitch  = options.pitch  || 1.0
      utterance.volume = options.volume || 1.0
      utterance.lang   = 'hi-IN'

      // get voices after they load
      const trySpeak = () => {
        const voices = window.speechSynthesis.getVoices()
        const hindi = voices.find(v =>
          v.lang === 'hi-IN' || v.lang.startsWith('hi')
        )
        const indian = voices.find(v => v.lang === 'en-IN')
        if (hindi) utterance.voice = hindi
        else if (indian) { utterance.voice = indian; utterance.lang = 'en-IN' }
        else utterance.lang = 'en-US'
        window.speechSynthesis.speak(utterance)
      }

      // voices may not be loaded yet
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = trySpeak
      } else {
        trySpeak()
      }

    } catch(e) {
      console.log('speak error', e)
    }
  },

  sayWelcome: (playerName) => {
    ElderVoice.speak(
      `Namaste ${playerName} ji! Main aapka CyberGuide hoon. ` +
      `Aaj hum cyber fraud se bachna seekhenge.`
    )
  },

  sayNearBuilding: (buildingName) => {
    ElderVoice.speak(
      `${buildingName} ke paas hain. Andar jaane ke liye bada button dabayein.`
    )
  },

  sayScenario: (message, sender) => {
    ElderVoice.speak(
      `${sender} se message aaya hai. Suniye: ${message}. ` +
      `Kya yeh sahi hai ya fraud?`,
      { rate: 0.75 }
    )
  },

  sayCorrect: (explanation) => {
    ElderVoice.speak(
      `Bilkul sahi! Aapne fraud pakad liya. ${explanation}`,
      { pitch: 1.1 }
    )
  },

  sayWrong: (explanation) => {
    ElderVoice.speak(
      `Nahi, yeh fraud tha. ${explanation}`,
      { rate: 0.75 }
    )
  },

  sayHelp: () => {
    ElderVoice.speak(
      `Arrow buttons se chalein. ` +
      `Building ke paas jaayein. ` +
      `Bada button dabayein andar jaane ke liye. ` +
      `Emergency mein 1930 call karein.`,
      { rate: 0.7 }
    )
  }
}

export default ElderVoice