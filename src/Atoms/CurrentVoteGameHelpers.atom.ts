import { currentGameAtom } from 'Atoms/CurrentGame.atom';
import { currentVoteGameAtom } from 'Atoms/CurrentVoteGame.atom';
import { Game } from 'Entities/Game.entity';
import { atom } from 'jotai';

export const currentVoteGameHelpersAtom = atom(get => {
  const game = get(currentVoteGameAtom);
  
  const currentRound = game?.rounds[game.rounds.length - 1];
  const currentQuestion = currentRound?.question;

  return {
    currentRound,
    currentQuestion,
  }
});