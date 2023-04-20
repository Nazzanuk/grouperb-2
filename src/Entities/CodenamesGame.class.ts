import { WORD_LIST } from 'Constants/codenamesWordList';
import { Game } from 'Entities/Game.entity';
import { User } from 'Entities/User.entity';
import { UserId } from 'Entities/UserId.entity';
import random from 'lodash/random';
import sampleSize from 'lodash/sampleSize';
import shuffle from 'lodash/shuffle';
import { v4 } from 'uuid';

export type Card = {
  id: string;
  word: string;
  type: 'red' | 'blue' | 'neutral' | 'assassin';
  revealed: boolean;
};

export type PlayerRole = 'spymaster' | 'operative';

export class CodenamesGame {
  id = random(10000, 99999).toString();
  type = 'codenames' as const;
  users: { [key: UserId]: User };
  hostId: UserId;
  status: 'lobby' | 'playing' | 'finished' = 'lobby';
  winner: 'red' | 'blue' | null = null;
  grid: Card[] = [];
  rounds: any[] = [];
  words: string[] = sampleSize(WORD_LIST, 25);
  redRemaining: number;
  blueRemaining: number;
  currentPlayer: 'red' | 'blue';
  teamAssignments: { [key: UserId]: { team: 'red' | 'blue'; role: PlayerRole } } = {};
  maxGuessesForCurrentTurn: number = 0;
  turnPhase: 'clueGiver' | 'guessing' = 'clueGiver';

  constructor(host: User) {
    this.users = { [host.id]: host };
    this.hostId = host.id;
    this.redRemaining = 9;
    this.blueRemaining = 8;
    this.currentPlayer = 'red';
  }

  static restoreGame(game: Game): CodenamesGame {
    const codenamesGame = new CodenamesGame(game.users[game.hostId]);
    Object.assign(codenamesGame, game);
    return codenamesGame;
  }

  generateGrid(): Card[] {
    const shuffledWords = shuffle(this.words);
    const grid: Card[] = [];

    for (let i = 0; i < 25; i++) {
      let type: 'red' | 'blue' | 'neutral' | 'assassin';
      if (i < 9) type = 'red';
      else if (i < 17) type = 'blue';
      else if (i < 24) type = 'neutral';
      else type = 'assassin';

      grid.push({ id: v4(), word: shuffledWords[i], type, revealed: false });
    }

    return shuffle(grid);
  }

  startGame(): void {
    if (this.status === 'lobby' && Object.keys(this.users).length >= 4) {
      this.grid = this.generateGrid();

      //shuffle users and return as object again
      this.users = Object.fromEntries(Object.entries(this.users).sort(() => Math.random() - 0.5));

      const userArray = Object.values(this.users);

      userArray.forEach((user, i) => this.assignPlayerToTeam(user.id));
      this.status = 'playing';
    }
  }

  revealCard(userId: UserId, cardId: string): void {
    if (
      this.status !== 'playing' ||
      !this.users[userId] ||
      this.getPlayerRole(userId) === 'spymaster' ||
      this.maxGuessesForCurrentTurn <= 0 ||
      this.getPlayerTeam(userId) !== this.currentPlayer
    ) {
      return;
    }

    const card = this.grid.find((c) => c.id === cardId);
    if (!card || card.revealed) return;

    card.revealed = true;
    this.maxGuessesForCurrentTurn--;

    if (card.type === 'assassin') {
      this.winner = this.currentPlayer === 'red' ? 'blue' : 'red';
      this.status = 'finished';
    } else if (card.type === this.currentPlayer) {
      if (this.currentPlayer === 'red') {
        this.redRemaining -= 1;
      } else {
        this.blueRemaining -= 1;
      }

      if (this.redRemaining === 0 || this.blueRemaining === 0) {
        this.winner = this.currentPlayer;
        this.status = 'finished';
      }
    } else if (card.type !== 'neutral') {
      this.switchTurn();
      return;
    }
    
    if (this.maxGuessesForCurrentTurn === 0) {
      this.switchTurn();
    }
  }

  assignPlayerToTeam(userId: UserId): void {
    const redTeamCount = Object.values(this.teamAssignments).filter((assignment) => assignment.team === 'red').length;
    const blueTeamCount = Object.values(this.teamAssignments).filter((assignment) => assignment.team === 'blue').length;

    const team = redTeamCount <= blueTeamCount ? 'red' : 'blue';
    const role: PlayerRole =
      (team === 'red' && redTeamCount === 0) || (team === 'blue' && blueTeamCount === 0) ? 'spymaster' : 'operative';

    this.teamAssignments[userId] = { team, role };
  }

