// src/api/auth.api.ts
import client from './client';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  role: 'PATIENT' | 'DOCTOR';
}

export const authApi = {
  login: async (payload: LoginPayload) => {
    const res = await client.post('/auth/login', payload);
    return res.data; // { access_token, user }
  },

  register: async (payload: RegisterPayload) => {
    const res = await client.post('/auth/register', payload);
    return res.data;
  },

  forgotPassword: async (email: string) => {
    const res = await client.post('/auth/forgot-password', { email });
    return res.data;
  },

  resetPassword: async (token: string, password: string) => {
    const res = await client.post('/auth/reset-password', { token, password });
    return res.data;
  },

  me: async () => {
    const res = await client.get('/users/me');
    return res.data;
  },
};
