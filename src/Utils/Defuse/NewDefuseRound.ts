import sample from 'lodash/sample';
import shuffle from 'lodash/shuffle';
import times from 'lodash/times';

import { DefuseGame } from 'Entities/DefuseGame.entity';
import { DefuseRound } from 'Entities/DefuseRound.entity';
import { DefuseRule } from 'Entities/DefuseRule.entity';
import { DefuseWire } from 'Entities/DefuseWire.entity';
import { StartDefuseRoundPayload } from 'Entities/Payloads.entity';

import { ServerGames } from 'Server/ServerGames';

import { checkDefuseRule, defuseColors, generateRule } from 'Utils/Defuse/Defuse.utils';

export const newDefuseRound = (payload: StartDefuseRoundPayload): DefuseGame | undefined => {
  const game = ServerGames[payload.gameId] as DefuseGame;
  const wires: DefuseWire[] = shuffle(
    times(6, (i) => ({ color: sample(defuseColors)!, letter: String.fromCharCode(65 + i) })),
  ).map((wire, i) => ({
    ...wire,
    index: i,
  }));

  const rules: DefuseRule[] = [];

  while (rules.length < game.rounds.length + 1) {
    const newRule = generateRule();
    console.log({ newRule, wires }, checkDefuseRule(newRule, wires));

    if (rules.includes(newRule)) continue;
    if (!checkDefuseRule(newRule, wires)[1]) continue;
    
    rules.push(newRule);
  }

  const roundsIndex = game.rounds.length;

  const round: DefuseRound = { wires, cutWires: [], rules, timeStarted: new Date().toISOString(), duration: roundsIndex * 10 + 20  };

  game.rounds.push(round);
  game.status = 'playing';

  return game;
};
