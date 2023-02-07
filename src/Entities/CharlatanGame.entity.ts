import { CharlatanRound } from "Entities/CharlatanRound.entity";
import { Game } from "Entities/Game.entity";
import { VoteRound } from "Entities/VoteRound.entity";

export type CharlatanGame = Game & {
  type: 'charlatan';
  topicList: string[];
  rounds: CharlatanRound[];
  maxRounds: number;
  status: 'lobby' | 'thinking' | 'answering' | 'voting' | 'discuss' | 'results';
};

