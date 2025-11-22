import api from './axios';
import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/auth';

const AuthService = {
  // Requisição de Cadastro (POST /auth/register)
  register: (data: RegisterPayload) => {
    return api.post('/auth/register', data);
  },

  // Requisição de Login (POST /auth/login)
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    const token = response.data.toString();
    // Salva os dados no localStorage
    localStorage.setItem('token', token);

    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
  },

  // Verifica se há um token
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default AuthService;