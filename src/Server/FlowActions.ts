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


/*
The code snippet defines a module called FlowActions, which contains functions for handling various game actions like starting a new round and updating points in a Flow game.

It imports necessary dependencies like WebSocket, entity classes, and utility functions.

There are two main parts in this module:

actions object: It maps game action types to corresponding handler functions. These functions receive an ActionProps object containing the WebSocket client, the data payload, and the WebSocket server instance. The handler functions return the updated game state or undefined if the action could not be performed.

update function: It is a utility function that updates the client games using the provided WebSocket server instance and the updated game state. If the game state is not provided, it sends an alert message back to the client.

The exported flowActions function receives ActionProps and calls the corresponding action handler function from the actions object. It then returns the updated game state.

In summary, this module handles various game actions, updates the game state accordingly, and synchronizes the state with the clients connected to the WebSocket server.
*/