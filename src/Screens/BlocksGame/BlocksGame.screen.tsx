/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useMemo, useRef, useState } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';

import random from 'lodash/random';
import startCase from 'lodash/startCase';

import times from 'lodash/times';
import Link from 'next/link';

import { useRouter } from 'next/router';
import { useLongPress } from 'use-long-press';

import { blocksGameAtom } from 'Atoms/BlocksGame.atom';
import { blocksGameHelpersAtom } from 'Atoms/BlocksGameHelpers.atom';

import { userAtom } from 'Atoms/User.atom';

import { showUserPopupAtom, userPopupAtom } from 'Atoms/UserPopup.atom';
import { wsAtom } from 'Atoms/Ws.atom';
import { BombBroadcast } from 'Components/BombBroadcast/BombBroadcast';
import { InfoOverlay } from 'Components/InfoOverlay/InfoOverlay';

import { LoadingGame } from 'Components/LoadingGame/LoadingGame';
import { UserPopup } from 'Components/UserPopup/UserPopup';
import { WinnerBroadcast } from 'Components/WinnerBroadcast/WinnerBroadcast';
import { BlocksGame } from 'Entities/BlocksGame.entity';

import { Block } from 'Entities/BlocksRound.entity';
import { User } from 'Entities/User.entity';
import { UserId } from 'Entities/UserId.entity';

import { useLoadGame } from 'Hooks/useLoadGame';
import { useUpdateGame } from 'Hooks/useUpdateGame';

import styles from './BlocksGame.screen.module.css';

export const BlocksGameScreen: FC = () => {
  const { query } = useRouter();

  const game = useAtomValue(blocksGameAtom);
  const send = useSetAtom(wsAtom);
  const user = useAtomValue(userAtom);
  const { selectedUser } = useAtomValue(userPopupAtom);
  const { status, currentRound, currentRoundIndex, isHost, userArray } = useAtomValue(blocksGameHelpersAtom);
  const { isGuesser } = useAtomValue(blocksGameHelpersAtom);

  const removeBlock = useLongPress((event, { context }) => {
    console.log('long press', context);
    send({ action: 'removeBlock', gameId: game!.id, userId: user.id, ...context });
  });

  useLoadGame(query.blocksGameId as string | undefined);
  useUpdateGame(query.blocksGameId as string | undefined);

  console.log({ game, status });

  const leaveGame = () => send({ action: 'leaveGame', gameId: game!.id, userId: user.id });
  const startGame = () => send({ action: 'createBlocksRound', gameId: game!.id, userId: user.id });
  const addBlock = ({ x, y }: any) => send({ action: 'addBlock', gameId: game!.id, userId: user.id, x, y });

  // const restartGame = () => send({ action: 'restartBlocksGame', gameId: game!.id, userId: user.id });
  // const startRound = () => send({ action: 'startBlocksRound', gameId: game!.id, userId: user.id });
  // const timeUp = () => send({ action: 'blocksTimeUp', gameId: game!.id, userId: user.id });

  if (!game) return <LoadingGame />;

  return (
    <>
      <InfoOverlay />
      <div className="darkScreen" style={{ backgroundImage: `url('/img/backgrounds/b15.jpeg')` }}>
        <div className="darkScreenOverlay" />
        <div className="darkScreenContent">
          <UserPopup />

          {status === 'lobby' && (
            <>
              <div className="label">Game code</div>
              <div className="textOutput">{game.id}</div>

              <div className="label">Players</div>
              <PlayerList users={userArray} game={game} />
            </>
          )}

          {status === 'playing' && (
            <WinnerBroadcast
              text={`Round ${currentRoundIndex}`}
              user={game.users[currentRound?.guesser]}
              subText={`${game.users[currentRound?.guesser].username} is the guesser`}
              duration={'1.5s'}
              bits={5}
            />
          )}

          {(status === 'playing' || status === 'complete') && (
            <>
              <div className={styles.grid}>
                {times(9).map((x) =>
                  times(9).map((y) => (
                    <Fragment key={'' + x + y}>
                      <div
                        className={styles.gridItem}
                        onClick={() => (isGuesser && status === 'playing' ? addBlock({ x, y }) : undefined)}
                        {...removeBlock({ x, y })}
                      >
                        {!isGuesser && !currentRound?.answer?.[x]?.[y]?.color && <div className={styles.dot} />}

                        {!isGuesser && currentRound?.answer?.[x]?.[y]?.color && (
                          <BlockEl block={currentRound?.answer?.[x]?.[y]} />
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

export const BlockEl: FC<{ block?: Block }> = ({ block }) => {
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
    />
  );
};

export const PlayerList: FC<{ users: User[]; game: BlocksGame }> = ({ users, game }) => {
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
