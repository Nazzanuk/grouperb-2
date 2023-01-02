import { atom } from 'jotai';
import values from 'lodash/values';

import { voteGameAtom } from 'Atoms/VoteGame.atom';
import { getVoteGameStatus } from 'Utils/Vote/GetVoteGameStatus';
import { userAtom } from 'Atoms/User.atom';

export const voteGameHelpersAtom = atom((get) => {
  const game = get(voteGameAtom);
  const user = get(userAtom);

  const status = getVoteGameStatus(game);
  const currentRound = game?.rounds[game.rounds.length - 1];
  const currentRoundIndex = game?.rounds.length ?? 0;
  const currentQuestion = currentRound?.question;
  const userArray = values(game?.users);
  const isHost = user.id === game?.hostId;

  return {
    currentRound,
    currentRoundIndex,
    currentQuestion,
    status,
    userArray,
    isHost,
  };
});
