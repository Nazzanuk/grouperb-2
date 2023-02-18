import { HEIGHT, WIDTH } from 'Constants/BallRun.constants';
import { Bodies, Body, Composite, Engine, Mouse, MouseConstraint, Render, World } from 'matter-js';


export const CreateRender = (element: HTMLElement, canvas: HTMLCanvasElement, engine:Engine) => {
  const render = Render.create({
    element,
    canvas,
    engine: engine,
    options: { width: WIDTH, height: HEIGHT, wireframes: false, background: 'transparent' },
  });

  return render;
};
