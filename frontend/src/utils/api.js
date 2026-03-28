import axios from "axios";

// Default: backend on port 8001 (override with VITE_API_URL, e.g. http://127.0.0.1:8001)
const apiRoot = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8001").replace(/\/$/, "");

const API = axios.create({
  baseURL: `${apiRoot}/api`,
});

// 🔐 Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// ✅ LOGIN
export const login = async (username, password) => {
  try {
    const res = await API.post("/auth/login", {
      username: username,
      password: password,
    });

    localStorage.setItem("token", res.data.access_token);
    return res.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const loginUser = login;

// ✅ REGISTER
export const register = async (username, email, password) => {
  try {
    const res = await API.post("/auth/register", {
      username,
      email,
      password,
    });
    return res.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const registerUser = register;

// ✅ LOGOUT
export const logout = () => {
  localStorage.removeItem("token");
};

// ✅ GET CURRENT USER
export const getMe = async () => {
  try {
    const res = await API.get("/auth/me");
    return res.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// ✅ GET SPIN WHEEL SEGMENTS
export const getSpinSegments = async () => {
  try {
    const res = await API.get("/spin/segments");
    return res.data;
  } catch (error) {
    console.error("Error fetching spin segments:", error);
    return [
      { id: 1, name: "10 Coins", value: 10, color: "#FFD700" },
      { id: 2, name: "20 Coins", value: 20, color: "#C0C0C0" },
      { id: 3, name: "50 Coins", value: 50, color: "#CD7F32" },
      { id: 4, name: "100 Coins", value: 100, color: "#FF6B6B" },
      { id: 5, name: "5 Coins", value: 5, color: "#4ECDC4" },
      { id: 6, name: "200 Coins", value: 200, color: "#FFE66D" },
      { id: 7, name: "Try Again", value: 0, color: "#95A5A6" },
      { id: 8, name: "500 Coins", value: 500, color: "#9B59B6" },
    ];
  }
};

// ✅ SUBMIT SPIN RESULT
export const submitSpin = async (result) => {
  try {
    const res = await API.post("/spin/result", { result });
    return res.data;
  } catch (error) {
    console.error("Error submitting spin result:", error);
    throw error;
  }
};

// ✅ GET USER STATS
export const getUserStats = async () => {
  try {
    const res = await API.get("/user/stats");
    return res.data;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
};

// ✅ ANALYZE MESSAGE FOR SCAM DETECTION
export const analyzeMessage = async (message) => {
  try {
    const res = await API.post("/analyze", { message });
    return res.data;
  } catch (error) {
    console.error("Error analyzing message:", error);
    return {
      isScam: false,
      confidence: 0,
      riskLevel: "low",
      reasons: ["Unable to analyze message at this time"],
      scamScore: 0,
      suggestions: ["Please try again later"],
      message: message,
      timestamp: new Date().toISOString()
    };
  }
};