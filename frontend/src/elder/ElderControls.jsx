// ScamVerse - HackMol 7.0
// ElderControls.jsx - big Hindi buttons
// Jaspreet built this

import ElderVoice from './ElderVoice'

// ─── Elder D-Pad ─────────────────────────────────────────
export function ElderDPad({ onMove }) {

  const btnStyle = {
    width: '64px',
    height: '64px',
    background: 'rgba(0,0,0,0.75)',
    border: '2px solid #3a3a6a',
    borderRadius: '12px',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    touchAction: 'none',
    padding: 0,
    fontFamily: 'inherit'
  }

  const emptyStyle = {
    width: '64px',
    height: '64px'
  }

  const rowStyle = {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    justifyContent: 'center'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>

      {/* up row */}
      <div style={rowStyle}>
        <div style={emptyStyle} />
        <button
          onPointerDown={() => onMove('up')}
          onPointerUp={() => onMove('_stop')}
          onPointerLeave={() => onMove('_stop')}
          style={btnStyle}
        >
          <div style={{ fontSize: '20px' }}>▲</div>
          <div style={{ fontSize: '10px', color: '#aaa' }}>ऊपर</div>
        </button>
        <div style={emptyStyle} />
      </div>

      {/* middle row */}
      <div style={rowStyle}>
        <button
          onPointerDown={() => onMove('left')}
          onPointerUp={() => onMove('_stop')}
          onPointerLeave={() => onMove('_stop')}
          style={btnStyle}
        >
          <div style={{ fontSize: '20px' }}>◀</div>
          <div style={{ fontSize: '10px', color: '#aaa' }}>बायें</div>
        </button>

        {/* center help */}
        <button
          onClick={() => ElderVoice.sayHelp()}
          style={{
            ...btnStyle,
            background: 'rgba(33,33,80,0.8)',
            border: '2px solid #4fc3f750',
            color: '#4fc3f7'
          }}
        >
          <div style={{ fontSize: '18px' }}>❓</div>
          <div style={{ fontSize: '9px' }}>मदद</div>
        </button>

        <button
          onPointerDown={() => onMove('right')}
          onPointerUp={() => onMove('_stop')}
          onPointerLeave={() => onMove('_stop')}
          style={btnStyle}
        >
          <div style={{ fontSize: '20px' }}>▶</div>
          <div style={{ fontSize: '10px', color: '#aaa' }}>दायें</div>
        </button>
      </div>

      {/* down row */}
      <div style={rowStyle}>
        <div style={emptyStyle} />
        <button
          onPointerDown={() => onMove('down')}
          onPointerUp={() => onMove('_stop')}
          onPointerLeave={() => onMove('_stop')}
          style={btnStyle}
        >
          <div style={{ fontSize: '20px' }}>▼</div>
          <div style={{ fontSize: '10px', color: '#aaa' }}>नीचे</div>
        </button>
        <div style={emptyStyle} />
      </div>

    </div>
  )
}

// ─── Elder Enter Button ───────────────────────────────────
export function ElderEnterButton({ nearBuilding, onEnter }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px'
    }}>
      <button
        onClick={() => {
          if (nearBuilding) {
            ElderVoice.speak(`${nearBuilding.label} mein ja rahe hain`)
            onEnter()
          } else {
            ElderVoice.speak('Pehle kisi building ke paas jaayein')
          }
        }}
        style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          border: nearBuilding ? '3px solid #ffd700' : '2px solid #2a2a4a',
          background: nearBuilding
            ? 'rgba(255,152,0,0.9)'
            : 'rgba(30,30,60,0.8)',
          color: nearBuilding ? '#000' : '#444',
          fontSize: '26px',
          cursor: 'pointer',
          boxShadow: nearBuilding
            ? '0 0 25px rgba(255,215,0,0.5)'
            : 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
          padding: 0,
          fontFamily: 'inherit',
          transition: 'all 0.2s'
        }}
      >
        <span>⚡</span>
        <span style={{ fontSize: '11px', fontWeight: 'bold' }}>
          अंदर जाएं
        </span>
      </button>

      {nearBuilding && (
        <div style={{
          color: '#ffd700',
          fontSize: '11px',
          textAlign: 'center',
          maxWidth: '100px'
        }}>
          {nearBuilding.label}
        </div>
      )}
    </div>
  )
}

