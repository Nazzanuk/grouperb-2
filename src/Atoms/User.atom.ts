import { v4 as uuidv4 } from 'uuid';

import { atomWithStorage } from 'jotai/utils';
import { User } from 'Entities/User.entity';
import { UserId } from 'Entities/UserId.entity';

export const userAtom = atomWithStorage<User>('user', {
  id: uuidv4() as UserId,
  username: '',
  avatar: '',
});
