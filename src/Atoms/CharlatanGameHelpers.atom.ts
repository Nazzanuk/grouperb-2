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

export const charlatanGameHelpersAtom = atom((get) => {
  const game = get(charlatanGameAtom);
  const user = get(userAtom);
  const sharedHelpers = get(sharedGameHelpersAtom);

  const currentRound: CharlatanRound = sharedHelpers.currentRound ?? {};

  const usersThatHaveVoted = keys(currentRound?.votes).map((userId) => game!.users[userId as UserId]) as User[];

  const usersThatHaveNotVoted = sharedHelpers.userArray.filter((user) => {
    return !usersThatHaveVoted.find((votedUser) => votedUser.id === user.id);
  });

  const votesWithoutCharlatan = omit(currentRound.votes, currentRound.bluffer);
  const votesForCharlatan = omitBy(votesWithoutCharlatan, (vote) => vote !== currentRound.bluffer);
  const votesAgainstCharlatan = omitBy(votesWithoutCharlatan, (vote) => vote === currentRound.bluffer);
  const allVotesAreForCharlatan = every(votesWithoutCharlatan, (vote) => vote === currentRound.bluffer);
  const noVotesAreForCharlatan = every(votesWithoutCharlatan, (vote) => vote !== currentRound.bluffer);
  const mostVotesAreForCharlatan = values(votesForCharlatan).length >= values(votesAgainstCharlatan).length;
  const myVote = currentRound.votes?.[user.id];

  const scores = getRoundScores(currentRound, game?.users ?? {}, user.id);
  const totalScores = mapValues(game?.users ?? {}, (user) => {
    return (game?.rounds ?? []).reduce((total, round) => {
      return total + getRoundScores(round, game?.users ?? {}, user.id)[user.id];
    }, 0);
  });

  const sortedTotalScoresArray = toPairs(totalScores)
    .sort((a, b) => b[1] - a[1])
    .map(([userId, score]) => [game?.users[userId as UserId], score]) as [User, number][];

  console.log({ scores, totalScores, sortedTotalScoresArray });

  return {
    ...sharedHelpers,
    currentRound,
    topicName: currentRound?.topic,
    usersThatHaveNotVoted,
    usersThatHaveVoted,
    scores,
    totalScores,
    sortedTotalScoresArray,
  };
});

function getRoundScores(round: CharlatanRound, users: Record<UserId, User>, userId: UserId) {
  const votesWithoutCharlatan = omit(round.votes, round.bluffer);
  const votesForCharlatan = omitBy(votesWithoutCharlatan, (vote) => vote !== round.bluffer);
  const votesAgainstCharlatan = omitBy(votesWithoutCharlatan, (vote) => vote === round.bluffer);
  const allVotesAreForCharlatan = every(votesWithoutCharlatan, (vote) => vote === round.bluffer);
  const noVotesAreForCharlatan = every(votesWithoutCharlatan, (vote) => vote !== round.bluffer);
  const mostVotesAreForCharlatan = values(votesForCharlatan).length >= values(votesAgainstCharlatan).length;
  const myVote = round.votes?.[userId];

  const scores = mapValues(users ?? {}, (user) => {
    if (userId === round.bluffer) {
      if (noVotesAreForCharlatan) return 3;
      if (!mostVotesAreForCharlatan) return 2;
      if (mostVotesAreForCharlatan) {
        if (round.blufferGuess === round.answer) return 1;
        return 0;
      }
    }

    if (myVote === round.bluffer) {
      if (round.blufferGuess === round.answer) return 0;
      if (mostVotesAreForCharlatan) return 2;
      return 0;
    }

    return 0;
  });

  return scores;
}
