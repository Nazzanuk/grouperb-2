import { Game } from 'Entities/Game.entity';
import { JoinGamePayload } from 'Entities/Payloads.entity';
import { ServerGames } from 'Server/ServerGames';

export const joinGame = (joinGamePayload: JoinGamePayload): Game => {
  const game = ServerGames[joinGamePayload.gameId];
  const user = joinGamePayload.user;
  game.users[user.id] = user;

  return game;
};