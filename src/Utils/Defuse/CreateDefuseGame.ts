import { DefuseGame } from 'Entities/DefuseGame.entity';
import { User } from 'Entities/User.entity';
import random from 'lodash/random';

export const createDefuseGame = ({ host }: { host: User }): DefuseGame => {
  const defuseGame: DefuseGame = {
    type: 'defuse',
    id: random(10000, 99999).toString(),
    users: { [host.id]: host },
    hostId: host.id,
    rounds: [],
    status: 'lobby',
  };

  return defuseGame;
};
