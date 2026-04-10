// src/api/client.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// ─── Change this to your Render.com backend URL in production ───────────────
export const API_BASE_URL = __DEV__
  ? 'http://10.18.168.191:3000'   // ← replace with your local IP when testing
  : 'https://your-api.onrender.com';

const client = axios.create({
  baseURL: API_BASE_URL + '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
client.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 — clear token and redirect to login
client.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('user');
    }
    return Promise.reject(error);
  }
);

export default client;


