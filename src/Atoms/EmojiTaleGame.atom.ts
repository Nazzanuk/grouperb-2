import { atom } from 'jotai';

import { currentGameAtom } from 'Atoms/CurrentGame.atom';
import { EmojiTaleGame } from 'Entities/EmojiTaleGame.entity';

export const emojiTaleGameAtom = atom<EmojiTaleGame | null>(get => {
  const game = get(currentGameAtom);

  if (game?.type === 'emojiTale') return game as EmojiTaleGame;
  return null;
});