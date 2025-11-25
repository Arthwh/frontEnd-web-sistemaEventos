import axios from 'axios';

//URL do API Gateway
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

//Adiciona o token em TODAS as requisições que saem
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    // Injeta o token para o API Gateway validar
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;