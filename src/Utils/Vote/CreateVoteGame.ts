import random from 'lodash/random';

import sampleSize from 'lodash/sampleSize';

import { VOTE_QUESTIONS } from 'Constants/VoteQuestions';
import { User } from 'Entities/User.entity';
import { VoteGame } from 'Entities/VoteGame.entity';

type CreateVoteGameProps = {
  host: User;
};

export const createVoteGame = ({ host }: CreateVoteGameProps): VoteGame => {
  const voteGame: VoteGame = {
    type: 'vote',
    id: random(10000, 99999).toString(),
    users: { [host.id]: host },
    hostId: host.id,
    questionList: sampleSize(VOTE_QUESTIONS, 30),
    usedQuestionList: [],
    rounds: [],
    status: 'lobby',
    maxRoundsIndex: 20,
  };

  return voteGame;
};
