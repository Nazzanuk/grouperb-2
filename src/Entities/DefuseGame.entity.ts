import { DefuseRound } from 'Entities/DefuseRound.entity';

import { Game } from 'Entities/Game.entity';
import { VoteRound } from 'Entities/VoteRound.entity';

export type DefuseGame = Game & {
  type: 'defuse';
  rounds: DefuseRound[];
  status: 'lobby' | 'playing' | 'defused' | 'failed';
};
