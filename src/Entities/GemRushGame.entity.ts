
import { Game } from "Entities/Game.entity";
import { GemRushRound } from "Entities/GemRushRound.entity";

type Override<What, With> = Omit<What, keyof With> & With

export type GemRushGame = Override<Game,{
  type: 'gemRush';
  rounds: GemRushRound[];
  status: 'lobby' | 'playing'| 'results';
}>;

