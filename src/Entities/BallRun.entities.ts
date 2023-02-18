export type OnCollide = (self: Matter.Body, otherBody: Matter.Body, world: Matter.World) => void;

export type PlayerBallBody = Matter.Body & { _: 'player' };
