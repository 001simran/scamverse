import React from 'react'
import './CyberShieldCertificate.css'

export default function CyberShieldCertificate({ playerName, score, total, date, onClose }) {
  const handlePrint = () => {
    window.print()
  }

  const handleShare = () => {
    // In a real app, this would use the Web Share API or generate an image
    alert("Sharing to WhatsApp... 📱 (Demo Feature)")
  }

  return (
    <div className="cert-backdrop">
      <div className="cert-card">
        {/* Certificate Border */}
        <div className="cert-border">
          <div className="cert-content">
            {/* Header */}
            <div className="cert-header">
              <div className="cert-seal">🛡️</div>
              <h1 className="cert-title">CERTIFICATE OF EXCELLENCE</h1>
              <p className="cert-subtitle">Presented to a Guardian of DataCity</p>
            </div>

            {/* Recipient */}
            <div className="cert-recipient-section">
              <span className="cert-label">THIS IS TO CERTIFY THAT</span>
              <h2 className="cert-name">{playerName || 'Guardian'}</h2>
              <p className="cert-desc">
                Has successfully completed the <b>ScamVerse Digital Defense Training</b> and 
                exhibited exceptional skill in identifying real-world cyber threats including 
                Digital Arrests, UPI Traps, and Phishing attacks.
              </p>
            </div>

            {/* Stats */}
            <div className="cert-stats">
              <div className="cert-stat-item">
                <span className="cert-stat-label">Safety Score</span>
                <span className="cert-stat-value">{score} / {total} SCAMS BLOCKED</span>
              </div>
              <div className="cert-stat-item">
                <span className="cert-stat-label">Rank Achieved</span>
                <span className="cert-stat-value">Cyber Ambassador 🎖️</span>
              </div>
            </div>

            {/* Footer */}
            <div className="cert-footer">
              <div className="cert-signature-box">
                <div className="cert-signature">NetGuardian AI</div>
                <div className="cert-label">ISSUING AUTHORITY</div>
              </div>
              <div className="cert-date">
                <div className="cert-val">{date || new Date().toLocaleDateString()}</div>
                <div className="cert-label">DATE OF COMPLETION</div>
              </div>
            </div>

            <div className="cert-stamp">VERIFIED ✅</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="cert-actions">
          <button className="cert-btn-print" onClick={handlePrint}>🖨️ Save as PDF</button>
          <button className="cert-btn-share" onClick={handleShare}>📱 Share to WhatsApp</button>
          <button className="cert-btn-close" onClick={onClose}>Back to Home</button>
        </div>
      </div>
    </div>
  )
}
