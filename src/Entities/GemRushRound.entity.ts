
import { BlocksRound } from "Entities/BlocksRound.entity";
import { Game } from "Entities/Game.entity";
import { UserId } from "Entities/UserId.entity";

export type Gem = {
  color: string;
  points: number;
}

export type GemCard = {
  id: string;
  color: string;
}

export type GemRushRound = {
  userCards: Record<UserId, GemCard[]>;
  userDiscarding: Record<UserId, GemCard>;
  userGems: Record<UserId, Gem>;
  points: Record<UserId, number>;
};

