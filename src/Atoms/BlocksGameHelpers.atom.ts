import { atom } from 'jotai';
import keys from 'lodash/keys';
import values from 'lodash/values';
import toPairs from 'lodash/toPairs';

import { charlatanGameAtom } from 'Atoms/CharlatanGame.atom';
import { defuseGameAtom } from 'Atoms/DefuseGame.atom';

import { sharedGameHelpersAtom } from 'Atoms/SharedGameHelpers.atom';
import { userAtom } from 'Atoms/User.atom';
import { CharlatanRound } from 'Entities/CharlatanRound.entity';
import { User } from 'Entities/User.entity';
import { UserId } from 'Entities/UserId.entity';
import mapValues from 'lodash/mapValues';
import omitBy from 'lodash/omitBy';
import omit from 'lodash/omit';
import every from 'lodash/every';
import { BlocksRound } from 'Entities/BlocksRound.entity';

export const blocksGameHelpersAtom = atom((get) => {
  const game = get(charlatanGameAtom);
  const user = get(userAtom);
  const sharedHelpers = get(sharedGameHelpersAtom);

  const currentRound: BlocksRound = sharedHelpers.currentRound ?? {};
  const isGuesser = currentRound.guesser === user.id;

  return {
    ...sharedHelpers,
    currentRound,
    isGuesser,
  };
});
