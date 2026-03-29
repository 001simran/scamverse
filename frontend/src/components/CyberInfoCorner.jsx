import React, { useState } from 'react';
import './CyberInfoCorner.css';

const CyberInfoCorner = ({ onClose }) => {
  const [activeScam, setActiveScam] = useState(0);

  const officialLinks = [
    { title: "National Cyber Crime Reporting", url: "https://cybercrime.gov.in", color: "#00FF41" },
    { title: "I4C Indian Cyber Crime Center", url: "https://i4c.mha.gov.in", color: "#00D9FF" },
    { title: "CERT-In Computer Emergency Response", url: "https://www.cert-in.org.in", color: "#FFB300" }
  ];

  const scamDirectory = [
    {
      title: "📞 DIGITAL ARREST",
      description: "Scammers pose as CBI/Police/Narcotics officers on WhatsApp video call, showing fake stations. They claim your Aadhar is involved in money laundering and demand immediate 'escrow' transfer to avoid arrest.",
      redFlag: "Police NEVER call for money. No Indian agency arrests via WhatsApp calls.",
      severity: "CRITICAL",
      realLifeImpact: "₹10,00,000+ lost by many senior citizens in 2024."
    },
    {
      title: "📦 FEDEX/COURIER SCAM",
      description: "You get a call saying a package to Taiwan in your name contains drugs. They connect you to a fake 'Mumbai Police' officer to resolve the case for a fee.",
      redFlag: "Couriers don't call about drug seizures. They simply seize the package and police come to your door, they don't call.",
      severity: "HIGH",
      realLifeImpact: "Commonly targets working professionals during office hours."
    },
    {
      title: "📈 FAKE TRADING APP",
      description: "Added to 'VIP' WhatsApp groups with 'stock gurus'. You are told to download a special app to invest in IPOs. App shows fake profits, but you can never withdraw.",
      redFlag: "Official apps are on Play Store only. SEBI registered brokers don't use WhatsApp groups for trading advice.",
      severity: "FATAL",
      realLifeImpact: "Victims lose their entire retirement savings (₹50L+)."
    },
    {
      title: "🏠 HOUSE RENT / QR SCAM",
      description: "A 'soldier' wants to pay you advance for your OLX listing. They send you a QR code and ask you to scan to 'receive' money.",
      redFlag: "You NEVER need to enter PIN or scan QR to RECEIVE money.",
      severity: "MEDIUM",
      realLifeImpact: "Targets middle-class sellers on online marketplaces."
    }
  ];

  return (
    <div className="info-corner-overlay">
      <div className="info-corner-container animate-fade-in">
        <div className="info-corner-header">
          <div className="header-info">
             <h2>🌐 SCAM DIRECTORY & REPORTING</h2>
             <p style={{ color: '#A8A8C8', margin: '5px 0 0 0' }}>Latest threats in the digital ecosystem</p>
          </div>
          <button className="next-lab-btn" onClick={onClose} style={{ float: 'none', background: '#00D9FF', color: 'black' }}>
            🏙️ GO TO CITY
          </button>
        </div>

        <div className="info-corner-content">
          <div className="info-sidebar">
            <h4 style={{ color: '#E8E8E8', marginBottom: '15px' }}>SCAM TYPES</h4>
            {scamDirectory.map((scam, i) => (
              <div key={i} className={`directory-item ${activeScam === i ? 'active' : ''}`} onClick={() => setActiveScam(i)}>
                {scam.title}
              </div>
            ))}
            
            <div style={{ marginTop: '30px' }}>
               <h4 style={{ color: '#E8E8E8', marginBottom: '15px' }}>OFFICIAL HELPLINES</h4>
               <div className="helpline-banner">📞 1930</div>
               <p style={{ fontSize: '11px', color: '#FF0055', textAlign: 'center' }}>Immediate Golden Hour Reporting</p>
            </div>
          </div>

          <div className="info-main">
            <div className="scam-detail-card animate-slide-up">
              <span className="innovation-badge">CURRENT THREAT: {scamDirectory[activeScam].severity}</span>
              <h3 style={{ color: '#00D9FF', fontSize: '28px', margin: '10px 0' }}>{scamDirectory[activeScam].title}</h3>
              <p style={{ color: '#E8E8E8', lineHeight: '1.6', fontSize: '16px' }}>{scamDirectory[activeScam].description}</p>
              
              <div style={{ background: 'rgba(255, 179, 0, 0.1)', borderLeft: '4px solid #FFB300', padding: '15px', color: '#FFB300', margin: '20px 0', fontSize: '14px' }}>
                💡 <strong>THE RED FLAG:</strong> {scamDirectory[activeScam].redFlag}
              </div>

              <div style={{ color: '#A8A8C8', fontSize: '12px' }}>
                 <strong>REAL LIFE IMPACT:</strong> {scamDirectory[activeScam].realLifeImpact}
              </div>
            </div>

            <h4 style={{ color: 'white', marginBottom: '20px' }}>OFFICIAL REPORTING PORTALS (REAL LINKS)</h4>
            <div className="scam-grid">
              {officialLinks.map((link, i) => (
                <div key={i} className="scam-mini-card">
                  <h4 style={{ color: link.color, marginBottom: '10px' }}>{link.title}</h4>
                  <p style={{ color: '#A8A8C8', fontSize: '12px', marginBottom: '15px' }}>Official government resource for reporting digital fraud and tracking cases.</p>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="external-link-btn" style={{ background: link.color, padding: '8px 15px', fontSize: '12px' }}>
                    VISIT PORTAL
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CyberInfoCorner;
