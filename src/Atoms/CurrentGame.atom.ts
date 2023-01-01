import { atom } from 'jotai';

import { Game } from 'Entities/Game.entity';

export const currentGameAtom = atom<Game | null>(null);