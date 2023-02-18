import { Bodies, Body } from 'matter-js';

type Rect = (
  tag: string,
  x: number,
  y: number,
  radius: number,
  options?: Matter.IChamferableBodyDefinition,
  render?: Matter.IBodyRenderOptions,
  bounciness?: number,
) => Matter.Body;

export const Circle: Rect = (label, x, y, radius, options = {}, render = {}, bounciness = 0.9) => {
  const block = Bodies.circle(x, y, radius, {
    label,
    isStatic: true,
    chamfer: { radius: 4 },
    render: { fillStyle: 'white', opacity: 0.8, ...render },
    density: 5,
    ...options,
  });
  block.restitution = bounciness;
  // Body.setMass(block, 50000);

  return block;
};
