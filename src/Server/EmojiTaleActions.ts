
import WebSocket, { WebSocketServer } from 'ws';

import {
  CreateEmojiTaleRoundPayload,
  Payload,
  SelectEmojiTaleCardPayload,
  SelectEmojiTaleGemPayload,
} from 'Entities/Payloads.entity';

import { updateClientGames } from 'Server/UpdateClientGames';
import { EmojiTaleGame } from 'Entities/EmojiTaleGame.entity';
import { createEmojiTaleRound } from 'Utils/EmojiTale/CreateEmojiTaleRound';

type Actions = Payload['action'];

type ActionProps = {
  client: WebSocket;
  data: Payload;
  wss: WebSocket.Server<WebSocket.WebSocket>;
};

type UpdateProps = {
  game: EmojiTaleGame | undefined;
  client: WebSocket;
  wss: WebSocket.Server<WebSocket.WebSocket>;
  alert?: string;
};

const actions: Partial<Record<Actions, (props: ActionProps) => EmojiTaleGame | undefined>> = {
  createEmojiTaleRound: ({ client, data, wss }) => {
    const game = createEmojiTaleRound(data as CreateEmojiTaleRoundPayload);
    update({ game, client, wss, alert: 'New round' });
    return game;
  },
};

const update = ({ game, client, wss, alert }: UpdateProps) => {
  if (game) updateClientGames(game, wss.clients);
  else client.send(JSON.stringify({ alert }));
};

export const emojiTaleActions = ({ client, data, wss }: ActionProps) => {
  const game = actions[data.action as keyof typeof actions]?.({ client, data, wss });
  return game;
};