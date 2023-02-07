import { atom } from 'jotai';
import keys from 'lodash/keys';
import values from 'lodash/values';

import { charlatanGameAtom } from 'Atoms/CharlatanGame.atom';
import { defuseGameAtom } from 'Atoms/DefuseGame.atom';

import { sharedGameHelpersAtom } from 'Atoms/SharedGameHelpers.atom';
import { userAtom } from 'Atoms/User.atom';
import { CharlatanRound } from 'Entities/CharlatanRound.entity';

export const charlatanGameHelpersAtom = atom((get) => {
  const game = get(charlatanGameAtom);
  const user = get(userAtom);
  const sharedHelpers = get(sharedGameHelpersAtom);

  const currentRound: CharlatanRound = sharedHelpers.currentRound;

  const usersThatHaveVoted = keys(currentRound?.votes).map((userId) => game!.users[userId as UserId]) as User[];

  const usersThatHaveNotVoted = sharedHelpers.userArray.filter((user) => {
    return !usersThatHaveVoted.find((votedUser) => votedUser.id === user.id);
  });

  return {
    ...sharedHelpers,
    currentRound,
    topicName: currentRound?.topic,
    usersThatHaveNotVoted,
    usersThatHaveVoted,
  };
});
