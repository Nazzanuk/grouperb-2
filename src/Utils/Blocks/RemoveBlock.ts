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

export const removeBlock = (payload: CreateBlocksRoundPayload): BlocksGame => {
  console.log('addBlock', payload);
  const game = ServerGames[payload.gameId] as BlocksGame;
  const userIds = Object.keys(game.users);
  const currentRound = game.rounds[game.rounds.length - 1] as BlocksRound;

  let block = currentRound.guess?.[payload.x]?.[payload.y];

  if (block) {
    if (block.color === 'white') return game;
    delete currentRound.guess[payload.x][payload.y];
  }


  const prunedGuess = currentRound.guess.flat(5).filter(Boolean).map((block) => ({...block, id: undefined}));
  const prunedAnswer = currentRound.answer.flat(5).filter(Boolean).map((block) => ({ ...block, id: undefined }));
  
  const areEqual = JSON.stringify(prunedGuess) === JSON.stringify(prunedAnswer);
  if (areEqual) {
    currentRound.endTime = new Date().toISOString();
    game.status = 'complete';
  }

  return game;
};