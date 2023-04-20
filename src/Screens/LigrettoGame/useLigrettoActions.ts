import { useEffect, useState } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';

import { useRouter } from 'next/router';

import { userAtom } from 'Atoms/User.atom';
import { wsAtom } from 'Atoms/Ws.atom';
import { useLoadGame } from 'Hooks/useLoadGame';
import { useUpdateGame } from 'Hooks/useUpdateGame';

import { UserId } from 'Entities/UserId.entity';
import { ligrettoGameAtom } from 'Atoms/LigrettoGame.atom';
import { Card } from 'Entities/LigrettoGame.class';
// import { Coordinate } from 'Entities/Ligretto.class';

let i: string | number | NodeJS.Timeout | undefined;

export const useLigrettoActions = () => {
  const { query } = useRouter();
  // const setTotal = useSetAtom(totalPointsAtom);
  // const { currentRound, currentRoundIndex, isHost, isObserver, status } = useAtomValue(emojiTaleGameHelpersAtom);

  useLoadGame(query.ligrettoGameId as string | undefined);
  useUpdateGame(query.ligrettoGameId as string | undefined);

  const game = useAtomValue(ligrettoGameAtom);
  const user = useAtomValue(userAtom);

  const send = useSetAtom(wsAtom);

  const baseActionProps = {
    gameId: game?.id!,
    gameType: 'ligretto' as const,
    userId: user?.id!,
    params: [],
  };

  const leaveGame = () => send({ action: 'leaveGame', ...baseActionProps });
  // const restartGame = () => send({ action: 'restartEmojiTaleGame', ...baseActionProps });
  const startGame = () => send({ action: 'startGame', ...baseActionProps });
  const playCard = (card: Card) => send({ action: 'playCard', ...baseActionProps, params: [user.id, card] });
  const resetGame = () => send({ action: 'resetGame', ...baseActionProps });
  const drawPileCard = () => send({ action: 'drawPileCard', ...baseActionProps, params: [user.id] });
  // const startRound = () => send({ action: 'createEmojiTaleRound', ...baseActionProps });
  // const updateAnswer = (answer: string[]) => send({ action: 'updateEmojiTaleAnswer', ...baseActionProps, answer });
  // const vote = (voteId: UserId) => send({ action: 'voteEmojiTaleAnswer', ...baseActionProps, voteId });
  // const timeUp = () => send({ action: 'endEmojiTaleGuessing', ...baseActionProps });

  return {
    leaveGame,
    startGame,
    playCard,
    resetGame,
    drawPileCard,
    // updateAnswer,
    // vote,
    // timeUp,
  };
};
