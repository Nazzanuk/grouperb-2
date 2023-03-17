import { FC, useEffect, useRef, useState } from 'react';

import { animated, to, useSpring } from '@react-spring/web';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

import random from 'lodash/random';
import sample from 'lodash/sample';
import times from 'lodash/times';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { currentGameAtom } from 'Atoms/CurrentGame.atom';
import { flowGameAtom } from 'Atoms/FlowGame.atom';
import { flowGameHelpersAtom } from 'Atoms/FlowGameHelpers.atom';
import { showScoreAtom } from 'Atoms/ShowScore.atom';
import { totalPointsAtom } from 'Atoms/TotalPoints.atom';
import { userAtom } from 'Atoms/User.atom';
import { wsAtom } from 'Atoms/Ws.atom';
import { DynamicBackground } from 'Components/DynamicBackground/DynamicBackground';
import { InfoOverlay } from 'Components/InfoOverlay/InfoOverlay';
import { LoadingGame } from 'Components/LoadingGame/LoadingGame';
import { PlayerList } from 'Components/PlayerList/PlayerList';

import { ShowScore } from 'Components/ShowScore/ShowScore';

import { useLoadGame } from 'Hooks/useLoadGame';
import { useUpdateGame } from 'Hooks/useUpdateGame';
import { useFlowGame } from 'Screens/FlowGame/useFlowGame';
import { useOnce } from 'Utils/UseOnce';

import styles from './FlowGame.screen.module.css';
import { WinnerBroadcast } from 'Components/WinnerBroadcast/WinnerBroadcast';

