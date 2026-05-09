import { api } from '../api/axios';
import type { AuthResponse, LoginRequest, RegisterRequest, Role } from '../types/auth';

type LoginApiResponse = {
  token: string;
  role: Role;
  userId: number;
  name: string;
};

export const authService = {
  register: async (payload: RegisterRequest) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },

  login: async (payload: LoginRequest): Promise<AuthResponse> => {
    const { data } = await api.post<LoginApiResponse>('/auth/login', payload);

    return {
      token: data.token,
      user: {
        id: data.userId,
        name: data.name,
        role: data.role,
      },
    };
  },
};