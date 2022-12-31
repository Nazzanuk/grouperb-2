import { VoteGame } from "Entities/VoteGame.entity";

export const getVoteGameStatus = (game?: VoteGame | null) => {
  if (!game) return "error";
  if (game.rounds.length === 0) return "lobby";
  if (game.rounds.length === 1) return "voting";
  if (game.rounds.length === 2) return "results";
  return "waiting";

}