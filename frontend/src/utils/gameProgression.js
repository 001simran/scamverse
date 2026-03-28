// gameProgression.js
// XP, Ranking, and City Security System for NetGuardian

export const RANKS = [
  { rankId: 1, name: "Rookie Guardian", minXP: 0, maxXP: 500, benefits: ["Tutorial access", "Basic missions"] },
  { rankId: 2, name: "Alert Guardian", minXP: 500, maxXP: 1200, benefits: ["Intermediate missions", "+10% XP bonus"] },
  { rankId: 3, name: "Seasoned Guardian", minXP: 1200, maxXP: 2500, benefits: ["All mission types", "+15% XP bonus", "Learn Mode unlocked"] },
  { rankId: 4, name: "Expert Guardian", minXP: 2500, maxXP: 5000, benefits: ["Challenge mode", "+25% XP bonus", "Team challenges"] },
  { rankId: 5, name: "Elite Guardian", minXP: 5000, maxXP: Infinity, benefits: ["All features", "+50% XP bonus", "Leaderboard exclusives"] }
]

export class ProgressionSystem {
  constructor(userId) {
    this.userId = userId
    this.totalXP = 0
    this.currentRankId = 1
    this.citySecurityLevel = 60 // Start at 60%
    this.missionCount = 0
    this.citizensSaved = 0
    this.citizensLost = 0
    this.achievements = []
    this.missionHistory = []
  }

  // ════════════════════════════════════════════════════════════
  // XP MANAGEMENT
  // ════════════════════════════════════════════════════════════

  addXP(amount, missionId = null) {
    const xpGain = Math.floor(amount)
    this.totalXP += xpGain

    // Check for rank up
    const newRank = this.getRankForXP(this.totalXP)
    if (newRank > this.currentRankId) {
      this.onRankUp(newRank)
    }

    return {
      xpGained: xpGain,
      totalXP: this.totalXP,
      newRank: newRank,
      feedback: `+${xpGain} XP!`
    }
  }

