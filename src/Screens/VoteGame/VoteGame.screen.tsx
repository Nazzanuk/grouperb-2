/* eslint-disable @next/next/no-img-element */
import { FC, useEffect } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { userAtom } from 'Atoms/User.atom';
import { voteGameAtom } from 'Atoms/VoteGame.atom';
import { voteGameHelpersAtom } from 'Atoms/VoteGameHelpers.atom';
import { wsAtom } from 'Atoms/Ws.atom';

import styles from './VoteGame.screen.module.css';

export const VoteGameScreen: FC = () => {
  const { query } = useRouter();
  const game = useAtomValue(voteGameAtom);
  const send = useSetAtom(wsAtom);
  const user = useAtomValue(userAtom);
  const { status, currentQuestion, currentRound, currentRoundIndex, isHost, userArray } =
    useAtomValue(voteGameHelpersAtom);

  console.log({ game });

  const leaveGame = () => send({ action: 'leaveGame', gameId: game!.id, userId: user.id });
  const startGame = () => send({ action: 'startVoteGame', gameId: game!.id, userId: user.id });

  useEffect(() => {
    console.log({ query });
    if (query.voteGameId) {
      send({ action: 'getGame', gameId: query.voteGameId as string });
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
        {status === 'lobby' && (
          <>
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
                  <div className={styles.playerName}>
                    {game.hostId === user.id && <i className="fas fa-star" />} {user.username}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {status === 'voting' && (
          <>
            <div className="label">Round {currentRoundIndex + 1}</div>


            <div className="shout">Who {currentQuestion}?</div>


            <div className="label">Voted</div>


            <div className="label">Still pondering</div>
          </>
        )}

        <div className={styles.buttons}>
          {status === 'lobby' && (
            <>
              {isHost && (
                <div className="button" data-variant="light" onClick={startGame}>
                  Start game
                </div>
              )}
              <Link href="/home" className="button" onClick={leaveGame}>
                Leave game
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};
