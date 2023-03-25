import { useEffect, useState } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';

import { useRouter } from 'next/router';

import { emojiTaleGameAtom } from 'Atoms/EmojiTaleGame.atom';
import { emojiTaleGameHelpersAtom } from 'Atoms/EmojiTaleGameHelpers.atom';
import { totalPointsAtom } from 'Atoms/TotalPoints.atom';
import { userAtom } from 'Atoms/User.atom';
import { wsAtom } from 'Atoms/Ws.atom';
import { useLoadGame } from 'Hooks/useLoadGame';
import { useUpdateGame } from 'Hooks/useUpdateGame';
import { Gem, GemCard } from 'Entities/EmojiTaleRound.entity';
import { UserId } from 'Entities/UserId.entity';

let i: string | number | NodeJS.Timeout | undefined;

export const useEmojiTaleActions = () => {
  const { query } = useRouter();
  // const setTotal = useSetAtom(totalPointsAtom);
  // const { currentRound, currentRoundIndex, isHost, isObserver, status } = useAtomValue(emojiTaleGameHelpersAtom);

  useLoadGame(query.emojiTaleGameId as string | undefined);
  useUpdateGame(query.emojiTaleGameId as string | undefined);

  const game = useAtomValue(emojiTaleGameAtom);
  const user = useAtomValue(userAtom);

  const send = useSetAtom(wsAtom);

  const baseActionProps = {
    gameId: game?.id!,
    userId: user?.id!,
  };

  const leaveGame = () => send({ action: 'leaveGame', ...baseActionProps });
  const restartGame = () => send({ action: 'restartEmojiTaleGame', ...baseActionProps });
  const startRound = () => send({ action: 'createEmojiTaleRound', ...baseActionProps });
  const updateAnswer = (answer: string[]) => send({ action: 'updateEmojiTaleAnswer', ...baseActionProps, answer });
  const vote = (voteId: UserId) => send({ action: 'voteEmojiTaleAnswer', ...baseActionProps, voteId });
  const timeUp = () => send({ action: 'endEmojiTaleGuessing', ...baseActionProps });

  return {
    leaveGame,
    startRound,
    updateAnswer,
    vote,
    timeUp,
  };
};
