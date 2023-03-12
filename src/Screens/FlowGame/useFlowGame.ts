import { useAtomValue, useSetAtom } from 'jotai';

import { useRouter } from 'next/router';

import { flowGameAtom } from 'Atoms/FlowGame.atom';
import { wsAtom } from 'Atoms/Ws.atom';
import { useLoadGame } from 'Hooks/useLoadGame';
import { useUpdateGame } from 'Hooks/useUpdateGame';
import { userAtom } from 'Atoms/User.atom';
import { useEffect } from 'react';
import { totalPointsAtom } from 'Atoms/TotalPoints.atom';
import { flowGameHelpersAtom } from 'Atoms/FlowGameHelpers.atom';

export const useFlowGame = () => {
  const { query } = useRouter();
  const setTotal = useSetAtom(totalPointsAtom);
  const { currentRound, currentRoundIndex, isHost, isObserver, status, userArray } = useAtomValue(flowGameHelpersAtom);


  useLoadGame(query.flowGameId as string | undefined);
  useUpdateGame(query.flowGameId as string | undefined);

  const game = useAtomValue(flowGameAtom);
  const user = useAtomValue(userAtom);

  const send = useSetAtom(wsAtom);

  useEffect(() => {
    setTotal(0);
  }, [currentRoundIndex]);

  const leaveGame = () => send({ action: 'leaveGame', gameId: game!.id, userId: user.id });
  const startGame = () => send({ action: 'startFlowRound', gameId: game!.id, userId: user.id });
  const updatePoints = (points: number) =>
    send({ action: 'updateFlowPoints', gameId: game!.id, userId: user.id, points });

  return {
    leaveGame,
    startGame,
    updatePoints,
  };
};
