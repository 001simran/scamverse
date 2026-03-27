// frontend/src/utils/sounds.js
// no install needed - uses browser built in audio

function playSound(type) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)

  if (type === 'correct') {
    osc.frequency.setValueAtTime(523, ctx.currentTime)
    osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1)
    osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2)
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.4)
  }

  if (type === 'wrong') {
    osc.frequency.setValueAtTime(200, ctx.currentTime)
    osc.frequency.setValueAtTime(150, ctx.currentTime + 0.2)
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.4)
  }

  if (type === 'levelup') {
    const notes = [523, 659, 784, 1047]
    notes.forEach((freq, i) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.connect(g)
      g.connect(ctx.destination)
      o.frequency.value = freq
      g.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.12)
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.2)
      o.start(ctx.currentTime + i * 0.12)
      o.stop(ctx.currentTime + i * 0.12 + 0.2)
    })
  }

  if (type === 'enter') {
    osc.frequency.setValueAtTime(440, ctx.currentTime)
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.15)
  }

  if (type === 'spin') {
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(100, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.3)
    gain.gain.setValueAtTime(0.1, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.3)
  }
}

export default playSound