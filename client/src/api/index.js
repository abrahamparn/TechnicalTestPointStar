import axios from "axios";
import { useAuthStore } from "../store/auth"; //get token for everything

const devBaseUrl = "http://localhost:3000/api/v1";
const prodBaseUrl = "/api/v1";
const baseURL = import.meta.env.DEV ? devBaseUrl : prodBaseUrl;

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