  switchTurn(): void {
    this.currentPlayer = this.currentPlayer === 'red' ? 'blue' : 'red';
    this.maxGuessesForCurrentTurn = 0;
    this.turnPhase = 'clueGiver';
  }

  setMaxGuessesForTurn(userId: UserId, guesses: number): boolean {
    if (this.status !== 'playing' || this.getPlayerRole(userId) !== 'spymaster' || guesses < 1) {
      return false;
    }

    this.maxGuessesForCurrentTurn = guesses;
    this.turnPhase = 'guessing';
    return true;
  }

  resetGame(): void {
    this.grid = [];
    this.winner = null;
    this.status = 'lobby';
    this.redRemaining = 9;
    this.blueRemaining = 8;
    this.currentPlayer = 'red';
    this.teamAssignments = {};
    this.maxGuessesForCurrentTurn = 0;
  }

  getUserList(): User[] {
    return Object.values(this.users);
  }

  getWinner(): 'red' | 'blue' | null {
    return this.winner;
  }

  getGrid(): Card[] {
    return this.grid;
  }

  getCurrentPlayer(): 'red' | 'blue' {
    return this.currentPlayer;
  }

  getRemainingCount(team: 'red' | 'blue'): number {
    return team === 'red' ? this.redRemaining : this.blueRemaining;
  }

  getPlayerTeam(userId: UserId): 'red' | 'blue' | null {
    return this.teamAssignments[userId]?.team ?? null;
  }

  getPlayerRole(userId: UserId): PlayerRole | null {
    return this.teamAssignments[userId]?.role ?? null;
  }

  isUserSpymaster(userId: UserId): boolean {
    return this.getPlayerRole(userId) === 'spymaster';
  }

  isUserOperative(userId: UserId): boolean {
    return this.getPlayerRole(userId) === 'operative';
  }

  isUsersTurn(userId: UserId): boolean {
    return this.getPlayerTeam(userId) === this.currentPlayer;
  }

  canUserRevealCard(userId: UserId): boolean {
    return (
      this.status === 'playing' &&
      this.isUserOperative(userId) &&
      this.isUsersTurn(userId) &&
      this.maxGuessesForCurrentTurn > 0
    );
  }

  getPlayerInstructions(userId: UserId): string {
    const playerRole = this.getPlayerRole(userId);
    const playerTeam = this.getPlayerTeam(userId);

    if (this.status === 'lobby') {
      return 'Waiting for enough players to join and the host to start the game.';
    }

    if (this.status === 'finished') {
      if (this.winner === playerTeam) {
        return 'Congratulations! Your team has won the game!';
      } else {
        return 'Sorry, your team has lost the game. Better luck next time!';
      }
    }

    if (playerTeam === this.currentPlayer) {
      if (playerRole === 'spymaster') {
        return `Say the one-word clue out loud and choose number of guesses for your team's operatives.`;
      } else {
        if (this.maxGuessesForCurrentTurn === 0) {
          return `Wait for your spymaster to give a clue and the number of guesses.`;
        } else {
          return `Your spymaster has given a clue and the number of guesses is ${this.maxGuessesForCurrentTurn}. Discuss with your team and make a guess.`;
        }
      }
    } else {
      return `Please wait for the ${this.currentPlayer} team to complete their turn.`;
    }
  }

  getWinningSpymaster(): User | null {
    if (this.status !== 'finished' || this.winner === null) {
      return null;
    }

    const winningSpymaster = Object.entries(this.teamAssignments).find(
      ([userId, assignment]) => assignment.team === this.winner && assignment.role === 'spymaster',
    );

    if (winningSpymaster) {
      const [winningSpymasterId] = winningSpymaster;
      return this.users[winningSpymasterId as UserId];
    }

    return null;
  }

  isUserTurn(userId: UserId): boolean {
    if (this.status !== 'playing' || !this.users[userId]) {
      return false;
    }

    const userTeam = this.getPlayerTeam(userId);
    const userRole = this.getPlayerRole(userId);

    if (userTeam !== this.currentPlayer) return false;

    // If the role is 'operative', only allow operatives to make a move during their turn
    if (userRole === 'operative' && this.turnPhase === 'guessing') return true;

    // If the role is 'spymaster', only allow spymasters to make a move during their turn
    if (userRole === 'spymaster' && this.turnPhase === 'clueGiver') return true;

    return false;
  }

  getCurrentUserRoleTurn(): PlayerRole {
    return this.turnPhase === 'clueGiver' ? 'spymaster' : 'operatives';
  }
}
