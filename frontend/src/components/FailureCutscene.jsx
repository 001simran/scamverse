/**
 * FailureCutscene.jsx
 * Emotional feedback module triggered when a player falls for a scam
 * Used to create a lasting memory of the consequences
 */

import React, { useEffect, useState } from 'react';

function FailureCutscene({ scamType, amountLost, missionResult, onContinue }) {
  const [visibleMessages, setVisibleMessages] = useState([]);

  const scenarioDetails = {
    digital_arrest: {
      messages: [
        "You transferred ₹14,00,000 to the 'escrow' account...",
        "Your family's entire life savings are gone.",
        "Your daughter's college fund... vanished.",
        "Your parents' medical fund... stolen.",
        "This happens to 60 people every day in India."
      ],
      emotionalImage: "😭", // Placeholder for actual high-impact image
      voiceNarration: "This could have been prevented. Your savings are gone. Learn from this mistake."
    },
    phishing_email: {
      messages: [
        "You clicked the link and entered your bank details...",
        "₹50,000 was debited instantly.",
        "Your savings for your child's birthday... gone.",
        "The scammer now has access to your identity."
      ],
      emotionalImage: "📉",
      voiceNarration: "A single click ruined your month's hard work. Never click links from unknown senders."
    },
    rupee_scam: {
      messages: [
        "You shared your OTP to 'receive' money...",
        "Instead of receiving, you just sent your balance.",
        "₹25,000 transferred to a burner account.",
        "Money lost to an unknown stranger."
      ],
      emotionalImage: "💔",
      voiceNarration: "You never need an OTP to receive money. Repeat this until you remember it."
    },
    default: {
      messages: [
        "The scammer successfully manipulated you.",
        "Your assets are being drained.",
        "A heavy emotional and financial toll follows.",
        "This is why awareness is your only shield."
      ],
      emotionalImage: "⚠️",
      voiceNarration: "Manipulation is the scammer's best tool. Break the cycle now."
    }
  };

  const scenario = scenarioDetails[scamType] || scenarioDetails.default;

  useEffect(() => {
    // Play voice narration for elderly users
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(scenario.voiceNarration);
      utterance.rate = 0.75;
      window.speechSynthesis.speak(utterance);
    }

    // Sequentially show messages
    scenario.messages.forEach((msg, index) => {
      setTimeout(() => {
        setVisibleMessages(prev => [...prev, msg]);
        speakText(msg);
      }, (index + 1) * 2000);
    });
  }, [scamType]);

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="failure-cutscene fixed inset-0 bg-black z-[100] flex items-center justify-center p-6 text-white overflow-hidden">
      <div className="content text-center max-w-4xl w-full">
        {/* Visual Impact */}
        <div className="text-9xl mb-12 animate-bounce">
          {scenario.emotionalImage}
        </div>

        {/* Amount Lost Header */}
        <div className="amount-lost-header mb-8">
          <h2 className="text-2xl text-red-500 font-bold tracking-widest uppercase mb-2">CONSEQUENCES</h2>
          <div className="text-7xl font-black text-red-600 animate-pulse">
            -₹{amountLost?.toLocaleString('en-IN') || "0"}
          </div>
        </div>

        {/* Narrative Messages */}
        <div className="messages space-y-6 min-h-[250px]">
          {/* Important feedback from the mission choice */}
          {missionResult?.feedback && (
            <p className="text-4xl text-yellow-400 font-bold mb-4 animate-in zoom-in duration-700">
              {missionResult.feedback}
            </p>
          )}

          {visibleMessages.map((msg, index) => (
            <p 
              key={index} 
              className="text-2xl md:text-3xl text-gray-200 font-medium animate-in fade-in slide-in-from-bottom-6 duration-1000"
            >
              {msg}
            </p>
          ))}
        </div>

        {/* Call to Action */}
        {visibleMessages.length === scenario.messages.length && (
          <div className="cta mt-16 animate-in fade-in zoom-in duration-500 delay-1000">
            <p className="text-2xl mb-8 text-gray-400">
              The red flags were there. Did you miss them?
            </p>
            <button 
              onClick={onContinue}
              className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-3xl font-black px-16 py-6 rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all"
            >
              TRY AGAIN - LEARN THE RED FLAGS
            </button>
          </div>
        )}
      </div>

      {/* Cracks Overlay Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cracked-glass.png')]"></div>
    </div>
  );
}

export default FailureCutscene;
