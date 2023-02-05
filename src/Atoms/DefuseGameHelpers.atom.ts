import { atom } from 'jotai';
import chunk from 'lodash/chunk';
import mapValues from 'lodash/mapValues';

import { defuseGameAtom } from 'Atoms/DefuseGame.atom';

import { sharedGameHelpersAtom } from 'Atoms/SharedGameHelpers.atom';
import { userAtom } from 'Atoms/User.atom';
import { DefuseWire } from 'Entities/DefuseWire.entity';

export const defuseGameHelpersAtom = atom((get) => {
  const game = get(defuseGameAtom);
  const user = get(userAtom);
  const sharedHelpers = get(sharedGameHelpersAtom);
  const { status, currentRound, currentRoundIndex, isHost, isObserver, userArray, usersWithoutMe } = sharedHelpers;

  if (!game) return sharedHelpers;

  const currentRules = currentRound?.rules ?? [];
  const orderedWires = [...(currentRound?.wires ?? [])].sort((a, b) => a.letter.charCodeAt(0) - b.letter.charCodeAt(0));
  const rulesChunks = chunk(currentRules, Math.round(currentRules.length / userArray.length));
  const hasBeenCut = (letter: string) => currentRound?.cutWires?.some(([userId, wire]) => wire.letter === letter);
  const timeRemaining =
    (currentRound?.duration ?? 0) - (Date.now() - new Date(currentRound?.timeStarted ?? 0).getTime()) / 1000;

  if (rulesChunks.length > userArray.length) {
    rulesChunks[0] = rulesChunks[0].concat(rulesChunks[rulesChunks.length - 1]);
  }

  const userRules = mapValues(game?.users, (user, i) => rulesChunks[userArray.findIndex((u) => u.id === user.id)]);
  const myRules = userRules[user.id] ?? [];

  const cutWiresWires: DefuseWire[] = currentRound?.cutWires?.map(([userId, wire]) => wire) ?? [];

  console.log({
    rulesChunks,
    userRules,
  });

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
