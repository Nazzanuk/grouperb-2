import { useEffect, useState } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';

import { charlatanGameAtom } from 'Atoms/CharlatanGame.atom';
import { charlatanGameHelpersAtom } from 'Atoms/CharlatanGameHelpers.atom';
import { userAtom } from 'Atoms/User.atom';
import { showUserPopupAtom } from 'Atoms/UserPopup.atom';
import { wsAtom } from 'Atoms/Ws.atom';

export const useDiscussTime = () => {
  const game = useAtomValue(charlatanGameAtom);
  const send = useSetAtom(wsAtom);
  const user = useAtomValue(userAtom);
  const { status, currentRound } = useAtomValue(charlatanGameHelpersAtom);
  const showUserPopup = useSetAtom(showUserPopupAtom);

  const [timer, setTimer] = useState(30);

  const startVoting = () => send({ action: 'startCharlatanVoting', gameId: game!.id, userId: user.id });

  useEffect(() => {
    if (game?.status !== 'discuss') return;

    const interval = setInterval(() => {
      const startTime: string = currentRound.startedDiscussing;
      const duration = 60;
      const timeRemaining = duration - (Date.now() - new Date(startTime).getTime()) / 1000;

      setTimer(Math.round(timeRemaining));

      if (timeRemaining <= -1) {
        clearInterval(interval);
        setTimer(0);
        startVoting();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [game?.status]);

  useEffect(() => {
    if (game?.status !== 'voting') return;
    if (!!currentRound.votes[user.id]) return;

    showUserPopup({ title: `Who's the Charlatan?` });
  }, [game?.status]);

  return {
    discussTimer: timer,
  };
};
