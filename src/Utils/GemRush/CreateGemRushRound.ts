import fromPairs from 'lodash/fromPairs';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';

import random from 'lodash/random';
import sample from 'lodash/sample';
import times from 'lodash/times';

import { GemRushGame } from 'Entities/GemRushGame.entity';
import { GemCard, GemRushRound } from 'Entities/GemRushRound.entity';
import { CreateGemRushRoundPayload, StartFlowRoundPayload } from 'Entities/Payloads.entity';
import { ServerGames } from 'Server/ServerGames';

const cardColors = ['red', 'blue', 'green', 'gold', 'purple', 'pink', 'black'];

export const createGemRushRound = (payload: CreateGemRushRoundPayload): GemRushGame => {
  console.log('createGemRushRound', payload);
  const game = ServerGames[payload.gameId] as GemRushGame;
  const userIds = Object.keys(game.users);
  const currentRoundIndex = game.rounds.length;

  const newRound: GemRushRound = {
    points: {},
    userCards: mapValues(game.users, () => times(4, generateCard)),
    userDiscarding: {},
    userGems: {},
  };

  game.status = 'playing';
  game.rounds.push(newRound);
  return game;
};

const generateCard = (): GemCard => {
  return {
    id: random(100000, 999999).toString(),
    color: sample(cardColors) as string,
  };
};
