
import { EmojiTaleRound } from "Entities/EmojiTaleRound.entity";
import { Game } from "Entities/Game.entity";
import { UserId } from "Entities/UserId.entity";

type Override<What, With> = Omit<What, keyof With> & With

export type EmojiTaleGame = Override<Game,{
  type: 'emojiTale';
  rounds: EmojiTaleRound[];
  status: 'lobby' | 'playing'| 'voting' | 'results';
  points?: Record<UserId, number>;
}>;

