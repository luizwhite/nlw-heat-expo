import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSessions from 'expo-auth-session';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { api } from '@/services/api';

interface IUser {
  id: string;
  avatar_url: string;
  name: string;
  login: string;
}

interface IAuthContext {
  user: IUser | null;
  isSigningIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

interface IAuthResponse {
  token: string;
  user: IUser;
}

const CLIENT_ID = 'eb3be78e7fcb27e5e61d';
const SCOPE = 'read:user';
const USER_STORAGE = '@nlwheat:user';
const TOKEN_STORAGE = '@nlwheat:token';

export const AuthContext = createContext({} as IAuthContext);

const AuthProvider: React.FC = ({ children }) => {
  const [isSigningIn, setIsSigningIn] = useState(true);
  const [user, setUser] = useState<IUser | null>(null);

  const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`;

  async function signOut() {
    await AsyncStorage.removeItem(USER_STORAGE);
    await AsyncStorage.removeItem(TOKEN_STORAGE);

    delete api.defaults.headers.common.authorization;
    setUser(null);
  }

  async function signIn() {
    setIsSigningIn(true);

    try {
      const res = await AuthSessions.startAsync({ authUrl });

      if (
        res.type === 'success' &&
        res.params.error !== 'access_denied' &&
        res.params.code
      ) {
        const { code } = res.params;
        const { data: authData } = await api.post<IAuthResponse>(
          '/authenticate',
          {
            code,
          },
        );

        const { user: authUser, token } = authData;
        api.defaults.headers.common.authorization = `Bearer ${token}`;
        await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(authUser));
        await AsyncStorage.setItem(TOKEN_STORAGE, token);

        setUser(authUser);
      } else await signOut();
    } catch (err) {
      await signOut();
    }

    setIsSigningIn(false);
  }

  useEffect(() => {
    async function loadUserStorageData() {
      const userStorage = await AsyncStorage.getItem(USER_STORAGE);
      const tokenStorage = await AsyncStorage.getItem(TOKEN_STORAGE);

      if (userStorage && tokenStorage) {
        api.defaults.headers.common.authorization = `Bearer ${tokenStorage}`;
        setUser(JSON.parse(userStorage));
      } else await signOut();

      setIsSigningIn(false);
    }

    loadUserStorageData();
  }, []);

  return (
    <AuthContext.Provider value={{ signIn, signOut, user, isSigningIn }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
