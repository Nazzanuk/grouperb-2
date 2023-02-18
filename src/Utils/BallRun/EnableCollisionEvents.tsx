import { Bodies, Body, Composite, Engine, Events, Mouse, MouseConstraint, Render, World } from 'matter-js';


export const EnableCollisionEvents = (engine:Engine, world:World) => {
  Events.on(engine, 'collisionStart', function (event) {
    event.pairs.forEach((pair) => {
      // @ts-expect-error
      pair.bodyA?.onCollide?.(pair.bodyA, pair.bodyB, world);
      // @ts-expect-error
      pair.bodyB?.onCollide?.(pair.bodyB, pair.bodyA, world);
    });
  });
};
