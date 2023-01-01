import { Game } from 'Entities/Game.entity';
import { LeaveGamePayload } from 'Entities/Payloads.entity';
import { ServerGames } from 'Server/ServerGames';

export const leaveGame = (payload: LeaveGamePayload): Game => {
  const game = ServerGames[payload.gameId];
  delete game.users[payload.userId];
  
  return game;
};
