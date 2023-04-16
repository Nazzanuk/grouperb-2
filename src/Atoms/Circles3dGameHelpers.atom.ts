import { atom } from 'jotai';
import mapValues from 'lodash/mapValues';
import max from 'lodash/max';
import sortBy from 'lodash/sortBy';
import times from 'lodash/times';
import toPairs from 'lodash/toPairs';
import values from 'lodash/values';

import { userAtom } from 'Atoms/User.atom';
import { UserId } from 'Entities/UserId.entity';

import { emojiTaleGameAtom } from './EmojiTaleGame.atom';
import { circles3dGameAtom } from 'Atoms/Circles3dGame.atom';

export const circles3dGameHelpersAtom = atom((get) => {
  const game = get(circles3dGameAtom);
  const user = get(userAtom);

  const users = game?.users ?? {};
  const status = game?.status;
  const currentRound = game?.rounds[game.rounds.length - 1];
  const currentRoundIndex = game?.rounds.length ?? 0;
  const userArray = values(game?.users);
  const isHost = user.id === game?.hostId;
  const isObserver = !game?.users[user.id];
  const usersWithoutMe = userArray.filter((u) => u.id !== user.id);
  
  return {
    currentRound,
    currentRoundIndex,
    status,
    userArray,
    isHost,
    usersWithoutMe,
    isObserver,
    user,
    users
  };
});
