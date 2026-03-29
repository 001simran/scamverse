// NetGuardianHUD.jsx
// Professional HUD system with animated stats and feedback

import React, { useState, useEffect } from 'react'
import './NetGuardianHUD.css'

export default function NetGuardianHUD({ 
  progression, 
  progressionData,
  currentMission, 
  onMissionDecision,
  setView,
  isElderMode,
  toggleElderMode,
  language = 'en',
  toggleLanguage,
  openPhoneSim,
  openFamilyShield,
  setAutoMoveTarget,
  onStartMission
}) {
  const [showXPFloatingText, setShowXPFloatingText] = useState(null)
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false)
  const [verdict, setVerdict] = useState(null); // 'correct' or 'wrong'
  const [selectedOption, setSelectedOption] = useState(null);

  const rank = progression.getCurrentRankInfo()
  const city = progression.getCitySecurityState()
  const stats = progression.getMissionStats()

  // ════════════════════════════════════════════════════════════
  // LOCALIZATION
  // ════════════════════════════════════════════════════════════
  const t = {
    en: {
      citySecurity: '🌃 CITY SECURITY',
      xpRank: 'Rank',
      citizensSaved: 'Citizens Saved',
      scamsStopped: 'Scams Stopped',
      accuracy: 'Accuracy',
      achievements: 'Achievements',
      noMission: '🎯 No Active Mission',
      noMissionSub: 'Start a new mission to defend DataCity!',
      response: '🎯 YOUR RESPONSE',
      sessionStats: '📊 SESSION STATS',
      recentAch: '🎖️ RECENT ACHIEVEMENTS',
      currentRank: '🏆 CURRENT RANK',
      console: '🛠️ GUARDIAN CONSOLE',
      elderModeOn: '🎤 ELDER MODE: ON',
      elderModeOff: '👤 ELDER MODE: OFF',
      langLabel: '🌍 LANGUAGE: EN',
      tip: '💡 Tip: Analyze the scam message for red flags before deciding',
      keyboard: 'Use A/B/C to respond | WASD or ARROW KEYS to walk'
    },
    hi: {
      citySecurity: '🌃 शहर की सुरक्षा',
      xpRank: 'रैंक',
      citizensSaved: 'सुरक्षित नागरिक',
      scamsStopped: 'हादसे रोके',
      accuracy: 'सटीकता',
      achievements: 'उपलब्धियां',
      noMission: '🎯 कोई सक्रिय मिशन नहीं',
      noMissionSub: 'शहर की रक्षा के लिए नया मिशन शुरू करें!',
      response: '🎯 आपकी प्रतिक्रिया',
      sessionStats: '📊 सत्र के आंकड़े',
      recentAch: '🎖️ हाल की उपलब्धियां',
      currentRank: '🏆 वर्तमान रैंक',
      console: '🛠️ गार्जियन कंसोल',
      elderModeOn: '🎤 बुजुर्ग मोड: चालू',
      elderModeOff: '👤 बुजुर्ग मोड: बंद',
      langLabel: '🌍 भाषा: हिंदी',
      tip: '💡 सुझाव: निर्णय लेने से पहले संदेश को ध्यान से पढ़ें',
      keyboard: 'जवाब के लिए A/B/C | चलने के लिए WASD या ARROW KEYS'
    }
  }[language];

  // ════════════════════════════════════════════════════════════
  // RENDER FUNCTIONS
  // ════════════════════════════════════════════════════════════

  const renderSecurityMeter = () => {
    const security = progression.citySecurityLevel
    const state = progression.getCitySecurityState()
    const color = progression.getCitySecurityColor()

    return (
      <div className="security-meter-container">
        <div className="security-label">
          <span>{t.citySecurity}</span>
          <span className={`security-state-${state}`}>{state}</span>
        </div>
        <div className="security-bar">
          <div 
            className="security-fill" 
            style={{
              width: `${security}%`,
              backgroundColor: color,
              boxShadow: `0 0 10px ${color}`
            }}
          />
          <div className="security-text">{Math.round(security)}%</div>
        </div>
        {security < 30 && (
          <div className="critical-alert">
            ⚠️ CRISIS MODE ACTIVE - Urgent action needed!
          </div>
        )}
      </div>
    )
  }

  const renderXPProgress = () => {
    const { current, total, percentage } = rank.xpProgress

    return (
      <div className="xp-container">
        <div className="xp-header">
          <span>⚡ {rank.name}</span>
          <span>{t.xpRank} {rank.rankId}/5</span>
        </div>
        <div className="xp-bar-container">
          <div className="xp-bar">
            <div 
              className="xp-fill" 
              style={{
                width: `${percentage}%`,
                background: 'linear-gradient(90deg, #00D9FF, #9D00FF)',
                boxShadow: '0 0 15px #00D9FF'
              }}
              transition="width 0.5s ease"
            />
          </div>
          <div className="xp-text">
            {progression.totalXP.toLocaleString()} / {Math.round(rank.maxXP).toLocaleString()} XP
          </div>
        </div>
      </div>
    )
  }

  const renderPlayerStats = () => {
    return (
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-label">{t.citizensSaved}</div>
            <div className="stat-value">{stats.citizensSaved}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛑</div>
          <div className="stat-content">
            <div className="stat-label">{t.scamsStopped}</div>
            <div className="stat-value">{stats.totalMissions}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-label">{t.accuracy}</div>
            <div className="stat-value" style={{color: stats.totalMissions > 0 ? '#00FF41' : '#aaa'}}>
              {stats.accuracy}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <div className="stat-label">{t.achievements}</div>
            <div className="stat-value">{progression.achievements.length}</div>
          </div>
        </div>
      </div>
    )
  }

  const renderMissionCard = () => {
    if (!currentMission) {
      if (isElderMode) {
        // Structured linear journey map for Elders
        const elderLevels = [
          { id: 1, en: "Level 1: WhatsApp Lottery Fraud", hi: "स्तर 1: वॉट्सऐप लॉटरी धोखाधड़ी", x: -14, z: -10, buildingId: 'home' },
          { id: 2, en: "Level 2: The City Bank Scam", hi: "स्तर 2: सिटी बैंक घोटाला", x: 12, z: -10, buildingId: 'bank' },
          { id: 3, en: "Level 3: Police & Digital Arrest", hi: "स्तर 3: पुलिस और डिजिटल अरेस्ट", x: 12, z: 8, buildingId: 'cybercell' },
          { id: 4, en: "Level 4: UPI QR Code Trap", hi: "स्तर 4: यूपीआई क्यूआर कोड जाल", x: -14, z: 8, buildingId: 'bazaar' },
        ];

        return (
          <div className="mission-card empty compact" style={{ padding: '0', background: 'transparent', border: 'none', boxShadow: 'none' }}>
            <div className="elder-journey-map">
              <h2 className="journey-title" style={{color: '#fff', fontSize: '28px', marginBottom: '20px', textAlign: 'center'}}>
                📍 {language === 'en' ? 'Your Learning Journey' : 'आपकी सीखने की यात्रा'}
              </h2>
              
              <div className="journey-path" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                {elderLevels.map((lvl, idx) => {
                  const isUnlocked = stats.totalMissions >= idx;
                  const isCurrent = stats.totalMissions === idx;
                  const isCompleted = stats.totalMissions > idx;
                  
                  let bgColor = '#333';
                  let textColor = '#aaa';
                  let borderColor = '#555';
                  let icon = '🔒 ';
                  
                  if (isCompleted) {
                    bgColor = '#0A2A1A'; borderColor = '#25D366'; textColor = '#25D366'; icon = '✅ ';
                  } else if (isCurrent) {
                    bgColor = '#1A103A'; borderColor = '#9D00FF'; textColor = '#fff'; icon = '🟢 ';
                  }

                  return (
                    <button 
                      key={lvl.id}
                      className={`action-btn journey-btn ${isCurrent ? 'pulse-current' : ''}`}
                      disabled={!isUnlocked && !isCurrent}
                      style={{ 
                        background: bgColor, border: `3px solid ${borderColor}`, color: textColor,
                        opacity: isUnlocked ? 1 : 0.6, transform: isCurrent ? 'scale(1.05)' : 'scale(1)',
                        textAlign: 'left', display: 'flex', alignItems: 'center', gap: '15px',
                        padding: '25px', borderRadius: '15px', fontSize: '24px', transition: 'all 0.3s'
                      }}
                      onClick={() => {
                        setAutoMoveTarget({ x: lvl.x, z: lvl.z, buildingId: lvl.buildingId });
                        if (onStartMission) onStartMission(lvl.buildingId);
                        
                        if (window.speechSynthesis) {
                          const msg = language === 'en' 
                            ? `Starting ${lvl.en}. Let's learn together.` 
                            : `${lvl.hi} शुरू कर रहे हैं। आइए साथ मिलकर सीखें।`;
                          const u = new SpeechSynthesisUtterance(msg);
                          u.lang = language === 'en' ? 'en-IN' : 'hi-IN';
                          window.speechSynthesis.speak(u);
                        }
                      }}
                    >
                      <span style={{fontSize: '42px'}}>{icon}</span>
                      <span style={{fontWeight: '900'}}>{language === 'en' ? lvl.en : lvl.hi}</span>
                    </button>
                  )
                })}
              </div>

              <div className="elder-quick-actions" style={{ borderTop: '2px solid #555', paddingTop: '20px' }}>
                <button 
                  className="action-btn train-lab"
                  onClick={() => openPhoneSim()}
                  style={{background: '#25D366', color: 'white', border: 'none'}}
                >
                  📱 {language === 'en' ? "Bonus: Digital Sandbox" : "बोनस: डिजिटल सैंडबॉक्स"}
                </button>

                <button 
                  className="action-btn reverse-scam-lab"
                  onClick={() => openFamilyShield()}
                  style={{background: '#128C7E', color: 'white', border: 'none', marginTop: '10px'}}
                >
                  👨‍👩‍👧‍👦 {language === 'en' ? "Share Progress with Family" : "परिवार के साथ प्रगति साझा करें"}
                </button>

                <button 
                  className="action-btn exit-elder-btn"
                  onClick={() => toggleElderMode()}
                  style={{
                    background: 'transparent', border: '2px dashed #FF0055', color: '#FF0055', 
                    marginTop: '25px', opacity: '0.8', fontSize: '16px'
                  }}
                >
                  🚪 {language === 'en' ? "Return to Normal Mode" : "सामान्य मोड पर वापस जाएं"}
                </button>
              </div>
            </div>
          </div>
        )
      }

      // Standard empty card for non-Elders
      return (
        <div className="mission-card empty compact">
          <div className="mission-empty-title">{t.noMission}</div>
          <div className="mission-subtitle">{t.noMissionSub}</div>
        </div>
      )
    }

    return (
      <div className="mission-card active">
        <div className="mission-header">
          <span className="mission-title">{currentMission.victim.avatar} {language === 'hi' && currentMission.victim.nameHi ? currentMission.victim.nameHi : currentMission.victim.name}</span>
          <span className="mission-difficulty">
            {'⭐'.repeat(currentMission.difficulty)}
          </span>
        </div>
        <div className="mission-situation">
          {language === 'hi' && currentMission.victim.situationHi ? currentMission.victim.situationHi : currentMission.victim.situation}
        </div>
        <div className="mission-message">
          {language === 'hi' && currentMission.scamMessageHi ? currentMission.scamMessageHi : currentMission.scamMessage}
        </div>
        <div className="mission-reward">
          <span>XP: +{currentMission.xpReward}</span>
          <span>•</span>
          <span>Security: +{currentMission.securityImpact}%</span>
        </div>

        {/* Elder Mode: Audio Guide */}
        {isElderMode && (
          <button 
            className="elder-guide-btn" 
            onClick={() => {
              if (window.speechSynthesis) {
                const name = language === 'hi' && currentMission.victim.nameHi ? currentMission.victim.nameHi : currentMission.victim.name;
                const sit = language === 'hi' && currentMission.victim.situationHi ? currentMission.victim.situationHi : currentMission.victim.situation;
                const txt = language === 'hi' 
                  ? `लक्ष्य: ${name} की मदद करें जो इस स्थिति में हैं: ${sit}`
                  : `Goal: Help ${name} who is in this situation: ${sit}`;
                const utt = new SpeechSynthesisUtterance(txt);
                utt.rate = 0.85;
                utt.lang = language === 'en' ? 'en-IN' : 'hi-IN';
                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(utt);
              }
            }}
            data-tts={language === 'en' ? "Listen to Mission Instructions" : "निर्देश सुनें"}
          >
            📢 {language === 'en' ? "GUIDE ME" : "निर्देश सुनें"}
          </button>
        )}
      </div>
    )
  }

  // Handle decision with immediate visual/audio feedback before transition
  const handleDecision = (option) => {
    if (verdict) return; // Prevent double-clicks
    
    const isCorrect = option.isCorrect;
    setVerdict(isCorrect ? 'correct' : 'wrong');
    setSelectedOption(option);
    
    // Voice feedback if in Elder Mode or for general audio presence
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const feedbackText = language === 'hi' && option.feedbackHi ? option.feedbackHi : option.feedback;
      const utterance = new SpeechSynthesisUtterance(feedbackText);
      utterance.rate = 0.9;
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      window.speechSynthesis.speak(utterance);
    }

    // Delay the transition so user sees the "Verdict" pop
    setTimeout(() => {
      onMissionDecision(option);
      setVerdict(null);
      setSelectedOption(null);
    }, 2500); // Increased delay for Elders to read the reason
  };

  // Keyboard support for A/B/C choices
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!currentMission || verdict) return;
      const key = e.key.toUpperCase();
      const option = currentMission.responseOptions.find(opt => opt.choice === key);
      if (option) {
        handleDecision(option);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentMission, onMissionDecision, verdict]);

  const renderDecisionPanel = () => {
    if (!currentMission) return null

    return (
      <div className="decision-panel">
        <div className="decision-header">{t.response}</div>
        
        {/* BIG VERDICT POP-UP */}
        {verdict && (
          <div className={`verdict-pop-overlay animate-zoom-in ${verdict}`}>
            <div className="verdict-card">
              <span className="verdict-icon">{verdict === 'correct' ? '✅' : '❌'}</span>
              <span className="verdict-text">
                {verdict === 'correct' 
                  ? (language === 'en' ? 'CORRECT!' : 'सही उत्तर!') 
                  : (language === 'en' ? 'WRONG!' : 'गलत उत्तर!')}
              </span>
              
              {selectedOption && (
                <div className="verdict-reason" style={{
                  marginTop: '15px', fontSize: '20px', color: '#fff', 
                  background: 'rgba(255,255,255,0.1)', padding: '15px', 
                  borderRadius: '10px', lineHeight: '1.4'
                }}>
                  {language === 'hi' && selectedOption.feedbackHi 
                    ? selectedOption.feedbackHi 
                    : selectedOption.feedback}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="decision-options">
          {currentMission.responseOptions.map((option) => (
            <button
              key={option.choice}
              className={`decision-btn ${verdict ? 'disabled' : ''}`}
              onClick={() => handleDecision(option)}
              onMouseEnter={(e) => {
                if (verdict) return;
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.6), inset 0 0 10px rgba(0, 217, 255, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'inset 0 0 10px rgba(157, 0, 255, 0.2)'
              }}
              data-tts={option.choice + ". " + (language === 'hi' && option.textHi ? option.textHi : option.text)}
              disabled={!!verdict}
            >
              <div className="decision-choice">{option.choice}</div>
              <div className="decision-text">{language === 'hi' && option.textHi ? option.textHi : option.text}</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const renderMinimap = () => {
    return (
      <div className="minimap">
        <div className="minimap-header">🗺️ DATAFILE PROGRESS</div>
        <div className="minimap-progress">
          <div className="minimap-bar">
            <div 
              className="minimap-fill"
              style={{
                width: `${(stats.totalMissions / 50) * 100}%`
              }}
            />
          </div>
          <div className="minimap-text">
            {stats.totalMissions}/50 missions
          </div>
        </div>
      </div>
    )
  }

  const renderConsole = () => {
    return (
      <div className="info-card console-card">
        <div className="info-header">{t.console}</div>
        <div className="console-buttons">
          <button 
            className="console-btn lang-toggle"
            onClick={toggleLanguage}
            data-tts={language === 'en' ? "Change language to Hindi." : "भाषा बदलकर अंग्रेजी करें।"}
          >
            {t.langLabel}
          </button>

          <button 
            className="console-btn"
            onClick={() => setView('dashboard')}
            data-tts={language === 'en' ? "View impact dashboard and statistics." : "प्रभाव डैशबोर्ड और आंकड़े देखें।"}
          >
            📊 {language === 'en' ? 'IMPACT DASHBOARD' : 'प्रभाव डैशबोर्ड'}
          </button>
          
          <button 
            className="console-btn"
            onClick={() => setView('leaderboard')}
            data-tts={language === 'en' ? "View global leaderboards." : "वैश्विक लीडरबोर्ड देखें।"}
          >
            🏆 {language === 'en' ? 'LEADERBOARD' : 'लीडरबोर्ड'}
          </button>

          <button 
            className="console-btn scan-btn"
            onClick={() => setView('scanner')}
            style={{
              borderColor: '#00D9FF', 
              color: '#00D9FF',
              boxShadow: '0 0 15px rgba(0, 217, 255, 0.4)',
              borderWidth: '2px',
              fontWeight: 'bold'
            }}
            data-tts={language === 'en' ? "Open All-in-One Scam Checker for Links, Images, and Videos." : "लिंक, फोटो और वीडियो जांचने के लिए ऑल-इन-वन स्कैम चेकर खोलें।"}
          >
            🔍 {language === 'en' ? 'ALL-IN-ONE CHECKER' : 'सब-कुछ जांचिए'}
          </button>
        </div>
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ════════════════════════════════════════════════════════════

  return (
    <div className="hud-container">
      {/* Header - Title & Main Stats */}
      <div className="hud-header">
        <div className="game-title" data-tts={language === 'en' ? "Welcome to Net Guardian Cyber Defense." : "नेट गार्जियन साइबर सुरक्षा में आपका स्वागत है।"}>
          <span className="shield-icon">🛡️</span>
          <span>NetGuardian</span>
          <span className="level-badge" data-tts={language === 'en' ? `You are at Level ${rank.rankId}` : `आप लेवल ${rank.rankId} पर हैं।`}>Lvl {rank.rankId}</span>
          
          {/* High Visibility Elder Mode Toggle */}
          {!isElderMode ? (
            <button 
              className="header-elder-toggle"
              onClick={toggleElderMode}
              data-tts="Turn on Elder Mode for voice assistance."
            >
              👤 ELDER MODE
            </button>
          ) : (
            <button 
              className="header-exit-elder"
              onClick={toggleElderMode}
              style={{
                background: '#FF0055', color: 'white', border: 'none', borderRadius: '8px',
                padding: '12px 20px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 0 20px rgba(255,0,85,0.4)'
              }}
              data-tts={language === 'en' ? "Exit Elder Mode and return to normal game." : "बुजुर्ग मोड से बाहर निकलें और सामान्य गेम पर वापस जाएं।"}
            >
              🚪 {language === 'en' ? 'EXIT ELDER MODE' : 'मोड से बाहर निकलें'}
            </button>
          )}
        </div>

        {/* Quick Stats Bar */}
        {!isElderMode && (
          <div className="quick-stats">
            <div className="stat-pill" data-tts={language === 'en' ? `Your Security Points: ${progressionData.totalPoints}` : `आपका सुरक्षा स्कोर: ${progressionData.totalPoints}`}>
              <span>🛡️</span>
              <span>{progressionData.totalPoints} SP</span>
            </div>
            <div className="stat-pill" data-tts={language === 'en' ? `Your XP: ${progressionData.xp}` : `आपका अनुभव स्कोर: ${progressionData.xp}`}>
              <span>⭐</span>
              <span>{progressionData.xp} XP</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className={`hud-content ${isElderMode ? 'elder-mode-active' : ''}`}>
        {/* Left Panel - Progress & Security */}
        {!isElderMode && (
          <div className="hud-left-panel">
            {renderXPProgress()}
            {renderSecurityMeter()}
            {renderMinimap()}
            {renderPlayerStats()}
          </div>
        )}

        {/* Center Panel - Mission */}
        <div className={`hud-center-panel ${isElderMode ? 'elder-center-focused' : ''}`}>
          {renderMissionCard()}
          {renderDecisionPanel()}
        </div>

        {/* Right Panel - Additional Info */}
        <div className="hud-right-panel">
          <div className="info-card">
            <div className="info-header">{t.sessionStats}</div>
            <div className="info-content">
              <div className="info-row">
                <span>{language === 'en' ? 'Missions' : 'मिशन'}:</span>
                <span>{stats.totalMissions}</span>
              </div>
              <div className="info-row">
                <span>{language === 'en' ? 'Win Rate' : 'जीत की दर'}:</span>
                <span>{stats.accuracy}</span>
              </div>
              <div className="info-row">
                <span>{language === 'en' ? 'Citizens Lost' : 'नागरिक खोए'}:</span>
                <span style={{color: '#FF0055'}}>{stats.citizensLost}</span>
              </div>
            </div>
          </div>

          <div className="info-card">
            <div className="info-header">{t.recentAch}</div>
            <div className="achievements-list">
              {progression.achievements.slice(-3).map((ach, idx) => (
                <div key={idx} className="achievement-badge">
                  {ach.name && ach.name.substring(0, 2)}
                </div>
              )) || (
                <div className="no-achievements">{language === 'en' ? 'Complete missions to unlock!' : 'अनलॉक के लिए मिशन पूरा करें!'}</div>
              )}
            </div>
          </div>

          <div className="info-card rank-card">
            <div className="info-header">{t.currentRank}</div>
            <div className="rank-display">
              <div className="rank-name">{rank.name}</div>
              <div className="rank-benefits">
                {rank.benefits.map((benefit, idx) => (
                  <div key={idx}>✓ {benefit}</div>
                ))}
              </div>
            </div>
          </div>

          {renderConsole()}
        </div>
      </div>

      {/* Bottom - Action Help */}
      <div className="hud-footer">
        <span>{t.tip}</span>
        <span className="keyboard-hint">{t.keyboard}</span>
      </div>
    </div>
  )
}
