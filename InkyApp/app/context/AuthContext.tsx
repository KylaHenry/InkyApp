// app/context/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import jwtDecode from 'jwt-decode';

interface AuthContextProps {
  userToken: string | null;
  userRole: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAdmin: boolean;
  isUser: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  userToken: null,
  userRole: null,
  login: () => {},
  logout: () => {},
  isAdmin: false,
  isUser: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

interface DecodedToken {
  user_id: number;
  email: string;
  role: string;
  exp: number;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Load token from SecureStore on app start
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          setUserToken(token);
          const decoded: DecodedToken = jwtDecode(token);
          setUserRole(decoded.role);
        }
      } catch (e) {
        console.error('Failed to load token', e);
      }
    };

    loadToken();
  }, []);

  const login = async (token: string) => {
    setUserToken(token);
    try {
      await SecureStore.setItemAsync('userToken', token);
      const decoded: DecodedToken = jwtDecode(token);
      setUserRole(decoded.role);
    } catch (e) {
      console.error('Failed to save token', e);
    }
  };

  const logout = async () => {
    setUserToken(null);
    setUserRole(null);
    try {
      await SecureStore.deleteItemAsync('userToken');
    } catch (e) {
      console.error('Failed to delete token', e);
    }
  };

  const isAdmin = userRole === 'admin';
  const isUser = userRole === 'user';

  return (
    <AuthContext.Provider value={{ userToken, userRole, login, logout, isAdmin, isUser }}>
      {children}
    </AuthContext.Provider>
  );
};
