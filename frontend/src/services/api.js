import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Assessment endpoints
export async function saveAssessment(data) {
  const response = await api.post("/assessment", data);
  return response.data;
}

export async function calculateScore(data) {
  const response = await api.post("/calculate", data);
  return response.data;
}

export async function analyzeAssessment(assessmentId) {
  const response = await api.post("/analyze", { assessmentId });
  return response.data;
}

export async function getDashboard() {
  const response = await api.get("/dashboard");
  return response.data;
}

export async function healthCheck() {
  const response = await api.get("/health");
  return response.data;
}

export default api;
