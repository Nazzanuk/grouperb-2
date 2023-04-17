import random from 'lodash/random';
import { Game } from 'Entities/Game.entity';
import { User } from 'Entities/User.entity';
import { UserId } from 'Entities/UserId.entity';
import shuffle from 'lodash/shuffle';

export type Coordinate = [x: number, y: number, z: number];

export class Circles3dGame {
  id = random(10000, 99999).toString();
  type = 'circles3d' as const;
  users: { [key: UserId]: User };
  hostId: UserId;
  rounds: any[] = [];
  status: 'lobby' | 'playing' | 'finished' = 'lobby';
  board: (UserId | null)[][][];
  winner: UserId | null;
  winningCoordinates: Coordinate[] | null = null;
  moves: { userId: UserId; coordinate: Coordinate }[];
  colors = shuffle([
    '#FF0000', // red
    '#FFA500', // orange
    '#FFFF00', // yellow
    '#00FF00', // green
    '#00FFFF', // cyan
    '#0000FF', // blue
    '#8B00FF', // violet
    '#FF00FF', // magenta
  ]);

  constructor(host: User) {
    this.users = { [host.id]: host };
    this.hostId = host.id;
    this.board = Array(3)
      .fill(null)
      .map(() =>
        Array(3)
          .fill(null)
          .map(() => Array(3).fill(null)),
      );
    this.winner = null;
    this.moves = [];
  }

  static restoreGame(game: Game): Circles3dGame {
    const circles3dGame = new Circles3dGame(game.users[game.hostId]);
    Object.assign(circles3dGame, game);
    return circles3dGame;
  }

  exportGame(): Game {
    return JSON.parse(JSON.stringify(this));
  }

  makeMove(userId: UserId, coordinate: Coordinate): boolean {
    const [x, y, z] = coordinate;
    if (this.board[x][y][z] === null && this.status === 'playing' && this.users[userId] !== undefined) {
      this.board[x][y][z] = userId;
      this.moves.push({ userId, coordinate });

      const winningCoordinates = this.checkWinner(userId, coordinate);
      if (winningCoordinates !== null) {
        this.winner = userId;
        this.status = 'finished';
        this.winningCoordinates = winningCoordinates;
      }

      return true;
    }
    return false;
  }

  checkWinner(userId: UserId, coordinate: Coordinate): Coordinate[] | null {
    const directions = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1], // X, Y, Z axes
      [1, 1, 0],
      [1, -1, 0],
      [1, 0, 1],
      [1, 0, -1],
      [0, 1, 1],
      [0, 1, -1], // Diagonals in XY, XZ, YZ planes
      [1, 1, 1],
      [1, 1, -1],
      [1, -1, 1],
      [1, -1, -1], // Diagonals across the 3D space
    ];

    const inBounds = (x: number, y: number, z: number): boolean =>
      x >= 0 && x < 3 && y >= 0 && y < 3 && z >= 0 && z < 3;

    const checkDirection = (dx: number, dy: number, dz: number): Coordinate[] | null => {
      let count = 0;
      let winningCoordinates: Coordinate[] = [];

      for (let i = -2; i <= 2; i++) {
        const x = coordinate[0] + i * dx;
        const y = coordinate[1] + i * dy;
        const z = coordinate[2] + i * dz;

        if (inBounds(x, y, z) && this.board[x][y][z] === userId) {
          count++;
          winningCoordinates.push([x, y, z]);
          if (count === 3) return winningCoordinates;
        } else {
          count = 0;
          winningCoordinates = [];
        }
      }
      return null;
    };

    for (const [dx, dy, dz] of directions) {
      const winningCoordinates = checkDirection(dx, dy, dz);
      if (winningCoordinates !== null) {
        return winningCoordinates;
      }
    }

    return null;
  }

  addPlayer(user: User): void {
    if (this.status === 'lobby') this.users[user.id] = user;
  }

  removePlayer(userId: UserId): void {
    if (this.status === 'lobby' && this.users[userId] !== undefined) delete this.users[userId];
  }

  startGame(): void {
    if (this.status === 'lobby' && Object.keys(this.users).length >= 2) {
      const shuffledUsersObject: { [key: UserId]: User } = {};
      const shuffledUsersrray = shuffle(Object.values(this.users));
      for (const user of shuffledUsersrray) {
        shuffledUsersObject[user.id] = user;
      }
      this.colors = shuffle(this.colors);
      this.users = shuffledUsersObject;
      this.status = 'playing';
    }
  }

  resetGame(): void {
    this.board = Array(3)
      .fill(null)
      .map(() =>
        Array(3)
          .fill(null)
          .map(() => Array(3).fill(null)),
      );
    this.winner = null;
    this.moves = [];
    this.status = 'lobby';
  }

  getCurrentPlayer(): UserId {
    const playerIds = Object.keys(this.users) as UserId[];
    return playerIds[this.moves.length % playerIds.length];
  }

  isPlayerTurn(userId: UserId): boolean {
    return userId === this.getCurrentPlayer();
  }

  getBoardSize(): number {
    return this.board.length;
  }

  getUserList(): User[] {
    return Object.values(this.users);
  }

  isFull(): boolean {
    return this.moves.length === this.board.length ** 3;
  }

  undoMove(): boolean {
    if (this.status !== 'playing' || this.moves.length === 0) return false;
    const lastMove = this.moves.pop()!;
    this.board[lastMove.coordinate[0]][lastMove.coordinate[1]][lastMove.coordinate[2]] = null;
    return true;
  }

  isMoveValid(coordinate: Coordinate): boolean {
    const [x, y, z] = coordinate;
    return this.board[x][y][z] === null && this.status === 'playing';
  }

  getWinner(): UserId | null {
    return this.winner;
  }

  getStatus(): 'lobby' | 'playing' | 'finished' {
    return this.status;
  }

  getMoveCount(): number {
    return this.moves.length;
  }

  getUserColor(userId: UserId): string | null {
    const playerIds = Object.keys(this.users);
    const playerIndex = playerIds.indexOf(userId);
    if (playerIndex === -1) return null;
    return this.colors[playerIndex % this.colors.length];
  }

  getColorAtCoordinate(coordinate: Coordinate): string | null {
    const userId = this.getPlayerAtCoordinate(coordinate);
    if (userId === null) return null;
    return this.getUserColor(userId);
  }

  getPlayerAtCoordinate(coordinate: Coordinate): UserId | null {
    const [x, y, z] = coordinate;
    return this.board[x][y][z];
  }

  getWinningCoordinates(): Coordinate[] | null {
    return this.winner ? this.winningCoordinates : null;
  }

  isWinningCoordinate(coordinate: Coordinate): boolean {
    const winningCoordinates = this.getWinningCoordinates();
    if (winningCoordinates === null) return false;

    return winningCoordinates.some(([x, y, z]) => x === coordinate[0] && y === coordinate[1] && z === coordinate[2]);
  }

  isWinningGrid(coordinate: [x: number, y: number]): boolean {
    const winningCoordinates = this.getWinningCoordinates();
    if (winningCoordinates === null) return false;

    return winningCoordinates.some(([x, y]) => x === coordinate[0] && y === coordinate[1]);
  }
}
