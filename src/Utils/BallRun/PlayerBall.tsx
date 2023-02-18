import type { PlayerBallBody } from 'Entities/BallRun.entities';
import { Circle } from 'Utils/BallRun/Circle';

export const PlayerBall = (): PlayerBallBody => {
  const playerBall = Circle('player', 250, 450, 20, {
    isStatic: false,
    density: 0.004,
    render: { fillStyle: 'orange' },
  });

  return playerBall as PlayerBallBody;
};
