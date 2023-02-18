import { Bodies, Body } from 'matter-js';

type Rect = (
  label: string,
  x: number,
  y: number,
  width: number,
  height: number,
  rotation?: number,
  options?: Matter.IChamferableBodyDefinition,
  render?:  Matter.IBodyRenderOptions,
  bounciness?: number,
) => Matter.Body;

export const Rect: Rect = (label, x, y, width, height, rotation = 0, options = {}, render = {}, bounciness = 0.8) => {
  const block = Bodies.rectangle(x, y, width, height, {
    label,
    isStatic: true,
    chamfer: { radius: 8 },
    render: { fillStyle: 'white', opacity: 0.5, ...render },
    friction: 0.5,
    ...options,
  });
  Body.rotate(block, rotation);
  block.restitution = bounciness;

  return block;
};
