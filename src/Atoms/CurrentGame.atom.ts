import { Game } from 'Entities/Game.entity';
import { atom } from 'jotai';

export const currentGameAtom = atom<Game | null>(null);