// NetGuardianHUD.jsx
// Professional HUD system with animated stats and feedback

import React, { useState, useEffect } from 'react'
import './NetGuardianHUD.css'

export default function NetGuardianHUD({ 
  progression, 
  currentMission, 
  onMissionDecision,
  setView,
  isElderMode,
  toggleElderMode,
  language = 'en',
  toggleLanguage
}) {
  const [showXPFloatingText, setShowXPFloatingText] = useState(null)
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false)

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
      keyboard: 'Use A/B/C keys or click to respond'
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
      keyboard: 'प्रतिक्रिया के लिए A/B/C या क्लिक का उपयोग करें'
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
          <span className="mission-title">{currentMission.victim.emoji} {currentMission.victim.name}</span>
          <span className="mission-difficulty">
            {'⭐'.repeat(currentMission.difficulty)}
          </span>
        </div>
        <div className="mission-situation">
          {currentMission.victim.situation}
        </div>
        <div className="mission-message">
          {currentMission.scamMessage}
        </div>
        <div className="mission-reward">
          <span>XP: +{currentMission.xpReward}</span>
          <span>•</span>
          <span>Security: +{currentMission.securityImpact}%</span>
        </div>
      </div>
    )
  }

  const renderDecisionPanel = () => {
    if (!currentMission) return null

    return (
      <div className="decision-panel">
        <div className="decision-header">{t.response}</div>
        <div className="decision-options">
          {currentMission.responseOptions.map((option) => (
            <button
              key={option.choice}
              className="decision-btn"
              onClick={() => onMissionDecision(option)}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.6), inset 0 0 10px rgba(0, 217, 255, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = 'inset 0 0 10px rgba(157, 0, 255, 0.2)'
              }}
            >
              <div className="decision-choice">{option.choice}</div>
              <div className="decision-text">{option.text}</div>
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
            className={`console-btn ${isElderMode ? 'active' : ''}`}
            onClick={toggleElderMode}
          >
            {isElderMode ? t.elderModeOn : t.elderModeOff}
          </button>
          
          {isElderMode && (
             <button 
              className="console-btn lang-toggle"
              onClick={toggleLanguage}
            >
              {t.langLabel}
            </button>
          )}

          <button 
            className="console-btn"
            onClick={() => setView('dashboard')}
          >
            📊 {language === 'en' ? 'IMPACT DASHBOARD' : 'प्रभाव डैशबोर्ड'}
          </button>
          
          <button 
            className="console-btn"
            onClick={() => setView('leaderboard')}
          >
            🏆 {language === 'en' ? 'LEADERBOARD' : 'लीडरबोर्ड'}
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
        <div className="game-title">
          <span className="shield-icon">🛡️</span>
          <span>NetGuardian</span>
          <span className="level-badge">Lvl {rank.rankId}</span>
        </div>

        {/* Quick Stats Bar */}
        <div className="quick-stats">
          <div className="quick-stat">💾 {progression.totalXP.toLocaleString()} XP</div>
          <div className="quick-stat">👥 {stats.citizensSaved} Saved</div>
          <div className="quick-stat">🎯 {stats.accuracy} Accuracy</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="hud-content">
        {/* Left Panel - Progress & Security */}
        <div className="hud-left-panel">
          {renderXPProgress()}
          {renderSecurityMeter()}
          {renderMinimap()}
          {renderPlayerStats()}
        </div>

        {/* Center Panel - Mission */}
        <div className="hud-center-panel">
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
