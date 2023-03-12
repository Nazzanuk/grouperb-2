import fromPairs from 'lodash/fromPairs';
import map from 'lodash/map';

import random from 'lodash/random';
import sample from 'lodash/sample';
import times from 'lodash/times';

import { BlocksRound } from 'Entities/BlocksRound.entity';
import { FlowGame } from 'Entities/FlowGame.entity';
import { Boop, FlowRound } from 'Entities/FlowRound.entity';
import { StartFlowRoundPayload, UpdateFlowPointsPayload } from 'Entities/Payloads.entity';
import { ServerGames } from 'Server/ServerGames';

export const updateFlowPoints = (payload: UpdateFlowPointsPayload): FlowGame => {
  console.log('updateFlowPoints', payload);
  const game = ServerGames[payload.gameId] as FlowGame;
  const userIds = Object.keys(game.users);
  const currentRoundIndex = game.rounds.length;
  const currentRound: FlowRound = game.rounds[currentRoundIndex - 1];

  currentRound.scores[payload.userId] = payload.points;
  currentRound.totalScore = Object.values(currentRound.scores).reduce((a, b) => a + b, 0);

  return game;
};
