import create from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IUserProps {
  name: string;
  avatarUrl: string;
}

interface IUseUserProps {
  user: IUserProps | null;
  setUser(user: IUserProps): void;
  removeUser(): void;
}

export const userUser = create<IUseUserProps>()((set) => ({
  user: null,
  setUser(user) {
    set((state) => ({ ...state, user }));
  },
  removeUser() {
    set((state) => ({ ...state, user: null }));
  },
}));
