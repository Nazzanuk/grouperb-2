import { atom } from 'jotai';
import max from 'lodash/max';
import sortBy from 'lodash/sortBy';
import toPairs from 'lodash/toPairs';
import values from 'lodash/values';

import { flowGameAtom } from 'Atoms/FlowGame.atom';
import { userAtom } from 'Atoms/User.atom';
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
  const startTime = currentRound?.startTime ?? 0;
  const topScorerId = max(toPairs(scores)) as UserId | undefined;

  const topScorer = topScorerId ? game?.users[topScorerId] : undefined;
  const topScore = topScorerId ? scores[topScorerId] : 0;
  const sortedScorers = sortBy(toPairs(scores), ([, score]) => score).reverse();

  const isGameOver = totalTeamScore < target;

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
    startTime,
    topScorer,
    topScore,
    sortedScorers,
    isGameOver,
  };
});
