import { useEffect, useState } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';

import { useRouter } from 'next/router';

import { userAtom } from 'Atoms/User.atom';
import { wsAtom } from 'Atoms/Ws.atom';
import { useLoadGame } from 'Hooks/useLoadGame';
import { useUpdateGame } from 'Hooks/useUpdateGame';

import { UserId } from 'Entities/UserId.entity';
import { codenamesGameAtom } from 'Atoms/CodenamesGame.atom';
import { Card } from 'Entities/CodenamesGame.class';
// import { Coordinate } from 'Entities/Codenames.class';

let i: string | number | NodeJS.Timeout | undefined;

export const useCodenamesActions = () => {
  const { query } = useRouter();
  // const setTotal = useSetAtom(totalPointsAtom);
  // const { currentRound, currentRoundIndex, isHost, isObserver, status } = useAtomValue(emojiTaleGameHelpersAtom);

  useLoadGame(query.codenamesGameId as string | undefined);
  useUpdateGame(query.codenamesGameId as string | undefined);

  const game = useAtomValue(codenamesGameAtom);
  const user = useAtomValue(userAtom);

  const send = useSetAtom(wsAtom);

  const baseActionProps = {
    gameId: game?.id!,
    gameType: 'codenames' as const,
    userId: user?.id!,
    params: [],
  };

  const leaveGame = () => send({ action: 'leaveGame', ...baseActionProps });
  // const restartGame = () => send({ action: 'restartEmojiTaleGame', ...baseActionProps });
  const startGame = () => send({ action: 'startGame', ...baseActionProps });
  const revealCard = (cardId: string) => send({ action: 'revealCard', ...baseActionProps, params: [user.id, cardId] });
  const resetGame = () => send({ action: 'resetGame', ...baseActionProps });
  const setMaxGuessesForTurn = (guesses:number) => send({ action: 'setMaxGuessesForTurn', ...baseActionProps, params: [user.id, guesses] });
  // const drawPileCard = () => send({ action: 'drawPileCard', ...baseActionProps, params: [user.id] });
  // const startRound = () => send({ action: 'createEmojiTaleRound', ...baseActionProps });
  // const updateAnswer = (answer: string[]) => send({ action: 'updateEmojiTaleAnswer', ...baseActionProps, answer });
  // const vote = (voteId: UserId) => send({ action: 'voteEmojiTaleAnswer', ...baseActionProps, voteId });
  // const timeUp = () => send({ action: 'endEmojiTaleGuessing', ...baseActionProps });

  return {
    leaveGame,
    startGame,
    revealCard,
    resetGame,
    setMaxGuessesForTurn,
    // drawPileCard,
    // updateAnswer,
    // vote,
    // timeUp,
  };
};
