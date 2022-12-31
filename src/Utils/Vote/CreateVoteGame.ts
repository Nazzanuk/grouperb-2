import { v4 as uuidv4 } from 'uuid';

import { VoteGame } from 'Entities/VoteGame.entity';
import { User } from 'Entities/User.entity';

type CreateVoteGameProps = {
  host: User;
};

export const createVoteGame = ({ host }: CreateVoteGameProps): VoteGame => {
  const voteGame: VoteGame = {
    type: 'vote',
    id: uuidv4(),
    users: { [host.id]: host },
    hostId: host.id,
    questionList: [],
    usedQuestionList: [],
    rounds: [],
  };

  return voteGame;
};
