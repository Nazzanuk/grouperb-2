/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useMemo, useRef, useState } from 'react';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import random from 'lodash/random';

import times from 'lodash/times';
import Link from 'next/link';

import { useRouter } from 'next/router';
import { useLongPress } from 'use-long-press';

import { blocksGameAtom } from 'Atoms/BlocksGame.atom';
import { blocksGameHelpersAtom } from 'Atoms/BlocksGameHelpers.atom';

import { showScoreAtom } from 'Atoms/ShowScore.atom';
import { userAtom } from 'Atoms/User.atom';

import { wsAtom } from 'Atoms/Ws.atom';
import { DynamicBackground } from 'Components/DynamicBackground/DynamicBackground';
import { InfoOverlay } from 'Components/InfoOverlay/InfoOverlay';

import { LoadingGame } from 'Components/LoadingGame/LoadingGame';
import { PlayerList } from 'Components/PlayerList/PlayerList';
import { ShowScore } from 'Components/ShowScore/ShowScore';
import { WinnerBroadcast } from 'Components/WinnerBroadcast/WinnerBroadcast';

import { Block } from 'Entities/BlocksRound.entity';

import { useBlocksTimer } from 'Hooks/Blocks/useBlocksTimer';
import { useLoadGame } from 'Hooks/useLoadGame';
import { useUpdateGame } from 'Hooks/useUpdateGame';

import styles from './BlocksGame.screen.module.css';
import { animated, to, useSpring } from '@react-spring/web';

