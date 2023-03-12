/* eslint-disable @next/next/no-img-element */

import { FC } from 'react';

import { BlocksGame } from 'Entities/BlocksGame.entity';
import { User } from 'Entities/User.entity';

import styles from './PlayerList.module.css';
import { Game } from 'Entities/Game.entity';

export const PlayerList: FC<{ users: User[]; game: Game }> = ({ users, game }) => {
  return (
    <div className={styles.playerList}>
      {users.map((user) => (
        <div className={styles.player} key={user.id}>
          <img className={styles.playerImage} src={`/img/avatars/${user.avatar}`} alt="avatar" />
          <div className={styles.playerName}>
            {game.hostId === user.id && <i className="fas fa-star" />} {user.username}
          </div>
        </div>
      ))}
    </div>
  );
};
