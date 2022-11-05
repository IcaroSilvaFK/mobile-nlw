import { createContext, useState, ReactNode, useEffect } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { api } from '../configs/global/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

interface IUserProps {
  name: string;
  avatarUrl: string;
}

interface IAuthContextProps {
  user: IUserProps | null;
  signIn: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<IAuthContextProps>(
  {} as IAuthContextProps
);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUserProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      '94323794903-s9ljp637jeofl3vfidkshrjq10hnpkac.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email'],
  });

  async function signIn() {
    try {
      setIsLoading(true);
      await promptAsync();
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);

      throw err;
    }
  }

  async function signInWithGoogle(accessToken: string) {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      throw err;
    }
  }

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken);
    }
  }, [response]);

  useEffect(() => {
    (async () => {
      try {
        const userLocal = JSON.parse(
          await AsyncStorage.getItem('@user:nlw')
        ) as IUserProps;

        setUser({
          avatarUrl: userLocal.avatarUrl,
          name: userLocal.name,
        });
      } catch (err) {
        console.log(err);
      }
    })();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, signIn, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
