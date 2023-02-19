export const HEIGHT = 1400;
export const WIDTH = 1000;
export const CENTER_X = WIDTH / 2;
export const CENTER_Y = HEIGHT / 2;
export const WALL_WIDTH = 500;
export const WALL_LENGTH = 4000;

export const offX = (n: number = 0) => CENTER_X + n;
export const offY = (n: number = 0) => CENTER_Y + n;
export const offTop = (n: number = 0) => 0 + n;
export const offBottom = (n: number = 0) => HEIGHT - n;
export const offLeft = (n: number = 0) => 0 + n;
export const offRight = (n: number = 0) => WIDTH - n;

export const MOUSE_CATEGORY = 0x0001,
  DEFAULT_CATEGORY = 0x0002,
  A_CATEGORY = 0x0004,
  B_CATEGORY = 0x0008;
