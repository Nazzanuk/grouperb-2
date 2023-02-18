import { OnCollide } from 'Entities/BallRun.entities';
import { Bodies, Body } from 'matter-js';
import { Circle } from 'Utils/BallRun/Circle';


type Rect = (
  x: number,
  y: number,
  radius: number,
  options?: Matter.IChamferableBodyDefinition,
  render?: Matter.IBodyRenderOptions,
  bounciness?: number,
) => Matter.Body;

export const Scorer: Rect = (x, y, radius) => {
  let i:NodeJS.Timeout | null = null;

  const scorer = Circle(
    'scorer',
    x,
    y,
    radius,
    {
      // @ts-expect-error
      onCollide: (self, otherBody, world): OnCollide => {
        clearTimeout(i as NodeJS.Timeout);
        console.log('oncollide scorer')
        self.render.opacity = 1;
        i = setTimeout(() => { self.render.opacity = 0.5 }, 200);
      },
    },
    { opacity: 0.5 },
    1.1,
  );

  return scorer;
};
