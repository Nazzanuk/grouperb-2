import { User } from 'Entities/User.entity';
import { UserId } from 'Entities/UserId.entity';

export type HostGamePayload = {
  action: 'hostGame';
  type: 'vote' | 'defuse';
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

export type StartVoteGamePayload = {
  action: 'startVoteGame';
  gameId: string;
  userId: UserId;
};

export type StartDefuseGamePayload = {
  action: 'startDefuseGame';
  gameId: string;
  userId: UserId;
};

export type StartVoteRoundPayload = {
  action: 'startVoteRound';
  gameId: string;
  userId: UserId;
};

export type StartDefuseRoundPayload = {
  action: 'startDefuseRound';
  gameId: string;
  userId: UserId;
};

export type ChooseDefuseWire = {
  action: 'chooseDefuseWire';
  gameId: string;
  userId: UserId;
  letter: string;
};

export type RestartDefuseGame = {
  action: 'restartDefuseGame';
  gameId: string;
  userId: UserId;
};

export type DefuseTimeUp = {
  action: 'defuseTimeUp';
  gameId: string;
  userId: UserId;
};

export type Payload =
  | HostGamePayload
  | StartDefuseGamePayload
  | StartDefuseRoundPayload
  | UpdateUserPayload
  | ConnectPayload
  | JoinGamePayload
  | CastVotePayload
  | GetGamePayload
  | DefuseTimeUp
  | StartVoteGamePayload
  | StartVoteRoundPayload
  | RestartDefuseGame
  | ChooseDefuseWire
  | LeaveGamePayload;
