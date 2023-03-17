import fromPairs from 'lodash/fromPairs';
import map from 'lodash/map';

import random from 'lodash/random';
import sample from 'lodash/sample';
import sampleSize from 'lodash/sampleSize';

import set from 'lodash/set';

import { BlocksGame } from 'Entities/BlocksGame.entity';
import { Block, BlocksRound } from 'Entities/BlocksRound.entity';
import { AddBlocksScorePayload } from 'Entities/Payloads.entity';
import { UserId } from 'Entities/UserId.entity';

import { ServerGames } from 'Server/ServerGames';

const colors = ['Crimson', 'LimeGreen', 'DodgerBlue', 'gold'];

export const addBlocksScore = (payload: AddBlocksScorePayload): BlocksGame => {
  console.log('addBlocksScore', payload);
  const game = ServerGames[payload.gameId] as BlocksGame;
  
  const currentRound = game.rounds[game.rounds.length - 1] as BlocksRound;

  currentRound.score += payload.score;
  return game;
};