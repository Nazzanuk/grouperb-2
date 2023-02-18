
import { PlayerBallBody } from 'Entities/BallRun.entities';
import { Constraint } from 'matter-js';
import { PlayerBall } from 'Utils/BallRun/PlayerBall';

export const Restraint = (player: PlayerBallBody) => {
  const elastic =  Constraint.create({
    label: 'elastic',
    pointA: { x: 250, y: 450 },
    bodyB:player,
    // length: 0.0001,
    length: 10,
    damping: 0.1,
    // stiffness: 0.1,
    stiffness: 1,
  });

  return elastic;
};
