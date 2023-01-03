import each from 'lodash/each';
import max from 'lodash/max';

import { CastVotePayload } from 'Entities/Payloads.entity';
import { User } from 'Entities/User.entity';
import { UserId } from 'Entities/UserId.entity';
import { VoteGame } from 'Entities/VoteGame.entity';

import { ServerGames } from 'Server/ServerGames';

export const castVote = (payload: CastVotePayload): VoteGame => {
  const game = ServerGames[payload.gameId] as VoteGame;
  const currentRound = game.rounds[game.rounds.length - 1];
  currentRound.votes[payload.userId] = payload.vote;

  const votes = Object.values(currentRound.votes);
  const numVotes = votes.length;

  if (numVotes === Object.keys(game.users).length) {
    game.status = 'results';

    const votesByUser: { [key: UserId]: number | undefined } = {};
    votes.forEach((userId) => {
      votesByUser[userId] = votesByUser[userId] ? votesByUser[userId]! + 1 : 1;
    });

    console.log({votesByUser})
    console.log({votes})
    const maxVotes = max(Object.values(votesByUser));

    console.log({maxVotes})
    each(votesByUser, (numVotes, userId) => {
      console.log('currentRound.winners', currentRound.winners)
      if (numVotes === maxVotes) {
        currentRound.winners[userId as UserId] = game.users[userId as UserId];
      }
    });
    console.log('AFTER currentRound.winners', currentRound.winners)
  }

  return game;
};
