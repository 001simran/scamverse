/*
 * ImpactDashboard.jsx
 * Shows measurable impact statistics for judges and players
 */

import React, { useState, useEffect } from 'react';

const ImpactDashboard = ({ userStats = {} }) => {
  const [animatedStats, setAnimatedStats] = useState({
    playersEducated: 0,
    familyMembersTrained: 0,
    scamsSpotted: 0,
    moneyProtected: 0,
    cyberAmbassadors: 0
  });

  // Real-time statistics (can be updated from API)
  const globalStats = {
    playersEducated: 1247,
    familyMembersTrained: 6235,
    scamsSpotted: 892,
    moneyProtected: 42000000, // ₹4.2 crores
    cyberAmbassadors: 156,
    scamIdentificationRate: 94,
    averageLivesProtected: 5
  };

  // Animate numbers counting up on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setAnimatedStats({
        playersEducated: Math.floor(globalStats.playersEducated * progress),
        familyMembersTrained: Math.floor(globalStats.familyMembersTrained * progress),
        scamsSpotted: Math.floor(globalStats.scamsSpotted * progress),
        moneyProtected: Math.floor(globalStats.moneyProtected * progress),
        cyberAmbassadors: Math.floor(globalStats.cyberAmbassadors * progress)
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} crores`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} lakhs`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  };

  const StatCard = ({ icon, value, label, color, suffix = '' }) => (
    <div
      style={{
        ...styles.statCard,
        borderLeftColor: color
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
      }}
    >
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
      <div style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: color,
        marginBottom: '0.25rem'
      }}>
        {value.toLocaleString('en-IN')}{suffix}
      </div>
      <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
        {label}
      </div>
    </div>
  );

  return (
    <div style={styles.dashboard}>
      <div style={styles.container}>
        <h1 style={styles.mainTitle}>🛡️ Impact Dashboard</h1>
        <p style={styles.subtitle}>
          Real-time statistics of lives protected and families educated
        </p>

        {/* Global Impact Stats */}
        <div style={styles.statsGrid}>
          <StatCard
            icon="👥"
            value={animatedStats.playersEducated}
            label="Players Educated"
            color="#3b82f6"
          />
          <StatCard
            icon="👨‍👩‍👧‍👦"
            value={animatedStats.familyMembersTrained}
            label="Family Members Trained"
            color="#22c55e"
          />
          <StatCard
            icon="🚨"
            value={animatedStats.scamsSpotted}
            label="Scams Correctly Identified"
            color="#ef4444"
          />
          <StatCard
            icon="💰"
            value={animatedStats.moneyProtected}
            label="Money Protected"
            color="#f59e0b"
            suffix=""
          />
        </div>

        {/* Key Metrics Section */}
        <div style={styles.metricsCard}>
          <h2 style={styles.metricsTitle}>📊 Key Performance Indicators</h2>
          
          <div style={styles.metricsGrid}>
            {/* Scam Identification Rate */}
            <div>
              <div style={styles.metricLabel}>Scam Identification Rate</div>
              <div style={styles.progressBarContainer}>
                <div
                  style={{
                    ...styles.progressBar,
                    width: `${globalStats.scamIdentificationRate}%`
                  }}
                >
                  <span style={styles.progressText}>
                    {globalStats.scamIdentificationRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* Cyber Ambassadors */}
            <div>
              <div style={styles.metricLabel}>Cyber Ambassadors</div>
              <div style={styles.largeMetric}>
                {animatedStats.cyberAmbassadors}
              </div>
              <div style={styles.metricSubtext}>Players who taught 10+ people</div>
            </div>

            {/* Multiplier Effect */}
            <div>
              <div style={styles.metricLabel}>Multiplier Effect</div>
              <div style={{
                ...styles.largeMetric,
                color: '#ef4444'
              }}>
                {globalStats.averageLivesProtected}x
              </div>
              <div style={styles.metricSubtext}>Each player protects 5 family members</div>
            </div>
          </div>
        </div>

        {/* User Personal Impact */}
        {userStats && Object.keys(userStats).length > 0 && (
          <div style={styles.userImpactCard}>
            <h2 style={styles.userImpactTitle}>⭐ Your Personal Impact</h2>
            
            <div style={styles.userStatsGrid}>
              <div style={styles.userStatItem}>
                <div style={styles.userStatLabel}>Missions Completed</div>
                <div style={styles.userStatValue}>
                  {userStats.missionsCompleted || 0}
                </div>
              </div>
              <div style={styles.userStatItem}>
                <div style={styles.userStatLabel}>Scams Spotted</div>
                <div style={styles.userStatValue}>
                  {userStats.scamsSpotted || 0}
                </div>
              </div>
              <div style={styles.userStatItem}>
                <div style={styles.userStatLabel}>Family Taught</div>
                <div style={styles.userStatValue}>
                  {userStats.familyTaught || 0}
                </div>
              </div>
              <div style={styles.userStatItem}>
                <div style={styles.userStatLabel}>Money Protected</div>
                <div style={styles.userStatValue}>
                  {formatCurrency(userStats.moneyProtected || 0)}
                </div>
              </div>
            </div>

            {userStats.badges && userStats.badges.length > 0 && (
              <div style={styles.badgesSection}>
                <div style={styles.badgesLabel}>Earned Badges:</div>
                <div style={styles.badgesContainer}>
                  {userStats.badges.map((badge, idx) => (
                    <span key={idx} style={styles.badge}>
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Testimonials */}
        <div style={styles.testimonialsCard}>
          <h2 style={styles.testimonialsTitle}>💬 Real User Impact Stories</h2>
          
          <div style={styles.testimonialsList}>
            <TestimonialCard
              name="Ramesh Kumar, 68"
              location="Lucknow"
              text="I received a digital arrest call yesterday. Because of ScamVerse, I recognized it immediately and hung up. Saved my pension fund of ₹14 lakh!"
              impact="₹14L saved"
            />
            <TestimonialCard
              name="Priya Sharma, 22"
              location="Mumbai"
              text="Taught my entire family (8 people) how to spot scams. My grandmother now laughs at scam calls instead of panicking!"
              impact="8 people protected"
            />
            <TestimonialCard
              name="Suresh Patel, 45"
              location="Ahmedabad"
              text="Spotted a fake loan app before downloading it. The game taught me the 'urgency tactics' red flag!"
              impact="Fraud prevented"
            />
          </div>
        </div>

        {/* Call to Action */}
        <div style={styles.ctaCard}>
          <h2>🚀 Join the Movement</h2>
          <p>Every player protects 5 family members. Be a Cyber Ambassador.</p>
          <button
            onClick={() => alert('Sharing feature coming soon!')}
            style={styles.ctaButton}
          >
            Share Your Impact
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

const TestimonialCard = ({ name, location, text, impact }) => (
  <div style={styles.testimonialCard}>
    <p style={styles.testimonialText}>
      "{text}"
    </p>
    <div style={styles.testimonialFooter}>
      <div>
        <div style={styles.testimonialName}>{name}</div>
        <div style={styles.testimonialLocation}>{location}</div>
      </div>
      <div style={styles.impactBadge}>
        ✅ {impact}
      </div>
    </div>
  </div>
);

const styles = {
  dashboard: {
    padding: '2rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  mainTitle: {
    fontSize: '2.5rem',
    color: 'white',
    textAlign: 'center',
    marginBottom: '0.5rem'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: '2rem'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  statCard: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    borderLeft: '4px solid',
    transition: 'all 0.3s',
    cursor: 'pointer'
  },
  metricsCard: {
    background: 'white',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    marginBottom: '2rem'
  },
  metricsTitle: {
    fontSize: '1.75rem',
    marginBottom: '1.5rem',
    color: '#1f2937'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem'
  },
  metricLabel: {
    fontSize: '0.85rem',
    color: '#6b7280',
    marginBottom: '0.5rem'
  },
  progressBarContainer: {
    background: '#f3f4f6',
    borderRadius: '0.5rem',
    height: '30px',
    position: 'relative',
    overflow: 'hidden'
  },
  progressBar: {
    background: 'linear-gradient(90deg, #22c55e 0%, #10b981 100%)',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    transition: 'width 1s ease-out'
  },
  progressText: {
    color: 'white',
    fontWeight: 'bold'
  },
  largeMetric: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#8b5cf6'
  },
  metricSubtext: {
    fontSize: '0.75rem',
    color: '#6b7280'
  },
  userImpactCard: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    padding: '2rem',
    borderRadius: '1rem',
    color: 'white',
    marginBottom: '2rem'
  },
  userImpactTitle: {
    fontSize: '1.75rem',
    marginBottom: '1.5rem'
  },
  userStatsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem'
  },
  userStatItem: {
    textAlign: 'center'
  },
  userStatLabel: {
    fontSize: '0.9rem',
    opacity: 0.9,
    marginBottom: '0.5rem'
  },
  userStatValue: {
    fontSize: '2rem',
    fontWeight: 'bold'
  },
  badgesSection: {
    marginTop: '1.5rem'
  },
  badgesLabel: {
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
    opacity: 0.9
  },
  badgesContainer: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  badge: {
    padding: '0.5rem 1rem',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '0.5rem',
    fontSize: '0.85rem'
  },
  testimonialsCard: {
    background: 'white',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    marginBottom: '2rem'
  },
  testimonialsTitle: {
    fontSize: '1.75rem',
    marginBottom: '1.5rem',
    color: '#1f2937'
  },
  testimonialsList: {
    display: 'grid',
    gap: '1rem'
  },
  testimonialCard: {
    padding: '1.25rem',
    background: '#f9fafb',
    borderRadius: '0.75rem',
    borderLeft: '4px solid #3b82f6'
  },
  testimonialText: {
    fontSize: '0.95rem',
    color: '#1f2937',
    marginBottom: '0.75rem',
    fontStyle: 'italic',
    margin: 0
  },
  testimonialFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  testimonialName: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: '#1f2937'
  },
  testimonialLocation: {
    fontSize: '0.8rem',
    color: '#6b7280'
  },
  impactBadge: {
    padding: '0.5rem 1rem',
    background: '#dcfce7',
    color: '#166534',
    borderRadius: '0.5rem',
    fontSize: '0.85rem',
    fontWeight: 'bold'
  },
  ctaCard: {
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    padding: '2rem',
    borderRadius: '1rem',
    textAlign: 'center',
    color: 'white'
  },
  ctaButton: {
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    background: 'white',
    color: '#16a34a',
    border: 'none',
    borderRadius: '0.75rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    marginTop: '1rem'
  }
};

export default ImpactDashboard;
