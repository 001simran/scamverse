// ScamVerse - HackMol 7.0
// GameContext.jsx - global game state
// tracks score xp level everything

import { createContext, useContext, useReducer } from 'react'

const GameContext = createContext(null)

const INITIAL_STATE = {
  playerName: '',
  score: 0,
  xp: 0,
  level: 1,
  rank: 'Rookie',
  caught: 0,
  fellFor: 0,
  combo: 0,
  shields: 1,
  scanners: 2,
  hints: 1,
  citySecurity: 50,
  isElderMode: false,
  achievements: [],
  currentView: 'title',  // title | game | scenario | spin | dna
  
  // ========== NEW ADVANCED FEATURES STATE ==========
  playerXP: 0,              // Total XP (separate from score)
  playerLevel: 1,          // Level based on XP
  playerBadges: [],        // Earned badges
  moneyProtected: 0,       // ₹ amount saved from scams
  scamsSpotted: 0,         // Total scams correctly identified
  familyTaught: 0,         // Family members educated
  missionsCompleted: 0,    // Completed missions
  emotionalImpact: 0,      // Emotional impact score
  lastCutscene: null,      // Last cutscene shown
  // ==============================================
}

const RANKS = [
  { level: 1, rank: 'Rookie',       xp: 0    },
  { level: 2, rank: 'Analyst',      xp: 300  },
  { level: 3, rank: 'Cyber Agent',  xp: 700  },
  { level: 4, rank: 'Guardian',     xp: 1200 },
  { level: 5, rank: 'Elite Guardian', xp: 2000 },
  { level: 6, rank: 'CyberHero',    xp: 3000 },
]

function computeRank(xp) {
  let current = RANKS[0]
  for (const r of RANKS) {
    if (xp >= r.xp) current = r
  }
  return current
}

function reducer(state, action) {
  switch (action.type) {

    case 'SET_PLAYER': {
      return {
        ...state,
        playerName: action.payload.name,
        isElderMode: action.payload.elderMode || false,
        currentView: 'game'
      }
    }

    case 'SET_VIEW': {
      return { ...state, currentView: action.payload }
    }

    case 'CORRECT_ANSWER': {
      const xpGain = action.payload || 100
      const combo = state.combo + 1
      const multiplier = combo >= 5 ? 3 : combo >= 3 ? 2 : 1
      const earned = xpGain * multiplier
      const newXP = state.xp + earned
      const rankInfo = computeRank(newXP)
      
      // Also update new XP system
      const newPlayerXP = state.playerXP + earned
      const newPlayerLevel = Math.floor(newPlayerXP / 100) + 1
      
      return {
        ...state,
        score: state.score + earned,
        xp: newXP,
        playerXP: newPlayerXP,
        playerLevel: newPlayerLevel,
        level: rankInfo.level,
        rank: rankInfo.rank,
        caught: state.caught + 1,
        scamsSpotted: state.scamsSpotted + 1,  // Increment scams spotted
        combo: combo,
        citySecurity: Math.min(100, state.citySecurity + 10)
      }
    }

    case 'WRONG_ANSWER': {
      return {
        ...state,
        fellFor: state.fellFor + 1,
        combo: 0,
        citySecurity: Math.max(0, state.citySecurity - 15)
      }
    }

    case 'USE_POWERUP': {
      if (state[action.payload] <= 0) return state
      return { ...state, [action.payload]: state[action.payload] - 1 }
    }

    // ========== NEW ACTIONS FOR ADVANCED FEATURES ==========
    
    case 'ADD_XP': {
      const earned = action.payload || 50
      const newXP = state.xp + earned
      const rankInfo = computeRank(newXP)
      const newPlayerXP = state.playerXP + earned
      const newPlayerLevel = Math.floor(newPlayerXP / 100) + 1
      
      return {
        ...state,
        xp: newXP,
        playerXP: newPlayerXP,
        playerLevel: newPlayerLevel,
        level: rankInfo.level,
        rank: rankInfo.rank,
        score: state.score + earned
      }
    }
    
    case 'ADD_BADGE': {
      const badge = action.payload
      // Don't add duplicate badges
      if (state.playerBadges.includes(badge)) return state
      
      return {
        ...state,
        playerBadges: [...state.playerBadges, badge],
        achievements: [...state.achievements, { 
          name: badge, 
          earnedAt: new Date().toISOString() 
        }]
      }
    }
    
    case 'UPDATE_MONEY_PROTECTED': {
      const amount = action.payload || 0
      return {
        ...state,
        moneyProtected: state.moneyProtected + amount
      }
    }
    
    case 'MISSION_COMPLETE': {
      const isCorrect = action.payload || false
      return {
        ...state,
        missionsCompleted: state.missionsCompleted + 1,
        scamsSpotted: state.scamsSpotted + (isCorrect ? 1 : 0)
      }
    }
    
    case 'TEACH_FAMILY': {
      return {
        ...state,
        familyTaught: state.familyTaught + 1
      }
    }
    
    case 'EMOTIONAL_IMPACT': {
      const impactValue = action.payload.value || 10
      const scamType = action.payload.scamType || 'unknown'
      const isWrong = action.payload.isWrong || false
      
      // Higher impact for wrong choices
      const actualImpact = isWrong ? impactValue * 2 : impactValue
      
      return {
        ...state,
        emotionalImpact: (state.emotionalImpact || 0) + actualImpact,
        lastCutscene: {
          scamType,
          timestamp: Date.now(),
          wasWrong: isWrong
        }
      }
    }
    
    case 'RESET_ADVANCED_STATS': {
      return {
        ...state,
        playerXP: 0,
        playerLevel: 1,
        playerBadges: [],
        moneyProtected: 0,
        scamsSpotted: 0,
        familyTaught: 0,
        missionsCompleted: 0,
        emotionalImpact: 0,
        lastCutscene: null
      }
    }
    
    // ======================================================
    
    case 'RESET': {
      return { ...INITIAL_STATE }
    }

    default:
      return state
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  
  const setPlayer = (name, elderMode = false) => {
    dispatch({
      type: 'SET_PLAYER',
      payload: { name, elderMode }
    })
  }
  
  const setView = (view) => {
    dispatch({ type: 'SET_VIEW', payload: view })
  }
  
  return (
    <GameContext.Provider value={{ state, dispatch, setPlayer, setView }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be inside GameProvider')
  return ctx
}

export { RANKS }