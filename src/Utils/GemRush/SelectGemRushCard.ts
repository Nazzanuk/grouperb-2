import fromPairs from 'lodash/fromPairs';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';

import random from 'lodash/random';
import sample from 'lodash/sample';
import times from 'lodash/times';

import { GemRushGame } from 'Entities/GemRushGame.entity';
import { GemCard, GemRushRound } from 'Entities/GemRushRound.entity';
import { CreateGemRushRoundPayload, SelectGemRushCardPayload, StartFlowRoundPayload } from 'Entities/Payloads.entity';
import { ServerGames } from 'Server/ServerGames';
import { UserId } from 'Entities/UserId.entity';

const cardColors = ['red', 'blue', 'green', 'gold', 'purple', 'pink', 'black'];

export const selectGemRushCard = (payload: SelectGemRushCardPayload): GemRushGame => {
  console.log('createGemRushRound', payload);
  const game = ServerGames[payload.gameId] as GemRushGame;
  const userIds = Object.keys(game.users);
  const currentRoundIndex = game.rounds.length;
  const currentRound = game.rounds[currentRoundIndex - 1];

  currentRound.userDiscarding[payload.userId] = payload.card;

  const hasEveryoneChosen = Object.keys(currentRound.userDiscarding).length === userIds.length;

  // Switch cards once all have chosen
  if (hasEveryoneChosen) {
    currentRound.userCards = mapValues(currentRound.userCards, (cards: GemCard[], userId: UserId) => {
      const cardToReplace = cards.find((card) => card.id === currentRound.userDiscarding[userId].id);
      const newCard = generateCard();
      const newCards = cards.map((card) => (card.id === cardToReplace?.id ? newCard : card));

      return newCards;
    });

    currentRound.userDiscarding = {};
  }

  return game;
};

const generateCard = (): GemCard => {
  return {
    id: random(100000, 999999).toString(),
    color: sample(cardColors) as string,
  };
};
