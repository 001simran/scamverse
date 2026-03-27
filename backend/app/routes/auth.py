// ScamVerse - HackMol 7.0
// api.js - all backend calls in one place

import axios from 'axios'

// ✅ STRICT ENV (no fallback)
const BASE_URL = import.meta.env.VITE_API_URL

if (!BASE_URL) {
  throw new Error("❌ VITE_API_URL is not defined. Check your environment variables.")
}

// Axios instance
const api = axios.create({
  baseURL: BASE_URL,
})

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/* ================= AUTH ================= */

// ✅ FIXED LOGIN (JSON instead of form-data)
export async function login(username, password) {
  try {
    const res = await api.post('/api/auth/login', {
      username,
      password
    })

    const { access_token } = res.data
    localStorage.setItem('token', access_token)

    return res.data
  } catch (err) {
    console.error('❌ Login error:', err.response?.data || err.message)
    throw err
  }
}

export async function register(username, email, password) {
  try {
    const res = await api.post('/api/auth/register', {
      username,
      email,
      password
    })

    const { access_token } = res.data
    localStorage.setItem('token', access_token)

    return res.data
  } catch (err) {
    console.error('❌ Register error:', err.response?.data || err.message)
    throw err
  }
}

export function logout() {
  localStorage.removeItem('token')
}

/* ================= PROGRESS ================= */

export async function saveProgress(scenarioId, completed = false, score = 0, notes = null) {
  const res = await api.post('/api/progress/progress', {
    scenario_id: scenarioId,
    completed,
    score,
    notes
  })
  return res.data
}

export async function getProgress() {
  const res = await api.get('/api/progress/progress')
  return res.data
}

export async function getScenarioProgress(scenarioId) {
  const res = await api.get(`/api/progress/progress/${scenarioId}`)
  return res.data
}

/* ================= SCENARIOS ================= */

export async function getScenario(playerName, scamType = null) {
  try {
    let url = `/api/scenarios/random?player_name=${playerName}`
    if (scamType) url += `&scam_type=${scamType}`
    const res = await api.get(url)
    return res.data
  } catch (err) {
    console.error('❌ getScenario error:', err)
    return null
  }
}

export async function getAllScenarios() {
  try {
    const res = await api.get('/api/scenarios/all')
    return res.data.scenarios
  } catch (err) {
    console.error('❌ getAllScenarios error:', err)
    return []
  }
}

/* ================= AI ================= */

export async function analyzeMessage(message, playerName) {
  try {
    const res = await api.post('/api/scenarios/analyze', {
      message,
      player_name: playerName
    })
    return res.data.analysis
  } catch (err) {
    console.error('❌ analyzeMessage error:', err)
    return null
  }
}

export async function askCyberGuide(question, playerName) {
  try {
    const res = await api.post('/api/ai/chat', {
      question,
      player_name: playerName
    })
    return res.data
  } catch (err) {
    console.error('❌ askCyberGuide error:', err)
    return null
  }
}

export async function getDailyTips() {
  try {
    const res = await api.get('/api/ai/tips')
    return res.data.tips
  } catch (err) {
    console.error('❌ getDailyTips error:', err)
    return []
  }
}

/* ================= UTILITIES ================= */

export async function getSpinSegments() {
  try {
    const res = await api.get('/api/spin/segments')
    return res.data.segments
  } catch (err) {
    console.error('❌ getSpinSegments error:', err)
    return null
  }
}

export async function analyzeTextMessage(message) {
  try {
    const res = await api.post('/api/scenarios/analyze', { message })
    return res.data
  } catch (err) {
    console.error('❌ analyzeTextMessage error:', err)
    return null
  }
}

export async function checkUrlSafety(url) {
  try {
    const res = await api.post('/api/safe-browsing/check', { url })
    return res.data
  } catch (err) {
    console.error('❌ checkUrlSafety error:', err)
    return null
  }
}

export async function analyzeImageDeepfake(imageFile) {
  try {
    const formData = new FormData()
    formData.append('image', imageFile)

    const res = await api.post('/api/deepfake/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return res.data
  } catch (err) {
    console.error('❌ analyzeImageDeepfake error:', err)
    return null
  }
}