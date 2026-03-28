/**
 * ImpactDashboard.jsx
 * High-impact visualization of ScamVerse's real-world effect
 * Uses animated counters and live activity feeds
 */

import React, { useState, useEffect } from 'react';

// Mock API function for the demo
const fetchImpactMetrics = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        playersEducated: 12450,
        familyMembersTrained: 62250,
        scamsSpotted: 84321,
        estimatedMoneyProtected: 396308700, // ₹39.6 Cr
        cyberAmbassadors: 842,
        averageScoreImprovement: 38
      });
    }, 800);
  });
};

function ImpactDashboard({ onClose }) {
  const [metrics, setMetrics] = useState({
    playersEducated: 0,
    familyMembersTrained: 0,
    scamsSpotted: 0,
    estimatedMoneyProtected: 0,
    cyberAmbassadors: 0,
    averageScoreImprovement: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const data = await fetchImpactMetrics();
      
      // Animate numbers counting up slowly for visual impact
      animateValue('playersEducated', 0, data.playersEducated, 2000);
      animateValue('familyMembersTrained', 0, data.familyMembersTrained, 2000);
      animateValue('scamsSpotted', 0, data.scamsSpotted, 2000);
      animateValue('estimatedMoneyProtected', 0, data.estimatedMoneyProtected, 2500);
      animateValue('cyberAmbassadors', 0, data.cyberAmbassadors, 2000);
      animateValue('averageScoreImprovement', 0, data.averageScoreImprovement, 2000);
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to load metrics:', error);
      setLoading(false);
    }
  };

  const animateValue = (key, start, end, duration) => {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      setMetrics(prev => ({ ...prev, [key]: Math.floor(current) }));
    }, 16);
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) { // 1 crore
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) { // 1 lakh
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="impact-dashboard-container fixed inset-0 z-50 overflow-y-auto bg-black/95 text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              REAL-WORLD IMPACT
            </h1>
            <p className="text-xl text-gray-400 mt-2">ScamVerse: Protecting India one player at a time</p>
          </div>
          <button 
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-colors"
          >
            <span className="text-3xl">✕</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Players Educated */}
          <div className="group relative bg-blue-600/10 border border-blue-500/30 p-10 rounded-3xl hover:border-blue-500/60 transition-all overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 group-hover:scale-110 transition-transform">👥</div>
            <div className="text-7xl font-black mb-4">{metrics.playersEducated.toLocaleString()}</div>
            <div className="text-2xl font-bold text-blue-400">Players Educated</div>
          </div>

          {/* Family Members Trained */}
          <div className="group relative bg-emerald-600/10 border border-emerald-500/30 p-10 rounded-3xl hover:border-emerald-500/60 transition-all overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 group-hover:scale-110 transition-transform">🏘️</div>
            <div className="text-7xl font-black mb-2">{metrics.familyMembersTrained.toLocaleString()}</div>
            <div className="text-2xl font-bold text-emerald-400">Citizens Protected</div>
            <div className="text-sm mt-4 text-emerald-500/70 bg-emerald-500/10 w-fit px-3 py-1 rounded-full">
              (5x family multiplier effect)
            </div>
          </div>

          {/* Money Protected */}
          <div className="group relative bg-orange-600/10 border border-orange-500/30 p-10 rounded-3xl hover:border-orange-500/60 transition-all overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 group-hover:scale-110 transition-transform">💰</div>
            <div className="text-7xl font-black mb-2">{formatCurrency(metrics.estimatedMoneyProtected)}</div>
            <div className="text-2xl font-bold text-orange-400">Fraud Prevented</div>
            <div className="text-sm mt-4 text-orange-500/70 bg-orange-500/10 w-fit px-3 py-1 rounded-full">
              Based on ₹4.7L avg scam loss
            </div>
          </div>

          {/* Scams Spotted */}
          <div className="group relative bg-red-600/10 border border-red-500/30 p-10 rounded-3xl hover:border-red-500/60 transition-all overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 group-hover:scale-110 transition-transform">🎯</div>
            <div className="text-7xl font-black mb-4">{metrics.scamsSpotted.toLocaleString()}</div>
            <div className="text-2xl font-bold text-red-400">Scams Identified</div>
          </div>

          {/* Cyber Ambassadors */}
          <div className="group relative bg-purple-600/10 border border-purple-500/30 p-10 rounded-3xl hover:border-purple-500/60 transition-all overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 group-hover:scale-110 transition-transform">🏅</div>
            <div className="text-7xl font-black mb-2">{metrics.cyberAmbassadors.toLocaleString()}</div>
            <div className="text-2xl font-bold text-purple-400">Ambassadors</div>
            <div className="text-sm mt-4 text-purple-500/70 bg-purple-500/10 w-fit px-3 py-1 rounded-full">
              Players who taught 10+ people
            </div>
          </div>

          {/* Score Improvement */}
          <div className="group relative bg-teal-600/10 border border-teal-500/30 p-10 rounded-3xl hover:border-teal-500/60 transition-all overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 group-hover:scale-110 transition-transform">📈</div>
            <div className="text-7xl font-black mb-2">+{metrics.averageScoreImprovement}%</div>
            <div className="text-2xl font-bold text-teal-400">Score Improvement</div>
            <div className="text-sm mt-4 text-teal-500/70 bg-teal-500/10 w-fit px-3 py-1 rounded-full">
              Before vs After game
            </div>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10 mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
            <h3 className="text-3xl font-bold">LIVE ACTIVITY FEED</h3>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-6 p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50">
              <span className="text-4xl">🎯</span>
              <div className="flex-1">
                <p className="text-xl"><span className="text-blue-400 font-bold">Priya</span> from Mumbai just spotted a <span className="font-bold underline decoration-red-500">Digital Arrest</span> scam!</p>
                <p className="text-gray-500 text-sm mt-1">2 minutes ago</p>
              </div>
              <div className="text-emerald-400 font-mono text-2xl font-bold">₹14,00,000 SAVED</div>
            </div>
            <div className="flex items-center gap-6 p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50">
              <span className="text-4xl">👨‍🏫</span>
              <div className="flex-1">
                <p className="text-xl"><span className="text-blue-400 font-bold">Rahul</span> became a <span className="text-purple-400 font-bold">Cyber Ambassador</span> (taught 5 family members)</p>
                <p className="text-gray-500 text-sm mt-1">15 minutes ago</p>
              </div>
              <div className="text-purple-400 font-mono text-2xl font-bold">+500 XP</div>
            </div>
            <div className="flex items-center gap-6 p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50">
              <span className="text-4xl">🎤</span>
              <div className="flex-1">
                <p className="text-xl"><span className="text-blue-400 font-bold">Sharma Ji</span> (65) completed first <span className="font-bold border-b border-orange-500">voice-only challenge</span></p>
                <p className="text-gray-500 text-sm mt-1">32 minutes ago</p>
              </div>
              <div className="text-orange-400 font-mono text-2xl font-bold">NEW MILESTONE</div>
            </div>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="p-10 bg-red-900/10 border border-red-500/20 rounded-3xl">
            <h4 className="text-3xl font-bold text-red-500 mb-8 border-b border-red-500/20 pb-4">BEFORE SCAMVERSE</h4>
            <div className="space-y-6">
              {[
                { l: "60% fell for digital arrest scams", p: 60 },
                { l: "85% shared OTP when asked", p: 85 },
                { l: "45% clicked phishing links", p: 45 },
                { l: "70% couldn't identify AI voices", p: 70 }
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2 text-lg">
                    <span>{item.l}</span>
                  </div>
                  <div className="h-4 w-full bg-red-900/20 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${item.p}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-10 bg-emerald-900/10 border border-emerald-500/20 rounded-3xl">
            <h4 className="text-3xl font-bold text-emerald-500 mb-8 border-b border-emerald-500/20 pb-4">AFTER SCAMVERSE</h4>
            <div className="space-y-6">
              {[
                { l: "92% successfully spotted scams", p: 92 },
                { l: "96% refused OTP sharing attempts", p: 96 },
                { l: "88% correctly identified phishing", p: 88 },
                { l: "82% detected AI deepfake voices", p: 82 }
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2 text-lg">
                    <span>{item.l}</span>
                  </div>
                  <div className="h-4 w-full bg-emerald-900/20 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${item.p}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImpactDashboard;
