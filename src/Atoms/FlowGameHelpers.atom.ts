import { atom } from 'jotai';
import values from 'lodash/values';

import { currentGameAtom } from 'Atoms/CurrentGame.atom';
import { userAtom } from 'Atoms/User.atom';
import { VoteGame } from 'Entities/VoteGame.entity';
import { flowGameAtom } from 'Atoms/FlowGame.atom';

export const flowGameHelpersAtom = atom((get) => {
  const game = get(flowGameAtom);
  const user = get(userAtom);

  const status = game?.status;
  const currentRound = game?.rounds[game.rounds.length - 1];
  const currentRoundIndex = game?.rounds.length ?? 0;
  const userArray = values(game?.users);
  const isHost = user.id === game?.hostId;
  const isObserver = !game?.users[user.id];
  const usersWithoutMe = userArray.filter((u) => u.id !== user.id);
  const sequence = currentRound?.sequence ?? [];
  const lanes = currentRound?.lanes ?? 1;

  return {
    currentRound,
    currentRoundIndex,
    status,
    userArray,
    isHost,
    usersWithoutMe,
    isObserver,
    sequence,
    lanes,
  };
});
