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
import { User } from 'Entities/User.entity';
import { VoteGame } from 'Entities/VoteGame.entity';
import { UserId } from 'Entities/UserId.entity';

export const VoteGameScreen: FC = () => {
  const { query } = useRouter();
  const game = useAtomValue(voteGameAtom);
  const send = useSetAtom(wsAtom);
  const user = useAtomValue(userAtom);
  const {
    status,
    currentQuestion,
    currentRound,
    currentRoundIndex,
    isHost,
    userArray,
    usersThatHaveVoted,
    usersThatHaveNotVoted,
    usersWithoutMe,
    IHaveVoted,
    isObserver,
  } = useAtomValue(voteGameHelpersAtom);

  console.log({ game, status });

  const leaveGame = () => send({ action: 'leaveGame', gameId: game!.id, userId: user.id });
  const startGame = () => send({ action: 'startVoteGame', gameId: game!.id, userId: user.id });
  const startRound = () => send({ action: 'startVoteRound', gameId: game!.id, userId: user.id });
  const castVote = (voteUserId: UserId) =>
    send({ action: 'castVote', gameId: game!.id, userId: user.id, vote: voteUserId });

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
            <PlayerList users={userArray} game={game} />
          </>
        )}

        {status === 'voting' && (
          <>
            <div className="label">Round {currentRoundIndex}</div>

            <div className="shout">Who {currentQuestion}?</div>

            <div className="label">Voted</div>
            <PlayerList users={usersThatHaveVoted} game={game} />

            <div className="label">Still pondering</div>
            <PlayerList users={usersThatHaveNotVoted} game={game} />

            {!IHaveVoted && (
              <div className={styles.userButtons}>
                {usersWithoutMe.map((user) => (
                  <div
                    className="button"
                    data-variant="orange"
                    data-size="s"
                    key={user.id}
                    onClick={() => castVote(user.id)}
                  >
                    {user.username}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {status === 'results' && (
          <>
            <div className="label">Round {currentRoundIndex}</div>
            <div className="shout">Who {currentQuestion}?</div>

            <div className={styles.singlePlayer}>
              <img
                className={styles.playerImage}
                src={`/img/avatars/${user.avatar}`}
                alt="avatar"
              />
              <div className={styles.playerName}>
                {game.hostId === user.id && <i className="fas fa-star" />} {user.username}
              </div>
            </div>
          </>
        )}

        {status === 'results' && (
          <div className={styles.buttons}>
            <>
              {!isObserver && (
                <div className="button" data-variant="light" onClick={startRound}>
                  Next round
                </div>
              )}
            </>
          </div>
        )}

        {status === 'lobby' && (
          <div className={styles.buttons}>
            <>
              {isHost && (
                <div className="button" data-variant="light" onClick={startGame}>
                  Start game
                </div>
              )}
              {!isObserver && (
                <Link href="/home" className="button" onClick={leaveGame}>
                  Leave game
                </Link>
              )}
            </>
          </div>
        )}
      </div>
    </>
  );
};

export const PlayerList: FC<{ users: User[]; game: VoteGame }> = ({ users, game }) => {
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
