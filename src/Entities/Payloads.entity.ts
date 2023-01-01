import { User } from 'Entities/User.entity';
import { UserId } from 'Entities/UserId.entity';

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

export type CastVotePayload = {
  action: 'castVote';
  gameId: string;
  userId: UserId;
  vote: UserId;
};

export type LeaveGamePayload = {
  action: 'leaveGame';
  gameId: string;
  userId: UserId;
};
export type GetGamePayload = {
  action: 'getGame';
  gameId: string;
};

export type Payload =
  | HostGamePayload
  | UpdateUserPayload
  | ConnectPayload
  | JoinGamePayload
  | CastVotePayload
  | GetGamePayload
  | LeaveGamePayload;
