import { User } from "Entities/User.entity";
import { UserId } from "Entities/UserId.entity";

export type Game = {
  type: 'vote';
  id: string;
  users: { [key: UserId]: User };
  hostId: UserId;
  [key: string]: any;
}