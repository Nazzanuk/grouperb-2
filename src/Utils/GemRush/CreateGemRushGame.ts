import random from 'lodash/random';

import { GemRushGame } from 'Entities/GemRushGame.entity';
import { User } from 'Entities/User.entity';

export const createGemRushGame = ({ host, id }: { host: User; id?: string }): GemRushGame => {
  const gemRushGame: GemRushGame = {
    type: 'gemRush',
    id: id ?? random(10000, 99999).toString(),
    users: { [host.id]: host },
    hostId: host.id,
    rounds: [],
    status: 'lobby',
  };

  return gemRushGame;
};
