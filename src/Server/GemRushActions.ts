
import WebSocket, { WebSocketServer } from 'ws';

import {
  CreateGemRushRoundPayload,
  Payload,
  SelectGemRushCardPayload,
  SelectGemRushGemPayload,
} from 'Entities/Payloads.entity';

import { updateClientGames } from 'Server/UpdateClientGames';
import { GemRushGame } from 'Entities/GemRushGame.entity';
import { createGemRushRound } from 'Utils/GemRush/CreateGemRushRound';
import { selectGemRushCard } from 'Utils/GemRush/SelectGemRushCard';
import { selectGemRushGem } from 'Utils/GemRush/SelectGemRushGem';

type Actions = Payload['action'];

type ActionProps = {
  client: WebSocket;
  data: Payload;
  wss: WebSocket.Server<WebSocket.WebSocket>;
};

type UpdateProps = {
  game: GemRushGame | undefined;
  client: WebSocket;
  wss: WebSocket.Server<WebSocket.WebSocket>;
  alert?: string;
};

const actions: Partial<Record<Actions, (props: ActionProps) => GemRushGame | undefined>> = {
  createGemRushRound: ({ client, data, wss }) => {
    const game = createGemRushRound(data as CreateGemRushRoundPayload);
    update({ game, client, wss, alert: 'New round' });
    return game;
  },

  selectGemRushCard: ({ client, data, wss }) => {
    const game = selectGemRushCard(data as SelectGemRushCardPayload);
    update({ game, client, wss, alert: 'New round' });
    return game;
  },

  selectGemRushGem: ({ client, data, wss }) => {
    const game = selectGemRushGem(data as SelectGemRushGemPayload);
    update({ game, client, wss, alert: 'New round' });
    return game;
  },
  
};

const update = ({ game, client, wss, alert }: UpdateProps) => {
  if (game) updateClientGames(game, wss.clients);
  else client.send(JSON.stringify({ alert }));
};

export const gemRushActions = ({ client, data, wss }: ActionProps) => {
  const game = actions[data.action as keyof typeof actions]?.({ client, data, wss });
  return game;
};