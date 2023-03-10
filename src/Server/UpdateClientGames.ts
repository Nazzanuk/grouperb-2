import WebSocket, { WebSocketServer } from 'ws';

import { Game } from 'Entities/Game.entity';

type Client = WebSocket.WebSocket & { id?: string };

export const updateClientGames = (game: Game, clients: Set<WebSocket>, object?: Record<string, any>): Game => {
  // Use Object.values to get an array of the values in the users object
  const users = Object.values(game.users);

  const allIds = Array.from(clients).map((client: Client) => client?.id);
  console.log({ allIds });

  // Iterate over the array of users
  users.forEach((user) => {
    Array.from(clients).forEach((client: Client) => {
      if (client.id === user.id) {
        client.send(JSON.stringify({ game, ...object }));
        console.log('SERVER SENT TO CLIENT: ', client?.id);
      }
    });
  });

  return game;
};
