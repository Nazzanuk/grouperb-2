import WebSocket, { WebSocketServer } from 'ws';

import { CharlatanGame } from 'Entities/CharlatanGame.entity';
import { CastCharlatanVotePayload, CreateCharlatanRoundPayload, Payload } from 'Entities/Payloads.entity';
import { addServerGame } from 'Server/AddServerGame';
import { updateClientGames } from 'Server/UpdateClientGames';
import { castCharlatanVote } from 'Utils/Charlatan/CastCharlatanVote';
import { createCharlatanRound } from 'Utils/Charlatan/CreateCharlatanRound';

type Actions = Payload['action'];

type ActionProps = {
  client: WebSocket;
  data: Payload;
  wss: WebSocket.Server<WebSocket.WebSocket>;
};

type UpdateProps = {
  game: CharlatanGame | undefined;
  client: WebSocket;
  wss: WebSocket.Server<WebSocket.WebSocket>;
  alert?: string;
};

const actions: Partial<Record<Actions, (props: ActionProps) => CharlatanGame | undefined>> = {
  castCharlatanVote: ({ client, data, wss }) => {
    const game = castCharlatanVote(data as CastCharlatanVotePayload);
    update({ game, client, wss, alert: 'Voted!' });
    return game;
  },
  createCharlatanRound: ({ client, data, wss }) => {
    const game = createCharlatanRound(data as CreateCharlatanRoundPayload);
    update({ game, client, wss, alert: 'New round' });
    return game;
  },
};

const update = ({ game, client, wss, alert }: UpdateProps) => {
  if (game) updateClientGames(game, wss.clients);
  else client.send(JSON.stringify({ alert }));
};

export const charlatanActions = ({ client, data, wss }: ActionProps) => {
  const game = actions[data.action as keyof typeof actions]?.({ client, data, wss });
  return game;
};
