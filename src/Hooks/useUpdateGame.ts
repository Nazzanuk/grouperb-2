import { useEffect, useRef } from 'react';

import { useSetAtom } from 'jotai';

import { wsAtom } from 'Atoms/Ws.atom';

export const useUpdateGame = (gameId?: string) => {
  const send = useSetAtom(wsAtom);
  const i = useRef<NodeJS.Timer>(null);

  useEffect(() => {
    if (!gameId) return;

    // @ts-ignore
    i.current = setInterval(() => {
      send({ action: 'getGame', gameId });
    }, 10000);

    return () => {
      // @ts-ignore
      clearInterval(i.current);
    };
  }, [gameId]);
};
