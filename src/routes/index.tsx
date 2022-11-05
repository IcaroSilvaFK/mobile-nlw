import { NavigationContainer } from '@react-navigation/native';
import { Box } from 'native-base';

import { useAuth } from '../hooks/useAuth';

import { SignIn } from '../screens/SignIn';
import { Routes } from './routes';

export function Router() {
  const { user } = useAuth();

  return (
    <Box flex={1} bg='gray.900'>
      <NavigationContainer>
        {!user ? <SignIn /> : <Routes />}
      </NavigationContainer>
    </Box>
  );
}
