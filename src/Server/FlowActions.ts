import WebSocket, { WebSocketServer } from 'ws';

import { CharlatanGame } from 'Entities/CharlatanGame.entity';
import {
  CastCharlatanVotePayload,
  CreateCharlatanRoundPayload,
  Payload,
  StartCharlatanVotingPayload,
  StartFlowRoundPayload,
  UpdateFlowPointsPayload,
  VoteCharlatanPayload,
} from 'Entities/Payloads.entity';
import { addServerGame } from 'Server/AddServerGame';
import { updateClientGames } from 'Server/UpdateClientGames';
import { FlowGame } from 'Entities/FlowGame.entity';
import { createFlowRound } from 'Utils/Flow/CreateFlowRound';
import { updateFlowPoints } from 'Utils/Flow/UpdateFlowPoints';

type Actions = Payload['action'];

type ActionProps = {
  client: WebSocket;
  data: Payload;
  wss: WebSocket.Server<WebSocket.WebSocket>;
};

type UpdateProps = {
  game: FlowGame | undefined;
  client: WebSocket;
  wss: WebSocket.Server<WebSocket.WebSocket>;
  alert?: string;
};

const actions: Partial<Record<Actions, (props: ActionProps) => FlowGame | undefined>> = {
  startFlowRound: ({ client, data, wss }) => {
    const game = createFlowRound(data as StartFlowRoundPayload);
    update({ game, client, wss, alert: 'New round' });
    return game;
  },

  updateFlowPoints: ({ client, data, wss }) => {
    const game = updateFlowPoints(data as UpdateFlowPointsPayload);
    update({ game, client, wss });
    return game;
  },
};

const update = ({ game, client, wss, alert }: UpdateProps) => {
  if (game) updateClientGames(game, wss.clients);
  else client.send(JSON.stringify({ alert }));
};

export const flowActions = ({ client, data, wss }: ActionProps) => {
  const game = actions[data.action as keyof typeof actions]?.({ client, data, wss });
  return game;
};
