import fromPairs from 'lodash/fromPairs';
import map from 'lodash/map';

import random from 'lodash/random';
import sample from 'lodash/sample';
import sampleSize from 'lodash/sampleSize';

import set from 'lodash/set';

import { BlocksGame } from 'Entities/BlocksGame.entity';
import { Block, BlocksRound } from 'Entities/BlocksRound.entity';
import { CreateBlocksRoundPayload } from 'Entities/Payloads.entity';
import { UserId } from 'Entities/UserId.entity';

import { ServerGames } from 'Server/ServerGames';

const colors = ['Crimson', 'LimeGreen', 'DodgerBlue', 'gold'];

export const clearBlocks = (payload: CreateBlocksRoundPayload): BlocksGame => {
  console.log('clearBlocks', payload);
  const game = ServerGames[payload.gameId] as BlocksGame;
  const userIds = Object.keys(game.users);
  const currentRound = game.rounds[game.rounds.length - 1] as BlocksRound;

  currentRound.guess = [];

  set(currentRound.guess, `[${payload.x}][${payload.y}]`, {
    id: random(100000),
    x: payload.x,
    y: payload.y,
    color: colors[0],
  });

  return game;
};