export const BlocksGameScreen: FC = () => {
  const { query } = useRouter();

  const game = useAtomValue(blocksGameAtom);
  const send = useSetAtom(wsAtom);
  const user = useAtomValue(userAtom);
  const { status, currentRound, currentRoundIndex, isHost, userArray, totalScore } =
    useAtomValue(blocksGameHelpersAtom);
  const { correctAnswers } = useAtomValue(blocksGameHelpersAtom);
  const { isGuesser, myAnswer } = useAtomValue(blocksGameHelpersAtom);
  const setScore = useSetAtom(showScoreAtom);

  const [animations, setAnimated] = useSpring(() => ({ score: 0 }));

  const removeBlock = useLongPress((event, { context }) => {
    console.log('long press', context);
    send({ action: 'removeBlock', gameId: game!.id, userId: user.id, ...context });
  });

  useLoadGame(query.blocksGameId as string | undefined);
  useUpdateGame(query.blocksGameId as string | undefined);
  const { playingTime } = useBlocksTimer();

  console.log({ game, status, playingTime });

  const leaveGame = () => send({ action: 'leaveGame', gameId: game!.id, userId: user.id });
  const startGame = () => send({ action: 'createBlocksRound', gameId: game!.id, userId: user.id });
  const addBlock = ({ x, y }: any) => send({ action: 'addBlock', gameId: game!.id, userId: user.id, x, y });
  const clearBlocks = ({ x, y }: any) => send({ action: 'clearBlocks', gameId: game!.id, userId: user.id, x, y });
  const newBlocksGame = () => send({ action: 'newBlocksGame', gameId: game!.id, userId: user.id });
  const addBlocksScore = (score: number) =>
    send({ action: 'addBlocksScore', gameId: game!.id, userId: user.id, score });

  const addScore = (score: number) => {
    setScore(score);

    if (isGuesser) addBlocksScore(score);
  };

  useEffect(() => {
    setAnimated({ score: totalScore });
  }, [totalScore]);

  useEffect(() => {
    if (playingTime === 0) {
      send({ action: 'endBlocksRound', gameId: game!.id, userId: user.id });
    }
  }, [playingTime]);

  useEffect(() => {
    if (correctAnswers <= 1) return;
    if (status !== 'playing') return;

    addScore(playingTime);
  }, [correctAnswers]);

  if (!game) return <LoadingGame />;

  return (
    <>
      <InfoOverlay />
      <ShowScore />
      <div className="darkScreen">
        <div className="darkScreenOverlay" />
        <DynamicBackground floaterCount={30} isDark />
        <div className="darkScreenContent">
          {status === 'lobby' && (
            <>
              <div className="label">Game code</div>
              <div className="textOutput">{game.id}</div>

              <div className="label">Players</div>
              <PlayerList users={userArray} game={game} />
            </>
          )}

          {status === 'playing' && (
            <>
              <WinnerBroadcast
                text={`Round ${currentRoundIndex}`}
                user={game.users[currentRound?.guesser]}
                subText={`${game.users[currentRound?.guesser].username} is the guesser`}
                duration={'1.5s'}
                bits={5}
              />
            </>
          )}

          {status === 'results' && (
            <>
              {/* <WinnerBroadcast text={`Game over!`} subText={`You ran out of time`} duration={'6s'} bits={50} /> */}

              <div className="shout">Game over</div>

              <div className={styles.completedText}>
                {currentRoundIndex} rounds completed
                <animated.div className={styles.total}>
                  {to(animations.score, (value) => Math.round(value))}
                </animated.div>
                Points
              </div>
              {/* <div className="label">leaderboard</div> */}

              <div className={styles.grid}>
                {times(9).map((x) =>
                  times(9).map((y) => (
                    <Fragment key={'' + x + y}>
                      <div className={styles.gridItem} {...removeBlock({ x, y })}>
                        {!isGuesser && !myAnswer?.[x]?.[y]?.color && <div className={styles.dot} />}

                        {!isGuesser && myAnswer?.[x]?.[y]?.color && (
                          <BlockEl block={myAnswer?.[x]?.[y]} star={currentRound?.guess?.[x]?.[y]} />
                        )}

                        {isGuesser && !currentRound?.guess?.[x]?.[y]?.color && <div className={styles.dot} />}

                        {isGuesser && currentRound?.guess?.[x]?.[y]?.color && (
                          <BlockEl block={currentRound?.guess?.[x]?.[y]} />
                        )}
                      </div>
                    </Fragment>
                  )),
                )}
              </div>
            </>
          )}

          {(status === 'playing' || status === 'complete') && (
            <>
              <div className={styles.actionArea}>
                <h3>{playingTime}s</h3>
                <p>Help {game.users[currentRound.guesser].username} match all the squares</p>
              </div>

              <div className={styles.completedText}>
                Round {currentRoundIndex}
                <animated.div className={styles.total}>
                  {to(animations.score, (value) => Math.round(value))}
                </animated.div>
                Points
              </div>

              <div className={styles.grid}>
                {times(9).map((x) =>
                  times(9).map((y) => (
                    <Fragment key={'' + x + y}>
                      <div
                        className={styles.gridItem}
                        onClick={() => (isGuesser && status === 'playing' ? addBlock({ x, y }) : undefined)}
                        {...removeBlock({ x, y })}
                      >
                        {!isGuesser && !myAnswer?.[x]?.[y]?.color && <div className={styles.dot} />}

                        {!isGuesser && myAnswer?.[x]?.[y]?.color && (
                          <BlockEl block={myAnswer?.[x]?.[y]} star={currentRound?.guess?.[x]?.[y]} />
                        )}

                        {isGuesser && !currentRound?.guess?.[x]?.[y]?.color && <div className={styles.dot} />}

                        {isGuesser && currentRound?.guess?.[x]?.[y]?.color && (
                          <BlockEl block={currentRound?.guess?.[x]?.[y]} />
                        )}
                      </div>
                    </Fragment>
                  )),
                )}
              </div>
            </>
          )}

          {status === 'results' && (
            <>
              <div className={styles.buttons}>
                <div className="button" data-variant="orange" onClick={newBlocksGame}>
                  Start again
                </div>
              </div>
            </>
          )}

          {status === 'complete' && (
            <>
              <WinnerBroadcast
                text={`Nice!`}
                subText={`Round ${currentRoundIndex} complete`}
                user={game.users[currentRound?.guesser]}
                duration={'3s'}
                bits={100}
              />

              <div className={styles.buttons}>
                <div className="button" data-variant="orange" onClick={startGame}>
                  Next round
                </div>
              </div>
            </>
          )}

          {status === 'playing' && isGuesser && (
            <div className={styles.buttons}>
              <div className="button" data-variant="light" onClick={clearBlocks}>
                Clear
              </div>
            </div>
          )}

          {status === 'lobby' && (
            <div className={styles.buttons}>
              {!isHost && <div className={styles.blurb}>Waiting for host to start game...</div>}

              {!(userArray.length >= 2) && (
                <div className={styles.blurb}>At least 2 players are needed to start the game</div>
              )}

              {isHost && userArray.length >= 2 && (
                <div className="button" data-variant="orange" onClick={startGame}>
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
};

export const BlockEl: FC<{ block?: Block }> = ({ block, star }) => {
  const [isActive, setIsActive] = useState(false);
  const [angle, setAngle] = useState(random(-100, 100));

  useEffect(() => {
    setIsActive(false);

    if (block?.color) {
      setTimeout(() => setIsActive(true), random(200));
    }
  }, [block?.id]);

  if (!block) return null;

  return (
    <div
      className={styles.block}
      data-is-active={isActive}
      style={{ '--color': block?.color, '--angle': `${angle}deg` }}
    >
      {star && <i className="fas fa-star" data-is-active={block?.color === star?.color} />}
    </div>
  );
};
