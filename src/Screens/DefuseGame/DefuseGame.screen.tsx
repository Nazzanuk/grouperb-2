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
import { WinnerBroadcast } from 'Components/WinnerBroadcast/WinnerBroadcast';
import { DefuseGame } from 'Entities/DefuseGame.entity';
import { User } from 'Entities/User.entity';
import { UserId } from 'Entities/UserId.entity';

import styles from './DefuseGame.screen.module.css';
import { checkDefuseRule, generateRule } from 'Utils/Defuse/Defuse.utils';
import { BombBroadcast } from 'Components/BombBroadcast/BombBroadcast';

export const DefuseGameScreen: FC = () => {
  const { query } = useRouter();
  const i = useRef<NodeJS.Timer>(null);
  const [trophyIndex, setTrophyIndex] = useState(1);
  const [isNextRoundEnabled, setIsNextRoundEnabled] = useState(false);
  const [isDefuseButtonsEnabled, setIsDefuseButtonsEnabled] = useState(false);
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
    hasBeenCut,
  } = useAtomValue(defuseGameHelpersAtom);

  console.log({ game, status });
  console.log({ cutWiresWires });

  const leaveGame = () => send({ action: 'leaveGame', gameId: game!.id, userId: user.id });
  const startGame = () => send({ action: 'startDefuseRound', gameId: game!.id, userId: user.id });
  const startRound = () => send({ action: 'startDefuseRound', gameId: game!.id, userId: user.id });
  const chooseWire = (letter: string) => {
    send({ action: 'chooseDefuseWire', gameId: game!.id, userId: user.id, letter });
  };

  useEffect(() => {
    setTrophyIndex(random(1, 3));
  }, [game?.rounds.length]);

  useEffect(() => {
    console.log({ query });
    if (query.defuseGameId) {
      send({ action: 'getGame', gameId: query.defuseGameId as string });
    }
  }, [query.defuseGameId]);

  useEffect(() => {
    console.log({ query });

    if (!query.defuseGameId) return;

    i.current = setInterval(() => {
      send({ action: 'getGame', gameId: query.defuseGameId as string });
    }, 10000);

    return () => {
      clearInterval(i.current);
    };
  }, [query.defuseGameId]);

  if (!game)
    return (
      <div className="darkScreen">
        <div className="label">Loading...</div>
      </div>
    );

  return (
    <>
      <div className="darkScreen" style={{ backgroundImage: `url('/img/backgrounds/b9.jpeg')` }}>
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
              <div className={styles.wirebox}>
                <div className={styles.bigBox}></div>
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
                <div className="button" data-variant="orange" onClick={startRound}>
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
