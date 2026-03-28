import { useState, useEffect } from 'react'
import './TransitionOverlay.css'

export default function TransitionOverlay({ isActive = false, message = 'Loading...', type = 'fade' }) {
  const [show, setShow] = useState(isActive)

  useEffect(() => {
    setShow(isActive)
  }, [isActive])

  if (!show) return null

  return (
    <div className={`transition-overlay transition-${type}`}>
      <div className="transition-content">
        <div className="transition-spinner"></div>
        <div className="transition-message">{message}</div>
      </div>
    </div>
  )
}
