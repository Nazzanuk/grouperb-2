import { Payload } from 'Entities/Payloads.entity';
import { Server } from 'http';
import { addServerGame } from 'Server/AddServerGame';
import { ServerUsers } from 'Server/ServerUsers';
import { v4 as uuidv4 } from 'uuid';
import WebSocket, { WebSocketServer } from 'ws';
import type { NextApiRequest, NextApiResponse } from 'next';

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
      console.log('connected', { client });

      wss.clients.forEach((client: Client) => console.log('Client.ID: ' + client.id));

      client.on('message', (json: string) => {
        const data: Payload = JSON.parse(json);
        console.log('received: ', data);
        client.send(JSON.stringify({ info: 'hello client from the server' }));

        if (data.action === 'updateUser') {
          ServerUsers[data.user.id] = data.user;
          client.id = data.user.id;
        }

        if (data.action === 'hostGame') {
          const game = addServerGame(data);

          if (game) client.send(JSON.stringify({ game }));
        }
      });
    });
  }
  res.end();
};

export default SocketHandler;
