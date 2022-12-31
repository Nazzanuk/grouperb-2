import { HostGamePayload } from 'Entities/Payloads.entity';
import { ServerGames } from 'Server/ServerGames';
import { createVoteGame } from 'Utils/Vote/CreateVoteGame';

export const addServerGame = (hostGamePayload: HostGamePayload) => {
  if (hostGamePayload.type === 'vote') {
    const voteGame = createVoteGame({ host: hostGamePayload.user });

    ServerGames[voteGame.id] = voteGame;

    return voteGame;
  }
};
