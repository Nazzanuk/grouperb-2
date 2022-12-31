import { Payload } from 'Entities/Payloads.entity';
import { atom } from 'jotai';
// import WebSocket from 'isomorphic-ws';

let ws: WebSocket;

console.log('wsAtom');

if (typeof window !== 'undefined') {
  var url = new URL('/api/socket', window.location.href);
  url.protocol = url.protocol.replace('http', 'ws');
  fetch('/api/socket');
}

export const avatarsAtom = atom<string[]>([]);

avatarsAtom.onMount = (setAtom) => {
  fetch('/api/avatars')
    .then((res) => res.json())
    .then((data) => {
      setAtom(data.avatars);
    });
};
