import { User } from 'Entities/User.entity';
import { UserId } from 'Entities/UserId.entity';

export type Block = {
  id: number;
  color: string;
  x: number;
  y: number;
}

export type BlocksRound = {
  answer: Block[][];
  guess: Block[][];
  startTime: string;
  endTime: string;
  guesser: UserId;
};
