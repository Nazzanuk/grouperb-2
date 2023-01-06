/* eslint-disable @next/next/no-img-element */
import { FC, useEffect, useRef, useState } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';
import random from 'lodash/random';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { userAtom } from 'Atoms/User.atom';
import { voteGameAtom } from 'Atoms/VoteGame.atom';
import { voteGameHelpersAtom } from 'Atoms/VoteGameHelpers.atom';
import { wsAtom } from 'Atoms/Ws.atom';
import { User } from 'Entities/User.entity';
import { UserId } from 'Entities/UserId.entity';
import { VoteGame } from 'Entities/VoteGame.entity';

import styles from './VoteGame.screen.module.css';

export const VoteGameScreen: FC = () => {
  const { query } = useRouter();
  const i = useRef<NodeJS.Timer>(null);
  const [trophyIndex, setTrophyIndex] = useState(1);
  const [isNextRoundEnabled, setIsNextRoundEnabled] = useState(false);
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
    have3Users,
    winnersArray,
    isWinner,
    allAreWinners,
    winnersString,
  } = useAtomValue(voteGameHelpersAtom);

  console.log({ game, status });

  const leaveGame = () => send({ action: 'leaveGame', gameId: game!.id, userId: user.id });
  const startGame = () => send({ action: 'startVoteGame', gameId: game!.id, userId: user.id });
  const startRound = () => send({ action: 'startVoteRound', gameId: game!.id, userId: user.id });
  const castVote = (voteUserId: UserId) =>
    send({ action: 'castVote', gameId: game!.id, userId: user.id, vote: voteUserId });

  useEffect(() => {
    if (game?.status !== 'results') return setIsNextRoundEnabled(false);
    setTimeout(() => setIsNextRoundEnabled(true), 4000);
  }, [game?.status === 'results']);

  useEffect(() => {
    setTrophyIndex(random(1, 3));
  }, [game?.rounds.length]);

  useEffect(() => {
    console.log({ query });
    if (query.voteGameId) {
      send({ action: 'getGame', gameId: query.voteGameId as string });
    }
  }, [query.voteGameId]);

  useEffect(() => {
    console.log({ query });

    if (!query.voteGameId) return;

    i.current = setInterval(() => {
      send({ action: 'getGame', gameId: query.voteGameId as string });
    }, 10000);

    return () => {
      clearInterval(i.current);
    };
  }, [query.voteGameId]);

  if (!game)
    return (
      <div className="darkScreen">
        <div className="label">Loading...</div>
      </div>
    );

  return (
    <>
      <div className="darkScreen" style={{ backgroundImage: `url('/img/backgrounds/b9.png')` }}>
        <div className="darkScreenOverlay" />
        <div className="darkScreenContent">
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

              {/* <div className="label">Voted</div>
            <PlayerList users={usersThatHaveVoted} game={game} /> */}

              <div className="label">Still pondering</div>
              <PlayerList users={usersThatHaveNotVoted} game={game} />

              {!IHaveVoted && !isObserver && (
                <div className={styles.userButtons}>
                  {userArray.map((user) => (
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

              {!isWinner && (
                <div className={styles.singlePlayer} data-animate key="winner">
                  <img
                    className={styles.playerImage}
                    src={`/img/avatars/${winnersArray[0].avatar}`}
                    alt="avatar"
                  />

                  <div className={styles.playerName}>{winnersString}</div>
                </div>
              )}

              {isWinner && (
                <div className={styles.singlePlayer} data-animate key="winner">
                  <img
                    className={styles.playerImage}
                    src={`/img/trophies/trophy-${trophyIndex}.png`}
                    alt="trophy"
                  />

                  <div className={styles.playerName}>
                    {allAreWinners ? 'All of You!' : winnersString}
                  </div>
                </div>
              )}

              <div className={styles.buttons}>
                <>
                  {!isObserver && (
                    <div
                      className="button"
                      data-variant="light"
                      onClick={startRound}
                      data-disabled={!isNextRoundEnabled}
                    >
                      Next round
                    </div>
                  )}
                </>
              </div>
            </>
          )}

          {status === 'lobby' && (
            <div className={styles.buttons}>
              <>
                {!have3Users && (
                  <div className={styles.blurb}>
                    At least 3 players are needed to start the game
                  </div>
                )}

                {!isHost && have3Users && (
                  <div className={styles.blurb}>Waiting for host to start game...</div>
                )}

                {isHost && userArray.length > 2 && (
                  <div className="button" data-variant="orange" onClick={startGame}>
                    Start game
                  </div>
                )}

                <Link href="/home" className="button" onClick={leaveGame} data-variant="light">
                  Leave game
                </Link>
              </>
            </div>
          )}
        </div>
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
