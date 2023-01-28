import sample from 'lodash/sample';

import ordinal from 'ordinal';

import { DefuseRule } from 'Entities/DefuseRule.entity';
import { DefuseWire } from 'Entities/DefuseWire.entity';

export const defuseColors = ['red', 'blue', 'green', 'gold', 'orange', 'purple'] as const;
export const defuseLetters = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
export const defuseIndexes = ['1', '2', '3', '4', '5', '6'] as const;

//this contains the rule type and a template of the rule value, L = letter, C = color, I = index
const ruleTypes = {
  letterBeforeLetter: 'L-L',
  colorBeforeColor: 'C-C',
  letterBeforeColor: 'L-C',
  letterAfterColor: 'L-C',
  // colorBeforeLetter: 'C-L',
  // colorAfterLetter: 'C-L',
  letterAtIndex: 'L-I',
  // letterAfterIndex: 'L-I',
  colorAtIndex: 'C-I',
  // colorBeforeIndex: 'C-I',
  // colorsTogether: 'C',
};

const rules = [
  `letterBeforeLetter|A-B`,
  `colorBeforeColor|red-blue`,
  'letterBeforeColor|A-red',
  'letterAfterColor|A-yellow',
  'colorBeforeLetter|red-A',
  'colorAfterLetter|red-A',
  'letterAtIndex|A-0',
  'letterAfterIndex|A-0',
  'colorAtIndex|red-0',
  'colorBeforeIndex|red-0',
  'colorsTogether|green',
] as DefuseRule[];

const getRuleValues = (ruleValue: string): string[] => {
  const values = ruleValue.split('-');
  return values;
};

const letterBeforeLetter = (ruleValue: string, wires: DefuseWire[]): [string, boolean] => {
  const [letterA, letterB] = getRuleValues(ruleValue);

  const description = `Wire ${letterA} must be cut before wire ${letterB}`;

  if (letterA === letterB) return [description, false];

  const letterAIndex = wires.findIndex((wire) => wire.letter === letterA);
  const letterBIndex = wires.findIndex((wire) => wire.letter === letterB);

  if (letterAIndex === -1 || letterBIndex === -1) return [description, false];
  return [description, letterAIndex < letterBIndex];
};

const colorBeforeColor = (ruleValue: string, wires: DefuseWire[]): [string, boolean] => {
  const [colorA, colorB] = getRuleValues(ruleValue);
  let [colorAIndex, colorBIndex] = [-1, -1];

  const description = `All ${colorA} wires must be cut before any ${colorB} wires`;

  wires.forEach(({ color }, i) => {
    if (color === colorA) colorAIndex = i;
    if (color === colorB && colorAIndex < i) colorBIndex = i;
  });

  if (colorAIndex === -1 || colorBIndex === -1) return [description, false];

  return [description, colorAIndex < colorBIndex];
};

const letterBeforeColor = (ruleValue: string, wires: DefuseWire[]): [string, boolean] => {
  const [letter, color] = getRuleValues(ruleValue);
  let [letterIndex, colorIndex] = [-1, -1];

  const description = `Wire ${letter} must be cut before any ${color} wires`;

  [...wires].reverse().forEach(({ letter: l, color: c }, i) => {
    if (l === letter) letterIndex = i;
    if (c === color) colorIndex = i;
  });

  if (letterIndex === -1 || colorIndex === -1) return [description, false];

  return [description, letterIndex > colorIndex];
};

const letterAfterColor = (ruleValue: string, wires: DefuseWire[]): [string, boolean] => {
  const [letter, color] = getRuleValues(ruleValue);
  let [letterIndex, colorIndex] = [-1, -1];

  const description = `Wire ${letter} must be cut after any ${color} wires`;

  wires.forEach(({ letter: l, color: c }, i) => {
    if (c === color) colorIndex = i;
    if (l === letter) letterIndex = i;
  });

  if (letterIndex === -1 || colorIndex === -1) return [description, false];

  return [description, letterIndex > colorIndex];
};

const colorBeforeLetter = (ruleValue: string, wires: DefuseWire[]): [string, boolean] => {
  const [color, letter] = getRuleValues(ruleValue);
  let [colorIndex, letterIndex] = [-1, -1];

  const description = `All ${color} wires must be cut before wire ${letter}`;

  wires.forEach(({ letter: l, color: c }, i) => {
    if (c === color) colorIndex = i;
    if (l === letter && colorIndex < i) letterIndex = i;
  });

  return [description, colorIndex < letterIndex || colorIndex === -1 || letterIndex === -1];
};

