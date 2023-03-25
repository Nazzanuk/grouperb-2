import fromPairs from 'lodash/fromPairs';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';

import toArray from 'lodash/toArray';

import { EmojiTaleGame } from 'Entities/EmojiTaleGame.entity';
import { EmojiTaleRound } from 'Entities/EmojiTaleRound.entity';
import { EndEmojiTaleGuessingPayload } from 'Entities/Payloads.entity';
import { User } from 'Entities/User.entity';
import { UserId } from 'Entities/UserId.entity';
import { ServerGames } from 'Server/ServerGames';
import { compareEmojis } from 'Utils/EmojiTale/CompareEmojis';

export const endEmojiTaleGuessing = (payload: EndEmojiTaleGuessingPayload): EmojiTaleGame => {
  console.log('endEmojiTaleGuessing', payload);
  const game = ServerGames[payload.gameId] as EmojiTaleGame;
  const userIds = Object.keys(game.users) as UserId[];
  const currentRoundIndex = game.rounds.length;
  const currentRound = game.rounds[currentRoundIndex - 1];

  currentRound.userPoints = mapValues(game.users, (user: User, userId: UserId) => {
    const basePoints = compareEmojis(toArray(currentRound.tale.solution), currentRound.userSolutions[userId]);
    const votePoints = Object.values(currentRound.userVotes).reduce((acc, voteId) => {
      if (voteId === userId) return acc + 10;
      return acc;
    }, 0);

    return basePoints + votePoints;
  });

  currentRound.winnerId = Object.keys(currentRound.userPoints).reduce((acc, userId) => {
    if ((currentRound.userPoints[userId as UserId] ?? 0) >= (currentRound.userPoints[acc as UserId] ?? 0))
      return userId;
    return acc;
  }, userIds[0]) as UserId;

  game.status = 'voting';
  game.status = 'results'; //temp

  if (userIds.length < 3) game.status = 'results';

  return game;
};
