import random from 'lodash/random';
import { Game } from 'Entities/Game.entity';
import { User } from 'Entities/User.entity';
import { UserId } from 'Entities/UserId.entity';
import shuffle from 'lodash/shuffle';
import chunk from 'lodash/chunk';
import isEqual from 'lodash/isEqual';
import without from 'lodash/without';
import { v4 } from 'uuid';

export type Card = {
  id: string;
  color: string;
  value: number;
};

export class LigrettoGame {
  id = random(10000, 99999).toString();
  type = 'ligretto' as const;
  users: { [key: UserId]: User };
  hostId: UserId;
  rounds: any[] = [];
  status: 'lobby' | 'playing' | 'finished' = 'lobby';
  winner: UserId | null = null;
  deck: Card[] = [];
  tablePiles: Card[][] = [];
  colors = shuffle([
    '#9F1010', // red
    '#DFA500', // orange
    '#90CF0A', // green,
    '#3777FF', // blue
    '#A500DF', // purple
  ]);
  userPiles: { [key: UserId]: Card[] } = {};

  constructor(host: User) {
    this.users = { [host.id]: host };
    this.hostId = host.id;
  }

  static restoreGame(game: Game): LigrettoGame {
    const ligrettoGame = new LigrettoGame(game.users[game.hostId]);
    Object.assign(ligrettoGame, game);
    return ligrettoGame;
  }

  generateDeck(playerCount: number): Card[] {
    const deck: Card[] = [];
    const colors = this.colors.splice(0, playerCount);
    for (const color of colors) {
      for (let value = 1; value <= 10; value++) {
        deck.push({ id: v4(), color, value });
        deck.push({ id: v4(), color, value });
      }
    }
    return shuffle(deck);
  }

  startGame(): void {
    if (this.status === 'lobby' && Object.keys(this.users).length >= 2) {
      this.tablePiles = [];
      this.userPiles = {};

      const userArray = Object.values(this.users);

      this.deck = this.generateDeck(userArray.length);

      userArray.forEach((user, index) => {
        this.userPiles[user.id as UserId] = chunk(this.deck, this.deck.length / userArray.length)[index];
      });

      this.status = 'playing';
    }
  }

  playCard(userId: UserId, card: Card): void {
    if (this.status !== 'playing' || !this.users[userId]) return;

    console.log('1', { userId, card });

    const userPile = [...this.userPiles[userId]];

    console.log('2', { userId, card, userPile, tablePiles: this.tablePiles });

    if (!userPile.slice(0, 4).find((c) => isEqual(c, card))) return;

    console.log('3', { userId, card, userPile, tablePiles: this.tablePiles });

    if (card.value === 1) {
      this.tablePiles.push([card]);
      this.userPiles[userId] = this.userPiles[userId].filter((c) => c.id !== card.id);
      return;
    }

    console.log('4', { userId, card });
    // let canPlayCard = false;

    for (const tablePile of this.tablePiles) {
      const lastCard = tablePile[tablePile.length - 1];
      if (lastCard.color === card.color && lastCard.value + 1 === card.value) {
        // canPlayCard = true;

        tablePile.push(card);
        this.userPiles[userId] = this.userPiles[userId].filter((c) => c.id !== card.id);

        break;
      }
    }

    if (this.userPiles[userId].length <= 3) {
      this.winner = userId;
      this.status = 'finished';
    }
  }

  resetGame(): void {
    this.deck = [];
    this.tablePiles = [];
    this.winner = null;
    this.status = 'lobby';
  }

  getUserList(): User[] {
    return Object.values(this.users);
  }

  getWinner(): UserId | null {
    return this.winner;
  }

  getCardsOnTable(): Card[][] {
    return this.tablePiles;
  }

  getUserCardCount(userId: UserId): number | null {
    if (!this.users[userId]) return null;
    return this.userPiles[userId].length;
  }

  getRemainingCardsToWin(userId: UserId): number | null {
    if (!this.users[userId]) return null;
    return Math.abs(4 - this.userPiles[userId].length);
  }

  drawPileCard(userId: UserId): void {
    if (!this.users[userId] || this.status !== 'playing') return;

    const [a, b, c, d, ...cards] = this.userPiles[userId];

    this.userPiles[userId] = [a, b, c, ...cards, d];
  }

  getUserFaceUpCards(userId: UserId): Card[] | null {
    if (!this.users[userId]) return null;

    return this.userPiles[userId].slice(0, 4);
  }

  getUserPile(userId: UserId): Card[] | null {
    if (!this.users[userId]) return null;
    return this.userPiles[userId];
  }

  getUserPileTopCard(userId: UserId): Card | null {
    if (!this.users[userId]) return null;
    return this.userPiles[userId][this.userPiles[userId].length - 1] ?? null;
  }

  getTablePiles(): { color: string; topCard: Card }[] {
    return this.tablePiles.map((pile) => {
      return { color: pile[0].color, topCard: pile[pile.length - 1] };
    });
  }

  getUserPilesInfo(): { [key: UserId]: { topCard: Card | null; count: number } } {
    const pilesInfo: { [key: UserId]: { topCard: Card | null; count: number } } = {};

    for (const userId in this.users) {
      const topCard = this.getUserPileTopCard(userId as UserId);
      const count = this.getUserPile(userId as UserId)?.length ?? 0;

      pilesInfo[userId as UserId] = { topCard, count };
    }

    return pilesInfo;
  }
}
