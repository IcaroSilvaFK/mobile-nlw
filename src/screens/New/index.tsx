import { Heading, Text, VStack, useToast } from 'native-base';
import { useState } from 'react';

import { Header, Input, Button } from '../../components';
import Logo from '../../assets/logo.svg';
import { api } from '../../configs/global/axios';
import { useLoading } from '../../hooks/useLoading';

export function New() {
  const [poll, setPoll] = useState<string>('');
  const [isLoading, carring, outCarring] = useLoading();
  const toast = useToast();

  async function handleSubmit() {
    if (!poll.trim()) {
      return toast.show({
        title: 'Informe um nome para seu bolão',
        placement: 'top',
        bg: 'red.500',
      });
    }

    try {
      carring();

      const { data } = await api.post<{ code: string }>('/polls', {
        title: poll,
      });

      toast.show({
        title: 'Bolão criado com sucesso',
        placement: 'top',
        bg: 'green.500',
      });
      setPoll('');
      outCarring();
    } catch (err) {
      console.log(err);
      toast.show({
        title: 'Infelizmente tivemos um problema para criar seu bolão',
        placement: 'top',
        bg: 'red.500',
      });
      outCarring();
    }
  }

  return (
    <VStack flex={1} bg='gray.900'>
      <Header title='Criar novo bolão' />
      <VStack mt={8} mx={5} alignItems='center'>
        <Logo />
        <Heading
          fontFamily='heading'
          color='white'
          fontSize='xl'
          my={8}
          textAlign='center'
        >
          Crie seu próprio bolão da copa {'\n'} e compartilhe entre seus amigos!
        </Heading>

        <Input
          mb={2}
          placeholder='Qual nome do seu bolão?'
          onChangeText={setPoll}
          value={poll}
        />

        <Button mt={4} onPress={handleSubmit} isLoading={isLoading}>
          <Text textTransform='uppercase'>Criar meu bolão</Text>
        </Button>

        <Text color='gray.200' fontSize='sm' textAlign='center' px={10} mt={4}>
          Apó criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas.
        </Text>
      </VStack>
    </VStack>
  );
}
