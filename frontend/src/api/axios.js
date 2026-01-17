import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, 
});

api.interceptors.request.use(
  (config) => {
    console.log("🔵 Making request to:", config.url);
    console.log("🔵 Request headers:", config.headers);
    console.log("🔵 Cookies:", document.cookie);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

