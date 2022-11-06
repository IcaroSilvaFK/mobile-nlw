import { createContext, useState, ReactNode, useEffect } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { api } from '../configs/global/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { reactotronError } from '../utils/reactotron-error';
import { useLoading } from '../hooks/useLoading';
import { userUser } from '../store/user/store';

WebBrowser.maybeCompleteAuthSession();

interface IUserProps {
  name: string;
  avatarUrl: string;
}

interface IAuthContextProps {
  signIn: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<IAuthContextProps>(
  {} as IAuthContextProps
);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [isLoading, carring, outCarring] = useLoading();
  const { setUser } = userUser((state) => state);
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      '94323794903-s9ljp637jeofl3vfidkshrjq10hnpkac.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email'],
  });

  async function signIn() {
    try {
      carring();
      await promptAsync();
      outCarring();
    } catch (err) {
      reactotronError('SignIn', err);
      outCarring();

      throw err;
    }
  }

  async function signInWithGoogle(accessToken: string) {
    try {
      carring();
      const { data } = await api.post<{ token: string }>('/users', {
        access_token: accessToken,
      });

      await AsyncStorage.setItem('@token:nlw', data.token);

      const { data: user } = await api.get<IUserProps>('/me');

      await AsyncStorage.setItem('@user:nlw', JSON.stringify(user));

      setUser({
        avatarUrl: user.avatarUrl,
        name: user.name,
      });
      outCarring();
    } catch (err) {
      reactotronError('signInWithGoogle', err);
      outCarring();
      throw err;
    }
  }

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken);
    }
  }, [response]);

  return (
    <AuthContext.Provider value={{ signIn, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
