import { atom } from 'jotai';

import { currentGameAtom } from 'Atoms/CurrentGame.atom';
import { routerAtom } from 'Atoms/Router.atom';
import { userAtom } from 'Atoms/User.atom';
import { Payload } from 'Entities/Payloads.entity';
// import WebSocket from 'isomorphic-ws';

let ws: WebSocket;
let t;

console.log('wsAtom');

if (typeof window !== 'undefined') {
  var url = new URL('/api/socket', window.location.href);
  url.protocol = url.protocol.replace('http', 'ws');
  fetch('/api/socket');
}

export const wsAtom = atom<WebSocket, Payload>(
  () => ws,
  (get, set, payload: Payload) => {
    const router = get(routerAtom);
    const user = get(userAtom);

    if (payload.action === 'reconnect' && ws.readyState === WebSocket.CLOSED) {
      console.log('reconnecting');
      connect();

      ws.onopen = () => {
        console.log('REconnected');

        setTimeout(() => {
          console.log('updating user??');
          ws.send(JSON.stringify({ action: 'updateUser', user }));
        }, 500);
      };

      // return;
    }

    console.log({ payload });

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('CLIENT RECIEVED: ', data, router);

      if (data.game) {
        set(currentGameAtom, data.game);
        router?.push(`/vote-game/${data.game.id}`);
      }
    };

    ws.onclose = function () {
      console.log('disconnected', ws.readyState, WebSocket.CLOSED);

      // if (ws.readyState === WebSocket.CLOSED) {
      //   connect();

      //   ws.onmessage = (event) => {
      //     const data = JSON.parse(event.data);
      //     console.log('CLIENT RECIEVED: ', data, router);
    
      //     if (data.game) {
      //       set(currentGameAtom, data.game);
      //       router?.push(`/vote-game/${data.game.id}`);
      //     }
      //   };
      // }
    };

    if (ws.readyState === WebSocket.OPEN) {
      if (payload.action === 'reconnect') return;
      ws.send(JSON.stringify(payload));
      console.log('sending: ', { payload });
    } else {
      console.log('waiting', ws.readyState);
      if (payload.action === 'reconnect') return;

      ws.addEventListener('open', () => {

        setTimeout(() => {
        ws.send(JSON.stringify({ action: 'updateUser', user }));
          ws.send(JSON.stringify(payload));
          console.log('delayed sending: ', { payload });
        }, 1000);
      });
    }
  },
);

wsAtom.onMount = (setAtom) => {
  console.log('mounting');
  connect();
};

const connect = () => {
  console.log('connecting');
  var url = new URL('/api/socket', window.location.href);

  url.protocol = url.protocol.replace('http', 'ws');

  ws = new WebSocket(url.href);

  ws.onopen = () => {
    console.log('connected');
  };
};
