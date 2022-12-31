/* eslint-disable @next/next/no-img-element */
import { FC } from 'react';

import { useEffect } from 'react';

import { useAtomValue } from 'jotai';
import { wsAtom } from 'Atoms/Ws.atom';
import { voteGameAtom } from 'Atoms/VoteGame.atom';

import styles from './VoteGame.screen.module.css';
import { voteGameHelpersAtom } from 'Atoms/VoteGameHelpers.atom';
import Link from 'next/link';

export const VoteGameScreen: FC = () => {
  const game = useAtomValue(voteGameAtom);
  const { status, currentQuestion, currentRound, userArray } = useAtomValue(voteGameHelpersAtom);

  console.log({ game });

  if (!game) return null;

  return (
    <>
      <div className="darkScreen">
        <div className="label">Game ID</div>
        <div className="textOutput">{game.id}</div>

        <div className="label">Players</div>
        <div className={styles.playerList}>
          {userArray.map((user) => (
            <div className={styles.player} key={user.id}>
              <img
                className={styles.playerImage}
                src={`/img/avatars/${user.avatar}`}
                alt="avatar"
              />
              <div className={styles.playerName}>{user.username}</div>
            </div>
          ))}
          {userArray.map((user) => (
            <div className={styles.player} key={user.id}>
              <img
                className={styles.playerImage}
                src={`/img/avatars/${user.avatar}`}
                alt="avatar"
              />
              <div className={styles.playerName}>{user.username}</div>
            </div>
          ))}
          {userArray.map((user) => (
            <div className={styles.player} key={user.id}>
              <img
                className={styles.playerImage}
                src={`/img/avatars/${user.avatar}`}
                alt="avatar"
              />
              <div className={styles.playerName}>{user.username}</div>
            </div>
          ))}
          {userArray.map((user) => (
            <div className={styles.player} key={user.id}>
              <img
                className={styles.playerImage}
                src={`/img/avatars/${user.avatar}`}
                alt="avatar"
              />
              <div className={styles.playerName}>{user.username}</div>
            </div>
          ))}
          {userArray.map((user) => (
            <div className={styles.player} key={user.id}>
              <img
                className={styles.playerImage}
                src={`/img/avatars/${user.avatar}`}
                alt="avatar"
              />
              <div className={styles.playerName}>{user.username}</div>
            </div>
          ))}
        </div>

        <div className={styles.buttons}>
          <div className="button" data-variant="light">
            Start game
          </div>
          <Link href="/home" className="button">Leave game</Link>
        </div>
      </div>
    </>
  );
};
