import { useState, useCallback } from 'react';
import { Box, FlatList, Text, useToast } from 'native-base';
import { useFocusEffect } from '@react-navigation/native';
import { Share } from 'react-native';

import { reactotronLog } from '../../utils/reactoton-log';
import { reactotronError } from '../../utils/reactotron-error';
import { api } from '../../configs/global/axios';
import { useLoading } from '../../hooks';
import { Game } from '../Game';
import { EmptyMyPoolList } from '../EmptyMyPoolList';
import { Loading } from '../Loading';

interface Props {
  poolId: string;
  code: string;
}

interface IApiResponseProps {
  id: string;
  data: string;
  firstTeamCountryCode: string;
  secondTeamCountryCode: string;
  guesses: {}[];
  guess: any;
  date: string;
}

export function Guesses({ poolId, code }: Props) {
  const [poll, setPoll] = useState<IApiResponseProps[]>([]);
  const [isLoading, carring, outCarring] = useLoading();
  const [isLoadingHandleSubmit, carringHandleSubmit, outCarringHandleSubmit] =
    useLoading();
  const toast = useToast();
  const [firstTeamPoints, setFirstTeamPoints] = useState('');
  const [secondTeamPoints, setSecondTeamPoints] = useState('');

  useFocusEffect(
    useCallback(() => {
      getPollPerId();
    }, [])
  );

  async function getPollPerId() {
    try {
      carring();
      const { data } = await api.get<{ games: IApiResponseProps[] }>(
        `/polls/${poolId}/games`
      );
      setPoll(data.games);
      reactotronLog('poll', data.games);

      outCarring();
    } catch (err) {
      outCarring();
      reactotronLog('getPollPerId', err);
      toast.show({
        title: 'Não foi possivel carregar os jogos',
        placement: 'top',
        bg: 'red.500',
      });
    }
  }

  async function handleSubmit(gameId: string) {
    if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
      toast.show({
        title: 'Informe o placar do palpite',
        placement: 'top',
        bg: 'red.500',
      });
    }
    try {
      carringHandleSubmit();
      await api.post(`/polls/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: +firstTeamPoints,
        secondTeamPoints: +secondTeamPoints,
      });
      outCarringHandleSubmit();
      toast.show({
        title: 'Palpite realizado com sucesso!',
        placement: 'top',
        bg: 'green.500',
      });
      await getPollPerId();
    } catch (err) {
      outCarringHandleSubmit();
      reactotronError('handleSubmi', err);
    }
  }

  async function handleShareCode() {
    await Share.share({
      message: code,
    });
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box>
      <FlatList
        data={poll}
        renderItem={({ item }) => (
          <Game
            data={{
              firstTeamCountryCode: item.firstTeamCountryCode,
              secondTeamCountryCode: item.secondTeamCountryCode,
              guess: item.guess,
              id: item.id,
              date: item.date,
            }}
            setFirstTeamPoints={(value) => setFirstTeamPoints(value)}
            setSecondTeamPoints={(value) => setSecondTeamPoints(value)}
            onGuessConfirm={() => handleSubmit(item.id)}
            isLoadingButton={isLoadingHandleSubmit}
          />
        )}
        keyExtractor={({ id }) => id}
        _contentContainerStyle={{
          pb: 12,
        }}
        ListEmptyComponent={() => (
          <EmptyMyPoolList code={code} share={handleShareCode} />
        )}
      />
    </Box>
  );
}
