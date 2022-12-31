import { v4 as uuidv4 } from 'uuid';

import { atom } from 'jotai';
import { User } from 'Entities/User.entity';
import { UserId } from 'Entities/UserId.entity';
import { userAtom } from 'Atoms/User.atom';
import { wsAtom } from 'Atoms/Ws.atom';
import { UpdateUserPayload } from 'Entities/Payloads.entity';
import { sendAtom } from 'Atoms/Send.atom';

export const updateUserAtom = atom<null, User>(null, (get, set, user) => {
  set(sendAtom, { action: 'updateUser', user });
  set(userAtom, user);
});
