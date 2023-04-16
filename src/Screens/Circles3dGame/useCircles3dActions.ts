import { useEffect, useState } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';

import { useRouter } from 'next/router';

import { userAtom } from 'Atoms/User.atom';
import { wsAtom } from 'Atoms/Ws.atom';
import { useLoadGame } from 'Hooks/useLoadGame';
import { useUpdateGame } from 'Hooks/useUpdateGame';

import { UserId } from 'Entities/UserId.entity';
import { circles3dGameAtom } from 'Atoms/Circles3dGame.atom';
import { Coordinate } from 'Entities/Circles3d.class';

let i: string | number | NodeJS.Timeout | undefined;

export const useCircles3dActions = () => {
  const { query } = useRouter();
  // const setTotal = useSetAtom(totalPointsAtom);
  // const { currentRound, currentRoundIndex, isHost, isObserver, status } = useAtomValue(emojiTaleGameHelpersAtom);

  useLoadGame(query.circles3dGameId as string | undefined);
  useUpdateGame(query.circles3dGameId as string | undefined);

  const game = useAtomValue(circles3dGameAtom);
  const user = useAtomValue(userAtom);

  const send = useSetAtom(wsAtom);

  const baseActionProps = {
    gameId: game?.id!,
    gameType: 'circles3d' as const,
    userId: user?.id!,
    params: [],
  };

  const leaveGame = () => send({ action: 'leaveGame', ...baseActionProps });
  // const restartGame = () => send({ action: 'restartEmojiTaleGame', ...baseActionProps });
  const startGame = () => send({ action: 'startGame', ...baseActionProps });
  const makeMove = ([x, y, z]: Coordinate) =>
    send({ action: 'makeMove', ...baseActionProps, params: [user.id, [x, y, z]] });
  const resetGame = () => send({ action: 'resetGame', ...baseActionProps });
  // const startRound = () => send({ action: 'createEmojiTaleRound', ...baseActionProps });
  // const updateAnswer = (answer: string[]) => send({ action: 'updateEmojiTaleAnswer', ...baseActionProps, answer });
  // const vote = (voteId: UserId) => send({ action: 'voteEmojiTaleAnswer', ...baseActionProps, voteId });
  // const timeUp = () => send({ action: 'endEmojiTaleGuessing', ...baseActionProps });

  return {
    leaveGame,
    startGame,
    makeMove,
    resetGame,
    // updateAnswer,
    // vote,
    // timeUp,
  };
};
