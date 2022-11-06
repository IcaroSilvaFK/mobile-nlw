import { NavigationContainer } from '@react-navigation/native';
import { Box } from 'native-base';

import { SignIn } from '../screens/SignIn';
import { userUser } from '../store/user/store';
import { Routes } from './routes';

export function Router() {
  const { user } = userUser((state) => state);

  return (
    <Box flex={1} bg='gray.900'>
      <NavigationContainer>
        {!user ? <SignIn /> : <Routes />}
      </NavigationContainer>
    </Box>
  );
}
