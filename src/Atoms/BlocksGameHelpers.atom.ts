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
import { blocksGameAtom } from 'Atoms/BlocksGame.atom';
import { BlocksGame } from 'Entities/BlocksGame.entity';
import { set } from 'lodash';

export const blocksGameHelpersAtom = atom((get) => {
  const game = get(blocksGameAtom) as BlocksGame;
  const user = get(userAtom);
  const sharedHelpers = get(sharedGameHelpersAtom);

  const currentRound: BlocksRound = sharedHelpers.currentRound ?? {};
  const answer = currentRound?.answer;
  const isGuesser = currentRound?.guesser === user.id;

  const userArrayWithoutGuesser = sharedHelpers.userArray.filter((user) => user.id !== currentRound.guesser);
  const usersWithoutGuesser = omit(game?.users, currentRound.guesser);

  const splitAnswer = mapValues(usersWithoutGuesser, () => []);
  console.log({ splitAnswers: splitAnswer });

  let n = 0;
  answer?.forEach((xAxis, x) =>
    xAxis?.forEach((yAxis, y) => {
      const index = n % userArrayWithoutGuesser.length;
      console.log('answerindex', index);

      const selectedUser = userArrayWithoutGuesser[index];
      set(splitAnswer, [selectedUser.id, x, y], answer?.[x]?.[y]);

      if (answer?.[x]?.[y]?.color === 'white') {
        userArrayWithoutGuesser.forEach((u) => set(splitAnswer, [u.id, x, y], answer?.[x]?.[y]));
      }

      n++;
    }),
  );

  const myAnswer = splitAnswer[user.id];

  console.log({ answers: answer, splitAnswers: splitAnswer, userArrayWithoutGuesser, usersWithoutGuesser });

  return {
    ...sharedHelpers,
    currentRound,
    isGuesser,
    splitAnswer,
    myAnswer,
  };
});
