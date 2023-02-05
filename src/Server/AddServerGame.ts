
import { HostGamePayload } from 'Entities/Payloads.entity';
import { ServerGames } from 'Server/ServerGames';
import { createCharlatanGame } from 'Utils/Charlatan/CreateCharlatanGame';
import { createDefuseGame } from 'Utils/Defuse/CreateDefuseGame';
import { createVoteGame } from 'Utils/Vote/CreateVoteGame';

export const addServerGame = (hostGamePayload: HostGamePayload) => {
  if (hostGamePayload.type === 'vote') {
    const voteGame = createVoteGame({ host: hostGamePayload.user });
    ServerGames[voteGame.id] = voteGame;

    return voteGame;
  }

  if (hostGamePayload.type === 'defuse') {
    const defuseGame = createDefuseGame({ host: hostGamePayload.user });
    ServerGames[defuseGame.id] = defuseGame;

    return defuseGame;
  }

  if (hostGamePayload.type === 'charlatan') {
    const charlatanGame = createCharlatanGame({ host: hostGamePayload.user });
    ServerGames[charlatanGame.id] = charlatanGame;

    return charlatanGame;
  }
};
