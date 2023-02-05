import random from 'lodash/random';

import { CharlatanGame } from 'Entities/CharlatanGame.entity';
import { DefuseGame } from 'Entities/DefuseGame.entity';
import { User } from 'Entities/User.entity';

export const createCharlatanGame = ({ host, id }: { host: User; id?: string }): CharlatanGame => {
  const charlatanGame: CharlatanGame = {
    type: 'charlatan',
    id: id ?? random(10000, 99999).toString(),
    users: { [host.id]: host },
    hostId: host.id,
    rounds: [],
    topicList: [],
    maxRounds: 10,
    status: 'lobby',
  };

  return charlatanGame;
};
