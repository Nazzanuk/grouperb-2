import { atom } from 'jotai';
import { NextRouter } from 'next/router';

export const routerAtom = atom<NextRouter | null>(null);
