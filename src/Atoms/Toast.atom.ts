import { atom } from 'jotai';
import { v4 } from 'uuid';

type Toast = { id: string; message: string };

export const toastsAtom = atom<Toast[], string>([], (get, set, message: string) => {
  const newToast: Toast = { id: v4(), message };
  console.log({ newToast });

  set(toastsAtom, [...get(toastsAtom), newToast]);

  console.log([...get(toastsAtom).filter((m) => m.message !== message), newToast]);
  setTimeout(() => {
    set(
      toastsAtom,
      get(toastsAtom).filter((m) => m.id !== newToast.id),
    );
  }, 500000);
});
