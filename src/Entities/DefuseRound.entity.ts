import { DefuseRule } from 'Entities/DefuseRule.entity';
import { DefuseWire } from 'Entities/DefuseWire.entity';

import { User } from 'Entities/User.entity';
import { UserId } from 'Entities/UserId.entity';

export type DefuseRound = {
  wires: DefuseWire[];
  cutWires: [UserId, DefuseWire][];
  rules: DefuseRule[];
  timeStarted: string;
  duration: number;
};
