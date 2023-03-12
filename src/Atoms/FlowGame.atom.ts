import { atom } from 'jotai';

import { currentGameAtom } from 'Atoms/CurrentGame.atom';
import { VoteGame } from 'Entities/VoteGame.entity';
import { FlowGame } from 'Entities/FlowGame.entity';

export const flowGameAtom = atom<FlowGame | null>(get => {
  const game = get(currentGameAtom);

  if (game?.type === 'flow') return game as FlowGame;
  return null;
});