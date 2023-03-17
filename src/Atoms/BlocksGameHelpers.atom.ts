import { atom } from 'jotai';
import { set } from 'lodash';
import mapValues from 'lodash/mapValues';
import omit from 'lodash/omit';

import { blocksGameAtom } from 'Atoms/BlocksGame.atom';

import { sharedGameHelpersAtom } from 'Atoms/SharedGameHelpers.atom';
import { userAtom } from 'Atoms/User.atom';
import { BlocksGame } from 'Entities/BlocksGame.entity';
import { BlocksRound } from 'Entities/BlocksRound.entity';

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

  const linearblocks = answer?.flat(2).filter(Boolean);
  console.log({ linearblocks });
  linearblocks?.forEach((answer, n) => {
    const { x, y } = answer;
    const index = n % userArrayWithoutGuesser.length;

    const selectedUser = userArrayWithoutGuesser[index];
    set(splitAnswer, [selectedUser.id, x, y], answer);

    console.log('answerindex', { n, index, selectedUser, splitAnswer });

    if (answer?.color === 'white') {
      userArrayWithoutGuesser.forEach((u) => set(splitAnswer, [u.id, x, y], answer));
    }

    n++;
  });

  const myAnswer = splitAnswer[user.id];

  const correctAnswers = linearblocks?.filter(
    (block) => currentRound.guess?.[block.x]?.[block.y]?.color === block.color,
  ).length;

  const totalScore = game?.rounds.reduce((acc, round) => acc + round.score, 0);

  console.log({ answers: answer, splitAnswers: splitAnswer, userArrayWithoutGuesser, usersWithoutGuesser, correctAnswers });

  return {
    ...sharedHelpers,
    currentRound,
    isGuesser,
    splitAnswer,
    myAnswer,
    linearblocks,
    correctAnswers,
    totalScore
  };
});
