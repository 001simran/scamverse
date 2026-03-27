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
  rank: 'Trainee',
  caught: 0,
  fellFor: 0,
  combo: 0,
  shields: 1,
  scanners: 2,
  hints: 1,
  isElderMode: false,
  achievements: [],
  currentView: 'title',  // title | game | scenario | spin | dna
}

const RANKS = [
  { level: 1, rank: 'Trainee',      xp: 0    },
  { level: 2, rank: 'Scout',        xp: 300  },
  { level: 3, rank: 'Analyst',      xp: 700  },
  { level: 4, rank: 'Investigator', xp: 1200 },
  { level: 5, rank: 'Defender',     xp: 2000 },
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
      return {
        ...state,
        score: state.score + earned,
        xp: newXP,
        level: rankInfo.level,
        rank: rankInfo.rank,
        caught: state.caught + 1,
        combo: combo,
      }
    }

    case 'WRONG_ANSWER': {
      return {
        ...state,
        fellFor: state.fellFor + 1,
        combo: 0,
      }
    }

    case 'USE_POWERUP': {
      if (state[action.payload] <= 0) return state
      return { ...state, [action.payload]: state[action.payload] - 1 }
    }

    case 'RESET': {
      return { ...INITIAL_STATE }
    }

    default:
      return state
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  return (
    <GameContext.Provider value={{ state, dispatch }}>
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