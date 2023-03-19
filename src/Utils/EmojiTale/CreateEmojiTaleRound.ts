import fromPairs from 'lodash/fromPairs';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';

import random from 'lodash/random';
import sample from 'lodash/sample';
import times from 'lodash/times';

import { Tales } from 'Constants/EmojiTale.constants';
import { EmojiTaleGame } from 'Entities/EmojiTaleGame.entity';
import { EmojiTaleRound } from 'Entities/EmojiTaleRound.entity';
import { CreateEmojiTaleRoundPayload, StartFlowRoundPayload } from 'Entities/Payloads.entity';
import { ServerGames } from 'Server/ServerGames';

const cardColors = ['red', 'blue', 'green', 'gold', 'purple', 'pink', 'black'];

export const createEmojiTaleRound = (payload: CreateEmojiTaleRoundPayload): EmojiTaleGame => {
  console.log('createEmojiTaleRound', payload);
  const game = ServerGames[payload.gameId] as EmojiTaleGame;
  const userIds = Object.keys(game.users);
  const currentRoundIndex = game.rounds.length;

  const newRound: EmojiTaleRound = {
    tale: sample(Tales)!,
    userPoints: {},
    userSolutions: {},
    userVotes: {},
  };

  game.status = 'playing';
  game.rounds.push(newRound);
  return game;
};