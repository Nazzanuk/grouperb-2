import { atom } from 'jotai';
import chunk from 'lodash/chunk';
import mapValues from 'lodash/mapValues';

import { defuseGameAtom } from 'Atoms/DefuseGame.atom';

import { sharedGameHelpersAtom } from 'Atoms/SharedGameHelpers.atom';
import { userAtom } from 'Atoms/User.atom';
import { DefuseWire } from 'Entities/DefuseWire.entity';
import { UserId } from 'Entities/UserId.entity';
import { round } from 'lodash';

export const defuseGameHelpersAtom = atom((get) => {
  const game = get(defuseGameAtom);
  const user = get(userAtom);
  const sharedHelpers = get(sharedGameHelpersAtom);
  const { status, currentRound, currentRoundIndex, isHost, isObserver, userArray, usersWithoutMe } = sharedHelpers;

  if (!game) return sharedHelpers;

  const currentRules = currentRound?.rules ?? [];
  const orderedWires = [...(currentRound?.wires ?? [])].sort((a, b) => a.letter.charCodeAt(0) - b.letter.charCodeAt(0));
  // const rulesChunks = chunk(currentRules, Math.round(currentRules.length / userArray.length));
  const hasBeenCut = (letter: string) => currentRound?.cutWires?.some(([userId, wire]) => wire.letter === letter);
  const timeRemaining =
    (currentRound?.duration ?? 0) - (Date.now() - new Date(currentRound?.timeStarted ?? 0).getTime()) / 1000;

  const userRulesList = currentRules.map((rule, i) => {
    const userIndex = (i + currentRoundIndex) % userArray.length;
    return { userId: userArray[userIndex]?.id as UserId, rule };
  });

  const userRules = {};

  userRulesList.forEach(({ userId, rule }) => {
    userRules[userId] ??= [];
    userRules[userId].push(rule);
  });

  const myRules = userRules[user.id] ?? [];

  const cutWiresWires: DefuseWire[] = currentRound?.cutWires?.map(([userId, wire]) => wire) ?? [];

  return {
    currentRound,
    currentRoundIndex,
    status,
    userArray,
    isHost,
    usersWithoutMe,
    isObserver,
    orderedWires,
    userRules,
    myRules,
    cutWiresWires,
    hasBeenCut,
    timeRemaining,
  };
});
