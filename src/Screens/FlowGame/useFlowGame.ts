import { useEffect, useState } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';

import { useRouter } from 'next/router';

import { flowGameAtom } from 'Atoms/FlowGame.atom';
import { flowGameHelpersAtom } from 'Atoms/FlowGameHelpers.atom';
import { totalPointsAtom } from 'Atoms/TotalPoints.atom';
import { userAtom } from 'Atoms/User.atom';
import { wsAtom } from 'Atoms/Ws.atom';
import { useLoadGame } from 'Hooks/useLoadGame';
import { useUpdateGame } from 'Hooks/useUpdateGame';

let i: string | number | NodeJS.Timeout | undefined;

export const useFlowGame = () => {
  const { query } = useRouter();
  const setTotal = useSetAtom(totalPointsAtom);
  const { currentRound, currentRoundIndex, isHost, isObserver, status, startTime } = useAtomValue(flowGameHelpersAtom);

  useLoadGame(query.flowGameId as string | undefined);
  useUpdateGame(query.flowGameId as string | undefined);

  const game = useAtomValue(flowGameAtom);
  const user = useAtomValue(userAtom);

  const send = useSetAtom(wsAtom);

  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    setTotal(0);
  }, [currentRoundIndex]);

  useEffect(() => {
    if (status !== 'playing') return;
    i = setInterval(() => {
      setTimeRemaining(Math.round((startTime + 5000 + currentRoundIndex * 5000 - new Date().getTime()) / 1000));
    }, 1000);

    return () => clearInterval(i);
  }, [currentRoundIndex]);

  useEffect(() => {
    if (status !== 'playing') return;
    if (timeRemaining < 0) {
      clearInterval(i);
      setTimeRemaining(0);
      endRound();
    }
  }, [timeRemaining]);

  const leaveGame = () => send({ action: 'leaveGame', gameId: game!.id, userId: user.id });
  const startGame = () => send({ action: 'startFlowRound', gameId: game!.id, userId: user.id });
  const endRound = () => send({ action: 'endFlowRound', gameId: game!.id, userId: user.id });
  const updatePoints = (points: number) =>
    send({ action: 'updateFlowPoints', gameId: game!.id, userId: user.id, points });

  return {
    leaveGame,
    startGame,
    endRound,
    updatePoints,
    timeRemaining
  };
};
