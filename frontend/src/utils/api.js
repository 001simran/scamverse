// Add this after your existing exports

// ✅ GET SPIN WHEEL SEGMENTS
export const getSpinSegments = async () => {
  try {
    const res = await API.get("/spin/segments");
    return res.data;
  } catch (error) {
    console.error("Error fetching spin segments:", error);
    // Return fallback data if API fails
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

// ✅ GET USER STATS (including coins, etc.)
export const getUserStats = async () => {
  try {
    const res = await API.get("/user/stats");
    return res.data;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
};
// Add this after your other exports

// ✅ ANALYZE MESSAGE FOR SCAM DETECTION
export const analyzeMessage = async (message) => {
  try {
    const res = await API.post("/analyze", { message });
    return res.data;
  } catch (error) {
    console.error("Error analyzing message:", error);
    // Return fallback analysis result if API fails
    return {
      isScam: false,
      confidence: 0,
      riskLevel: "low",
      reasons: ["Unable to analyze message at this time"],
      scamScore: 0,
      suggestions: ["Please try again later"]
    };
  }
};