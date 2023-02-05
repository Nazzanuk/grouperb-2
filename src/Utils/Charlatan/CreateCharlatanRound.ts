import fromPairs from 'lodash/fromPairs';
import map from 'lodash/map';

import sample from 'lodash/sample';
import sampleSize from 'lodash/sampleSize';

import { CHARLATAN_TOPICS } from 'Constants/CharlatanTopics';
import { CharlatanGame } from 'Entities/CharlatanGame.entity';
import { CharlatanRound } from 'Entities/CharlatanRound.entity';
import { CastCharlatanVotePayload, CreateCharlatanRoundPayload } from 'Entities/Payloads.entity';
import { UserId } from 'Entities/UserId.entity';

import { ServerGames } from 'Server/ServerGames';

export const createCharlatanRound = (payload: CreateCharlatanRoundPayload): CharlatanGame => {
  const game = ServerGames[payload.gameId] as CharlatanGame;
  const userIds = Object.keys(game.users);

  const topicName = sample(Object.keys(CHARLATAN_TOPICS)) as keyof typeof CHARLATAN_TOPICS;
  const topicAnswers = sampleSize(CHARLATAN_TOPICS[topicName], 16);
  const playerAnswers = sampleSize(topicAnswers, Object.keys(game.users).length);

  console.log({
    playerAnswers,
    userIds,
    pairs: map(game.users, (userId, index) => [userId, playerAnswers[index as unknown as number]]),
    pairs2: map(userIds, (userId, index) => [userId, playerAnswers[index as unknown as number]]),
  });

  const newRound: CharlatanRound = {
    votes: {},
    answer: sample(topicAnswers),
    answers: topicAnswers,
    bluffer: sample(userIds) as UserId,
    playerAnswers: fromPairs(map(userIds, (userId, index) => [userId, playerAnswers[index as unknown as number]])),
    topic: topicName,
  };

  game.status = 'thinking';

  game.rounds.push(newRound);

  return game;
};
