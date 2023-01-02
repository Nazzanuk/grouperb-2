import { atom } from 'jotai';

import { currentGameAtom } from 'Atoms/CurrentGame.atom';
import { routerAtom } from 'Atoms/Router.atom';
import { Payload } from 'Entities/Payloads.entity';
import { userAtom } from 'Atoms/User.atom';
// import WebSocket from 'isomorphic-ws';

let ws: WebSocket;

console.log('wsAtom');

if (typeof window !== 'undefined') {
  var url = new URL('/api/socket', window.location.href);
  url.protocol = url.protocol.replace('http', 'ws');
  fetch('/api/socket');
}

export const wsAtom = atom<WebSocket, Payload>(
  () => ws,
  (get, set, payload: Payload) => {
    if (payload.action === 'reconnect') {
      const user = get(userAtom);
      console.log('reconnecting');
      var url = new URL('/api/socket', window.location.href);

      url.protocol = url.protocol.replace('http', 'ws');
      ws = new WebSocket(url.href);

      ws.onopen = () => {
        console.log('REconnected');

          setTimeout(() => {
            console.log('updating user??')
            ws.send(JSON.stringify({ action: 'updateUser', user }));
          }, 500);
      };

      return;
    }

    const router = get(routerAtom);
    console.log({ payload });

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('CLIENT RECIEVED: ', data, router);

      if (data.game) {
        set(currentGameAtom, data.game);
        router?.push(`/vote-game/${data.game.id}`);
      }
    };

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
      console.log('sending: ', { payload });
    } else {
      console.log('waiting');

      ws.addEventListener('open', () => {
        setTimeout(() => {
          ws.send(JSON.stringify(payload));
          console.log('delayed sending: ', { payload });
        }, 1000);
      });
    }
  },
);

wsAtom.onMount = (setAtom) => {
  console.log('mounting');
  var url = new URL('/api/socket', window.location.href);

  url.protocol = url.protocol.replace('http', 'ws');

  ws = new WebSocket(url.href);

  ws.onopen = () => {
    console.log('connected');
  };
};
