import { atom } from 'jotai';

export const showBottomOverlayAtom = atom<string | null, string | null>(null, (get, set, value) => {
  const showBottomOverlay = get(showBottomOverlayAtom);

  if (value === showBottomOverlay) set(showBottomOverlayAtom, null);
  else set(showBottomOverlayAtom, value);
});
