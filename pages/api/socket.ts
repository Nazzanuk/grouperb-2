import { Server } from 'http';

import { send } from 'process';

import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

import WebSocket, { WebSocketServer } from 'ws';

import { DefuseGame } from 'Entities/DefuseGame.entity';
import { Payload } from 'Entities/Payloads.entity';
import { addServerGame } from 'Server/AddServerGame';
import { charlatanActions } from 'Server/CharlatanActions';
import { joinGame } from 'Server/JoinGame';
import { ServerGames } from 'Server/ServerGames';
import { ServerUsers } from 'Server/ServerUsers';

import { updateClientGames } from 'Server/UpdateClientGames';
import { chooseDefuseWire } from 'Utils/Defuse/ChooseDefuseWire';
import { createDefuseGame } from 'Utils/Defuse/CreateDefuseGame';
import { newDefuseRound } from 'Utils/Defuse/NewDefuseRound';
import { castVote } from 'Utils/Vote/CastVote';
import { leaveGame } from 'Utils/Vote/LeaveGame';
import { startVoteGame } from 'Utils/Vote/StartVoteGame';
import { startVoteRound } from 'Utils/Vote/StartVoteRound';
import { blocksActions } from 'Server/BlocksActions';
import { flowActions } from 'Server/FlowActions';

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
          ServerUsers[data.user.id] = data.user;

          // wss.clients.forEach((existingClient: Client) => {
          //   if (!client.id && existingClient.id && existingClient.id === data.user.id) {
          //     existingClient.close();
          //   }
          // });

          client.id = data.user.id;

          // console.log(client);
          // console.log({ ServerUsers });
        }

        blocksActions({ client, data, wss });
        charlatanActions({ client, data, wss });
        flowActions({ client, data, wss });

        if (data.action === 'hostGame') {
          const game = addServerGame(data);

          if (game) updateClientGames(game, wss.clients);
          else client.send(JSON.stringify({ alert: 'Error creating game' }));
        }

        if (data.action === 'joinGame') {
          const game = joinGame(data);

          console.log('joinGame...', { game });
          if (game) {
            client.send(JSON.stringify({ game }));
            // updateClientGames(game, wss.clients);
            updateClientGames(game, wss.clients, {
              alert: `${data.user.username} joined the game`,
            });
          } else client.send(JSON.stringify({ alert: 'Error joining game' }));

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

          if (game) {
            updateClientGames(game, wss.clients);
            // updateClientGames(game, wss.clients, {
            //   alert: `${game.users[data.userId].username} left the game`,
            // });
          } else client.send(JSON.stringify({ alert: 'Error leaving game' }));

          // console.log({ data, game });
        }

        if (data.action === 'startVoteGame') {
          const game = startVoteGame(data);

          // if (game) updateClientGames(game, wss.clients);
          if (game) updateClientGames(game, wss.clients, { alert: `Game started!` });
          else client.send(JSON.stringify({ alert: 'Error starting game' }));

          // console.log({ data, game });
        }

        if (data.action === 'startDefuseRound') {
          const game = newDefuseRound(data);

          // if (game) updateClientGames(game, wss.clients);
          if (game) updateClientGames(game, wss.clients, { alert: `Game started!` });
          else client.send(JSON.stringify({ alert: 'Error starting game' }));
        }

        if (data.action === 'castVote') {
          const game = castVote(data);

          if (game) {
            // updateClientGames(game, wss.clients);
            updateClientGames(game, wss.clients, {
              alert: `${game.users[data.userId].username} voted`,
            });
          } else {
            client.send(JSON.stringify({ alert: 'Error voting' }));
          }

          // console.log({ data, game });
        }

        if (data.action === 'startVoteRound') {
          const game = startVoteRound(data);

          if (game) updateClientGames(game, wss.clients);
          else client.send(JSON.stringify({ alert: 'Error starting new round' }));

          // console.log({ data, game });
        }

        if (data.action === 'chooseDefuseWire') {
          const game = chooseDefuseWire(data);

          // if (game) updateClientGames(game, wss.clients);
          if (game) {
            const user = game.users[data.userId];
            updateClientGames(game, wss.clients, { alert: `${user.username} cut wire ${data.letter}` });
          } else client.send(JSON.stringify({ alert: 'Error starting new round' }));

          // console.log({ data, game });
        }

        if (data.action === 'restartDefuseGame') {
          const prevGame = ServerGames[data.gameId];

          const game = createDefuseGame({ host: prevGame.users[prevGame.hostId], id: data.gameId });
          game.users = prevGame.users;

          ServerGames[data.gameId] = game;

          if (game) updateClientGames(game, wss.clients, { alert: `Game restarted!` });
          else client.send(JSON.stringify({ alert: 'Error restarting game' }));
        }

        if (data.action === 'defuseTimeUp') {
          const game = ServerGames[data.gameId] as DefuseGame;
          game.status = 'failed';

          if (game) updateClientGames(game, wss.clients, { alert: `Time is up!` });
          else client.send(JSON.stringify({ alert: 'Error doing time upe' }));
        }
      });
    });
  }
  res.end();
};

export default SocketHandler;
