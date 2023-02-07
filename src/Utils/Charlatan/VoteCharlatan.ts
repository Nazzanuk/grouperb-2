import fromPairs from 'lodash/fromPairs';
import map from 'lodash/map';

import sample from 'lodash/sample';
import sampleSize from 'lodash/sampleSize';

import { CHARLATAN_TOPICS } from 'Constants/CharlatanTopics';
import { CharlatanGame } from 'Entities/CharlatanGame.entity';
import { CharlatanRound } from 'Entities/CharlatanRound.entity';
import { CastCharlatanVotePayload, CreateCharlatanRoundPayload, VoteCharlatanPayload } from 'Entities/Payloads.entity';
import { UserId } from 'Entities/UserId.entity';

import { ServerGames } from 'Server/ServerGames';

export const voteCharlatan = (payload: VoteCharlatanPayload): CharlatanGame => {
  const game = ServerGames[payload.gameId] as CharlatanGame;
  const userIds = Object.keys(game.users);
  const currentRound = game.rounds[game.rounds.length - 1] as CharlatanRound;

  currentRound.votes[payload.userId] = payload.vote;

  if (Object.keys(currentRound.votes).length === userIds.length) game.status = 'results';

  return game;
};
