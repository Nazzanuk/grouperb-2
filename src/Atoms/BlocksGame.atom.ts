import { atom } from 'jotai';

import { currentGameAtom } from 'Atoms/CurrentGame.atom';
import { BlocksGame } from 'Entities/BlocksGame.entity';

export const blocksGameAtom = atom<BlocksGame | null>(get => {
  const game = get(currentGameAtom);

  if (game?.type === 'blocks') return game as BlocksGame;
  return null;
});