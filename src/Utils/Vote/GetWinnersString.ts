import { User } from 'Entities/User.entity';
import { VoteGame } from 'Entities/VoteGame.entity';
import values from 'lodash/values';

export const getWinnersString = (game: VoteGame | null, user: User) => {
  const currentRound = game?.rounds[game?.rounds.length - 1];
  if (!currentRound) return '';

  const winnersArray = values(currentRound?.winners ?? {});

  return winnersArray
    .map((winner) => winner.username)
    .reduce((acc, name, index, array) => {
      if (index === 0) {
        return name === user.username ? 'You!' : name;
      } else if (index === array.length - 1) {
        return `${acc} and ${name}`;
      } else {
        return `${acc}, ${name}`;
      }
    }, '');
};
