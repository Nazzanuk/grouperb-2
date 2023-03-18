import { useEffect, useState } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';

import { useRouter } from 'next/router';

import { gemRushGameAtom } from 'Atoms/GemRushGame.atom';
import { gemRushGameHelpersAtom } from 'Atoms/GemRushGameHelpers.atom';
import { totalPointsAtom } from 'Atoms/TotalPoints.atom';
import { userAtom } from 'Atoms/User.atom';
import { wsAtom } from 'Atoms/Ws.atom';
import { useLoadGame } from 'Hooks/useLoadGame';
import { useUpdateGame } from 'Hooks/useUpdateGame';
import { Gem, GemCard } from 'Entities/GemRushRound.entity';

let i: string | number | NodeJS.Timeout | undefined;

export const useGemRushActions = () => {
  const { query } = useRouter();
  const setTotal = useSetAtom(totalPointsAtom);
  const { currentRound, currentRoundIndex, isHost, isObserver, status } = useAtomValue(gemRushGameHelpersAtom);

  useLoadGame(query.gemRushGameId as string | undefined);
  useUpdateGame(query.gemRushGameId as string | undefined);

  const game = useAtomValue(gemRushGameAtom);
  const user = useAtomValue(userAtom);

  const send = useSetAtom(wsAtom);

  const baseActionProps = {
    gameId: game?.id!,
    userId: user?.id!,
  };

  const leaveGame = () => send({ action: 'leaveGame', ...baseActionProps });
  const restartGame = () => send({ action: 'restartGemRushGame', ...baseActionProps });
  const startRound = () => send({ action: 'createGemRushRound', ...baseActionProps });
  const selectCard = (card: GemCard) => send({ action: 'selectGemRushCard', card, ...baseActionProps });
  const selectGem = (gem: Gem) => send({ action: 'selectGemRushGem', gem, ...baseActionProps });

  return {
    leaveGame,
    startRound,
    selectCard,
    selectGem,
  };
};
