import { useCallback, useState } from 'react';
import { Icon, Text, VStack, FlatList, useToast } from 'native-base';
import { Octicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import {
  Button,
  Header,
  PoolCard,
  Loading,
  EmptyPoolList,
} from '../../components';
import { api } from '../../configs/global/axios';
import { reactotronError } from '../../utils/reactotron-error';
import { useLoading } from '../../hooks';

interface IPollsProps {
  code: string;
  createdAt: string;
  id: string;
  owner: {
    id: string;
    username: string;
  };
  ownerId: string;
  participants: {
    id: string;
    user: {
      avatarUrl: string;
      username: string;
    };
  }[];

  _count: {
    participants: number;
  };
  title: string;
}

export function Pools() {
  const [polls, setPolls] = useState<IPollsProps[]>([]);
  const [isLoading, carring, outCarring] = useLoading();
  const navigation = useNavigation();
  const toast = useToast();

  useFocusEffect(
    useCallback(() => {
      fetchPolls();
    }, [])
  );

  async function fetchPolls() {
    try {
      carring();
      const { data } = await api.get<{ polls: IPollsProps[] }>('/polls');
      setPolls(data.polls);
      outCarring();
    } catch (err) {
      reactotronError('fetchPolls', err);
      outCarring();
      toast.show({
        title: 'Não foi possivel carregar os bolões',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

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
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={polls}
          renderItem={({ item }) => (
            <PoolCard
              data={{
                _count: {
                  participants: item._count.participants,
                },
                code: item.code,
                createdAt: item.createdAt,
                id: item.id,
                owner: {
                  name: item.owner.username,
                },
                ownerId: item.ownerId,
                participants: item.participants,
                title: item.title,
              }}
              key={item.id}
              onPress={() => navigation.navigate('details', { id: item.id })}
            />
          )}
          showsVerticalScrollIndicator={false}
          keyExtractor={({ id }) => id}
          px={5}
          _contentContainerStyle={{
            pb: 10,
          }}
          ListEmptyComponent={() => <EmptyPoolList />}
        />
      )}
    </VStack>
  );
}
