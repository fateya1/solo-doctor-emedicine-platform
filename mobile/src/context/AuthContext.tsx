import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authApi } from '../api/auth.api';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => Promise<void>;
  isDoctor: boolean;
  isPatient: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('access_token');
        const storedUser = await SecureStore.getItemAsync('user');
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };
    // Add timeout so it never hangs forever
    const timer = setTimeout(() => setIsLoading(false), 3000);
    restore().finally(() => clearTimeout(timer));
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authApi.login({ email, password });
    await SecureStore.setItemAsync('access_token', data.access_token);
    await SecureStore.setItemAsync('user', JSON.stringify(data.user));
    setToken(data.access_token);
    setUser(data.user);
  };

  const register = async (payload: any) => {
    const data = await authApi.register(payload);
    await SecureStore.setItemAsync('access_token', data.access_token);
    await SecureStore.setItemAsync('user', JSON.stringify(data.user));
    setToken(data.access_token);
    setUser(data.user);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user, token, isLoading, login, register, logout,
        isDoctor: user?.role === 'DOCTOR',
        isPatient: user?.role === 'PATIENT',
        isAdmin: user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);