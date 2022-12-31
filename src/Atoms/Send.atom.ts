import { atom } from 'jotai';

import { wsAtom } from 'Atoms/Ws.atom';
import { Payload } from 'Entities/Payloads.entity';

export const sendAtom = atom(null, (get, set, payload: Payload) => {
  set(wsAtom, payload);
});
