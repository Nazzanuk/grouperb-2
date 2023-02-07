import { atom } from 'jotai';

import { currentGameAtom } from 'Atoms/CurrentGame.atom';
import { CharlatanGame } from 'Entities/CharlatanGame.entity';
import { UserId } from 'Entities/UserId.entity';
import { sharedGameHelpersAtom } from 'Atoms/SharedGameHelpers.atom';
import { User } from 'Entities/User.entity';

export const userPopupAtom = atom({
  isActive: false,
  selectedUser: null as null | User,
  userIds: [] as UserId[],
});

export const showUserPopupAtom = atom(null, (get, set, userIds?: UserId[] | undefined) => {
  const userPopup = get(userPopupAtom);
  const game = get(currentGameAtom);
  const { userArray } = get(sharedGameHelpersAtom);

  set(userPopupAtom, {
    ...userPopup,
    isActive: true,
    selectedUser: null,
    userIds: userIds ?? userArray.map((user) => user.id),
  });
});

export const selectUserPopupAtom = atom(null, (get, set, user: User) => {
  const userPopup = get(userPopupAtom);

  set(userPopupAtom, {
    ...userPopup,
    selectedUser: user,
    isActive: false,
  });

  setTimeout(() => {
    set(userPopupAtom, {
      ...get(userPopupAtom),
      selectedUser: null,
    });
  }, 1000);
});
