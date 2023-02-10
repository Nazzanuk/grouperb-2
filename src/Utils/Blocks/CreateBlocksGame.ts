import random from 'lodash/random';

import { BlocksGame } from 'Entities/BlocksGame.entity';
import { DefuseGame } from 'Entities/DefuseGame.entity';
import { User } from 'Entities/User.entity';

export const createBlocksGame = ({ host, id }: { host: User; id?: string }): BlocksGame => {
  const blocksGame: BlocksGame = {
    type: 'blocks',
    id: id ?? random(10000, 99999).toString(),
    users: { [host.id]: host },
    hostId: host.id,
    rounds: [],
    status: 'lobby',
  };

  return blocksGame;
};
