import sample from 'lodash/sample';
import shuffle from 'lodash/shuffle';
import times from 'lodash/times';

import { DefuseGame } from 'Entities/DefuseGame.entity';
import { DefuseRound } from 'Entities/DefuseRound.entity';
import { StartDefuseRoundPayload } from 'Entities/Payloads.entity';

import { ServerGames } from 'Server/ServerGames';

import { checkDefuseRule, defuseColors, generateRule } from 'Utils/Defuse/Defuse.utils';
import { DefuseWire } from 'Entities/DefuseWire.entity';

export const newDefuseRound = (payload: StartDefuseRoundPayload): DefuseGame | undefined => {
  const game = ServerGames[payload.gameId] as DefuseGame;
  const wires: DefuseWire[] = shuffle(
    times(6, (i) => ({ color: sample(defuseColors)!, letter: String.fromCharCode(65 + i) })),
  ).map((wire, i) => ({
    ...wire,
    index: i,
  }));

  const rules = [];

  while (rules.length < game.rounds.length + 1) {
    const newRule = generateRule();
    console.log({ newRule, wires }, checkDefuseRule(newRule, wires));
    if (!!checkDefuseRule(newRule, wires)[1]) {
      rules.push(newRule);
    }
  }

  const round: DefuseRound = { wires, cutWires: [], rules };

  game.rounds.push(round);
  game.status = 'playing';

  return game;
};
