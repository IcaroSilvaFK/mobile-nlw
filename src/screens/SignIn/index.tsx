import { Icon, Text, View } from 'native-base';
import { Fontisto } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Logo from '../../assets/logo.svg';
import { Button } from '../../components';
import { useAuth } from '../../hooks';
import { useEffect } from 'react';

export function SignIn() {
  const { signIn, isLoading } = useAuth();

  useEffect(() => {
    AsyncStorage.clear();
  }, []);

  return (
    <View
      flex={1}
      bg='gray.900'
      alignItems='center'
      justifyContent='center'
      p={7}
    >
      <Logo width={212} height={40} />
      <Button
        type='SECONDARY'
        leftIcon={<Icon as={Fontisto} name='google' color='white' size='md' />}
        mt={4}
        onPress={signIn}
        isLoading={isLoading}
        _loading={{ _spinner: { color: 'white' } }}
      >
        <Text
          textTransform='uppercase'
          fontSize='sm'
          fontFamily='heading'
          color='white'
        >
          Entrar com o google
        </Text>
      </Button>
      <Text color='white' textAlign='center' mt={4}>
        Não utlizamos nenhuma informação além {'\n'} de seu e-mail para criação
        de sua conta.
      </Text>
    </View>
  );
}
