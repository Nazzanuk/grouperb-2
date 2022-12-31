import { atom } from 'jotai';

import { currentGameAtom } from 'Atoms/CurrentGame.atom';
import { VoteGame } from 'Entities/VoteGame.entity';

export const voteGameAtom = atom<VoteGame | null>(get => {
  const game = get(currentGameAtom);

  if (game?.type === 'vote') return game as VoteGame;
  return null;
});