import { defuseGameAtom } from 'Atoms/DefuseGame.atom';
import { atom } from 'jotai';
import values from 'lodash/values';
import chunk from 'lodash/chunk';
import map from 'lodash/map';
import mapKeys from 'lodash/mapKeys';
import mapValues from 'lodash/mapValues';

import { userAtom } from 'Atoms/User.atom';
import { DefuseWire } from 'Entities/DefuseWire.entity';

export const defuseGameHelpersAtom = atom((get) => {
  const game = get(defuseGameAtom);
  const user = get(userAtom);

  const status = game?.status;
  const currentRound = game?.rounds[game.rounds.length - 1];
  const currentRoundIndex = game?.rounds.length ?? 0;
  const currentRules = currentRound?.rules ?? [];
  const userArray = values(game?.users);
  const isHost = user.id === game?.hostId;
  const isObserver = !game?.users[user.id];
  const usersWithoutMe = userArray.filter((u) => u.id !== user.id);
  const orderedWires = currentRound?.wires?.sort((a, b) => a.letter.charCodeAt(0) - b.letter.charCodeAt(0));
  const rulesChunks = chunk(currentRules, Math.round(currentRules.length / userArray.length));
  const hasBeenCut = (letter: string) => currentRound?.cutWires?.some(([userId, wire]) => wire.letter === letter);

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
  };
});
