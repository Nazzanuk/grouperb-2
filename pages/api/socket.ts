import { Server } from 'http';

import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

import WebSocket, { WebSocketServer } from 'ws';

import { Payload } from 'Entities/Payloads.entity';
import { addServerGame } from 'Server/AddServerGame';
import { joinGame } from 'Server/JoinGame';
import { ServerGames } from 'Server/ServerGames';
import { ServerUsers } from 'Server/ServerUsers';

import { updateClientGames } from 'Server/UpdateClientGames';
import { leaveGame } from 'Utils/Vote/LeaveGame';

type Client = WebSocket.WebSocket & { id?: string };

const SocketHandler = (req: NextApiRequest, res: NextApiResponse<any>) => {
  if (res.socket!.server!.wss) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');

    const server: Server = res.socket.server;
    const wss = new WebSocketServer({ noServer: true });
    res.socket.server.wss = wss;

    console.log('connected');

    server.on('upgrade', (req, socket, head) => {
      if (!req.url!.includes('/_next/webpack-hmr')) {
        wss.handleUpgrade(req, socket, head, (ws) => wss.emit('connection', ws, req));
      }
    });

    wss.on('connection', (client: Client) => {
      console.log('connected', { clientId: client.id });

      wss.clients.forEach((c: Client) => {
        if (c.id && c.id === client.id) {
          c.close();
        }
      });

      wss.clients.forEach((client: Client) => console.log('ClientId: ' + client.id));

      client.on('message', (json: string) => {
        const data: Payload = JSON.parse(json);
        console.log('SERVER RECIEVED: ', data);
        client.send(JSON.stringify({ info: 'server confirmed payload', data }));

        if (data.action === 'updateUser') {
          console.log('???');
          ServerUsers[data.user.id] = data.user;
          client.id = data.user.id;

          // console.log(client);
          console.log({ ServerUsers });
        }

        if (data.action === 'hostGame') {
          const game = addServerGame(data);

          if (game) updateClientGames(game, wss.clients);

          console.log({ data, game });
        }

        if (data.action === 'joinGame') {
          const game = joinGame(data);

          if (game) updateClientGames(game, wss.clients);

          console.log({ data, game });
        }

        if (data.action === 'getGame') {
          const game = ServerGames[data.gameId];

          if (game) client.send(JSON.stringify({ game }));

          console.log({ data, game });
        }

        if (data.action === 'leaveGame') {
          const game = leaveGame(data);

          if (game) updateClientGames(game, wss.clients);
          
          console.log({ data, game });
        }
      });
    });
  }
  res.end();
};

export default SocketHandler;
