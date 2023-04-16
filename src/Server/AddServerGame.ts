
import { Circles3dGame } from 'Entities/Circles3d.class';
import { HostGamePayload } from 'Entities/Payloads.entity';
import { ServerGames } from 'Server/ServerGames';
import { createBlocksGame } from 'Utils/Blocks/CreateBlocksGame';
import { createCharlatanGame } from 'Utils/Charlatan/CreateCharlatanGame';
import { createDefuseGame } from 'Utils/Defuse/CreateDefuseGame';
import { createEmojiTaleGame } from 'Utils/EmojiTale/CreateEmojiTaleGame';
import { createFlowGame } from 'Utils/Flow/CreateFlowGame';
import { createGemRushGame } from 'Utils/GemRush/CreateGemRushGame';
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

  if (hostGamePayload.type === 'blocks') {
    const blocksGame = createBlocksGame({ host: hostGamePayload.user });
    ServerGames[blocksGame.id] = blocksGame;

    return blocksGame;
  }

  if (hostGamePayload.type === 'flow') {
    const game = createFlowGame({ host: hostGamePayload.user });
    ServerGames[game.id] = game;

    return game;
  }

  if (hostGamePayload.type === 'gemRush') {
    const game = createGemRushGame({ host: hostGamePayload.user });
    ServerGames[game.id] = game;

    return game;
  }

  if (hostGamePayload.type === 'emojiTale') {
    const game = createEmojiTaleGame({ host: hostGamePayload.user });
    ServerGames[game.id] = game;

    return game;
  }

  if (hostGamePayload.type === 'circles3d') {
    const game = new Circles3dGame(hostGamePayload.user);
    ServerGames[game.id] = game;

    return game;
  }
};
