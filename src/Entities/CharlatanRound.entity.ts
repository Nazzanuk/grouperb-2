import { User } from 'Entities/User.entity';
import { UserId } from 'Entities/UserId.entity';

export type CharlatanRound = {
  topic: string;
  answer: string;
  answers: string[];
  playerAnswers: Record<UserId, string>;
  bluffer: UserId;
  votes: Record<UserId, string>;
  timeStarted: string;
};
