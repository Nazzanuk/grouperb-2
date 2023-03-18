import { atom } from 'jotai';

import { currentGameAtom } from 'Atoms/CurrentGame.atom';
import { GemRushGame } from 'Entities/GemRushGame.entity';

export const gemRushGameAtom = atom<GemRushGame | null>(get => {
  const game = get(currentGameAtom);

  if (game?.type === 'gemRush') return game as GemRushGame;
  return null;
});