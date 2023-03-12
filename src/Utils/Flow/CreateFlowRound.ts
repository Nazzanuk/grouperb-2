import fromPairs from 'lodash/fromPairs';
import map from 'lodash/map';

import random from 'lodash/random';
import sample from 'lodash/sample';
import times from 'lodash/times';

import { BlocksRound } from 'Entities/BlocksRound.entity';
import { FlowGame } from 'Entities/FlowGame.entity';
import { Boop, FlowRound } from 'Entities/FlowRound.entity';
import { StartFlowRoundPayload } from 'Entities/Payloads.entity';
import { ServerGames } from 'Server/ServerGames';

export const createFlowRound = (payload: StartFlowRoundPayload): FlowGame => {
  console.log('createFlowRound', payload);
  const game = ServerGames[payload.gameId] as FlowGame;
  const userIds = Object.keys(game.users);
  const currentRoundIndex = game.rounds.length;

  const newRound: FlowRound = {
    sequence: genSequence((currentRoundIndex + 1) * 10),
    lanes: currentRoundIndex + 1,
    scores: {},
    startTime: new Date().getTime(),
    totalScore: 0,
  };

  game.status = 'playing';
  game.rounds.push(newRound);
  return game;
};

const genSequence = (amount: number) =>
  times(amount, (i) => ({
    delay: i - (0.1 * i),
    index: i,
    speed: random(2, 3 + i),
    color: sample(['orange']),
  })) as Boop[];
