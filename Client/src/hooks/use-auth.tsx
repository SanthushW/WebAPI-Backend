import React, { useState, useEffect, useContext, createContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { User } from '@/types/shared';

interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

function createAuthValue() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  const queryClient = useQueryClient();

  // Skip automatic /auth/me fetch to require login each session
  const isLoading = false;

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string; }): Promise<AuthResponse> => {
      return apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
    },
    onSuccess: (data) => {
      setAuthState({ user: data.user, token: data.token, isAuthenticated: true });
      queryClient.invalidateQueries();
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (payload: { username: string; password: string; role?: string; }): Promise<AuthResponse> => {
      return apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
    },
    onSuccess: (data) => {
      setAuthState({ user: data.user, token: data.token, isAuthenticated: true });
      queryClient.invalidateQueries();
    },
  });

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({ user: null, token: null, isAuthenticated: false });
    queryClient.clear();
  };

  return {
    ...authState,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}

const AuthContext = createContext<ReturnType<typeof createAuthValue> | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const value = createAuthValue();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}


