import random from 'lodash/random';

import { BlocksGame } from 'Entities/BlocksGame.entity';
import { DefuseGame } from 'Entities/DefuseGame.entity';
import { User } from 'Entities/User.entity';
import { FlowGame } from 'Entities/FlowGame.entity';

export const createFlowGame = ({ host, id }: { host: User; id?: string }): FlowGame => {
  const flowGame: FlowGame = {
    type: 'flow',
    id: id ?? random(10000, 99999).toString(),
    users: { [host.id]: host },
    hostId: host.id,
    rounds: [],
    status: 'lobby',
  };

  return flowGame;
};
