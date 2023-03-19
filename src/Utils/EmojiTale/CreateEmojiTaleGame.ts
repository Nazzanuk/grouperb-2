import random from 'lodash/random';

import { EmojiTaleGame } from 'Entities/EmojiTaleGame.entity';
import { User } from 'Entities/User.entity';

export const createEmojiTaleGame = ({ host, id }: { host: User; id?: string }): EmojiTaleGame => {
  const emojiTaleGame: EmojiTaleGame = {
    type: 'emojiTale',
    id: id ?? random(10000, 99999).toString(),
    users: { [host.id]: host },
    hostId: host.id,
    rounds: [],
    status: 'lobby',
  };

  return emojiTaleGame;
};
