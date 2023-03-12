import { User } from 'Entities/User.entity';
import { UserId } from 'Entities/UserId.entity';

export type Boop = {
  delay: number;
  index: number;
  speed: number;
  color: string;
};

export type FlowRound = {
  sequence: Boop[];
  lanes: number;
  scores: Record<UserId, number>;
  totalScore: number;
  startTime: number;
};
