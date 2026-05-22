import axios from "axios";

const API = axios.create({
  // Point to Spring Boot's port (8080)
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Dynamic interceptor to attach the JWT token to every request
API.interceptors.request.use(
  (config) => {
    // 1. Grab the raw token string directly from localStorage
    const token = localStorage.getItem("token");

    // 2. If it exists, attach it to the header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default API;
