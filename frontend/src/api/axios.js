import axios from "axios";

// 1. Asosiy manzilni o'zgaruvchiga olamiz (oxirida /api yo'q)
export const BASE_URL = "https://nokis-ijara-uyler-backend.onrender.com";

const API = axios.create({
  // 2. API so'rovlari uchun /api qo'shimchasini qo'shib baseURL qilamiz
  baseURL: `${BASE_URL}/api`,
});

// Har bir so'rovga avtomatik token qo'shish
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
