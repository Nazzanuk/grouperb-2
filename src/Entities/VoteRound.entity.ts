import { User } from "Entities/User.entity";
import { UserId } from "Entities/UserId.entity";

export type VoteRound = {
  question: string;
  votes: { [key: UserId]: UserId };
  winners: { [key: UserId]: User };
}