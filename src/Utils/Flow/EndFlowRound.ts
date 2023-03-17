import { FlowGame } from 'Entities/FlowGame.entity';
import { EndFlowRoundPayload } from 'Entities/Payloads.entity';
import { ServerGames } from 'Server/ServerGames';

export const endFlowRound = (payload: EndFlowRoundPayload): FlowGame => {
  console.log('endFlowRound', payload);
  const game = ServerGames[payload.gameId] as FlowGame;

  game.status = 'results';

  return game;
};
