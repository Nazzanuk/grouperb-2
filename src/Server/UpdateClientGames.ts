import WebSocket, { WebSocketServer } from 'ws';

import { Game } from 'Entities/Game.entity';

type Client = WebSocket.WebSocket & { id?: string };

export const updateClientGames = (game: Game, clients: Client[]): Game => {
  // Use Object.values to get an array of the values in the users object
  const users = Object.values(game.users);

  // Iterate over the array of users
  users.forEach((user) => {
    const client = Array.from(clients).find((client) => client.id === user.id);
    if (client) {
      client.send(JSON.stringify({game}));

      console.log('SERVER SENT TO CLIENT: ', client);
    }
  });

  return game;
};
