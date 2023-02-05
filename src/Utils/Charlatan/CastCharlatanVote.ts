import each from 'lodash/each';
import every from 'lodash/every';

import { CharlatanGame } from 'Entities/CharlatanGame.entity';
import { CharlatanRound } from 'Entities/CharlatanRound.entity';
import { CastCharlatanVotePayload } from 'Entities/Payloads.entity';
import { UserId } from 'Entities/UserId.entity';

import { ServerGames } from 'Server/ServerGames';

export const castCharlatanVote = (payload: CastCharlatanVotePayload): CharlatanGame => {
  const game = ServerGames[payload.gameId] as CharlatanGame;
  const currentRound: CharlatanRound = game.rounds[game.rounds.length - 1];
  currentRound.votes[payload.userId] = payload.vote;

  const hasEveryoneVoted = every(currentRound.votes, (votedFor, voteBy) => !!game.users[voteBy as UserId]);

  return game;
};
