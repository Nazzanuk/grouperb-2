import { Bodies, Body, Composite, World } from 'matter-js';

import { offX, offBottom, WALL_WIDTH, WALL_LENGTH } from 'Constants/BallRun.constants';
import { OnCollide } from 'Entities/BallRun.entities';
import { Circle } from 'Utils/BallRun/Circle';
import { Elastic } from 'Utils/BallRun/Elastic';
import { PlayerBall } from 'Utils/BallRun/PlayerBall';
import { Rect } from 'Utils/BallRun/Rect';

export const BottomWall = (): Body => {
  let i: NodeJS.Timeout | null = null;

  const scorer = Rect(
    'bottomWall',
    offX(),
    offBottom(-500),
    WALL_WIDTH,
    WALL_LENGTH,
    Math.PI / 2,
    {
      // @ts-expect-error
      onCollide: (self, otherBody, world): OnCollide => {
        if (otherBody.label === 'player') Composite.remove(world, otherBody);

        const elastic = Composite.allConstraints(world).find((body) => body.label === 'elastic');
        if (elastic) Composite.remove(world, elastic);

        const newPlayer = PlayerBall();
        const newElastic = Elastic(newPlayer);
        Composite.add(world, newElastic);
        Composite.add(world, newPlayer);
      },
    },
    {
      fillStyle: '#00000000',
    },
  );

  return scorer;
};
