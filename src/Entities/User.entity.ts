import { UserId } from "Entities/UserId.entity";

export type User = {
  id: UserId;
  avatar?: string;
  email?: string;
  isPremium?: boolean;
  username: string;
}