import axios from 'axios';

export const BACKEND_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;