
import keys from 'lodash/keys';
import values from 'lodash/values';
import toPairs from 'lodash/toPairs';
import sortBy from 'lodash/sortBy';
import countBy from 'lodash/countBy';
import flatten from 'lodash/flatten';

import { VoteGame } from "Entities/VoteGame.entity";

export const getUserWhoVotedForThemselvesMost = (game?: VoteGame | null) => {
  // Get array of votes in each round
  const votesArray = (game?.rounds ?? []).map((round) => toPairs(round.votes));

  // Flatten the array of votes and filter for votes where the user voted for themselves
  const selfVotes = flatten(votesArray).filter(([userId, votedForId]) => userId === votedForId);

  console.log({selfVotes});

  // Count the number of self votes for each user
  const selfVotesCount = countBy(selfVotes, ([userId]) => userId);
  
  // Find the user who voted for themselves the most
  return values(game?.users).find(({ id }) => selfVotesCount[id] === Math.max(...Object.values(selfVotesCount)));
};
