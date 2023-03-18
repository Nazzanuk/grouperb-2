import { atom } from 'jotai';
import { times } from 'lodash';
import max from 'lodash/max';
import sortBy from 'lodash/sortBy';
import toPairs from 'lodash/toPairs';
import values from 'lodash/values';

import { userAtom } from 'Atoms/User.atom';
import { Gem, GemCard } from 'Entities/GemRushRound.entity';
import { UserId } from 'Entities/UserId.entity';

import { gemRushGameAtom } from './GemRushGame.atom';

const gemColors = ['gold', 'silver', 'bronze', 'red', 'green', 'purple', 'blue'] as const;

export const gemRushGameHelpersAtom = atom((get) => {
  const game = get(gemRushGameAtom);
  const user = get(userAtom);

  const status = game?.status;
  const currentRound = game?.rounds[game.rounds.length - 1];
  const currentRoundIndex = game?.rounds.length ?? 0;
  const userArray = values(game?.users);
  const isHost = user.id === game?.hostId;
  const isObserver = !game?.users[user.id];
  const usersWithoutMe = userArray.filter((u) => u.id !== user.id);

  const allCards = currentRound?.userCards ?? {};
  const myCards = allCards[user.id] ?? [];
  const mySelectedCard = currentRound?.userDiscarding?.[user.id];
  const allMyCardsMatch = myCards.every((card) => card.color === myCards[0].color);
  const somebodyHasGem = !!Object.values(currentRound?.userGems ?? {}).length;
  const hasEveryoneGotGem = Object.values(currentRound?.userGems ?? {}).length === userArray.length - 1;
  const myGem = currentRound?.userGems?.[user.id];
  const myRoundPoints = currentRound?.points?.[user.id] ?? 0;
  const canChooseGem = !myGem && (allMyCardsMatch || (somebodyHasGem && !hasEveryoneGotGem))

  const gems: Gem[] = times(userArray.length - 1).map((i) => ({
    points: userArray.length - i - 1,
    color: gemColors[i],
  }));

  const isMySelectedCard = (card: GemCard) => card.id === mySelectedCard?.id;
  const isGemSelected = (gem: Gem) => !!Object.values(currentRound?.userGems ?? {}).find((g) => g.color === gem.color);

  console.log({
    values: Object.values(currentRound?.userGems ?? {}),
    currentRound,
    gems,
  });

  return {
    currentRound,
    currentRoundIndex,
    status,
    userArray,
    isHost,
    usersWithoutMe,
    isObserver,
    myCards,
    mySelectedCard,
    isMySelectedCard,
    isGemSelected,
    allMyCardsMatch,
    somebodyHasGem,
    hasEveryoneGotGem,
    gems,
    myGem,
    myRoundPoints,
    canChooseGem,
  };
});
