import fromPairs from 'lodash/fromPairs';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';

import random from 'lodash/random';
import sample from 'lodash/sample';
import times from 'lodash/times';

import { GemRushGame } from 'Entities/GemRushGame.entity';
import { GemCard, GemRushRound } from 'Entities/GemRushRound.entity';
import { SelectGemRushGemPayload, StartFlowRoundPayload } from 'Entities/Payloads.entity';
import { ServerGames } from 'Server/ServerGames';
import { UserId } from 'Entities/UserId.entity';

const cardColors = ['crimson', 'dodgerblue', 'darkolivegreen', 'gold', 'darkviolet', 'deeppink', 'black'];

export const selectGemRushGem = (payload: SelectGemRushGemPayload): GemRushGame => {
  console.log('createGemRushRound', payload);
  const game = ServerGames[payload.gameId] as GemRushGame;
  const userIds = Object.keys(game.users) as UserId[];
  const currentRoundIndex = game.rounds.length;
  const currentRound = game.rounds[currentRoundIndex - 1];

  currentRound.userGems[payload.userId] ??= payload.gem;

  const gems = Object.values(currentRound.userGems);

  const hasEveryoneChosen = Object.keys(userIds).length === gems.length + 1;

  currentRound.points = fromPairs(
    userIds.map((userId) => {
      const userGem = currentRound?.userGems?.[userId];
      const userPoints = userGem ? userGem.points : 0;
      return [userId, userPoints];
    }),
  );

  game.points = fromPairs(
    userIds.map((userId) => {
      const userPoints = game.rounds.reduce((acc, round) => acc + (round.points?.[userId] ?? 0), 0);
      return [userId, userPoints];
    }),
  );

  // Switch cards once all have chosen
  if (hasEveryoneChosen) {
    game.status = 'results';
  }

  return game;
};
