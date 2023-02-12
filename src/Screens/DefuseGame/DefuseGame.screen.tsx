/* eslint-disable @next/next/no-img-element */
import { FC, useEffect, useRef, useState } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';
import random from 'lodash/random';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { defuseGameAtom } from 'Atoms/DefuseGame.atom';
import { defuseGameHelpersAtom } from 'Atoms/DefuseGameHelpers.atom';

import { userAtom } from 'Atoms/User.atom';

import { wsAtom } from 'Atoms/Ws.atom';
import { BombBroadcast } from 'Components/BombBroadcast/BombBroadcast';
import { InfoOverlay } from 'Components/InfoOverlay/InfoOverlay';
import { WinnerBroadcast } from 'Components/WinnerBroadcast/WinnerBroadcast';
import { DefuseGame } from 'Entities/DefuseGame.entity';
import { User } from 'Entities/User.entity';
import { UserId } from 'Entities/UserId.entity';

import { checkDefuseRule, generateRule } from 'Utils/Defuse/Defuse.utils';

import styles from './DefuseGame.screen.module.css';
import { useLoadGame } from 'Hooks/useLoadGame';
import { useUpdateGame } from 'Hooks/useUpdateGame';
import { LoadingGame } from 'Components/LoadingGame/LoadingGame';
import { DynamicBackground } from 'Components/DynamicBackground/DynamicBackground';

export const DefuseGameScreen: FC = () => {
  const { query } = useRouter();
  const [trophyIndex, setTrophyIndex] = useState(1);
  const [timer, setTimer] = useState(0);
  const game = useAtomValue(defuseGameAtom);
  const send = useSetAtom(wsAtom);
  const user = useAtomValue(userAtom);
  const {
    status,
    currentRound,
    currentRoundIndex,
    isHost,
    userArray,
    usersWithoutMe,
    isObserver,
    orderedWires,
    myRules,
    cutWiresWires,
    timeRemaining,
    hasBeenCut,
  } = useAtomValue(defuseGameHelpersAtom);

  useLoadGame(query.defuseGameId as string | undefined);
  useUpdateGame(query.defuseGameId as string | undefined);

  console.log({ game, status });

  const leaveGame = () => send({ action: 'leaveGame', gameId: game!.id, userId: user.id });
  const startGame = () => send({ action: 'startDefuseRound', gameId: game!.id, userId: user.id });
  const restartGame = () => send({ action: 'restartDefuseGame', gameId: game!.id, userId: user.id });
  const startRound = () => send({ action: 'startDefuseRound', gameId: game!.id, userId: user.id });
  const timeUp = () => send({ action: 'defuseTimeUp', gameId: game!.id, userId: user.id });

  const chooseWire = (letter: string) => {
    send({ action: 'chooseDefuseWire', gameId: game!.id, userId: user.id, letter });
  };

  useEffect(() => {
    if (game?.status !== 'playing') return;

    const interval = setInterval(() => {
      const timeRemaining =
        (currentRound?.duration ?? 0) - (Date.now() - new Date(currentRound?.timeStarted ?? 0).getTime()) / 1000;

      setTimer(Math.round(timeRemaining));

      if (timeRemaining <= -1) {
        clearInterval(interval);
        setTimer(0);
        timeUp();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [game?.status]);

  useEffect(() => {
    setTrophyIndex(random(1, 3));
  }, [game?.rounds.length]);

  if (!game) return <LoadingGame />;

  return (
    <>
      <InfoOverlay />
      <div className="darkScreen" >
        <div className="darkScreenOverlay" />

      <DynamicBackground floaterCount={100} isDark noLines/>
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
              <>
                {!isHost && <div className={styles.blurb}>Waiting for host to start game...</div>}

                {isHost && (
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

          {status === 'playing' && (
            <>
              <WinnerBroadcast
                text={`Round ${currentRoundIndex}`}
                subText={'Defuse the bomb!'}
                duration={'1.5s'}
                bits={5}
              />
            </>
          )}
          {(status === 'playing' || status === 'defused' || status === 'failed') && (
            <>
              <div className={styles.wireBox}>
                <div className={styles.bigBox}>
                  <div className={styles.armed} data-status={status}>
                    {status === 'playing' ? 'Bomb armed' : ''}
                    {status === 'failed' ? `${timer === 0 ? 'You ran out of time!' : ''}` : ''}
                    {status === 'defused' ? `Bomb inactive` : ''}
                  </div>

                  <div className={styles.answers}>
                    {orderedWires.map((wire, i) => (
                      <div
                        className={styles.answer}
                        key={cutWiresWires[i]?.letter ?? i}
                        style={{ '--color': cutWiresWires[i]?.color }}
                      >
                        {cutWiresWires[i]?.letter}
                      </div>
                    ))}
                  </div>

                  <div
                    className={styles.clock}
                    style={{ '--timeRemaining': timer, '--time': (game.rounds.length - 1) * 10 + 19 }}
                  >
                    <div className={styles.time}>
                      <div className={styles.timeFill} />
                    </div>
                  </div>
                </div>
                <div className={styles.wires}>
                  {orderedWires.map((wire, i) => (
                    <div
                      key={wire.letter}
                      className={styles.wire}
                      style={{ '--color': wire.color }}
                      data-cut={hasBeenCut(wire.letter)}
                    ></div>
                  ))}
                </div>
                <div className={styles.lights}>
                  {orderedWires.map((wire, i) => (
                    <div className={styles.lightBox} key={wire.letter} onClick={() => chooseWire(wire.letter)}>
                      <div
                        className={styles.light}
                        style={{ '--color': wire.color }}
                        data-cut={hasBeenCut(wire.letter)}
                      >
                        {wire.letter}
                        {/* {['A', 'B', 'C', 'D', 'E', 'F'][i]} */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="label">Round {game.rounds.length} instructions</div>
              {/* <div className="textOutput">{game.id}</div> */}

              <div className={styles.clues}>
                {myRules.map((rule, i) => (
                  <div className={styles.clue} key={i} data-pass={checkDefuseRule(rule, cutWiresWires)[1]}>
                    {checkDefuseRule(rule, currentRound!.wires ?? [])[0]} &nbsp;
                    {/* {checkDefuseRule(rule, cutWiresWires)[1] ? 'pass': 'fail'} */}
                  </div>
                ))}
              </div>
            </>
          )}

          {status === 'defused' && (
            <>
              <WinnerBroadcast
                img={`/img/trophies/trophy-${trophyIndex}.jpeg`}
                text={'Bomb defused!'}
                // subText={''}
              />

              <div className={styles.buttons}>
                <div className="button" data-variant="orange" onClick={startRound}>
                  Start next round
                </div>
              </div>
            </>
          )}

          {status === 'failed' && (
            <>
              <BombBroadcast
                // img={`/img/trophies/trophy-${trophyIndex}.jpeg`}
                text={'Boom! '}
                subText={'Game over'}
                duration={'10s'}
              />

              <div className={styles.buttons}>
                <div className="button" data-variant="orange" onClick={restartGame}>
                  New game
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export const PlayerList: FC<{ users: User[]; game: DefuseGame }> = ({ users, game }) => {
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
