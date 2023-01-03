import { atom } from 'jotai';

import { currentGameAtom } from 'Atoms/CurrentGame.atom';
import { routerAtom } from 'Atoms/Router.atom';
import { userAtom } from 'Atoms/User.atom';
import { Payload } from 'Entities/Payloads.entity';
import { connectionStatusAtom } from 'Atoms/ConnectionStatus.atom';
import { User } from 'Entities/User.entity';
// import WebSocket from 'isomorphic-ws';

type GameWs = { instance: WebSocket };

const gameWs: GameWs = { instance: null };

console.log('connecting');
var url = new URL('/api/socket', window.location.href);
const serverUrl = url.href;

console.log('wsAtom');

if (typeof window !== 'undefined') {
  var url = new URL('/api/socket', window.location.href);
  url.protocol = url.protocol.replace('http', 'ws');
  fetch('/api/socket');
}

export const wsAtom = atom<WebSocket, Payload>(
  (get) => get(initWebSocketAtom).instance,
  (get, set, payload: Payload) => {
    const user = get(userAtom);

    if (gameWs.instance.readyState === WebSocket.OPEN) {
      gameWs.instance.send(JSON.stringify(payload));
      console.log('sending: ', { payload });
    } else {
      set(connectionStatusAtom, 'Connecting');
      console.log('waiting', gameWs.instance.readyState);

      gameWs.instance.addEventListener('open', () => {
        set(connectionStatusAtom, 'Connected');

        setTimeout(() => {
          gameWs.instance.send(JSON.stringify({ action: 'updateUser', user }));
          gameWs.instance.send(JSON.stringify(payload));
          console.log('delayed sending: ', { payload });
        }, 1000);
      });
    }
  },
);

export const initWebSocketAtom = atom<GameWs, Payload>(
  () => gameWs,
  (get, set, payload: Payload) => {
    const router = get(routerAtom);

    gameWs.instance?.close?.();

    console.log('connecting');
    gameWs.instance = new WebSocket(serverUrl);

    gameWs.instance.onopen = () => {
      console.log('connected');
    };

    gameWs.instance.onmessage = (event) => {
      set(connectionStatusAtom, 'Connected');
      const data = JSON.parse(event.data);
      console.log('CLIENT RECIEVED: ', data, router);

      if (data.game) {
        set(currentGameAtom, data.game);
        router?.push(`/vote-game/${data.game.id}`);
      }
    };

    gameWs.instance.onclose = function () {
      console.log('disconnected', ws.readyState, WebSocket.CLOSED);
      set(connectionStatusAtom, 'Disconnected');
    };

    // @ts-ignore
    set(initWebSocketAtom, gameWs);
  },
);
