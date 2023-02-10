import { User } from 'Entities/User.entity';
import { UserId } from 'Entities/UserId.entity';

export type CharlatanRound = {
  topic: string;
  answer: string;
  answers: string[];
  playerAnswers: Record<UserId, string>;
  bluffer: UserId;
  blufferGuess: string;
  votes: Record<UserId, string>;
  timeStarted: string;
  startedAnswering: string;
  startedDiscussing: string;
  startedVoting: string;
};
