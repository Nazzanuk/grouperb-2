import { Body, Composite } from 'matter-js';

import type { OnCollide, PlayerBallBody } from 'Entities/BallRun.entities';
import { Circle } from 'Utils/BallRun/Circle';
import { Elastic } from 'Utils/BallRun/Elastic';
import { offX, offBottom } from 'Constants/BallRun.constants';

export const PlayerBall = (): PlayerBallBody => {
  let i: NodeJS.Timeout | null = null;
  const radius = 20;

  const playerBall = Circle('player', offX(), offBottom(200), 50, {
    isStatic: false,
    density: 0.004,
    render: { fillStyle: '#1E90FF', lineWidth: 5, strokeStyle: '#00BFFF' },
    // frictionAir: 0.03,
    
    // @ts-expect-error
    isFree: false,
    onCollide: (self, otherBody, world): OnCollide => {
      if (otherBody.label === 'gameArea' && self.isFree === false) {
        const elastic = Composite.allConstraints(world).find((body) => body.label === 'elastic');

        Composite.remove(world, self);

        const player = Composite.allBodies(world).find((body) => body.label === 'player');
        if (elastic) Composite.remove(world, elastic);
        if (player) Composite.remove(world, player);

        const newPlayer = PlayerBall();
        const newElastic = Elastic(newPlayer);
        Composite.add(world, newElastic);
        Composite.add(world, newPlayer);
      }

      if (otherBody.label === 'scorer') {
        clearTimeout(i as NodeJS.Timeout);
        console.log('oncollide scorer', self);
        self.render.opacity = 1;
        self.render.fillStyle = 'white';

        i = setTimeout(() => {
          self.render.fillStyle = '#1E90FF';
        }, 200);
      }
    },
  });

  return playerBall as PlayerBallBody;
};
