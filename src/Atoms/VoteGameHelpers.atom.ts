import { atom } from 'jotai';
import values from 'lodash/values';

import { currentGameAtom } from 'Atoms/CurrentGame.atom';
import { voteGameAtom } from 'Atoms/VoteGame.atom';
import { Game } from 'Entities/Game.entity';
import { getVoteGameStatus } from 'Utils/Vote/GetVoteGameStatus';

export const voteGameHelpersAtom = atom((get) => {
  const game = get(voteGameAtom);

  const status = getVoteGameStatus(game);
  const currentRound = game?.rounds[game.rounds.length - 1];
  const currentQuestion = currentRound?.question;
  const userArray = values(game?.users);

  return {
    currentRound,
    currentQuestion,
    status,
    userArray,
  };
});
