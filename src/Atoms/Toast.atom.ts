import { atom } from 'jotai';

export const toastsAtom = atom([] as string[], (get, set, message) => {
  set(toastsAtom, [...get(toastsAtom).filter((m) => m !== message), message]);
  setTimeout(() => {
    set(
      toastsAtom,
      get(toastsAtom).filter((m) => m !== message),
    );
  }, 5000);
});
