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

const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];

export const addBlock = (payload: CreateBlocksRoundPayload): BlocksGame => {
  console.log('addBlock', payload);
  const game = ServerGames[payload.gameId] as BlocksGame;
  const userIds = Object.keys(game.users);
  const currentRound = game.rounds[game.rounds.length - 1] as BlocksRound;

  let block = currentRound.guess?.[payload.x]?.[payload.y];

  if (!block) {
    set(currentRound.guess, `[${payload.x}][${payload.y}]`, {
      id: random(100000),
      x: payload.x,
      y: payload.y,
      color: colors[0],
    });
  } else {
    if (block.color === 'white') return game;

    const colorIndex = colors.indexOf(block.color);
    block.color = colors[colorIndex + 1] || colors[0];
  }

  const prunedGuess = currentRound.guess.flat(5).filter(Boolean).map((block) => ({...block, id: undefined}));
  const prunedAnswer = currentRound.answer.flat(5).filter(Boolean).map((block) => ({ ...block, id: undefined }));
  
  const areEqual = JSON.stringify(prunedGuess) === JSON.stringify(prunedAnswer);
  
  if (areEqual) {
    currentRound.endTime = new Date().toISOString();
    game.status = 'complete';
  }

  console.log({ prunedGuess, prunedAnswer });

  return game;
};
