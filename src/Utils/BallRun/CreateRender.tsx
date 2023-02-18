import { Bodies, Body, Composite, Engine, Mouse, MouseConstraint, Render, World } from 'matter-js';


export const CreateRender = (element: HTMLElement, canvas: HTMLCanvasElement, engine:Engine) => {
  const render = Render.create({
    element,
    canvas,
    engine: engine,
    options: { width: 500, height: 600, wireframes: false, background: 'transparent' },
  });

  return render;
};
