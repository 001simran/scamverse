import React, { useState } from 'react';
import './FamilyShield.css';
import { useGame } from '../game/GameContext';

export default function FamilyShield({ onClose, language = 'en' }) {
  const { progression } = useGame();
  
  // Calculate vulnerabilities based on game progression
  const stats = progression.getMissionStats();
  const rawVulnerability = Math.max(0, 100 - (stats.accuracy || 50));
  
  // Fake "Vulnerabilities" for fun even if they haven't failed much
  const vulnerableAreas = [];
  if (vulnerableAreas.length === 0) {
    vulnerableAreas.push(language === 'en' ? 'Fear Tactics (Digital Arrest)' : 'डर का झांसा (डिजिटल अरेस्ट)');
    vulnerableAreas.push(language === 'en' ? 'Greed Tactics (Lottery Scams)' : 'लालच का झांसा (लॉटरी स्कैम)');
  }

  const [copied, setCopied] = useState(false);

  const t = {
    en: {
      title: '👨‍👩‍👧‍👦 FAMILY CYBER SHIELD',
      subtitle: 'The best defense against scams is a united family. Share your vulnerability report with your children so they can protect you!',
      vulnScore: 'Your Scam Vulnerability Score',
      weaknesses: 'Identified Weaknesses & Threats:',
      actionText: 'Take Action to Protect Yourself:',
      whatsappBtn: 'Share Report to Family WhatsApp Group',
      copyBtn: 'Copy SMS Link to send to children',
      copied: 'COPIED TO CLIPBOARD!',
      close: 'CLOSE REPORT',
      whatsappMessage: `🚨 *My Cyber Vulnerability Alert* 🚨\n\nI just played ScamVerse and learned how easily hackers can trick me!\n\nMy top vulnerabilities:\n- ${vulnerableAreas[0]}\n- ${vulnerableAreas[1]}\n\nPlease don't let me send money to anyone claiming I am arrested or won a lottery without checking with you first!\n\nProtect yourself too! Test your skills here: www.scamverse.gov.in`
    },
    hi: {
      title: '👨‍👩‍👧‍👦 परिवार साइबर सुरक्षा कवच',
      subtitle: 'ठगी से बचने का सबसे अच्छा तरीका एक जागरूक परिवार है। अपने बच्चों के साथ अपनी रिपोर्ट साझा करें ताकि वे आपकी रक्षा कर सकें!',
      vulnScore: 'आपका स्कैम भेद्यता स्कोर',
      weaknesses: 'पहचाने गए खतरे और कमजोरियां:',
      actionText: 'खुद को सुरक्षित रखने के लिए कदम उठाएं:',
      whatsappBtn: 'पवार के वॉट्सऐप ग्रुप में शेयर करें',
      copyBtn: 'बच्चों को SMS में भेजने के लिए कॉपी करें',
      copied: 'कॉपी हो गया!',
      close: 'रिपोर्ट बंद करें',
      whatsappMessage: `🚨 *मेरी साइबर सुरक्षा रिपोर्ट* 🚨\n\nमैंने अभी ScamVerse खेला और सीखा कि हैकर्स कैसे मुझे फंसा सकते हैं!\n\nमेरे मुख्य खतरे:\n- ${vulnerableAreas[0]}\n- ${vulnerableAreas[1]}\n\nअगर कोई पुलिस या लॉटरी वाला मुझसे पैसे मांगे तो कृपया मुझे रोक लें!\n\nआप भी अपने कौशल का परीक्षण करें: www.scamverse.gov.in`
    }
  }[language];

  const handleWhatsApp = () => {
    const text = encodeURIComponent(t.whatsappMessage);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(t.whatsappMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="family-shield-overlay">
      <div className="fs-wrapper animate-pop-in">
        <button className="fs-close" onClick={onClose}>✕</button>
        
        <div className="fs-header">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        <div className="fs-body">
          <div className="fs-score-circle">
            <svg viewBox="0 0 36 36" className="circular-chart warning">
              <path className="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path className="circle"
                strokeDasharray={`${rawVulnerability}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" className="percentage">{rawVulnerability}%</text>
            </svg>
            <div className="fs-score-label">{t.vulnScore}</div>
          </div>

          <div className="fs-weaknesses">
            <h3>{t.weaknesses}</h3>
            <ul>
              {vulnerableAreas.map((area, index) => (
                <li key={index}>⚠️ {area}</li>
              ))}
            </ul>
          </div>

          <div className="fs-action-box">
             <h4>{t.actionText}</h4>
             <button className="fs-whatsapp-btn" onClick={handleWhatsApp}>
               <span className="wa-icon">📲</span> {t.whatsappBtn}
             </button>
             
             <button className="fs-copy-btn" onClick={handleCopy}>
                {copied ? t.copied : t.copyBtn}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
