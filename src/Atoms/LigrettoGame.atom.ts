import { atom } from 'jotai';

import { currentGameAtom } from 'Atoms/CurrentGame.atom';
import { LigrettoGame } from 'Entities/LigrettoGame.class';

export const ligrettoGameAtom = atom<LigrettoGame | null>((get) => {
  const game = get(currentGameAtom);

  if (game?.type === 'ligretto') return LigrettoGame.restoreGame(game);
  return null;
});
