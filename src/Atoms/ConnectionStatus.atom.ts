import { atom } from "jotai";

export const connectionStatusAtom = atom<'Connecting' | 'Reconnecting' | 'Disconnected' | 'Connected' | null>(null);