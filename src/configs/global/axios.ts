import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const api = axios.create({
  baseURL: 'http://192.168.1.112:8000',
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@token:nlw');

  config.headers.Authorization = `Bearer ${token}`;

  return config;
});
