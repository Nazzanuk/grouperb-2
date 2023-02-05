import { atom } from 'jotai';

import { currentGameAtom } from 'Atoms/CurrentGame.atom';
import { CharlatanGame } from 'Entities/CharlatanGame.entity';

export const charlatanGameAtom = atom<CharlatanGame | null>(get => {
  const game = get(currentGameAtom);

  if (game?.type === 'charlatan') return game as CharlatanGame;
  return null;
});