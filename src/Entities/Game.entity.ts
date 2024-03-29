import { User } from 'Entities/User.entity';
import { UserId } from 'Entities/UserId.entity';

export type Game = {
  type:
    | 'vote'
    | 'defuse'
    | 'charlatan'
    | 'blocks'
    | 'flow'
    | 'gemRush'
    | 'emojiTale'
    | 'circles3d'
    | 'ligretto'
    | 'codenames';
  id: string;
  users: { [key: UserId]: User };
  hostId: UserId;
  rounds: any[];
  status: string;
};
