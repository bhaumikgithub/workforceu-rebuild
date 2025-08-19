import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://dev-api.example.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Login API
export const loginUser = async (email: string, password: string) => {
  const res = await API.post("/login", { email, password });
  return res.data;
};

// Get Curriculum
export const getCurriculum = async () => {
  const res = await API.get("/curriculum");
  return res.data;
};

// Export API instance if needed
export default API;
