import { User } from 'Entities/User.entity';

export type HostGamePayload = {
  action: 'hostGame';
  type: 'vote';
  user: User;
};

export type JoinGamePayload = {
  action: 'joinGame';
  gameId: string;
  user: User;
};

export type UpdateUserPayload = {
  action: 'updateUser';
  user: User;
};

export type ConnectPayload = {
  action: 'connect';
};

export type Payload = HostGamePayload | UpdateUserPayload | ConnectPayload | JoinGamePayload;