export function FlowGameScreen() {
  const { query } = useRouter();
  const { startRound, leaveGame, updatePoints, timeRemaining, restartFlowGame } = useFlowGame();

  const [animations, setAnimated] = useSpring(() => ({ myTotal: 0, totalTeamScore: 0 }));

  const game = useAtomValue(flowGameAtom);
  const { currentRound, currentRoundIndex, isHost, isGameOver, status, userArray } = useAtomValue(flowGameHelpersAtom);
  const { usersWithoutMe, sequence, lanes, target, totalTeamScore, sortedScorers } = useAtomValue(flowGameHelpersAtom);

  console.log({ game, status });

  const user = useAtomValue(userAtom);
  const myTotal = useAtomValue(totalPointsAtom);

  useEffect(() => {
    if (status !== 'playing') return;
    setAnimated.start({ myTotal });
    updatePoints(myTotal);
  }, [myTotal]);

  useEffect(() => {
    if (status !== 'playing') return;
    setAnimated.start({ totalTeamScore });
  }, [totalTeamScore]);

  if (!game) return <LoadingGame />;

  return (
    <>
      <InfoOverlay />
      <div className="darkScreen">
        <div className="darkScreenOverlay" />
        <DynamicBackground floaterCount={30} />

        <div className="darkScreenContent" style={{ overflow: 'hidden' }}>
          <ShowScore />

          {status === 'lobby' && (
            <>
              <div className="label">Game code</div>
              <div className="textOutput">{game.id}</div>

              <div className="label">Players</div>
              <PlayerList users={userArray} game={game} />
            </>
          )}

          {status === 'results' && (
            <>
              {isGameOver && (
                <WinnerBroadcast text={`Game over!`} subText={`Not enough points`} duration={'6s'} bits={50} />
              )}

              {!isGameOver && (
                <WinnerBroadcast text={`Complete!`} subText={`${totalTeamScore} points!`} duration={'6s'} bits={50} />
              )}

              <div className="label">Round {currentRoundIndex}</div>
              {/* <div className="label">Sequence {sequence.length}</div> */}

              <div className={styles.scoreGrid}>
                <div className={styles.scoreLabel}>My score</div>
                <div className={styles.scoreLabel}>Team score</div>
                <div className={styles.scoreLabel}>Target</div>

                <animated.div className={styles.myScore}>
                  {to(animations.myTotal, (value) => Math.round(value))}
                </animated.div>

                <animated.div className={styles.total}>
                  {to(animations.totalTeamScore, (value) => Math.round(value))}
                </animated.div>

                <div className={styles.target}>{target}</div>
              </div>

              <div className="table">
                <div className="cell w50 heading">Player</div>
                <div className="cell heading">Points</div>
                {sortedScorers.map(([scorerId, score]) => (
                  <>
                    <div className="cell w50">{game.users[scorerId].username}</div>
                    <div className="cell big">{score}</div>
                  </>
                ))}
              </div>
            </>
          )}

          {status === 'playing' && (
            <>
              <div className="label">Round {currentRoundIndex}</div>
              <div className="label">Time remaining {timeRemaining}s</div>
              {/* <div className="label">Sequence {sequence.length}</div> */}

              <div className={styles.scoreGrid}>
                <div className={styles.scoreLabel}>My score</div>
                <div className={styles.scoreLabel}>Team score</div>
                <div className={styles.scoreLabel}>Target</div>

                <animated.div className={styles.myScore}>
                  {to(animations.myTotal, (value) => Math.round(value))}
                </animated.div>

                <animated.div className={styles.total}>
                  {to(animations.totalTeamScore, (value) => Math.round(value))}
                </animated.div>

                <div className={styles.target}>{target}</div>
              </div>

              <div className={styles.boops} key={currentRoundIndex}>
                {times(lanes).map((i) => (
                  <div className={styles.boopBox} key={i}>
                    {sequence
                      .filter((s) => s.index % lanes === i)
                      .map(({ speed, delay, index, color }) => (
                        <Boop
                          delay={delay}
                          speed={speed}
                          key={index}
                          color={color}
                          startTime={currentRound?.startTime}
                        />
                      ))}
                  </div>
                ))}
              </div>
            </>
          )}

          {status === 'results' && (
            <div className={styles.buttons}>
              {isGameOver && (<div className="button" data-variant="orange" onClick={restartFlowGame}>
                Restart game
              </div>)}
              {!isGameOver && (<div className="button" data-variant="orange" onClick={startRound}>
                Next round
              </div>)}
            </div>
          )}

          {status === 'lobby' && (
            <div className={styles.buttons}>
              {!isHost && <div className={styles.blurb}>Waiting for host to start game...</div>}

              {!(userArray.length >= 2) && (
                <div className={styles.blurb}>At least 2 players are needed to start the game</div>
              )}

              {isHost && (
                <div className="button" data-variant="orange" onClick={startRound}>
                  Start game
                </div>
              )}

              <Link href="/home" className="button" onClick={leaveGame} data-variant="light">
                Leave game
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const Boop = ({ delay = 0, speed = 5, color = '', startTime }) => {
  const [endTime, setEndTime] = useState<number>(0);
  const $el = useRef<HTMLDivElement>(null);
  const [init, setInit] = useState(false);
  const [, sync] = useState(0);
  // const [isActive, setIsActive] = useState(false);
  const [wasTapped, setWasTapped] = useState(false);
  const [total, setTotal] = useAtom(totalPointsAtom);
  const [points, setPoints] = useState(0);
  const [appearTime, setAppearTime] = useState(0);
  const showScore = useSetAtom(showScoreAtom);

  const hitTime = ((5000 + delay * 1000 - (new Date().getTime() - startTime)) / 5000) * 100 * speed * 2;
  const y = hitTime;

  const tap = () => {
    if (wasTapped) return;

    setWasTapped(true);
    setPoints(Math.round(400 - Math.abs(hitTime * 15)));
  };

  useEffect(() => {
    console.log({ points });
    if (points > 0) {
      console.log('setting points');
      setTotal((total) => total + points);

      showScore(points);
    }
  }, [points]);

  useEffect(() => {
    const i = setInterval(() => {
      sync((i) => i + 1);
    }, 1);
    return () => clearInterval(i);
  }, []);

  return (
    <div
      className={styles.boopMove}
      ref={$el}
      style={{
        '--y': y,
        '--color': color,
      }}
      data-tapped={wasTapped}
    >
      <div
        className={styles.boop}
        onMouseDown={tap}
        onTouchStart={tap}
        data-tapped={wasTapped}
        data-fail={points < 0}
        data-success={points > 0}
      >
        <div className={styles.inside}></div>
        <div className={styles.points}>+{points}</div>
      </div>
    </div>
  );
};
