import fromPairs from 'lodash/fromPairs';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';

import random from 'lodash/random';
import sample from 'lodash/sample';
import times from 'lodash/times';

import { Tales } from 'Constants/EmojiTale.constants';
import { EmojiTaleGame } from 'Entities/EmojiTaleGame.entity';
import { EmojiTaleRound } from 'Entities/EmojiTaleRound.entity';
import {
  CreateEmojiTaleRoundPayload,
  StartFlowRoundPayload,
  UpdateEmojiTaleAnswerPayload,
} from 'Entities/Payloads.entity';
import { ServerGames } from 'Server/ServerGames';

const cardColors = ['red', 'blue', 'green', 'gold', 'purple', 'pink', 'black'];

export const updateEmojiTaleAnswer = (payload: UpdateEmojiTaleAnswerPayload): EmojiTaleGame => {
  console.log('updateEmojiTaleAnswer', payload);
  const game = ServerGames[payload.gameId] as EmojiTaleGame;
  const userIds = Object.keys(game.users);
  const currentRoundIndex = game.rounds.length;
  const currentRound = game.rounds[currentRoundIndex - 1];

  currentRound.userSolutions[payload.userId] = payload.answer;

  return game;
};
