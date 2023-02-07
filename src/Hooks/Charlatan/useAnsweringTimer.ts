import { useEffect, useState } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';

import { charlatanGameAtom } from 'Atoms/CharlatanGame.atom';
import { charlatanGameHelpersAtom } from 'Atoms/CharlatanGameHelpers.atom';
import { userAtom } from 'Atoms/User.atom';
import { wsAtom } from 'Atoms/Ws.atom';

export const useAnsweringTime = () => {
  const game = useAtomValue(charlatanGameAtom);
  const send = useSetAtom(wsAtom);
  const user = useAtomValue(userAtom);
  const { status, currentRound, userArray } = useAtomValue(charlatanGameHelpersAtom);

  const [timer, setTimer] = useState(30);

  const answeringTimer = timer % 5;
  const answeringUser = userArray[Math.floor(timer / 5)];

  const startDiscussion = () => send({ action: 'startCharlatanDiscussion', gameId: game!.id, userId: user.id });

  useEffect(() => {
    if (game?.status !== 'answering') return;

    const interval = setInterval(() => {
      const startTime: string = currentRound.startedAnswering;
      const duration = 5 * userArray.length;
      const timeRemaining = duration - (Date.now() - new Date(startTime).getTime()) / 1000;

      setTimer(Math.round(timeRemaining));

      if (timeRemaining <= -1) {
        clearInterval(interval);
        setTimer(0);
        startDiscussion();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [game?.status]);

  console.log({
    userArray,
    answeringTimer,
    answeringUser,
  });

  return {
    answeringTotalTimer: timer,
    answeringTimer,
    answeringUser,
  };
};