// ─── Elder Decision Buttons ───────────────────────────────
export function ElderDecisionButtons({ onDecide, disabled }) {
  return (
    <div style={{
      display: 'flex',
      gap: '10px',
      width: '100%',
      padding: '0 4px'
    }}>

      <button
        onClick={() => {
          if (!disabled) {
            ElderVoice.speak('Aapne sahi maana')
            onDecide('trust')
          }
        }}
        disabled={disabled}
        style={{
          flex: 1,
          padding: '16px 6px',
          borderRadius: '14px',
          border: '2px solid #4caf50',
          background: '#4caf5015',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          fontFamily: 'inherit'
        }}
      >
        <div style={{ fontSize: '26px' }}>✅</div>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>
          सही है
        </div>
        <div style={{ fontSize: '10px', color: '#888' }}>TRUST</div>
      </button>

      <button
        onClick={() => {
          if (!disabled) {
            ElderVoice.speak('Aapne ignore kiya')
            onDecide('ignore')
          }
        }}
        disabled={disabled}
        style={{
          flex: 1,
          padding: '16px 6px',
          borderRadius: '14px',
          border: '2px solid #ff9800',
          background: '#ff980015',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          fontFamily: 'inherit'
        }}
      >
        <div style={{ fontSize: '26px' }}>🤔</div>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>
          देखते हैं
        </div>
        <div style={{ fontSize: '10px', color: '#888' }}>IGNORE</div>
      </button>

      <button
        onClick={() => {
          if (!disabled) {
            ElderVoice.speak('Sahi kiya! Fraud report kar diya')
            onDecide('report')
          }
        }}
        disabled={disabled}
        style={{
          flex: 1,
          padding: '16px 6px',
          borderRadius: '14px',
          border: '2px solid #f44336',
          background: '#f4433615',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          fontFamily: 'inherit'
        }}
      >
        <div style={{ fontSize: '26px' }}>🚨</div>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>
          फ्रॉड है
        </div>
        <div style={{ fontSize: '10px', color: '#888' }}>REPORT</div>
      </button>

    </div>
  )
}

// ─── Floating Help Button ─────────────────────────────────
export function ElderHelpButton() {
  function handleHelp() {
    ElderVoice.sayHelp()
    alert(
      '🆘 मदद — HELP\n\n' +
      '▲▼◀▶ — चलने के लिए\n' +
      '⚡ बड़ा बटन — अंदर जाने के लिए\n\n' +
      '✅ सही है — Safe message\n' +
      '🤔 देखते हैं — Not sure\n' +
      '🚨 फ्रॉड है — This is scam\n\n' +
      '🆘 Emergency: 1930 call करें'
    )
  }

  return (
    <button
      onClick={handleHelp}
      style={{
        position: 'fixed',
        bottom: '100px',
        right: '16px',
        width: '60px',
        height: '60px',
        background: '#4fc3f7',
        border: 'none',
        borderRadius: '50%',
        color: '#000',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 500,
        boxShadow: '0 4px 15px rgba(79,195,247,0.4)',
        fontFamily: 'inherit',
        padding: 0
      }}
    >
      <div style={{ fontSize: '20px' }}>❓</div>
      <div style={{ fontSize: '9px', fontWeight: 'bold', marginTop: '2px' }}>
        मदद
      </div>
    </button>
  )
}

// ─── Stop Voice Button ────────────────────────────────────
export function ElderStopVoice() {
  return (
    <button
      onClick={() => ElderVoice.stop()}
      style={{
        padding: '5px 12px',
        background: '#333',
        border: '1px solid #555',
        borderRadius: '20px',
        color: '#aaa',
        fontSize: '11px',
        cursor: 'pointer',
        fontFamily: 'inherit'
      }}
    >
      🔇 रुको
    </button>
  )
}