import { useEffect, useRef, useState } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';
import capitalize from 'lodash/capitalize';
import toArray from 'lodash/toArray';
import Link from 'next/link';

import { DynamicBackground } from 'Components/DynamicBackground/DynamicBackground';
import { InfoOverlay } from 'Components/InfoOverlay/InfoOverlay';
import { LoadingGame } from 'Components/LoadingGame/LoadingGame';
import { PlayerList } from 'Components/PlayerList/PlayerList';
import { ShowScore } from 'Components/ShowScore/ShowScore';

import styles from './Circles3dGame.screen.module.css';
import { circles3dGameAtom } from 'Atoms/Circles3dGame.atom';
import { useCircles3dActions } from 'Screens/Circles3dGame/useCircles3dActions';
import { circles3dGameHelpersAtom } from 'Atoms/Circles3dGameHelpers.atom';
import { userAtom } from 'Atoms/User.atom';
import random from 'lodash/random';
import { WinnerBroadcast } from 'Components/WinnerBroadcast/WinnerBroadcast';
import { Coordinate } from 'Entities/Circles3d.class';

export function Circles3dGameScreen() {
  const game = useAtomValue(circles3dGameAtom);
  const user = useAtomValue(userAtom);
  const { status, userArray, isHost, users } = useAtomValue(circles3dGameHelpersAtom);
  // const { myAnswer, currentRound, user, usersWithoutMe } = useAtomValue(emojiTaleGameHelpersAtom);
  const { leaveGame, startGame, makeMove, resetGame } = useCircles3dActions();

  const [selectedCircle, setSelectedCircle] = useState<Coordinate | null>(null);

  useEffect(() => {
    setSelectedCircle(null);
  }, [game?.moves.length]);

  const canMoveHere = ([x, y, z]) => {
    if (selectedCircle?.join(',') === [x, y, z].join(',')) return false;
    if (!game?.isMoveValid([x, y, z])) return false;
    return true;
  };

  const selectCircle = ([x, y]: [number, number]) => {
    if (game?.getCurrentPlayer() !== user?.id) return;

    if ([x, y, 1].join(',') === selectedCircle?.join(',')) {
      if (canMoveHere([x, y, 2])) return setSelectedCircle([x, y, 2]);
    }

    if (canMoveHere([x, y, 0])) return setSelectedCircle([x, y, 0]);
    if (canMoveHere([x, y, 1])) return setSelectedCircle([x, y, 1]);
    if (canMoveHere([x, y, 2])) return setSelectedCircle([x, y, 2]);
  };

  console.log('Circles3dGame', { game });

  if (!game) return <LoadingGame />;

  return (
    <>
      <div className="darkScreen">
        <div className="darkScreenOverlay" />
        <DynamicBackground floaterCount={30} />

        <div className="darkScreenContent">
          <ShowScore />

          {status === 'lobby' && (
            <>
              <InfoOverlay />
              <div className="label">Game code</div>
              <div className="textOutput">{game.id}</div>

              <div className="label">Players</div>
              <PlayerList users={userArray} game={game} />
            </>
          )}

          {status === 'playing' && (
            <>
              <div className="actionArea">
                <h3>
                  <img
                    className="profile"
                    src={`/img/avatars/${users[game.getCurrentPlayer()]?.avatar}`}
                    alt="avatar"
                  />
                  {users[game.getCurrentPlayer()]?.username} to play!
                </h3>
                {game.isPlayerTurn(user.id) && <p>Pick a circle!</p>}
                {!game.isPlayerTurn(user.id) && <p>Waiting...</p>}
              </div>
            </>
          )}

          {status === 'finished' && (
            <>
              <WinnerBroadcast
                user={users[game.winner!]}
                text={`${users[game.winner!].username} wins!`}
                // subText={`with ${currentRound.userPoints[currentRound?.winnerId]} points`}
                duration={'5s'}
                bits={50}
              />
            </>
          )}

          {(status === 'playing' || status === 'finished') && (
            <>
              <div className="label">
                Order:{' '}
                {userArray.map((user) => (
                  <span className={styles.dot} style={{ '--color': game.getUserColor(user.id) }} />
                ))}
              </div>

              <div className="label">
                You are <span className={styles.dot} style={{ '--color': game.getUserColor(user.id) }} />
              </div>

              <div className={styles.grid}>
                <div className={styles.grid}>
                  {loopThrough([3, 3], ([x, y]) => (
                    <div
                      className={styles.cell}
                      key={`${x}-${y}`}
                      data-is-winner={game.isWinningGrid([x, y])}
                      onClick={() => selectCircle([x, y])}
                    >
                      <div
                        data-x={x}
                        data-y={y}
                        data-z={0}
                        className={styles.circleOutline}
                        data-is-winner={game.isWinningCoordinate([x, y, 0])}
                        data-is-selected={[x, y, 0].join(',') === selectedCircle?.join(',')}
                        style={{ '--diameter': '80%', '--color': game.getColorAtCoordinate([x, y, 0]) }}
                      />
                      <div
                        className={styles.circleOutline}
                        data-is-winner={game.isWinningCoordinate([x, y, 1])}
                        data-is-selected={[x, y, 1].join(',') === selectedCircle?.join(',')}
                        style={{ '--diameter': '50%', '--color': game.getColorAtCoordinate([x, y, 1]) }}
                      />
                      <div
                        className={styles.circleOutline}
                        data-is-winner={game.isWinningCoordinate([x, y, 2])}
                        data-is-selected={[x, y, 2].join(',') === selectedCircle?.join(',')}
                        style={{ '--diameter': '20%', '--color': game.getColorAtCoordinate([x, y, 2]) }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {game.isPlayerTurn(user.id) && (
                <div
                  className="button"
                  data-variant="orange"
                  data-disabled={!selectedCircle}
                  onClick={() => (selectedCircle ? makeMove(selectedCircle) : null)}
                >
                  Play
                </div>
              )}
            </>
          )}

          {status === 'finished' && (
            <div className="buttons">
              <div className="button" data-variant="orange" onClick={() => resetGame()}>
                Reset game
              </div>
            </div>
          )}

          {status === 'lobby' && (
            <div className="buttons">
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
        </div>
      </div>
    </>
  );
}

type IndexTuple<T extends number[]> = {
  [K in keyof T]: number;
};

function loopThrough<T extends number[]>(
  maxValues: T,
  callback: (indices: IndexTuple<T>) => JSX.Element,
): JSX.Element[] {
  const results: JSX.Element[] = [];
  const loop = (indices: number[]): void => {
    if (indices.length === maxValues.length) {
      results.push(callback(indices as IndexTuple<T>));
    } else {
      for (let i = 0; i < maxValues[indices.length]; i++) {
        loop([...indices, i]);
      }
    }
  };
  loop([]);
  return results;
}
