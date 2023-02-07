import { useEffect, useState } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';

import { charlatanGameAtom } from 'Atoms/CharlatanGame.atom';
import { charlatanGameHelpersAtom } from 'Atoms/CharlatanGameHelpers.atom';
import { userAtom } from 'Atoms/User.atom';
import { wsAtom } from 'Atoms/Ws.atom';

export const useThinkingTime = () => {
  const game = useAtomValue(charlatanGameAtom);
  const send = useSetAtom(wsAtom);
  const user = useAtomValue(userAtom);
  const { status, currentRound } = useAtomValue(charlatanGameHelpersAtom);

  const [timer, setTimer] = useState(30);

  const startAnswering = () => send({ action: 'startCharlatanAnswering', gameId: game!.id, userId: user.id });

  useEffect(() => {
    if (game?.status !== 'thinking') return;

    const interval = setInterval(() => {
      const startTime: string = currentRound.timeStarted;
      const duration = 10;
      const timeRemaining = duration - (Date.now() - new Date(startTime).getTime()) / 1000;

      setTimer(Math.round(timeRemaining));

      if (timeRemaining <= -1) {
        clearInterval(interval);
        setTimer(0);
        startAnswering();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [game?.status]);

  return {
    thinkingTimer: timer,
  };
};
