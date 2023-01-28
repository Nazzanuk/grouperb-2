import { DefuseGame } from 'Entities/DefuseGame.entity';
import { ChooseDefuseWire } from 'Entities/Payloads.entity';
import { ServerGames } from 'Server/ServerGames';
import { checkDefuseRule } from 'Utils/Defuse/Defuse.utils';

export const chooseDefuseWire = (payload: ChooseDefuseWire): DefuseGame | undefined => {
  const game = ServerGames[payload.gameId] as DefuseGame;
  if (!game) return;

  const { letter, gameId, userId } = payload;
  const round = game.rounds[game.rounds.length - 1];

  const wires = round.wires;
  const cutWires = round.cutWires;
  const rules = round.rules;
  let cutWiresWires = round.cutWires.map(([userId, wire]) => wire);
  const wire = wires.find((wire) => wire.letter === letter);
  if (!wire) return;

  if (cutWiresWires.map((wire) => wire.letter).includes(letter)) return game;

  cutWires.push([userId, wire]);
  cutWiresWires = round.cutWires.map(([userId, wire]) => wire);

  const areAllRulesPassed = rules.every((rule) => checkDefuseRule(rule, cutWiresWires)[1]);
  if (areAllRulesPassed && cutWiresWires.length === 6) game.status = 'defused';
  if (!areAllRulesPassed && cutWiresWires.length === 6) game.status = 'failed';

  console.log('check', areAllRulesPassed, cutWiresWires.length);

  return game;
};
