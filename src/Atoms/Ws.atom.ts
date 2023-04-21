import { atom } from 'jotai';
import { currentGameAtom } from 'Atoms/CurrentGame.atom';
import { routerAtom } from 'Atoms/Router.atom';
import { userAtom } from 'Atoms/User.atom';
import { Payload } from 'Entities/Payloads.entity';
import { connectionStatusAtom } from 'Atoms/ConnectionStatus.atom';
import { User } from 'Entities/User.entity';
import { toastsAtom } from 'Atoms/Toast.atom';
import { createWebSocket, sendWithReconnect } from 'Utils/WebsocketUtils';
import { kebabCase } from 'lodash';

type GameWs = { instance: WebSocket };

const gameWs: GameWs = { instance: null as any };

if (typeof window !== 'undefined') createWebSocket();

const reconnect = (get: any, set: any, user: User) => {
  try {
    set(initWebSocketAtom, user);
  } catch (e) {
    console.error('Failed to reconnect', e);
    setTimeout(() => reconnect(get, set, user), 1000);
  }
};

const gameTypeToRoute = (gameType: string, gameId: string): string | null => {
  if (gameType) return `/${kebabCase(gameType)}-game/${gameId}`.replace(/3-d/g, '3d');
  return null;
};

export const wsAtom = atom<WebSocket, Payload>(
  (get) => get(initWebSocketAtom).instance,
  (get, set, payload: Payload) => {
    const user = get(userAtom);

    if (!gameWs.instance) {
      set(initWebSocketAtom, user);
    }

    sendWithReconnect(gameWs.instance, payload, get, set);
  },
);

export const initWebSocketAtom = atom<GameWs, User>(
  () => gameWs,
  (get, set, user) => {
    if ([WebSocket.OPEN, WebSocket.CONNECTING].includes(gameWs?.instance?.readyState)) return;
    set(connectionStatusAtom, 'Connecting');
    gameWs.instance?.close?.();

    gameWs.instance = createWebSocket();

    gameWs.instance.onopen = () => {
      gameWs.instance.send(JSON.stringify({ action: 'updateUser', user }));
    };

    gameWs.instance.onmessage = (event) => {
      const router = get(routerAtom);
      set(connectionStatusAtom, 'Connected');
      const data = JSON.parse(event.data);

      if (data.alert) {
        set(toastsAtom, data?.alert);

        if (['Error joining game', 'Error getting game'].includes(data?.alert)) {
          router?.replace(`/home`);
        }
      }

      if (data.game) {
        set(currentGameAtom, data.game);

        if (!['/fetching'].includes(router?.asPath!)) return;

        const route = gameTypeToRoute(data.game.type, data.game.id);
        if (route) {
          router?.replace(route);
        }
      }
    };

    gameWs.instance.onclose = function () {
      set(connectionStatusAtom, 'Disconnected');
      const user = get(userAtom);
      reconnect(get, set, user);
    };

    return () => {
      gameWs.instance.onopen = null;
      gameWs.instance.onmessage = null;
      gameWs.instance.onclose = null;
    };
  },
);
