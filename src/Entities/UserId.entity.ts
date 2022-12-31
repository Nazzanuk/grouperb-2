declare const userId: unique symbol;

export type UserId = string & {
  [userId]: true
}