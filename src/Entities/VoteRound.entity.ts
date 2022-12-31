import { UserId } from "Entities/UserId.entity";

export type VoteRound = {
  question: string;
  votes: { [key: UserId]: UserId };
}