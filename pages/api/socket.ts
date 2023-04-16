import { Server } from 'http';

import { send } from 'process';

import type { NextApiRequest, NextApiResponse } from 'next';

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
import { gemRushActions } from 'Server/GemRushActions';
import { emojiTaleActions } from 'Server/EmojiTaleActions';
import { Circles3dGame } from 'Entities/Circles3d.class';

type Client = WebSocket & { id?: string; isAlive?: boolean };

const logger = (level: 'info' | 'error', message: string, ...args: any[]) => {
  console[level](`[${level.toUpperCase()}] ${message}`, ...args);
};

const safeJSONParse = <T>(json: string): { data?: T; error?: Error } => {
  try {
    const data: T = JSON.parse(json);
    return { data };
  } catch (error) {
    return { error };
  }
};

const handleWebSocketEvents = (client: Client, wss: WebSocket.Server) => {
  client.on('pong', () => {
    client.isAlive = true;
  });

  client.on('message', (json: string) => {
    const { data, error } = safeJSONParse<Payload>(json);

    if (error) return logger('error', 'Failed to parse JSON:', error);
    if (!data) return logger('error', 'No data in JSON:', json);

    logger('info', 'SERVER RECIEVED:', data);
    client.send(JSON.stringify({ info: `server confirmed: ${data.action}`, data }));

    if (data.action === 'updateUser') {
      ServerUsers[data.user.id] = data.user;
      client.id = data.user.id;
    }

    blocksActions({ client, data, wss });
    charlatanActions({ client, data, wss });
    flowActions({ client, data, wss });
    gemRushActions({ client, data, wss });
    emojiTaleActions({ client, data, wss });

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

    if (data.gameType === 'circles3d') {
      const game = ServerGames[data.gameId] as Circles3dGame;

      game[data.action](...data.params);

      updateClientGames(JSON.parse(JSON.stringify(game)), wss.clients);
      return;
    }

    // NEEDS REFACTORING

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

  client.on('error', (err) => {
    logger('error', 'WebSocket error:', err);
    client.terminate();
  });

  client.on('close', () => {
    logger('info', `Client disconnected: ${client.id}`);
    delete ServerUsers[client.id];
  });
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponse<any>) => {
  if (res.socket.server.wss) {
    logger('info', 'Socket is already running');
  } else {
    logger('info', 'Socket is initializing');

    const server: Server = res.socket.server;
    const wss = new WebSocketServer({ noServer: true });
    res.socket.server.wss = wss;

    server.on('upgrade', (req, socket, head) => {
      if (!req.url?.includes('/_next/webpack-hmr')) {
        wss.handleUpgrade(req, socket, head, (ws) => wss.emit('connection', ws, req));
      }
    });

    wss.on('connection', (client: Client) => {
      client.isAlive = true;
      handleWebSocketEvents(client, wss);
    });

    const pingInterval = setInterval(() => {
      wss.clients.forEach((client: Client) => {
        if (!client.isAlive) {
          client.terminate();
          return;
        }

        client.isAlive = false;
        client.ping();
      });
    }, 10000); // Every 10 seconds

    server.on('close', () => {
      clearInterval(pingInterval);
    });
  }
  res.end();
};

export default SocketHandler;
