/**
 * CyberAmbassadorLeaderboard.jsx
 * Gamified component to showcase users who are teaching others
 * Highlights top contributors and badges
 */

import React, { useState, useEffect } from 'react';

const MOCK_LEADERS = [
  { id: 1, username: 'Priya Verma', familyMembersTaught: 12, totalScore: 18450, city: 'Mumbai', badges: ['🥇', '🛡️', '👨‍🏫'] },
  { id: 2, username: 'Rahul Das', familyMembersTaught: 10, totalScore: 16200, city: 'Kolkata', badges: ['🥈', '🛡️', '🎯'] },
  { id: 3, username: 'Ananya Iyer', familyMembersTaught: 8, totalScore: 14800, city: 'Chennai', badges: ['🥉', '🛡️', '🎁'] },
  { id: 4, username: 'Deepak Rao', familyMembersTaught: 6, totalScore: 11200, city: 'Bengaluru', badges: ['🛡️', '⚡'] },
  { id: 5, username: 'Kavitha S.', familyMembersTaught: 5, totalScore: 9800, city: 'Hyderabad', badges: ['🛡️', '✅'] }
];

function CyberAmbassadorLeaderboard({ onClose }) {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    // Simulate API fetch delay
    setTimeout(() => {
      setLeaders(MOCK_LEADERS);
    }, 500);
  }, []);

  return (
    <div className="leaderboard-container fixed inset-0 z-50 overflow-y-auto bg-black/95 text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              CYBER AMBASSADORS
            </h2>
            <p className="text-xl text-gray-400 mt-2">Heroes protecting their families and communities</p>
          </div>
          <button 
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-colors"
          >
            <span className="text-3xl">✕</span>
          </button>
        </div>

        <div className="leaders space-y-6">
          {leaders.map((leader, index) => (
            <div 
              key={leader.id}
              className={`leader-card group relative flex flex-col md:flex-row items-center justify-between p-8 rounded-3xl border-2 transition-all hover:scale-[1.02] ${
                index === 0 ? 'bg-gradient-to-r from-yellow-600/20 to-yellow-900/40 border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.2)]' :
                index === 1 ? 'bg-gradient-to-r from-gray-400/10 to-gray-600/30 border-gray-400/30' :
                index === 2 ? 'bg-gradient-to-r from-orange-600/10 to-orange-800/30 border-orange-500/30' :
                'bg-gray-800/40 border-gray-700/50 hover:border-blue-500/30'
              }`}
            >
              <div className="rank text-7xl font-black mr-8 absolute md:relative -left-4 md:left-0 top-0 md:top-auto opacity-20 md:opacity-100 italic">
                {index === 0 ? '01' : index === 1 ? '02' : index === 2 ? '03' : `#${index + 1}`}
              </div>

              <div className="info flex-1 space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <div className="name text-4xl font-black uppercase tracking-tight">{leader.username}</div>
                  <span className="text-sm bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30">
                    📍 {leader.city}
                  </span>
                </div>
                
                <div className="stats flex flex-wrap justify-center md:justify-start gap-6 text-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">👨‍🏫</span>
                    <span className="font-bold text-emerald-400">{leader.familyMembersTaught}</span>
                    <span className="text-gray-400 uppercase text-xs tracking-widest font-bold">People Taught</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">🎯</span>
                    <span className="font-bold text-blue-400">{leader.totalScore.toLocaleString()}</span>
                    <span className="text-gray-400 uppercase text-xs tracking-widest font-bold">Points</span>
                  </div>
                </div>
              </div>

              <div className="badges flex gap-4 mt-6 md:mt-0">
                {leader.badges.map((badge, bIdx) => (
                  <div 
                    key={bIdx}
                    className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-4xl shadow-inner group-hover:bg-white/10 transition-colors"
                    title="Achievement Badge"
                  >
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 p-12 rounded-3xl text-center relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
          
          <h3 className="text-5xl font-black italic tracking-tighter mb-4 relative z-10 uppercase">Want to join the leaderboard?</h3>
          <p className="text-2xl text-blue-200/70 mb-10 relative z-10 max-w-2xl mx-auto">
            Each person you teach increases India's security index. 
            Teach 5 family members and become a certified <span className="text-blue-400 font-bold">Cyber Ambassador</span> today!
          </p>
          <button 
            onClick={onClose}
            className="group relative bg-blue-600 hover:bg-blue-500 text-white text-3xl font-black px-16 py-6 rounded-2xl shadow-[0_0_50px_rgba(37,99,235,0.3)] transition-all hover:-translate-y-1 relative z-10"
          >
            START TEACHING NOW
            <span className="absolute inset-0 bg-white/20 rounded-2xl scale-0 group-hover:scale-100 transition-transform origin-center"></span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CyberAmbassadorLeaderboard;
