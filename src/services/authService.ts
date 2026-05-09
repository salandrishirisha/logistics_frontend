import { api } from '../api/axios';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';

export const authService = {
  register: async (payload: RegisterRequest) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },
  login: async (payload: LoginRequest): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', payload);
    return data;
  },
};