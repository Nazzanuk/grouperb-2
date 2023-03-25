import WebSocket, { WebSocketServer } from 'ws';

import { EmojiTaleGame } from 'Entities/EmojiTaleGame.entity';
import {
  CreateEmojiTaleRoundPayload,
  EndEmojiTaleGuessingPayload,
  Payload,
  UpdateEmojiTaleAnswerPayload,
  VoteEmojiTaleAnswerPayload,
} from 'Entities/Payloads.entity';

import { updateClientGames } from 'Server/UpdateClientGames';
import { createEmojiTaleRound } from 'Utils/EmojiTale/CreateEmojiTaleRound';
import { endEmojiTaleGuessing } from 'Utils/EmojiTale/EndEmojiTaleGuessing';
import { updateEmojiTaleAnswer } from 'Utils/EmojiTale/UpdateEmojiTaleAnswer';
import { voteEmojiTaleAnswer } from 'Utils/EmojiTale/VoteEmojiTaleAnswer';

type Actions = Payload['action'];

type ActionProps = {
  client: WebSocket;
  data: Payload;
  wss: WebSocket.Server<WebSocket.WebSocket>;
};

type UpdateProps = {
  game: EmojiTaleGame | undefined;
  client: WebSocket;
  wss: WebSocket.Server<WebSocket.WebSocket>;
  alert?: string;
};

const actions: Partial<Record<Actions, (props: ActionProps) => EmojiTaleGame | undefined>> = {
  createEmojiTaleRound: ({ client, data, wss }) => {
    const game = createEmojiTaleRound(data as CreateEmojiTaleRoundPayload);
    update({ game, client, wss, alert: 'New round' });
    return game;
  },
  updateEmojiTaleAnswer: ({ client, data, wss }) => {
    const game = updateEmojiTaleAnswer(data as UpdateEmojiTaleAnswerPayload);
    update({ game, client, wss });
    return game;
  },
  voteEmojiTaleAnswer: ({ client, data, wss }) => {
    const game = voteEmojiTaleAnswer(data as VoteEmojiTaleAnswerPayload);
    update({ game, client, wss, alert: `${game.users[(data as VoteEmojiTaleAnswerPayload).userId]} voted` });
    return game;
  },
  endEmojiTaleGuessing: ({ client, data, wss }) => {
    const game = endEmojiTaleGuessing(data as EndEmojiTaleGuessingPayload);
    update({ game, client, wss });
    return game;
  },
};

const update = ({ game, client, wss, alert }: UpdateProps) => {
  if (game) updateClientGames(game, wss.clients);
  else client.send(JSON.stringify({ alert }));
};

export const emojiTaleActions = ({ client, data, wss }: ActionProps) => {
  const game = actions[data.action as keyof typeof actions]?.({ client, data, wss });
  return game;
};
