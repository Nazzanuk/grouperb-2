import { Game } from "Entities/Game.entity";
import { VoteRound } from "Entities/VoteRound.entity";

export type VoteGame = Game & {
  type: 'vote';
  questionList: string[];
  usedQuestionList: string[];
  rounds: VoteRound[];
};

