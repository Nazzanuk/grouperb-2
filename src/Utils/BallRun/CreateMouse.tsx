import { Bodies, Body, Composite, Engine, Mouse, MouseConstraint, World } from 'matter-js';

import { offX, offBottom, WALL_WIDTH, WALL_LENGTH, MOUSE_CATEGORY } from 'Constants/BallRun.constants';
import { OnCollide } from 'Entities/BallRun.entities';
import { Circle } from 'Utils/BallRun/Circle';
import { Elastic } from 'Utils/BallRun/Elastic';
import { PlayerBall } from 'Utils/BallRun/PlayerBall';
import { Rect } from 'Utils/BallRun/Rect';
import { render } from 'react-dom';

export const CreateMouse = (canvas: HTMLCanvasElement, engine: Engine): [Mouse, MouseConstraint] => {
  const mouse = Mouse.create(canvas),
    mouseConstraint = MouseConstraint.create(engine, {
      collisionFilter: { mask: MOUSE_CATEGORY },
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

  return [mouse, mouseConstraint];
};
