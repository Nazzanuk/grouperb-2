import { BlocksRound } from "Entities/BlocksRound.entity";
import { Game } from "Entities/Game.entity";

export type BlocksGame = Game & {
  type: 'blocks';
  rounds: BlocksRound[];
  status: 'lobby' | 'playing'| 'results';
};

