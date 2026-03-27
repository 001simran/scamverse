// ScamVerse - HackMol 7.0
// api.js - all backend calls in one place
// connects frontend to Simran's backend

import axios from 'axios'

const BASE_URL =
  (import.meta?.env?.VITE_API_URL && String(import.meta.env.VITE_API_URL)) ||
  'http://localhost:8001'

// Create axios instance with auth
const api = axios.create({
  baseURL: BASE_URL,
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth functions
export async function register(username, email, password) {
  const response = await api.post('/api/auth/register', {
    username,
    email,
    password
  })
  return response.data
}

export async function login(username, password) {
  const response = await api.post('/api/auth/login', new URLSearchParams({
    username,
    password
  }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  const { access_token } = response.data
  localStorage.setItem('token', access_token)
  return response.data
}

export function logout() {
  localStorage.removeItem('token')
}

// Progress functions
export async function saveProgress(scenarioId, completed = false, score = 0, notes = null) {
  const response = await api.post('/api/progress/progress', {
    scenario_id: scenarioId,
    completed,
    score,
    notes
  })
  return response.data
}

export async function getProgress() {
  const response = await api.get('/api/progress/progress')
  return response.data
}

export async function getScenarioProgress(scenarioId) {
  const response = await api.get(`/api/progress/progress/${scenarioId}`)
  return response.data
}

// get random scenario for a building
export async function getScenario(playerName, scamType = null) {
  try {
    let url = `/api/scenarios/random?player_name=${playerName}`
    if (scamType) url += `&scam_type=${scamType}`
    const response = await api.get(url)
    return response.data
  } catch (err) {
    console.log('backend not connected, using fallback')
    return null
  }
}

// get all scenarios
export async function getAllScenarios() {
  try {
    const response = await api.get('/api/scenarios/all')
    return response.data.scenarios
  } catch (err) {
    console.log('getAllScenarios error:', err)
    return []
  }
}

// analyze a message with AI
export async function analyzeMessage(message, playerName) {
  try {
    const response = await api.post('/api/scenarios/analyze', {
      message,
      player_name: playerName
    })
    return response.data.analysis
  } catch (err) {
    console.log('analyzeMessage error:', err)
    return null
  }
}

// get spin wheel segments
export async function getSpinSegments() {
  try {
    const response = await api.get('/api/spin/segments')
    return response.data.segments
  } catch (err) {
    console.log('getSpinSegments error:', err)
    return null
  }
}

// ask cyberguide a question
export async function askCyberGuide(question, playerName) {
  try {
    const response = await api.post('/api/ai/chat', {
      question,
      player_name: playerName
    })
    return response.data
  } catch (err) {
    console.log('askCyberGuide error:', err)
    return null
  }
}

// get daily tips
export async function getDailyTips() {
  try {
    const response = await api.get('/api/ai/tips')
    return response.data.tips
  } catch (err) {
    console.log('getDailyTips error:', err)
    return []
  }
}

// analyze text message for scam detection
export async function analyzeTextMessage(message) {
  try {
    const response = await api.post('/api/scenarios/analyze', {
      message
    })
    return response.data
  } catch (err) {
    console.log('analyzeTextMessage error:', err)
    return null
  }
}

// check URL for safety
export async function checkUrlSafety(url) {
  try {
    const response = await api.post('/api/safe-browsing/check', {
      url
    })
    return response.data
  } catch (err) {
    console.log('checkUrlSafety error:', err)
    return null
  }
}

// analyze image for deepfake
export async function analyzeImageDeepfake(imageFile) {
  try {
    const formData = new FormData()
    formData.append('image', imageFile)

    const response = await api.post('/api/deepfake/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (err) {
    console.log('analyzeImageDeepfake error:', err)
    return null
  }
}