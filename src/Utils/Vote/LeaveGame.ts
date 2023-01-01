import { ServerGames } from 'Server/ServerGames';
import { LeaveGamePayload } from 'Entities/Payloads.entity';
import { Game } from 'Entities/Game.entity';

export const leaveGame = (payload: LeaveGamePayload): Game => {
  const game = ServerGames[payload.gameId];
  delete game.users[payload.userId];
  
  return game;
};
