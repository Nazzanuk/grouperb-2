import { atom } from 'jotai';

import values from 'lodash/values';

import { userAtom } from 'Atoms/User.atom';

import { ligrettoGameAtom } from 'Atoms/LigrettoGame.atom';

export const ligrettoGameHelpersAtom = atom((get) => {
  const game = get(ligrettoGameAtom);
  const user = get(userAtom);

  const users = game?.users ?? {};
  const status = game?.status;
  const currentRound = game?.rounds[game.rounds.length - 1];
  const currentRoundIndex = game?.rounds.length ?? 0;
  const userArray = values(game?.users);
  const isHost = user.id === game?.hostId;
  const isObserver = !game?.users[user.id];
  const usersWithoutMe = userArray.filter((u) => u.id !== user.id);

  return {
    currentRound,
    currentRoundIndex,
    status,
    userArray,
    isHost,
    usersWithoutMe,
    isObserver,
    user,
    users,
  };
});
