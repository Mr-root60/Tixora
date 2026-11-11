// mobile/src/context/AuthContext.js
import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setAuthToken } from '../api/client';

const STORAGE_KEY = 'auth_token';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Au lancement : si un badge est sauvegardé, on vérifie qu'il est encore valide.
  useEffect(() => {
    async function restoreSession() {
      try {
        const token = await AsyncStorage.getItem(STORAGE_KEY);
        if (token) {
          setAuthToken(token);
          const res = await api.get('/auth/me');
          setUser(res.data);
        }
      } catch (e) {
        // badge expiré ou serveur injoignable : on repart déconnecté
        setAuthToken(null);
        await AsyncStorage.removeItem(STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  async function saveSession(data) {
    setAuthToken(data.access_token);
    await AsyncStorage.setItem(STORAGE_KEY, data.access_token);
    setUser(data.user);
  }

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    await saveSession(res.data);
  }

  async function register(fullName, email, password) {
    const res = await api.post('/auth/register', {
      full_name: fullName,
      email,
      password,
    });
    await saveSession(res.data);
  }

  async function logout() {
    setAuthToken(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
