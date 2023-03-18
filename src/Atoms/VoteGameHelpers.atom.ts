import { atom } from 'jotai';
import countBy from 'lodash/countBy';
import flatten from 'lodash/flatten';
import keys from 'lodash/keys';
import sortBy from 'lodash/sortBy';
import toPairs from 'lodash/toPairs';
import values from 'lodash/values';

import { sharedGameHelpersAtom } from 'Atoms/SharedGameHelpers.atom';
import { userAtom } from 'Atoms/User.atom';
import { voteGameAtom } from 'Atoms/VoteGame.atom';
import { User } from 'Entities/User.entity';
import { UserId } from 'Entities/UserId.entity';
import { VoteGame } from 'Entities/VoteGame.entity';
import { getUserAssignedLeastQuestions } from 'Utils/Vote/GetUserAssignedLeastQuestions';
import { getUserAssignedMostQuestions } from 'Utils/Vote/GetUserAssignedMostQuestions';
import { getUserWhoVotedForThemselvesMost } from 'Utils/Vote/GetUserWhoVotedForThemselvesMost';
import { getWinnersString } from 'Utils/Vote/GetWinnersString';
import { VoteRound } from 'Entities/VoteRound.entity';

export const voteGameHelpersAtom = atom((get) => {
  const game = get(voteGameAtom);
  const user = get(userAtom);
  const sharedHelpers = get(sharedGameHelpersAtom);
  const { status, currentRoundIndex, isHost, isObserver, userArray, usersWithoutMe } = sharedHelpers;
  const currentRound = sharedHelpers.currentRound as VoteRound;

  const currentQuestion = currentRound?.question;
  const isWinner = !!currentRound?.winners?.[user.id];
  const allAreWinners = keys(currentRound?.winners ?? {}).length === keys(game?.users ?? {}).length;
  const hasFinished = game?.status === 'finished' || (game?.maxRoundsIndex ?? 0) < currentRoundIndex;
  const have3Users = Object.keys(game?.users ?? {}).length >= 3;
  const usersThatHaveVoted = keys(currentRound?.votes).map((userId) => game!.users[userId as UserId]) as User[];

  const usersThatHaveNotVoted = userArray.filter((user) => {
    return !usersThatHaveVoted.find((votedUser) => votedUser.id === user.id);
  });

  const winnersArray = values(currentRound?.winners ?? {});

  const IHaveVoted = !!currentRound?.votes?.[user.id];

  const myWinningQuestions = getMyWinningQuestions(game, user);
  const winnersString = getWinnersString(game, user);
  const usersWithScores = getUsersWithScores(game);
  const usersSortedByScore = usersWithScores.sort((a, b) => b.score - a.score);
  const topScorer = usersSortedByScore[0];
  const mostQuestionsAssignedUser = getUserAssignedMostQuestions(game);
  const leastQuestionsAssignedUser = getUserAssignedLeastQuestions(game);
  const mostSelfVotesUser = getUserWhoVotedForThemselvesMost(game);
  const stalkers = getStalkers(game);
  const didGuessCorrectly = !!currentRound?.votes?.[user.id] && !!currentRound?.winners[currentRound.votes[user.id]];
  const hasManyWinners = winnersArray.length > 1;

  return {
    currentRound,
    currentRoundIndex,
    currentQuestion,
    status,
    userArray,
    isHost,
    usersThatHaveVoted,
    usersThatHaveNotVoted,
    usersWithoutMe,
    IHaveVoted,
    isObserver,
    have3Users,
    winnersArray,
    isWinner,
    allAreWinners,
    winnersString,
    myWinningQuestions,
    usersSortedByScore,
    topScorer,
    mostQuestionsAssignedUser,
    leastQuestionsAssignedUser,
    mostSelfVotesUser,
    stalkers,
    didGuessCorrectly,
    hasManyWinners
  };
});

//convert existing messy logic in this file into helper functions

const getUsersWithScores = (game: VoteGame | null) => {
  const userArray = values(game?.users);
  return userArray.map((user) => {
    const userWinningQuestions = values(game?.rounds ?? []).filter((round) =>
      keys(round.winners).includes(round.votes[user.id]),
    );
    const userCorrectVotes = userWinningQuestions.length;
    return { ...user, score: userCorrectVotes };
  });
};

const getStalkers = (game: VoteGame | null) => {
  const votePairs = countBy(
    flatten(game?.rounds.map((round) => toPairs(round.votes))).filter((pair) => pair[0] !== pair[1]),
  );
  const maxVotePair = sortBy(votePairs).reverse()[0];
  const stalkerIds = keys(votePairs)
    .find((pair) => votePairs[pair] === maxVotePair)
    ?.split(',');
  const stalkers = stalkerIds?.map((id) => game?.users[id as UserId]);
  return stalkers;
};

const getMyWinningQuestions = (game: VoteGame | null, user: User) => {
  return values(game?.rounds ?? [])
    .filter((round) => round.winners[user.id])
    .map((round) => round.question);
};
