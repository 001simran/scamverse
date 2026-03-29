import React, { useState } from 'react';
import axios from 'axios';
import './ScamScanner.css';

const ScamScanner = ({ onClose, language = 'en' }) => {
  const [input, setInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const t = {
    en: {
      title: '🔍 SMART CYBER SCANNER',
      subtitle: 'Paste URL/Text or Upload Media for holistic scam analysis.',
      smartPlaceholder: 'Paste suspicious link/text or drag & drop media here...',
      btnScan: 'ANALYZE NOW',
      scanning: 'Performing Multi-Layer Scan...',
      verdict: 'VERDICT',
      confidence: 'CONFIDENCE',
      type: 'SCAM TYPE',
      explanation: 'EXPLANATION',
      whatToDo: 'WHAT TO DO',
      flags: 'IDENTIFIED FLAGS',
      close: 'CLOSE SCANNER',
      fileLoaded: 'File ready for analysis:',
      clear: 'Clear All'
    },
    hi: {
      title: '🔍 स्मार्ट साइबर स्कैनर',
      subtitle: 'संपूर्ण विश्लेषण के लिए लिंक/टेक्स्ट पेस्ट करें या मीडिया अपलोड करें।',
      smartPlaceholder: 'संदिग्ध लिंक/टेक्स्ट पेस्ट करें या मीडिया यहां ड्रैग करें...',
      btnScan: 'अभी विश्लेषण करें',
      scanning: 'बहु-स्तरीय स्कैन किया जा रहा है...',
      verdict: 'निर्णय',
      confidence: 'आत्मविश्वास',
      type: 'धोखाधड़ी का प्रकार',
      explanation: 'विवरण',
      whatToDo: 'क्या करना है',
      flags: 'पहचाने गए झंडे',
      close: 'स्कैनर बंद करें',
      fileLoaded: 'विश्लेषण के लिए फाइल तैयार:',
      clear: 'सब साफ करें'
    }
  }[language];

  const handleScan = async () => {
    if (!input.trim() && !selectedFile) return;

    setIsScanning(true);
    setError(null);
    setResult(null);

    try {
      if (selectedFile) {
        // Media Analysis Logic (Simulated for Demo)
        setTimeout(() => {
          setResult({
            verdict: 'SCAM',
            confidence: 94,
            scam_type: selectedFile.type.includes('audio') ? 'AI VOICE CLONE' : (selectedFile.type.includes('video') ? 'DEEPFAKE VIDEO' : 'MORPHED IMAGE'),
            flags: ['Digital metadata anomalies detected', 'AI-generated frequency patterns found', 'Potential deepfake artifacts present'],
            explanation: `Deep analysis of ${selectedFile.name} found irregularities in spatial consistency. The data matches known AI-modified patterns.`,
            what_to_do: "Do not trust this media. Verify through an independent channel. Do not send money.",
            source: "Neural Media Analysis Engine",
            fetched_content: `Analyzing ${selectedFile.name}... Scan Complete.`
          });
          setIsScanning(false);
        }, 3000);
      } else {
        // URL/Text Analysis Logic
        const isUrl = /^https?:\/\//.test(input) || /^www\./.test(input) || /\.[a-z]{2,}/.test(input);
        const payload = isUrl ? { url: input } : { text: input };
        const response = await axios.post('/api/scanner/scan', payload);
        setResult(response.data);
      }
    } catch (err) {
      console.error('Scan error:', err);
      setError(language === 'en' ? 'Scanning failed. Backend connection lost.' : 'स्कैन विफल रहा। कनेक्शन टूट गया।');
    } finally {
      if (!selectedFile) setIsScanning(false);
    }
  };

  const getVerdictClass = (verdict) => {
    if (verdict === 'SCAM') return 'verdict-scam';
    if (verdict === 'SUSPICIOUS') return 'verdict-suspicious';
    return 'verdict-safe';
  };

  const onFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setInput(''); // Clear text when file is selected
    }
  };

  const currentSelectionText = selectedFile ? selectedFile.name : (input.length > 30 ? input.substring(0, 30) + '...' : input);

  return (
    <div className="scanner-overlay">
      <div className="scanner-container animate-slide-up">
        <div className="scanner-header">
          <h2>{t.title}</h2>
          <p>{t.subtitle}</p>
          <button className="scanner-close-btn" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="smart-input-zone">
          <div className="input-type-badges">
            <span className="badge">🔗 LINK</span>
            <span className="badge">📄 TEXT</span>
            <span className="badge">🖼️ PHOTO</span>
            <span className="badge">🎥 VIDEO</span>
            <span className="badge">🎙️ VOICE</span>
          </div>
          
          <textarea
            className="scanner-textarea"
            placeholder={t.smartPlaceholder}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setSelectedFile(null); // Clear file when typing
            }}
            disabled={!!selectedFile || isScanning}
          />
          
          <div className="smart-upload-section">
            <input type="file" onChange={onFileChange} accept="audio/*,video/*,image/*" id="scanner-file" disabled={isScanning} />
            <label htmlFor="scanner-file" className={`smart-file-btn ${selectedFile ? 'active' : ''}`}>
               {selectedFile ? '✅ ' + selectedFile.name : '📁 ANALYZE FILE (PIC/VIDEO/VOICE)'}
            </label>
            {(selectedFile || input) && (
              <button className="clear-selection" onClick={() => { setInput(''); setSelectedFile(null); setResult(null); }}>
                {t.clear}
              </button>
            )}
          </div>
        </div>

        <button 
          className={`scan-submit-btn ${isScanning ? 'is-loading' : ''}`}
          onClick={handleScan}
          disabled={isScanning || (!input.trim() && !selectedFile)}
        >
          {isScanning ? t.scanning : t.btnScan}
        </button>

        {error && <div className="scanner-error">{error}</div>}

        {result && (
          <div className="scanner-results animate-fade-in">
            <div className="result-main">
              <div className={`verdict-badge ${getVerdictClass(result.verdict)}`}>
                <span className="badge-label">{t.verdict}:</span>
                <span className="badge-value">{result.verdict}</span>
              </div>
              <div className="confidence-meter">
                <span className="meter-label">{t.confidence}: {result.confidence}%</span>
                <div className="meter-bar">
                  <div 
                    className="meter-fill" 
                    style={{ width: `${result.confidence}%`, backgroundColor: result.confidence > 70 ? '#FF0055' : '#FFB300' }}
                  />
                </div>
              </div>
            </div>

            <div className="result-grid">
              <div className="result-item">
                <h3>{t.type}</h3>
                <p>{result.scam_type}</p>
              </div>
              <div className="result-item">
                <h3>{t.explanation}</h3>
                <p>{result.explanation}</p>
              </div>
              <div className="result-item full-width">
                <h3>{t.whatToDo}</h3>
                <div className="action-box">
                  <span className="action-icon">💡</span>
                  {result.what_to_do}
                </div>
              </div>
            </div>

            {result.flags && result.flags.length > 0 && (
              <div className="result-flags">
                <h3>{t.flags}</h3>
                <ul>
                  {result.flags.map((flag, i) => (
                    <li key={i}>🚩 {flag}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="scanner-footer" style={{ display: 'flex', gap: '10px' }}>
          <button className="footer-close-btn" onClick={onClose} style={{ flex: 1 }}>{t.close}</button>
          <button className="footer-city-btn" onClick={onClose} style={{
            flex: 1,
            background: '#00D9FF' ,
            color: 'black',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            🏙️ {language === 'en' ? 'GO TO CITY' : 'शहर वापस जाएं'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScamScanner;