  getRankForXP(xp) {
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (xp >= RANKS[i].minXP) return i + 1
    }
    return 1
  }

  getCurrentRankInfo() {
    const rank = RANKS[this.currentRankId - 1]
    return {
      rankId: this.currentRankId,
      name: rank.name,
      minXP: rank.minXP,
      maxXP: rank.maxXP,
      benefits: rank.benefits,
      xpProgress: {
        current: this.totalXP - rank.minXP,
        total: rank.maxXP - rank.minXP,
        percentage: ((this.totalXP - rank.minXP) / (rank.maxXP - rank.minXP)) * 100
      }
    }
  }

  onRankUp(newRankId) {
    this.currentRankId = newRankId
    const rank = RANKS[newRankId - 1]
    this.achievements.push({
      type: "RANK_UP",
      rankName: rank.name,
      timestamp: new Date(),
      xp: this.totalXP
    })
  }

  // ════════════════════════════════════════════════════════════
  // CITY SECURITY SYSTEM
  // ════════════════════════════════════════════════════════════

  updateCitySecurity(change, reason = "Mission result") {
    const previousLevel = this.citySecurityLevel
    this.citySecurityLevel = Math.max(0, Math.min(100, this.citySecurityLevel + change))

    const state = this.getCitySecurityState()

    // Check for critical states
    if (previousLevel > 30 && this.citySecurityLevel <= 30) {
      this.triggerCrisisMode()
    }

    if (this.citySecurityLevel === 100) {
      this.triggerVictory()
    }

    if (this.citySecurityLevel === 0) {
      this.triggerGameOver()
    }

    return {
      previousLevel,
      newLevel: this.citySecurityLevel,
      change,
      reason,
      state
    }
  }

  getCitySecurityState() {
    if (this.citySecurityLevel >= 80) return "EXCELLENT" // 🟢
    if (this.citySecurityLevel >= 60) return "GOOD" // 🟡
    if (this.citySecurityLevel >= 40) return "FAIR" // 🟠
    if (this.citySecurityLevel >= 20) return "CRITICAL" // 🔴
    return "CATASTROPHIC" // ⚫
  }

  getCitySecurityColor() {
    const state = this.getCitySecurityState()
    const colors = {
      EXCELLENT: "#00FF41",
      GOOD: "#FFD700",
      FAIR: "#FFA500",
      CRITICAL: "#FF4500",
      CATASTROPHIC: "#FF0000"
    }
    return colors[state]
  }

  triggerCrisisMode() {
    this.achievements.push({
      type: "CRISIS_MODE",
      timestamp: new Date(),
      security: this.citySecurityLevel
    })
  }

  triggerVictory() {
    this.achievements.push({
      type: "VICTORY",
      timestamp: new Date(),
      totalXP: this.totalXP,
      rank: RANKS[this.currentRankId - 1].name
    })
  }

  triggerGameOver() {
    this.achievements.push({
      type: "GAME_OVER",
      timestamp: new Date(),
      reason: "City security collapsed",
      finalXP: this.totalXP,
      rank: RANKS[this.currentRankId - 1].name
    })
  }

  // ════════════════════════════════════════════════════════════
  // MISSION TRACKING
  // ════════════════════════════════════════════════════════════

  recordMissionResult(missionId, scamType, result) {
    this.missionCount += 1

    const missionResult = {
      missionId,
      scamType,
      timestamp: new Date(),
      result: result.isCorrect ? "SUCCESS" : "FAILURE",
      xpEarned: result.xpGain,
      securityChange: result.securityGain,
      citizenName: result.citizenName || "Unknown Citizen"
    }

    this.missionHistory.push(missionResult)

    // Update save counters
    if (result.isCorrect) {
      this.citizensSaved += 1
    } else {
      this.citizensLost += 1
    }

    // Add XP and update security
    this.addXP(result.xpGain, missionId)
    this.updateCitySecurity(result.securityGain, `Mission: ${scamType}`)

    return missionResult
  }

  getMissionAccuracy() {
    if (this.missionCount === 0) return 0
    return Math.round((this.citizensSaved / this.missionCount) * 100)
  }

  getRecentMissions(count = 5) {
    return this.missionHistory.slice(-count).reverse()
  }

  getMissionStats() {
    return {
      totalMissions: this.missionCount,
      citizensSaved: this.citizensSaved,
      citizensLost: this.citizensLost,
      accuracy: this.getMissionAccuracy() + "%",
      defensionStats: {
        tier1Solved: this.missionHistory.filter(m => m.scamType === "tier1").length,
        tier2Solved: this.missionHistory.filter(m => m.scamType === "tier2").length,
        tier3Solved: this.missionHistory.filter(m => m.scamType === "tier3").length,
        tier4Solved: this.missionHistory.filter(m => m.scamType === "tier4").length
      }
    }
  }

  // ════════════════════════════════════════════════════════════
  // ACHIEVEMENTS
  // ════════════════════════════════════════════════════════════

  checkAndUnlockAchievements() {
    const newAchievements = []

    // First Save
    if (this.citizensSaved === 1 && !this.achievements.find(a => a.type === "FIRST_SAVE")) {
      newAchievements.push({
        id: "first_save",
        name: "🛡️ First Guardian",
        description: "Saved your first citizen",
        xpReward: 50
      })
    }

    // Perfect Round (10 consecutive correct)
    const recentTen = this.missionHistory.slice(-10)
    if (recentTen.length === 10 && recentTen.every(m => m.result === "SUCCESS")) {
      newAchievements.push({
        id: "perfect_round",
        name: "⭐ Flawless",
        description: "10 perfect decisions in a row",
        xpReward: 200
      })
    }

    // 50 Citizens Saved
    if (this.citizensSaved === 50 && !this.achievements.find(a => a.type === "HERO_50")) {
      newAchievements.push({
        id: "hero_50",
        name: "🦸 City Hero",
        description: "Saved 50 citizens",
        xpReward: 300
      })
    }

    // Speedrunner (3+ missions in 2 minutes)
    const twoMinutesAgo = new Date(Date.now() - 120000)
    const recentFast = this.missionHistory.filter(m => new Date(m.timestamp) > twoMinutesAgo)
    if (recentFast.length >= 3) {
      newAchievements.push({
        id: "speedrunner",
        name: "⚡ Lightning Reflexes",
        description: "3 missions in 2 minutes",
        xpReward: 150
      })
    }

    // All Tier 4 Scams Completed
    const tier4Missions = this.missionHistory.filter(m => m.scamType === "tier4")
    if (tier4Missions.length >= 3 && tier4Missions.every(m => m.result === "SUCCESS")) {
      newAchievements.push({
        id: "expert_detector",
        name: "🔍 Expert Detector",
        description: "Solved 3 Expert-level scams",
        xpReward: 250
      })
    }

    // Add new achievements to list and award XP
    newAchievements.forEach(achievement => {
      const existing = this.achievements.find(a => a.id === achievement.id)
      if (!existing) {
        this.achievements.push({
          ...achievement,
          unlockedAt: new Date()
        })
        this.totalXP += achievement.xpReward
      }
    })

    return newAchievements
  }

  getAchievements() {
    return this.achievements.filter(a => a.unlockedAt || a.type)
  }

  // ════════════════════════════════════════════════════════════
  // STATISTICS & REPORTING
  // ════════════════════════════════════════════════════════════

  getFullProgressReport() {
    return {
      userId: this.userId,
      rank: {
        current: this.getCurrentRankInfo(),
        totalXP: this.totalXP
      },
      city: {
        securityLevel: this.citySecurityLevel,
        state: this.getCitySecurityState(),
        color: this.getCitySecurityColor()
      },
      missions: this.getMissionStats(),
      achievements: this.getAchievements(),
      recent: {
        missions: this.getRecentMissions(3),
        achievements: this.achievements.slice(-3)
      }
    }
  }

  exportProgressData() {
    return {
      userId: this.userId,
      exportDate: new Date().toISOString(),
      summary: this.getFullProgressReport(),
      fullHistory: this.missionHistory,
      allAchievements: this.achievements
    }
  }

  // ════════════════════════════════════════════════════════════
  // RESET & DEBUG
  // ════════════════════════════════════════════════════════════

  resetProgress() {
    this.totalXP = 0
    this.currentRankId = 1
    this.citySecurityLevel = 60
    this.missionCount = 0
    this.citizensSaved = 0
    this.citizensLost = 0
    this.achievements = []
    this.missionHistory = []
  }

  // For hackathon demo: Skip to exciting points
  demoMode(demoLevel = "mid") {
    if (demoLevel === "mid") {
      this.totalXP = 2000
      this.currentRankId = 3
      this.citySecurityLevel = 65
      this.missionCount = 20
      this.citizensSaved = 18
      this.citizensLost = 2
    } else if (demoLevel === "endgame") {
      this.totalXP = 4800
      this.currentRankId = 4
      this.citySecurityLevel = 85
      this.missionCount = 45
      this.citizensSaved = 42
      this.citizensLost = 3
    }
  }
}

export default ProgressionSystem
