import { atom } from 'jotai';
import keys from 'lodash/keys';
import values from 'lodash/values';

import { userAtom } from 'Atoms/User.atom';
import { voteGameAtom } from 'Atoms/VoteGame.atom';
import { User } from 'Entities/User.entity';
import { UserId } from 'Entities/UserId.entity';
import { getVoteGameStatus } from 'Utils/Vote/GetVoteGameStatus';
import { VoteGame } from 'Entities/VoteGame.entity';

export const voteGameHelpersAtom = atom((get) => {
  const game = get(voteGameAtom);
  const user = get(userAtom);

  const status = game?.status;
  const currentRound = game?.rounds[game.rounds.length - 1];
  const currentRoundIndex = game?.rounds.length ?? 0;
  const currentQuestion = currentRound?.question;
  const userArray = values(game?.users);
  const isHost = user.id === game?.hostId;
  const isObserver = !game?.users[user.id];
  const isWinner = !!currentRound?.winners[user.id];
  const allAreWinners = keys(currentRound?.winners ?? {}).length === keys(game?.users ?? {}).length;
  const have3Users = Object.keys(game?.users ?? {}).length >= 3;
  const usersThatHaveVoted = keys(currentRound?.votes).map(
    (userId) => game!.users[userId as UserId],
  ) as User[];

  const usersThatHaveNotVoted = userArray.filter((user) => {
    return !usersThatHaveVoted.find((votedUser) => votedUser.id === user.id);
  });

  const usersWithoutMe = userArray.filter((u) => {
    return u.id !== user.id;
  });

  const winnersArray = values(currentRound?.winners ?? {});

  const IHaveVoted = !!currentRound?.votes[user.id];

  //string which lists all winners in a sentence
  const winnersString = winnersArray
    .map((winner) => winner.username)
    .reduce((acc, name, index, array) => {
      if (index === 0) {
        return name;
      } else if (index === array.length - 1) {
        return `${acc} and ${name}`;
      } else {
        return `${acc}, ${name}`;
      }
    }, '');
  

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
  };
});
