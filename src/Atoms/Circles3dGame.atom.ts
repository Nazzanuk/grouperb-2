import { atom } from 'jotai';

import { currentGameAtom } from 'Atoms/CurrentGame.atom';
import { Circles3dGame } from 'Entities/Circles3d.class';

export const circles3dGameAtom = atom<Circles3dGame | null>((get) => {
  const game = get(currentGameAtom);

  if (game?.type === 'circles3d') return Circles3dGame.restoreGame(game);
  return null;
});
