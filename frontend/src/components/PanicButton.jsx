/**
 * PanicButton.jsx
 * Critical accessibility feature for elderly users
 * High-impact trigger for simulated emergency alerts
 */

import React, { useState } from 'react';

function PanicButton() {
  const [calling, setCalling] = useState(false);
  const [showStatus, setShowStatus] = useState(null); // 'notified', 'error'

  const triggerEmergency = async () => {
    setCalling(true);
    
    // Voice alert
    speakText("Calling your registered family member now. Help is on the way.");
    
    // Simulate API call for demo
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate SMS/WhatsApp notification success
      console.log("EMERGENCY ALERT SENT: Family notified with location and timestamp.");
      setShowStatus('notified');
      speakText("Your family has been notified and they will call you in a moment.");
    } catch (error) {
      console.error('Failed to send alert:', error);
      setShowStatus('error');
      speakText("Could not send alert automatically. Please try the manual dialer.");
    }
    
    setCalling(false);
    setTimeout(() => setShowStatus(null), 10000);
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="panic-button-container fixed bottom-8 left-8 z-[200]">
      {showStatus === 'notified' && (
        <div className="absolute bottom-36 left-0 bg-green-600/90 text-white p-6 rounded-2xl w-64 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="text-xl font-bold mb-2">✅ HELP ON THE WAY</p>
          <p className="text-sm">We've alerted your daughter Priya via SMS and WhatsApp.</p>
        </div>
      )}

      {showStatus === 'error' && (
        <div className="absolute bottom-36 left-0 bg-red-600/90 text-white p-6 rounded-2xl w-64 shadow-2xl animate-in bounce-in duration-500">
          <p className="text-xl font-bold mb-2">❓ ALERT FAILED</p>
          <p className="text-sm">Please call your family directly on their phone number.</p>
        </div>
      )}

      <button
        onClick={triggerEmergency}
        className={`panic-button group relative flex flex-col items-center justify-center w-32 h-32 md:w-40 md:h-40 bg-red-600 rounded-full border-4 border-white shadow-[0_0_50px_rgba(220,38,38,0.5)] transition-all active:scale-90 overflow-hidden ${calling ? 'animate-pulse' : ''}`}
        disabled={calling}
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <span className="text-5xl md:text-6xl mb-2 drop-shadow-md">🚨</span>
        <span className="text-xl md:text-2xl font-black text-white px-2 text-center uppercase leading-tight">HELP!</span>
        
        {calling && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </button>

      {/* Pulsing glow behind button */}
      <div className="absolute -inset-4 bg-red-600/30 rounded-full blur-2xl animate-pulse -z-10"></div>
    </div>
  );
}

export default PanicButton;
