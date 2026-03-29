// LearnMode.jsx
// Educational interface showing after each mission

import React, { useState } from 'react'
import './LearnMode.css'

export default function LearnMode({ scamContent, onClose, missionResult }) {
  const [expandedSection, setExpandedSection] = useState('whyItWorks')

  if (!scamContent) {
    return (
      <div className="learn-mode-container">
        <div className="learn-mode-content">
          <div className="learn-mode-header error">
            <span>❌ No Content Available</span>
          </div>
          <button onClick={onClose} className="learn-mode-close-btn">
            Continue to Next Mission
          </button>
        </div>
      </div>
    )
  }

  const sections = [
    { key: 'whyItWorks', title: '🧠 Why This Scam Works' },
    { key: 'mechanics', title: '⚙️ How It Actually Happens' },
    { key: 'statistics', title: '📊 Real Impact Numbers' },
    { key: 'realWorldImpact', title: '💔 Real World Consequences' },
    { key: 'redFlagsToSpot', title: '🚩 Red Flags to Spot' },
    { key: 'whatRealShopsNeverDo', title: '✅ What Legitimate Services Never Do' },
    { key: 'realPoliceNever', title: '⚖️ What Real Police Never Do' },
    { key: 'beforeSendingMoney', title: '💰 Before You Send Money' },
    { key: 'timeline', title: '⏱️ Scam Timeline' },
    { key: 'theSocialEngineering', title: '🎭 Social Engineering Tricks' },
    { key: 'theMath', title: '🔢 The Math That Doesn\'t Work' },
    { key: 'howItCollapses', title: '💥 How Ponzi Schemes Collapse' },
    { key: 'psychology', title: '🧩 Psychological Manipulation' },
    { key: 'preventionTips', title: '🛡️ Prevention Tips' },
    { key: 'ifYouGotScammed', title: '🆘 If You Got Scammed' },
    { key: 'ifYouSuspect', title: '⚠️ If You Suspect Fraud' },
    { key: 'ifTargeted', title: '📞 If You\'re Being Targeted' },
    { key: 'ifYouSentMoney', title: '🚨 If You Sent Money' },
    { key: 'resources', title: '📚 Helpful Resources' }
  ]

  const availableSections = sections.filter(s => scamContent[s.key])

  const renderContent = (content) => {
    if (!content) return null

    if (Array.isArray(content)) {
      return (
        <ul className="content-list">
          {content.map((item, idx) => (
            <li key={idx}>
              {item.includes('✓') || item.includes('❌') ? (
                <span>{item}</span>
              ) : (
                <span>{item}</span>
              )}
            </li>
          ))}
        </ul>
      )
    }

    return (
      <div className="content-text">
        {content.split('\n').map((line, idx) => (
          <p key={idx}>{line.trim()}</p>
        ))}
      </div>
    )
  }

  return (
    <div className="learn-mode-overlay">
      <div className="learn-mode-modal">
        {/* Header */}
        <div className="learn-mode-header">
          <div className="header-content">
            <h1>📚 LEARN MODE: {scamContent.title}</h1>
            <div className="header-meta">
              <span className="category">📁 {scamContent.category}</span>
              <span className="difficulty">⭐ {scamContent.difficulty}</span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Mission Result Badge */}
        {missionResult && (
          <div className={`mission-result ${missionResult.isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="result-icon">
              {missionResult.isCorrect ? '✅' : '❌'}
            </div>
            <div className="result-text">
              <div className="result-title">
                {missionResult.isCorrect ? 'Mission Successful!' : 'Mission Failed'}
              </div>
              <div className="result-feedback">
                {missionResult.feedback}
              </div>
            </div>
          </div>
        )}

        {/* Content Sections */}
        <div className="learn-mode-sections">
          {availableSections.map(({ key, title }) => (
            <div
              key={key}
              className={`section ${expandedSection === key ? 'expanded' : ''}`}
            >
              <div
                className="section-header"
                onClick={() => setExpandedSection(expandedSection === key ? null : key)}
              >
                <span className="section-title">{title}</span>
                <span className="section-toggle">
                  {expandedSection === key ? '▼' : '▶'}
                </span>
              </div>

              {expandedSection === key && (
                <div className="section-content">
                  {renderContent(scamContent[key])}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Key Takeaway */}
        <div className="key-takeaway">
          <div className="takeaway-icon">💡</div>
          <div className="takeaway-text">
            <h3>KEY TAKEAWAY</h3>
            <p>
              {missionResult?.isCorrect
                ? 'Great job identifying the red flags! This knowledge will help you spot similar scams in the future.'
                : 'Now you know how to spot this scam. Remember: if it feels wrong, it probably is. Trust your instincts!'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="learn-mode-actions">
          <button className="btn-secondary" onClick={onClose} style={{ background: '#555', color: 'white' }}>
            🏙️ GO TO CITY
          </button>
          <button className="btn-primary" onClick={onClose}>
            Continue to Next Mission →
          </button>
        </div>
      </div>
    </div>
  )
}
