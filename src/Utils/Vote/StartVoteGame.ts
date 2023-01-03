import round from 'lodash/round';

import { Game } from 'Entities/Game.entity';
import { StartVoteGamePayload } from 'Entities/Payloads.entity';
import { VoteGame } from 'Entities/VoteGame.entity';
import { ServerGames } from 'Server/ServerGames';

export const startVoteGame = (payload: StartVoteGamePayload): Game | undefined => {
  const game = ServerGames[payload.gameId] as VoteGame;

  if (game.hostId !== payload.userId) return;
  const question = game.questionList[round(Math.random() * game.questionList.length)];

  // find and delete question from questionList
  const questionIndex = game.questionList.indexOf(question);
  if (questionIndex > -1) game.questionList.splice(questionIndex, 1);

  game.usedQuestionList.push(question);

  game.rounds.push({ question, votes: {}, winners: {} });
  game.status = 'voting';

  return game;
};
