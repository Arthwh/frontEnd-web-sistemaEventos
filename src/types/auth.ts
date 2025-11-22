import type { UserData } from '../types/user';

// Dados enviados para POST /auth/register
export interface RegisterPayload {
  cpf: string;
  fullname: string;
  email: string;
  password: string;
  birth_date: string;
}

// Dados enviados para POST /auth/login
export interface LoginPayload {
  email: string;
  password: string;
}

// Dados esperados na resposta do Login
export interface AuthResponse {
  token: string;
}

// Interface para o corpo de erro esperado do microsserviço
export interface BackendError {
  message: string;
}

// Tipo para dados do usuário autenticado
export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<UserData>) => void;
}