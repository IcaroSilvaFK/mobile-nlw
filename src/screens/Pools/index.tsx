import { Icon, Text, VStack } from 'native-base';
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { Button } from '../../components/Button';
import { Header } from '../../components/Header';

export function Pools() {
  const navigation = useNavigation();

  return (
    <VStack flex={1} bg='gray.900'>
      <Header title='Meus bolões' />
      <VStack
        borderBottomColor='gray.600'
        borderBottomWidth={1}
        mt={6}
        mx={6}
        pb={5}
        mb={4}
      >
        <Button
          leftIcon={
            <Icon as={Octicons} name='search' color='black' size='md' />
          }
          onPress={() => navigation.navigate('find')}
        >
          <Text textTransform='uppercase'>Buscar bolão por código</Text>
        </Button>
      </VStack>
    </VStack>
  );
}