const letterAtIndex = (ruleValue: string, wires: DefuseWire[]): [string, boolean] => {
  const [letter, index] = getRuleValues(ruleValue);

  const description = `Wire ${letter} must be cut ${ordinal(Number(index))}`;

  const letterIndex = wires.findIndex((wire) => wire.letter === letter) + 1;

  letterIndex;

  if (letterIndex === 0) return [description, false];
  return [description, letterIndex == parseInt(index, 10)];
};

const colorAtIndex = (ruleValue: string, wires: DefuseWire[]): [string, boolean] => {
  const [color, index] = getRuleValues(ruleValue);

  const description = `A ${color} wire must be cut ${ordinal(Number(index))}`;

  const colorIndex = wires.findIndex((wire) => wire.color === color) + 1;

  if (colorIndex === 0) return [description, false];
  return [description, colorIndex === parseInt(index, 10)];
};

const colorBeforeIndex = (ruleValue: string, wires: DefuseWire[]): [string, boolean] => {
  const [color, index] = getRuleValues(ruleValue);
  let colorIndex = -1;

  const description = `All ${color} wires must be cut before the ${ordinal(Number(index))} wire`;

  wires.forEach(({ color: c }, i) => {
    if (c === color) colorIndex = i + 1;
  });

  return [description, colorIndex < parseInt(index, 10) || colorIndex === -1];
};

const colorAfterLetter = (ruleValue: string, wires: DefuseWire[]): [string, boolean] => {
  const [color, letter] = getRuleValues(ruleValue);
  let [colorIndex, letterIndex] = [-1, -1];

  const description = `All ${color} wires must be cut after wire ${letter}`;

  wires.forEach(({ letter: l, color: c }, i) => {
    if (l === letter) letterIndex = i;
    if (c === color && letterIndex < i) colorIndex = i;
  });

  return [description, colorIndex > letterIndex || colorIndex === -1 || letterIndex === -1];
};

const letterAfterIndex = (ruleValue: string, wires: DefuseWire[]): [string, boolean] => {
  const [letter, index] = getRuleValues(ruleValue);

  letter;

  const description = `Wire ${letter} must be cut after the ${ordinal(Number(index))} wire`;

  const firstLetterIndex = wires.findIndex((wire) => wire.letter === letter) + 1;

  firstLetterIndex;
  index;

  if (firstLetterIndex <= 0) return [description, false];
  if (firstLetterIndex > parseInt(index, 10)) return [description, true];

  return [description, firstLetterIndex === -1];
};

const colorsTogether = (ruleValue: string, wires: DefuseWire[]): [string, boolean] => {
  const [color] = getRuleValues(ruleValue);

  const description = `All ${color} wires must be next to each other`;

  const colorWireIndexes = wires.reduce((acc, wire, index) => {
    if (wire.color === color) acc.push(index);
    return acc;
  }, [] as number[]);

  if (colorWireIndexes.length < 2) return [description, false];

  return [description, colorWireIndexes.every((index, i) => i === 0 || index - 1 === colorWireIndexes[i - 1])];
};

const w = [
  { color: 'blue', letter: 'B' },
  { color: 'purple', letter: 'C' },
  { color: 'orange', letter: 'E' },
  { color: 'blue', letter: 'D' },
  { color: 'gold', letter: 'F' },
  { color: 'orange', letter: 'A' },
];

const ruleMap = {
  letterBeforeLetter,
  colorBeforeColor,
  letterBeforeColor,
  letterAfterColor,
  colorBeforeLetter,
  letterAtIndex,
  colorAtIndex,
  colorBeforeIndex,
  colorsTogether,
  colorAfterLetter,
  letterAfterIndex,
};

export const checkDefuseRule = (rule: DefuseRule, wires: DefuseWire[]): [string, boolean] => {
  const [ruleType, ruleValue] = rule.split('|');

  // console.log({
  //   ruleType,
  //   ruleValue,
  // });

  const result = ruleMap[ruleType as keyof typeof ruleMap](ruleValue, wires);

  if (result) return result;

  return ['Unknown rule argh', true];
};

const result = checkDefuseRule('letterAtIndex|A-6', w);
result;

// generate rules as codes
export const generateRule = (): DefuseRule => {
  const ruleType = sample(Object.keys(ruleTypes))!;

  console.log({
    ruleType,
    // ruleTypes,
  });

  ruleType;
  ruleTypes[ruleType];

  const value = ruleTypes[ruleType]
    .replace(/C/, sample(defuseColors)!)
    .replace(/C/, sample(defuseColors)!)
    .replace(/L/, sample(defuseLetters)!)
    .replace(/L/, sample(defuseLetters)!)
    .replace(/I/, sample(defuseIndexes)!)
    .replace(/I/, sample(defuseIndexes)!);

  return `${ruleType}|${value}` as DefuseRule;
};

const rule = generateRule();

rule;

defuseLetters;
defuseColors;
defuseIndexes;
