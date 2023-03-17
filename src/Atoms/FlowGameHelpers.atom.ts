import { atom } from 'jotai';
import values from 'lodash/values';

import { currentGameAtom } from 'Atoms/CurrentGame.atom';
import { userAtom } from 'Atoms/User.atom';
import { VoteGame } from 'Entities/VoteGame.entity';
import { flowGameAtom } from 'Atoms/FlowGame.atom';
import { UserId } from 'Entities/UserId.entity';

export const flowGameHelpersAtom = atom((get) => {
  const game = get(flowGameAtom);
  const user = get(userAtom);

  const status = game?.status;
  const currentRound = game?.rounds[game.rounds.length - 1];
  const currentRoundIndex = game?.rounds.length ?? 0;
  const userArray = values(game?.users);
  const isHost = user.id === game?.hostId;
  const isObserver = !game?.users[user.id];
  const usersWithoutMe = userArray.filter((u) => u.id !== user.id);
  const sequence = currentRound?.sequence ?? [];
  const lanes = currentRound?.lanes ?? 1;
  const target = currentRound?.target ?? 0;
  const totalTeamScore = currentRound?.totalScore ?? 0;
  const scores: Record<UserId, number> = currentRound?.scores ?? {};
  // const topScorerId: UserId = (Object.keys(scores) as UserId[]).reduce((a, b) => (scores[a] > scores[b] ? a : b));
  // const topScorer = game?.users[topScorerId];
  // const topScore = scores[topScorerId];

  // const orderedScorers: Record<User, number> = Object.keys(scores).reduce((acc, userId) => {
  //   const user = game?.users[userId as UserId];
  //   if (!user) return acc;
  //   return { ...acc, [user]: scores[userId as UserId] };
  // }, {});



  return {
    currentRound,
    currentRoundIndex,
    status,
    userArray,
    isHost,
    usersWithoutMe,
    isObserver,
    sequence,
    lanes,
    target,
    totalTeamScore,
    scores,
    // topScorer,
    // topScore,
    // orderedScorers
  };
});
