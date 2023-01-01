import { ServerGames } from 'Server/ServerGames';
import { CastVotePayload } from 'Entities/Payloads.entity';
import { VoteGame } from 'Entities/VoteGame.entity';

export const castVote = (payload: CastVotePayload): VoteGame => {
  const game = ServerGames[payload.gameId] as VoteGame;
  const currentRound = game.rounds[game.rounds.length - 1];
  currentRound.votes[payload.userId] = payload.vote;

   // Check if round has ended (i.e. we have enough votes)
   const numVotes = Object.keys(currentRound.votes).length;
   if (numVotes === Object.keys(game.users).length) {
     // Update game status to indicate round has ended
     game.status = 'results';
   }
  
  return game;
};