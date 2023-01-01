import { Game } from 'Entities/Game.entity';
import { LeaveGamePayload } from 'Entities/Payloads.entity';
import { UserId } from 'Entities/UserId.entity';
import { ServerGames } from 'Server/ServerGames';

export const leaveGame = (payload: LeaveGamePayload): Game => {
  const game = ServerGames[payload.gameId];
  delete game.users[payload.userId];

  if (game.hostId === payload.userId) {
    const userIds = Object.keys(game.users) as UserId[] ;
    game.hostId = userIds[0];
  }
  
  return game;
};
