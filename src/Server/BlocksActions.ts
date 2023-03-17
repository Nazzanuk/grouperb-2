import WebSocket, { WebSocketServer } from 'ws';

import { BlocksGame } from 'Entities/BlocksGame.entity';
import {AddBlocksScorePayload, EndBlocksRoundPayload, NewBlocksGamePayload, Payload
} from 'Entities/Payloads.entity';
import { updateClientGames } from 'Server/UpdateClientGames';
import { createBlocksRound } from 'Utils/Blocks/CreateBlocksRound';
import { addBlock } from 'Utils/Blocks/AddBlock';
import { removeBlock } from 'Utils/Blocks/RemoveBlock';
import { clearBlocks } from 'Utils/Blocks/ClearBlocks';
import { endBlocksRound } from 'Utils/Blocks/EndBlocksRound';
import { newBlocksGame } from 'Utils/Blocks/NewBlocksGame';
import { addBlocksScore } from 'Utils/Blocks/AddBlocksScore';

type Actions = Payload['action'];

type ActionProps = {
  client: WebSocket;
  data: Payload;
  wss: WebSocket.Server<WebSocket.WebSocket>;
};

type UpdateProps = {
  game: BlocksGame | undefined;
  client: WebSocket;
  wss: WebSocket.Server<WebSocket.WebSocket>;
  alert?: string;
};

const actions: Partial<Record<Actions, (props: ActionProps) => BlocksGame | undefined>> = {
  newBlocksGame: ({ client, data, wss }) => {
    const game = newBlocksGame(data as NewBlocksGamePayload);
    update({ game, client, wss });
    return game;
  },
  createBlocksRound: ({ client, data, wss }) => {
    const game = createBlocksRound(data as CastBlocksVotePayload);
    update({ game, client, wss, alert: 'New round!' });
    return game;
  },
  addBlock: ({ client, data, wss }) => {
    const game = addBlock(data as CastBlocksVotePayload);
    update({ game, client, wss });
    return game;
  },
  removeBlock: ({ client, data, wss }) => {
    const game = removeBlock(data as CastBlocksVotePayload);
    update({ game, client, wss });
    return game;
  },
  clearBlocks: ({ client, data, wss }) => {
    const game = clearBlocks(data as CastBlocksVotePayload);
    update({ game, client, wss });
    return game;
  },
  endBlocksRound: ({ client, data, wss }) => {
    const game = endBlocksRound(data as EndBlocksRoundPayload);
    update({ game, client, wss });
    return game;
  },
  addBlocksScore: ({ client, data, wss }) => {
    const game = addBlocksScore(data as AddBlocksScorePayload);
    update({ game, client, wss });
    return game;
  },
};

const update = ({ game, client, wss, alert }: UpdateProps) => {
  if (game) updateClientGames(game, wss.clients);
  else client.send(JSON.stringify({ alert }));
};

export const blocksActions = ({ client, data, wss }: ActionProps) => {
  const game = actions[data.action as keyof typeof actions]?.({ client, data, wss });
  return game;
};
