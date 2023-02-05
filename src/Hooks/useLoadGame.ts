import { useEffect } from 'react';

import { useSetAtom } from 'jotai';

import { wsAtom } from 'Atoms/Ws.atom';

export const useLoadGame = (gameId?: string) => {
  const send = useSetAtom(wsAtom);

  useEffect(() => {
    if (gameId) {
      send({ action: 'getGame', gameId});
    }
  }, [gameId]);
};
