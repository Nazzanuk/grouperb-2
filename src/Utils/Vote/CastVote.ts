import { CastVotePayload } from 'Entities/Payloads.entity';
import { User } from 'Entities/User.entity';
import { UserId } from 'Entities/UserId.entity';
import { VoteGame } from 'Entities/VoteGame.entity';
import { round } from 'lodash';
import { ServerGames } from 'Server/ServerGames';

export const castVote = (payload: CastVotePayload): VoteGame => {
  const game = ServerGames[payload.gameId] as VoteGame;
  const currentRound = game.rounds[game.rounds.length - 1];
  currentRound.votes[payload.userId] = payload.vote;

  // Check if round has ended (i.e. we have enough votes)
  const numVotes = Object.keys(currentRound.votes).length;
  if (numVotes === Object.keys(game.users).length) {
    // Update game status to indicate round has ended
    game.status = 'results';

    // get players with most votes, game.winners is an object like this... winners: { [key: UserId]: User };
    const winners = Object.values(currentRound.votes).reduce((acc, vote) => {
      acc[vote] = (acc[vote] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // get the max number of votes
    const maxVotes = Math.max(...Object.values(winners));

    // get the players with the most votes
    const winnerIds = Object.keys(winners).filter((key) => winners[key] === maxVotes) as UserId[];

    // get the players with the most votes
    const winnerUsers = winnerIds.map((id) => game.users[id]);

    // add the winners to the current round
    winnerUsers.forEach((user) => {
      currentRound.winners[user.id] = user;
    });
  }

  return game;
};
