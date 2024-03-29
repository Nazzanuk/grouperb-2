import { atom } from 'jotai';
import mapValues from 'lodash/mapValues';
import max from 'lodash/max';
import sortBy from 'lodash/sortBy';
import times from 'lodash/times';
import toPairs from 'lodash/toPairs';
import values from 'lodash/values';

import { userAtom } from 'Atoms/User.atom';
import { UserId } from 'Entities/UserId.entity';

import { emojiTaleGameAtom } from './EmojiTaleGame.atom';

export const emojiTaleGameHelpersAtom = atom((get) => {
  const game = get(emojiTaleGameAtom);
  const user = get(userAtom);

  const status = game?.status;
  const currentRound = game?.rounds[game.rounds.length - 1];
  const currentRoundIndex = game?.rounds.length ?? 0;
  const userArray = values(game?.users);
  const isHost = user.id === game?.hostId;
  const isObserver = !game?.users[user.id];
  const usersWithoutMe = userArray.filter((u) => u.id !== user.id);
  const story = currentRound?.tale.story;
  const tale = currentRound?.tale;
  const myAnswer = currentRound?.userSolutions[user.id] ?? [];
  const userGameScores: Record<UserId, number> = {};
  game?.rounds.forEach((round) => {
    toPairs(round.userPoints).forEach(([userId, points]) => {
      userGameScores[userId as UserId] = (userGameScores[userId as UserId] ?? 0) + points;
    });
  });

  const usersSortedByScore = sortBy(userArray, (u) => userGameScores[u.id] ?? 0).reverse();

  return {
    currentRound,
    currentRoundIndex,
    status,
    userArray,
    isHost,
    usersWithoutMe,
    isObserver,
    story,
    tale,
    myAnswer,
    user,
    usersSortedByScore,
    userGameScores,
  };
});
