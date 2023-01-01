import random from 'lodash/random';

import { VoteGame } from 'Entities/VoteGame.entity';
import { User } from 'Entities/User.entity';

type CreateVoteGameProps = {
  host: User;
};

export const createVoteGame = ({ host }: CreateVoteGameProps): VoteGame => {
  const voteGame: VoteGame = {
    type: 'vote',
    id: random(10000, 99999).toString(),
    users: { [host.id]: host },
    hostId: host.id,
    questionList: [],
    usedQuestionList: [],
    rounds: [],
  };

  return voteGame;
};
