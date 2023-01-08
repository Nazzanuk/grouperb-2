import round from 'lodash/round';

import { Game } from 'Entities/Game.entity';
import { StartVoteRoundPayload } from 'Entities/Payloads.entity';
import { VoteGame } from 'Entities/VoteGame.entity';
import { ServerGames } from 'Server/ServerGames';

export const startVoteRound = (payload: StartVoteRoundPayload): Game | undefined => {
  const game = ServerGames[payload.gameId] as VoteGame;

  const currentRoundHasWinner = !!Object.values(
    game.rounds?.[game.rounds.length - 1]?.winners ?? {},
  ).length;
  if (!currentRoundHasWinner) return;

  const question = game.questionList[round(Math.random() * game.questionList.length)];
  game.usedQuestionList.push(question);

  // find and delete question from questionList
  const questionIndex = game.questionList.indexOf(question);
  if (questionIndex > -1) game.questionList.splice(questionIndex, 1);


  game.rounds.push({ question, votes: {}, winners: {} });
  game.status = 'voting';

  //check if game is finished
  if (game.rounds.length > game.maxRoundsIndex) {
    game.status = 'finished';
    return game;
  }

  return game;
};
