import { atom } from 'jotai';
import values from 'lodash/values';

import { defuseGameAtom } from 'Atoms/DefuseGame.atom';

import { sharedGameHelpersAtom } from 'Atoms/SharedGameHelpers.atom';
import { userAtom } from 'Atoms/User.atom';
import { charlatanGameAtom } from 'Atoms/CharlatanGame.atom';
import { CharlatanRound } from 'Entities/CharlatanRound.entity';

export const charlatanGameHelpersAtom = atom((get) => {
  const game = get(charlatanGameAtom);
  const user = get(userAtom);
  const sharedHelpers = get(sharedGameHelpersAtom);

  const currentRound: CharlatanRound = sharedHelpers.currentRound;

  return {
    ...sharedHelpers,
    currentRound,
    topicName: currentRound?.topic,
  };
});
