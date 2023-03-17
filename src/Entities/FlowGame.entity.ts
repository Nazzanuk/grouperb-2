import { FlowRound } from "Entities/FlowRound.entity";
import { Game } from "Entities/Game.entity";

type Override<What, With> = Omit<What, keyof With> & With

export type FlowGame = Override<Game,{
  type: 'flow';
  rounds: FlowRound[];
  status: 'lobby' | 'playing' | 'results' ;
}>;

