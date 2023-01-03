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
import { startVoteGame } from 'Utils/Vote/StartVoteGame';
import { send } from 'process';
import { castVote } from 'Utils/Vote/CastVote';
import { startVoteRound } from 'Utils/Vote/StartVoteRound';

function heartbeat() {
  this.isAlive = true;
}

type Client = WebSocket.WebSocket & { id?: string; isAlive?: boolean };

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
      // client.isAlive = true;
      // client.on('pong', heartbeat);

      // const interval = setInterval(function ping() {
      //   (wss.clients as Client[]).forEach(function each(client) {
      //     if (client.isAlive === false) return client.terminate();

      //     client.isAlive = false;
      //     client.ping();
      //   });
      // }, 2000);

      // wss.on('close', function close() {
      //   clearInterval(interval);
      // });

      console.log('connected', { clientId: client.id });

      const allIds = Array.from(wss.clients).map((client: Client) => client?.id);
      console.log({ allIds });

      client.on('message', (json: string) => {
        const data: Payload = JSON.parse(json);
        console.log('SERVER RECIEVED: ', data);
        client.send(JSON.stringify({ info: `server confirmed: ${data.action}`, data }));

        if (data.action === 'updateUser') {
          console.log('???');
          ServerUsers[data.user.id] = data.user;

          // wss.clients.forEach((existingClient: Client) => {
          //   if (!client.id && existingClient.id && existingClient.id === data.user.id) {
          //     existingClient.close();
          //   }
          // });

          client.id = data.user.id;

          // console.log(client);
          console.log({ ServerUsers });
        }

        if (data.action === 'hostGame') {
          const game = addServerGame(data);

          if (game) updateClientGames(game, wss.clients);
          else client.send(JSON.stringify({ alert: 'Error creating game' }));

          // console.log({ data, game });
        }

        if (data.action === 'joinGame') {
          const game = joinGame(data);

          if (game) updateClientGames(game, wss.clients);
          else client.send(JSON.stringify({ alert: 'Error joining game' }));

          // console.log({ data, game });
        }

        if (data.action === 'getGame') {
          const game = ServerGames[data.gameId];

          if (game) client.send(JSON.stringify({ game }));
          else client.send(JSON.stringify({ alert: 'Error getting game' }));

          // console.log({ data, game });
        }

        if (data.action === 'leaveGame') {
          const game = leaveGame(data);

          if (game) updateClientGames(game, wss.clients);
          else client.send(JSON.stringify({ alert: 'Error leaving game' }));

          // console.log({ data, game });
        }

        if (data.action === 'startVoteGame') {
          const game = startVoteGame(data);

          if (game) updateClientGames(game, wss.clients);
          else client.send(JSON.stringify({ alert: 'Error starting game' }));

          // console.log({ data, game });
        }

        if (data.action === 'castVote') {
          const game = castVote(data);

          if (game) updateClientGames(game, wss.clients);
          else client.send(JSON.stringify({ alert: 'Error voting' }));

          // console.log({ data, game });
        }

        if (data.action === 'startVoteRound') {
          const game = startVoteRound(data);

          if (game) updateClientGames(game, wss.clients);
          else client.send(JSON.stringify({ alert: 'Error starting new round' }));

          // console.log({ data, game });
        }
      });
    });
  }
  res.end();
};

export default SocketHandler;
