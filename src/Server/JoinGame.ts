import { HostGamePayload, JoinGamePayload } from 'Entities/Payloads.entity';
import { VoteGame } from 'Entities/VoteGame.entity';
import { ServerGames } from 'Server/ServerGames';
import { createVoteGame } from 'Utils/Vote/CreateVoteGame';

export const joinGame = (hostGamePayload: JoinGamePayload) => {
  const game = ServerGames[hostGamePayload.gameId] as VoteGame;
  if (!game) return;

  const user = hostGamePayload.user;
  game.users[user.id] = user;

  return game;
};
