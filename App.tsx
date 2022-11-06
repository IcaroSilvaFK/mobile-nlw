import { NativeBaseProvider, StatusBar } from 'native-base';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { reactotron } from './src/configs/global/reactotron';

import { Router } from './src/routes';

import { theme } from './src/styles/theme';
import { Loading } from './src/components/Loading';
import { AuthContextProvider } from './src/contexts/AuthContext';

if (__DEV__) {
  reactotron.connect();
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  return (
    <NativeBaseProvider theme={theme}>
      <AuthContextProvider>
        <StatusBar
          barStyle='light-content'
          backgroundColor='transparent'
          animated
          translucent
        />
        {fontsLoaded ? <Router /> : <Loading />}
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}
