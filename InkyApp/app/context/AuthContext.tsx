// app/context/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import storage from '../util/storage';

interface AuthContextProps {
  userToken: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  userToken: null,
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    // Load token from storage on app start
    const loadToken = async () => {
      try {
        const token = await storage.getItemAsync('userToken');
        if (token) {
          setUserToken(token);
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
      await storage.setItemAsync('userToken', token);
    } catch (e) {
      console.error('Failed to save token', e);
    }
  };

  const logout = async () => {
    setUserToken(null);
    try {
      await storage.deleteItemAsync('userToken');
    } catch (e) {
      console.error('Failed to delete token', e);
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
