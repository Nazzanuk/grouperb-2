
import { Game } from "Entities/Game.entity";
import { GemRushRound } from "Entities/GemRushRound.entity";
import { UserId } from "Entities/UserId.entity";

type Override<What, With> = Omit<What, keyof With> & With

export type GemRushGame = Override<Game,{
  type: 'gemRush';
  rounds: GemRushRound[];
  status: 'lobby' | 'playing'| 'results';
  points?: Record<UserId, number>;
}>;

