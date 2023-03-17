import { FlowGame } from 'Entities/FlowGame.entity';
import { RestartFlowGamePayload, StartFlowRoundPayload } from 'Entities/Payloads.entity';
import { ServerGames } from 'Server/ServerGames';

export const restartFlowGame = (payload: RestartFlowGamePayload): FlowGame => {
  console.log('createFlowRound', payload);
  const game = ServerGames[payload.gameId] as FlowGame;

  game.status = 'lobby';
  game.rounds = [];
  return game;
};