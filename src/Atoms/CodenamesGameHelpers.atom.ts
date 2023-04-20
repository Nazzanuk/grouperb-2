import { atom } from 'jotai';

import values from 'lodash/values';

import { userAtom } from 'Atoms/User.atom';

import { codenamesGameAtom } from 'Atoms/CodenamesGame.atom';

export const codenamesGameHelpersAtom = atom((get) => {
  const game = get(codenamesGameAtom);
  const user = get(userAtom);

  const users = game?.users ?? {};
  const status = game?.status;
  const userArray = values(game?.users);
  const isHost = user.id === game?.hostId;
  const isObserver = !game?.users[user.id];
  const usersWithoutMe = userArray.filter((u) => u.id !== user.id);

  return {
    status,
    userArray,
    isHost,
    usersWithoutMe,
    isObserver,
    user,
    users,
  };
});
