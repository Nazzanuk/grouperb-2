import { atom } from 'jotai';
import { v4 } from 'uuid';

type Score = { id: string; score: number };

export const showScoreAtom = atom<Score[], number>([], (get, set, score: number) => {
  const newScore: Score = { id: v4(), score };
  console.log({ newToast: newScore });

  set(showScoreAtom, [...get(showScoreAtom), newScore]);

  console.log([...get(showScoreAtom).filter((m) => m.score !== score), newScore]);
  setTimeout(() => {
    set(
      showScoreAtom,
      get(showScoreAtom).filter((m) => m.id !== newScore.id),
    );
  }, 2000);
});
