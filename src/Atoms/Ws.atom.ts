import { atom } from 'jotai';

import { currentGameAtom } from 'Atoms/CurrentGame.atom';
import { routerAtom } from 'Atoms/Router.atom';
import { userAtom } from 'Atoms/User.atom';
import { Payload } from 'Entities/Payloads.entity';
import { connectionStatusAtom } from 'Atoms/ConnectionStatus.atom';
import { ToastContainer, toast } from 'react-toastify';
import { User } from 'Entities/User.entity';

type GameWs = { instance: WebSocket };

const gameWs: GameWs = { instance: null as any };

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

    console.log('gameWs?.instance?.readyState', gameWs?.instance?.readyState);
    console.log('gameWs?.instance?', gameWs?.instance);
    if (!gameWs.instance) {
      set(initWebSocketAtom, user);

      const i = setInterval(() => {
        if (gameWs.instance?.readyState === WebSocket.OPEN) {
          set(connectionStatusAtom, 'Connected');
          gameWs.instance?.send?.(JSON.stringify(payload));
          clearInterval(i);
        }
      }, 1000);

      return;
    }

    if (gameWs.instance?.readyState === WebSocket.OPEN) {
      gameWs.instance.send(JSON.stringify(payload));
      console.log('sending: ', { payload });
    } else {
      set(connectionStatusAtom, 'Connecting');
      console.log('waiting', gameWs.instance.readyState);

      gameWs.instance.addEventListener('open', () => {
        set(connectionStatusAtom, 'Connected');

        setTimeout(() => {
          gameWs.instance.send(JSON.stringify({ action: 'updateUser', user }));
        }, 500);

        setTimeout(() => {
          gameWs.instance.send(JSON.stringify(payload));
          console.log('delayed sending: ', { payload });
        }, 1000);
      });
    }
  },
);

export const initWebSocketAtom = atom<GameWs, User>(
  () => gameWs,
  (get, set, user) => {
    console.log('gameWs?.instance?.readyState', gameWs?.instance?.readyState);
    if ([WebSocket.OPEN, WebSocket.CONNECTING].includes(gameWs?.instance?.readyState)) return;
    set(connectionStatusAtom, 'Connecting');
    gameWs.instance?.close?.();


    setTimeout(() => {
      if (gameWs.instance?.readyState !== WebSocket.OPEN) {
        window.location.reload();
      }
    }, 5000);

    console.log('connecting');
    var url = new URL('/api/socket', window.location.href);
    url.protocol = url.protocol.replace('http', 'ws');
    const serverUrl = url.href;
    gameWs.instance = new WebSocket(serverUrl);

    gameWs.instance.onopen = () => {
      console.log('connected');
      gameWs.instance.send(JSON.stringify({ action: 'updateUser', user }));
    };

    gameWs.instance.onmessage = (event) => {
      const router = get(routerAtom);
      set(connectionStatusAtom, 'Connected');
      const data = JSON.parse(event.data);
      console.log('CLIENT RECIEVED: ', data, router);

      if (data.game) {
        set(currentGameAtom, data.game);
        router?.push(`/vote-game/${data.game.id}`);
      }

      if (data.alert) {

      toast(data.alert);
        // alert(data.alert);
      }
    };

    gameWs.instance.onclose = function () {
      console.log('disconnected', gameWs.instance.readyState, WebSocket.CLOSED);
      set(connectionStatusAtom, 'Disconnected');
    };
  },
);

// import WebSocket from 'isomorphic-ws';

// let ws: WebSocket;
// let t;

// console.log('wsAtom');

// if (typeof window !== 'undefined') {
//   var url = new URL('/api/socket', window.location.href);
//   url.protocol = url.protocol.replace('http', 'ws');
//   fetch('/api/socket');
// }

// export const wsAtom = atom<WebSocket, Payload>(
//   () => ws,
//   (get, set, payload: Payload) => {
//     const router = get(routerAtom);
//     const user = get(userAtom);

//     if (payload.action === 'reconnect' && ws.readyState === WebSocket.OPEN) {
//       set(connectionStatusAtom, 'Connected');
//     }

//     if (payload.action === 'reconnect' && ws.readyState === WebSocket.CLOSED) {
//       set(connectionStatusAtom, 'Reconnecting (socket currently closed)');
//       console.log('reconnecting');
//       connect();

//       ws.onopen = () => {
//         console.log('REconnected');
//         set(connectionStatusAtom, 'Connected');

//         setTimeout(() => {
//           console.log('updating user??');
//           ws.send(JSON.stringify({ action: 'updateUser', user }));

//           ws.onmessage = (event) => {
//             set(connectionStatusAtom, 'Connected');
//             const data = JSON.parse(event.data);
//             console.log('CLIENT RECIEVED: ', data, router);

//             if (data.game) {
//               set(currentGameAtom, data.game);
//               router?.push(`/vote-game/${data.game.id}`);
//             }
//           };
//         }, 500);
//       };

//       // return;
//     }

//     console.log({ payload });

//     ws.onmessage = (event) => {
//       set(connectionStatusAtom, 'Connected');

//       const data = JSON.parse(event.data);
//       console.log('CLIENT RECIEVED: ', data, router);

//       if (data.game) {
//         set(currentGameAtom, data.game);
//         router?.push(`/vote-game/${data.game.id}`);
//       }
//     };

//     ws.onclose = function () {
//       console.log('disconnected', ws.readyState, WebSocket.CLOSED);
//       set(connectionStatusAtom, 'Disconnected');

//       // if (ws.readyState === WebSocket.CLOSED) {
//       //   connect();

//       //   ws.onmessage = (event) => {
//       //     const data = JSON.parse(event.data);
//       //     console.log('CLIENT RECIEVED: ', data, router);

//       //     if (data.game) {
//       //       set(currentGameAtom, data.game);
//       //       router?.push(`/vote-game/${data.game.id}`);
//       //     }
//       //   };
//       // }
//     };

//     if (ws.readyState === WebSocket.OPEN) {
//       if (payload.action === 'reconnect') return;
//       ws.send(JSON.stringify(payload));
//       console.log('sending: ', { payload });
//     } else {
//       set(connectionStatusAtom, 'Connecting');
//       console.log('waiting', ws.readyState);
//       if (payload.action === 'reconnect') return;

//       ws.addEventListener('open', () => {
//         set(connectionStatusAtom, 'Connected');

//         setTimeout(() => {
//           ws.send(JSON.stringify({ action: 'updateUser', user }));
//           ws.send(JSON.stringify(payload));
//           console.log('delayed sending: ', { payload });
//         }, 1000);
//       });
//     }
//   },
// );

// wsAtom.onMount = (setAtom) => {
//   console.log('mounting');
//   connect();
// };

// const connect = () => {
//   console.log('connecting');
//   var url = new URL('/api/socket', window.location.href);

//   url.protocol = url.protocol.replace('http', 'ws');

//   ws = new WebSocket(url.href);

//   ws.onopen = () => {
//     console.log('connected');
//   };
// };
