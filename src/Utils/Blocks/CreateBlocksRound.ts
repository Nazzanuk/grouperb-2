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

export const createBlocksRound = (payload: CreateBlocksRoundPayload): BlocksGame => {
  console.log('createBlocksRound', payload);
  const game = ServerGames[payload.gameId] as BlocksGame;
  const userIds = Object.keys(game.users);

  const newRound: BlocksRound = {
    startTime: new Date().toISOString(),
    answer: generateAnswer(game.rounds.length + 1),
    guess: [],
    guesser: sample(userIds),
  };

  const gridSize = 9;
  const [x, y] = [Math.floor(gridSize / 2), Math.floor(gridSize / 2)];
  set(newRound.guess, `[${x}][${y}]`, { id: random(100000), x, y, color: 'white' });

  game.status = 'playing';

  game.rounds.push(newRound);

  console.log('createBlocksRoundgame', game);
  return game;
};

function generateAnswer(n: number): Block[][] {
  const gridSize = 9;
  const answer: Block[][] = [];

  const [x, y] = [Math.floor(gridSize / 2), Math.floor(gridSize / 2)];

  set(answer, `[${x}][${y}]`, { id: random(100000), x, y, color: 'white' });

  while (n > 0) {
    const [x, y] = [random(gridSize - 1), random(gridSize - 1)];

    if (answer?.[x]?.[y]) continue;
    
    if (!(answer[x + 1]?.[y] || answer[x - 1]?.[y] || answer[x]?.[y + 1] || answer[x]?.[y - 1])) continue;

    set(answer, `[${x}][${y}]`, { id: random(100000), x, y, color: sample(colors) });
    n--;
  }

  return answer;
}
