import countBy from 'lodash/countBy';
import flatten from 'lodash/flatten';
import map from 'lodash/map';
import values from 'lodash/values';

import { VoteGame } from 'Entities/VoteGame.entity';

export const getUserAssignedMostQuestions = (game: VoteGame | null) => {
  // Get array of all user IDs that were assigned questions in each round
  const assignedQuestionsUserIds = flatten(
    map(game?.rounds ?? [], (round) => values(round.votes))
  );

  // Count the number of questions assigned to each user
  const mostQuestionsAssigned = countBy(assignedQuestionsUserIds);

  // Find the user who was assigned the most questions
  const user = values(game?.users).find(
    ({ id }) => mostQuestionsAssigned[id] === Math.max(...Object.values(mostQuestionsAssigned))
  );

  // Return an object containing the user and the number of questions they were assigned
  return {
    ...user,
    questionCount: mostQuestionsAssigned[user?.id as any],
  };
};
