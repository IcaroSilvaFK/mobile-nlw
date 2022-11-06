import { Heading, Text, useToast, VStack } from 'native-base';
import { useState } from 'react';

import { Header, Input, Button } from '../../components';
import { reactotronError } from '../../utils/reactotron-error';
import { useLoading } from '../../hooks/useLoading';
import { api } from '../../configs/global/axios';

export function Find() {
  const [code, setCode] = useState('');
  const [isLoading, carring, outCarring] = useLoading();
  const toast = useToast();

  async function handleSubmit() {
    if (!code.trim()) {
      toast.show({
        title: 'Por favor coloque um código',
        bg: 'red.500',
        placement: 'top',
      });
    }

    try {
      carring();
      await api.post('/polls/join', {
        code,
      });

      outCarring();
      toast.show({
        title: 'Sucesso agora você faz parte do bolão!',
        bg: 'green.500',
        placement: 'top',
      });
      setCode('');
    } catch (err) {
      outCarring();
      console.log(err);
      reactotronError('find handleSubmit', err);

      if (err.response?.data?.message === 'Poll do not exists') {
        return toast.show({
          title: 'Não foi possível encontrar o bolão',
          bg: 'red.500',
          placement: 'top',
        });
      }

      if (err.response?.data?.message === 'You alredy joined this poll.') {
        return toast.show({
          title: 'Você já participa deste bolão!',
          bg: 'red.500',
          placement: 'top',
        });
      }

      toast.show({
        title: 'Não foi possivel entrar no bolão',
        bg: 'red.500',
        placement: 'top',
      });
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

        <Button mt={4} isLoading={isLoading} onPress={handleSubmit}>
          <Text textTransform='uppercase'>buscar bolão</Text>
        </Button>
      </VStack>
    </VStack>
  );
}
