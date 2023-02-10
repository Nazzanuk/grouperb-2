import { useEffect, useState } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';

import { charlatanGameAtom } from 'Atoms/CharlatanGame.atom';
import { charlatanGameHelpersAtom } from 'Atoms/CharlatanGameHelpers.atom';
import { userAtom } from 'Atoms/User.atom';
import { wsAtom } from 'Atoms/Ws.atom';
import { blocksGameAtom } from 'Atoms/BlocksGame.atom';
import { blocksGameHelpersAtom } from 'Atoms/BlocksGameHelpers.atom';

export const useBlocksTimer = () => {
  const game = useAtomValue(blocksGameAtom);
  const send = useSetAtom(wsAtom);
  const user = useAtomValue(userAtom);
  const { status, currentRound, currentRoundIndex } = useAtomValue(blocksGameHelpersAtom);

  const [timer, setTimer] = useState(30);

  const blocksTimeOut = () => send({ action: 'blocksTimeOut', gameId: game!.id, userId: user.id });

  useEffect(() => {
    if (game?.status !== 'playing') return;

    const interval = setInterval(() => {
      const startTime: string = currentRound.startTime;
      const duration = 10 + 5 * currentRoundIndex;
      const timeRemaining = duration - (Date.now() - new Date(startTime).getTime()) / 1000;

      setTimer(Math.round(timeRemaining));

      if (timeRemaining <= -1) {
        clearInterval(interval);
        setTimer(0);
        blocksTimeOut();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [game?.status]);

  return {
    playingTime: timer,
  };
};
