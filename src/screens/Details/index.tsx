import { useEffect, useState } from 'react';
import { HStack, VStack } from 'native-base';
import { useRoute } from '@react-navigation/native';
import { Share } from 'react-native';

import {
  Header,
  Loading,
  PoolHeader,
  EmptyMyPoolList,
  Option,
  Guesses,
} from '../../components';
import { userUser } from '../../store/user/store';
import { reactotronError } from '../../utils/reactotron-error';
import { api } from '../../configs/global/axios';
import { useLoading } from '../../hooks';
import { reactotronLog } from '../../utils/reactoton-log';

type RouteParams = {
  id: string;
};

interface IPollDetails {
  id: string;
  title: string;
  code: string;
  createdAt: string;
  ownerId: string;
  owner: {
    id: string;
    email: string;
    username: string;
    avatarUrl: string;
    createdAt: string;
  };
  participants: { id: string; user: { avatarUrl: string; username: string } }[];
  _count: {
    participants: number;
  };
}

export function Details() {
  const { user } = userUser((state) => state);
  const { params } = useRoute();
  const { id } = params as RouteParams;
  const [isLoading, carring, outCarring] = useLoading();
  const [pollDetails, setPollDetails] = useState<IPollDetails | null>(null);
  const [optionSelect, setOptionSelected] = useState<'guesses' | 'ranking'>(
    'guesses'
  );

  useEffect(() => {
    getDetailsPoll();
  }, [id]);

  async function getDetailsPoll() {
    try {
      carring();
      const { data } = await api.get<{ poll: IPollDetails }>(`/polls/${id}`);

      reactotronLog('getDetailsPoll', data);
      setPollDetails(data.poll);
      outCarring();
    } catch (err) {
      reactotronError('getDetailsPoll', err);
    }
  }

  async function handleShareCode() {
    await Share.share({
      message: pollDetails.code,
      title: 'Código do bolão',
    });
  }

  if (isLoading) {
    return <Loading />;
  }

  if (!pollDetails) {
    return <VStack flex={1} bg='gray.900' />;
  }
  return (
    <VStack flex={1} bg='gray.900'>
      <Header
        title={pollDetails?.title.toUpperCase()}
        showBackButton
        showShareButton
        share={handleShareCode}
      />

      {pollDetails._count.participants ? (
        <VStack flex={1}>
          <PoolHeader
            data={{
              _count: {
                participants: pollDetails._count.participants,
              },
              code: pollDetails.code,
              createdAt: pollDetails.createdAt,
              id: pollDetails.id,
              owner: {
                name: pollDetails.owner.username,
              },
              ownerId: pollDetails.ownerId,
              participants: pollDetails.participants,
              title: pollDetails.title.toUpperCase(),
            }}
          />
          <HStack bg='gray.800' p={1} rounded='sm' mb={5}>
            <Option
              title='Seus palpites'
              isSelected={optionSelect === 'guesses'}
              onPress={() => setOptionSelected('guesses')}
            />
            <Option
              title='Ranking do grupo'
              isSelected={optionSelect === 'ranking'}
              onPress={() => setOptionSelected('ranking')}
            />
          </HStack>
          <Guesses poolId={pollDetails.id} code={pollDetails.code} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={pollDetails.code} share={handleShareCode} />
      )}
    </VStack>
  );
}
