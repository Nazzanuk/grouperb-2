import { DefuseGame } from 'Entities/DefuseGame.entity';
import { atom } from 'jotai';

import { currentGameAtom } from 'Atoms/CurrentGame.atom';
import { VoteGame } from 'Entities/VoteGame.entity';

export const defuseGameAtom = atom<DefuseGame | null>((get) => {
  const game = get(currentGameAtom);

  console.log('defuseGameAtom', {game})

  if (game?.type === 'defuse') return game as DefuseGame;
  return null;
});
