/**
 * sounds.js
 * Professional SFX utility for ScamVerse using Web Audio API
 * Generates tones for success, failure, clicks, and language/voice events
 * without needing local MP3 files.
 *
 * UPDATED:
 *  - playLanguageSelect()  — short double-beep played when user picks Hindi or English
 *  - playVoiceActivate()   — warm rising tone played when voice commands turn ON
 *  - playVoiceDeactivate() — soft falling tone played when voice commands turn OFF
 *  - playProximity()       — subtle chime when user approaches a building
 */

class SoundManager {
  constructor() {
    this.context = null;
    this.isInitialized = false;
  }

  /** Must be called inside a user-gesture handler (click, keydown, etc.) */
  init() {
    if (this.isInitialized) return;
    try {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      this.isInitialized = true;
      console.log("SoundManager initialized");
    } catch (e) {
      console.error("Web Audio API not supported", e);
    }
  }

  // ── Internal helpers ────────────────────────────────────────────────────────

  /**
   * Create and connect a simple oscillator → gain node, returning both so the
   * caller can tweak frequencies/gains before triggering.
   * @param {'sine'|'square'|'triangle'|'sawtooth'} type
   * @returns {{ osc: OscillatorNode, gain: GainNode }}
   */
  _makeOscGain(type = 'sine') {
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = type;
    osc.connect(gain);
    gain.connect(this.context.destination);
    return { osc, gain };
  }

  /** Shorthand: schedule osc start + stop and gain fade */
  _play(osc, gain, startFreq, endFreq, peakGain, duration) {
    const t = this.context.currentTime;
    osc.frequency.setValueAtTime(startFreq, t);
    if (endFreq !== startFreq) {
      osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration * 0.8);
    }
    gain.gain.setValueAtTime(peakGain, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.start(t);
    osc.stop(t + duration);
  }

  // ── Public sound effects ────────────────────────────────────────────────────

  /**
   * Success sound — high rising chime (correct answer / threat neutralised).
   */
  playSuccess() {
    this.init();
    if (!this.context) return;
    const { osc, gain } = this._makeOscGain('sine');
    this._play(osc, gain, 440, 880, 0.22, 0.6);
  }

  /**
   * Failure sound — harsh falling buzz (wrong answer / security breach).
   */
  playFailure() {
    this.init();
    if (!this.context) return;
    const { osc, gain } = this._makeOscGain('square');
    this._play(osc, gain, 220, 80, 0.15, 0.6);
  }

  /**
   * Click sound — crisp high tick (button presses, menu interactions).
   */
  playClick() {
    this.init();
    if (!this.context) return;
    const { osc, gain } = this._makeOscGain('sine');
    this._play(osc, gain, 1200, 1200, 0.06, 0.1);
  }

  /**
   * Language select sound — two short upward beeps, played when user picks
   * Hindi (H key) or English (E key).
   *
   * Usage:
   *   soundManager.playLanguageSelect();   // call inside setLanguage() handler
   */
  playLanguageSelect() {
    this.init();
    if (!this.context) return;
    const t = this.context.currentTime;

    // First beep
    const { osc: o1, gain: g1 } = this._makeOscGain('sine');
    o1.frequency.setValueAtTime(600, t);
    g1.gain.setValueAtTime(0.12, t);
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    o1.start(t);
    o1.stop(t + 0.12);

    // Second beep (slightly higher, slight delay)
    const { osc: o2, gain: g2 } = this._makeOscGain('sine');
    o2.frequency.setValueAtTime(800, t + 0.15);
    g2.gain.setValueAtTime(0.12, t + 0.15);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.30);
    o2.start(t + 0.15);
    o2.stop(t + 0.30);
  }

  /**
   * Voice activate sound — warm rising tone, played when voice commands turn ON.
   *
   * Usage:
   *   soundManager.playVoiceActivate();   // call when mic starts listening
   */
  playVoiceActivate() {
    this.init();
    if (!this.context) return;
    const { osc, gain } = this._makeOscGain('sine');
    this._play(osc, gain, 300, 600, 0.14, 0.4);
  }

  /**
   * Voice deactivate sound — soft falling tone, played when voice commands turn OFF.
   *
   * Usage:
   *   soundManager.playVoiceDeactivate();  // call when mic stops
   */
  playVoiceDeactivate() {
    this.init();
    if (!this.context) return;
    const { osc, gain } = this._makeOscGain('sine');
    this._play(osc, gain, 500, 250, 0.12, 0.35);
  }

  /**
   * Proximity chime — gentle triangle-wave ding when player nears a building.
   *
   * Usage:
   *   soundManager.playProximity();   // call inside speakProximity()
   */
  playProximity() {
    this.init();
    if (!this.context) return;
    const { osc, gain } = this._makeOscGain('triangle');
    this._play(osc, gain, 880, 1100, 0.10, 0.5);
  }
}

const soundManager = new SoundManager();
export default soundManager;