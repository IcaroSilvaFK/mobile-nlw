import { Heading, Text, VStack } from 'native-base';

import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useState } from 'react';
import { reactotron } from '../../configs/global/reactotron';

export function Find() {
  const [code, setCode] = useState('');

  async function handleSubmit() {
    try {
    } catch (err) {
      reactotron.error('find handleSubmit', err);
    }
  }

  return (
    <VStack flex={1} bg='gray.900'>
      <Header title='Buscar por código' showBackButton />
      <VStack mt={8} mx={5} alignItems='center'>
        <Heading
          fontFamily='heading'
          color='white'
          fontSize='xl'
          textAlign='center'
          mb={8}
        >
          Encontre um bolão através de {'\n'}
          seu código único
        </Heading>

        <Input
          mb={2}
          placeholder='Qual o código do bolão?'
          value={code}
          onChangeText={setCode}
        />

        <Button mt={4}>
          <Text textTransform='uppercase'>buscar bolão</Text>
        </Button>
      </VStack>
    </VStack>
  );
}
