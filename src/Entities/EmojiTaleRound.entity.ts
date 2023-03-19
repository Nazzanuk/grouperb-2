import { UserId } from "Entities/UserId.entity";

export type Tale = {
  story: string;
  solution: string;
};


export type EmojiTaleRound = {
  tale: Tale;
  userSolutions: Record<UserId, string>;
  userPoints: Record<UserId, number>;
  userVotes: Record<UserId, UserId>;
};

