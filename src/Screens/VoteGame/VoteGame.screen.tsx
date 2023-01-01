/* eslint-disable @next/next/no-img-element */
import { FC } from 'react';

import { useEffect } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';
import { wsAtom } from 'Atoms/Ws.atom';
import { voteGameAtom } from 'Atoms/VoteGame.atom';

import styles from './VoteGame.screen.module.css';
import { voteGameHelpersAtom } from 'Atoms/VoteGameHelpers.atom';
import Link from 'next/link';
import { useRouter } from 'next/router';

export const VoteGameScreen: FC = () => {
  const { query } = useRouter();
  const game = useAtomValue(voteGameAtom);
  const send = useSetAtom(wsAtom);
  const { status, currentQuestion, currentRound, userArray } = useAtomValue(voteGameHelpersAtom);

  console.log({ game });

  useEffect(() => {
    console.log({ query });
    if (query.voteGameId) {
      send({ action: 'getGame', gameId: query.voteGameId });
    }
  }, [query.voteGameId]);

  if (!game)
    return (
      <div className="darkScreen">
        <div className="label">Loading...</div>
      </div>
    );

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
        </div>

        <div className={styles.buttons}>
          <div className="button" data-variant="light">
            Start game
          </div>
          <Link href="/home" className="button">
            Leave game
          </Link>
        </div>
      </div>
    </>
  );
};
