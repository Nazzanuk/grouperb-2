import { connectionStatusAtom } from "Atoms/ConnectionStatus.atom";
import { Payload } from "Entities/Payloads.entity";

export const createWebSocket = (): WebSocket => {
  const url = new URL('/api/socket', window.location.href);
  url.protocol = url.protocol.replace('http', 'ws');
  return new WebSocket(url.href);
};

export const sendWithReconnect = (
  ws: WebSocket,
  payload: Payload,
  get: any,
  set: any,
) => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  } else {
    set(connectionStatusAtom, 'Connecting');

    ws.addEventListener('open', () => {
      set(connectionStatusAtom, 'Connected');
      ws.send(JSON.stringify(payload));
    });
  }
};
