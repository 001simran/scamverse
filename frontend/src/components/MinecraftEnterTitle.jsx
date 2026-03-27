import { useEffect, useMemo, useState } from 'react'

export default function MinecraftEnterTitle({ title, subtitle = '', durationMs = 2600 }) {
  const [visible, setVisible] = useState(false)

  const key = useMemo(() => `${title}__${subtitle}__${durationMs}`, [title, subtitle, durationMs])

  useEffect(() => {
    if (!title) {
      setVisible(false)
      return
    }

    setVisible(true)
    const t = window.setTimeout(() => setVisible(false), durationMs)
    return () => window.clearTimeout(t)
  }, [key, title, durationMs])

  if (!title || !visible) return null

  return (
    <div style={styles.wrap} aria-live="polite" aria-atomic="true">
      <div style={styles.title}>{title}</div>
      {!!subtitle && <div style={styles.subtitle}>{subtitle}</div>}
    </div>
  )
}

const styles = {
  wrap: {
    position: 'absolute',
    top: '28px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1200,
    pointerEvents: 'none',
    textAlign: 'center',
    animation: 'mcTitleInOut 2.6s ease-in-out forwards'
  },
  title: {
    fontSize: '28px',
    fontWeight: 900,
    letterSpacing: '0.5px',
    color: '#fff',
    textShadow:
      '0 4px 0 rgba(0,0,0,0.85), 0 0 16px rgba(0,0,0,0.7)',
    padding: '6px 14px',
    background: 'rgba(0,0,0,0.20)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    backdropFilter: 'blur(2px)'
  },
  subtitle: {
    marginTop: '8px',
    fontSize: '14px',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.9)',
    textShadow: '0 3px 0 rgba(0,0,0,0.85)',
    opacity: 0.95
  }
}

// Inject animation once
const styleTag = document.createElement('style')
styleTag.textContent = `
  @keyframes mcTitleInOut {
    0%   { transform: translateX(-50%) translateY(-10px) scale(0.96); opacity: 0; }
    12%  { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; }
    82%  { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; }
    100% { transform: translateX(-50%) translateY(-6px) scale(0.98); opacity: 0; }
  }
`
if (!document.head.querySelector('style[data-mc-enter-title]')) {
  styleTag.setAttribute('data-mc-enter-title', 'true')
  document.head.appendChild(styleTag)
}

