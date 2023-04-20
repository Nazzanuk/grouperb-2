import { atom } from 'jotai';

import { currentGameAtom } from 'Atoms/CurrentGame.atom';
import { CodenamesGame } from 'Entities/CodenamesGame.class';

export const codenamesGameAtom = atom<CodenamesGame | null>((get) => {
  const game = get(currentGameAtom);

  if (game?.type === 'codenames') return CodenamesGame.restoreGame(game);
  return null;
});
