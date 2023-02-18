
import { PlayerBallBody } from 'Entities/BallRun.entities';
import { Constraint } from 'matter-js';
import { PlayerBall } from 'Utils/BallRun/PlayerBall';

export const Elastic = (player: PlayerBallBody) => {
  const elastic =  Constraint.create({
    label: 'elastic',
    pointA: { x: 250, y: 450 },
    bodyB:player,
    length: 0.0001,
    // length: 100,
    damping: 0.1,
    stiffness: 0.03,
    // stiffness: 0.01,
  });

  return elastic;
};
