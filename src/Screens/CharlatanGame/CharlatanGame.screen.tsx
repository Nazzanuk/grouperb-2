/* eslint-disable @next/next/no-img-element */
import { FC, useEffect, useRef, useState } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';
import random from 'lodash/random';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { charlatanGameAtom } from 'Atoms/CharlatanGame.atom';
import { charlatanGameHelpersAtom } from 'Atoms/CharlatanGameHelpers.atom';

import { userAtom } from 'Atoms/User.atom';

import { wsAtom } from 'Atoms/Ws.atom';
import { BombBroadcast } from 'Components/BombBroadcast/BombBroadcast';
import { InfoOverlay } from 'Components/InfoOverlay/InfoOverlay';

import { LoadingGame } from 'Components/LoadingGame/LoadingGame';
import { WinnerBroadcast } from 'Components/WinnerBroadcast/WinnerBroadcast';
import { CharlatanGame } from 'Entities/CharlatanGame.entity';
import { User } from 'Entities/User.entity';
import { UserId } from 'Entities/UserId.entity';
import { useLoadGame } from 'Hooks/useLoadGame';
import { useUpdateGame } from 'Hooks/useUpdateGame';

import styles from './CharlatanGame.screen.module.css';

export const CharlatanGameScreen: FC = () => {
  const { query } = useRouter();

  const [timer, setTimer] = useState(30);
  const game = useAtomValue(charlatanGameAtom);
  const send = useSetAtom(wsAtom);
  const user = useAtomValue(userAtom);
  const { status, currentRound, currentRoundIndex, isHost, userArray, usersWithoutMe, isObserver } =
    useAtomValue(charlatanGameHelpersAtom);

  useLoadGame(query.charlatanGameId as string | undefined);
  useUpdateGame(query.charlatanGameId as string | undefined);

  console.log({ game, status });

  const leaveGame = () => send({ action: 'leaveGame', gameId: game!.id, userId: user.id });
  const startGame = () => send({ action: 'createCharlatanRound', gameId: game!.id, userId: user.id });
  // const restartGame = () => send({ action: 'restartCharlatanGame', gameId: game!.id, userId: user.id });
  // const startRound = () => send({ action: 'startCharlatanRound', gameId: game!.id, userId: user.id });
  // const timeUp = () => send({ action: 'charlatanTimeUp', gameId: game!.id, userId: user.id });

  useEffect(() => {
    if (game?.status !== 'thinking') return;

    const interval = setInterval(() => {
      const startTime: string = currentRound.timeStarted;
      const duration = 30;
      const timeRemaining = duration - (Date.now() - new Date(startTime).getTime()) / 1000;

      setTimer(Math.round(timeRemaining));

      if (timeRemaining <= -1) {
        clearInterval(interval);
        setTimer(0);
        // timeUp();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [game?.status]);

  if (!game) return <LoadingGame />;

  return (
    <>
      <InfoOverlay />
      <div className="darkScreen" style={{ backgroundImage: `url('/img/backgrounds/b13.jpeg')` }}>
        <div className="darkScreenOverlay" />
        <div className="darkScreenContent">
          {status === 'lobby' && (
            <>
              <div className="label">Game code</div>
              <div className="textOutput">{game.id}</div>

              <div className="label">Players</div>
              <PlayerList users={userArray} game={game} />
            </>
          )}

          {status === 'lobby' && (
            <div className={styles.buttons}>
              {!isHost && <div className={styles.blurb}>Waiting for host to start game...</div>}

              {isHost && (
                <div className="button" data-variant="orange" onClick={startGame}>
                  Start game
                </div>
              )}

              <Link href="/home" className="button" onClick={leaveGame} data-variant="light">
                Leave game
              </Link>
            </div>
          )}

          {status === 'thinking' && (
            <>
              <div className={styles.actionArea}>
                <h3>Thinking time: {timer}s</h3>
                <p>Think of a word that describes the answer but doesn't give it away</p>
              </div>

              <div className="label">Topic</div>
              <div className="textOutput">{currentRound.topic}</div>

              <div className="label">Possible answers</div>
              <div className={styles.answers}>
                {currentRound.answers.map((answer) => (
                  <div
                    className={styles.answer}
                    key={answer}
                    data-is-answer={currentRound.answer === answer && currentRound.bluffer !== user.id}
                  >
                    {answer}
                  </div>
                ))}
              </div>

              {currentRound.bluffer === user.id && (
                <>
                  <div className="label">Answer </div>
                  <div className="textOutput">You are the bluffer</div>
                </>
              )}

              {currentRound.bluffer !== user.id && (
                <>
                  <div className="label">Answer</div>
                  <div className="textOutput">{currentRound.answer}</div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export const PlayerList: FC<{ users: User[]; game: CharlatanGame }> = ({ users, game }) => {
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
