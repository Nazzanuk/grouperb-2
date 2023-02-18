/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useMemo, useRef, useState } from 'react';

import { ballRunGameAtom } from 'Atoms/BallRunGame.atom';

import { ballRunGameHelpersAtom } from 'Atoms/BallRunGameHelpers.atom';
import { BallRunGame } from 'Entities/BallRunGame.entity';
import { Block } from 'Entities/BallRunRound.entity';
import { useBallRunTimer } from 'Hooks/BallRun/useBallRunTimer';
import { useAtomValue, useSetAtom } from 'jotai';

import random from 'lodash/random';
import startCase from 'lodash/startCase';

import times from 'lodash/times';
import Matter, { Composite, Engine, Events, Render, Runner } from 'matter-js';
import Link from 'next/link';

import { useRouter } from 'next/router';
import { useLongPress } from 'use-long-press';

import { currentGameAtom } from 'Atoms/CurrentGame.atom';
import { userAtom } from 'Atoms/User.atom';

import { showUserPopupAtom, userPopupAtom } from 'Atoms/UserPopup.atom';
import { wsAtom } from 'Atoms/Ws.atom';
import { BombBroadcast } from 'Components/BombBroadcast/BombBroadcast';
import { DynamicBackground } from 'Components/DynamicBackground/DynamicBackground';
import { InfoOverlay } from 'Components/InfoOverlay/InfoOverlay';

import { LoadingGame } from 'Components/LoadingGame/LoadingGame';
import { UserPopup } from 'Components/UserPopup/UserPopup';
import { WinnerBroadcast } from 'Components/WinnerBroadcast/WinnerBroadcast';

import { offX, offTop, WALL_WIDTH, WALL_LENGTH, offLeft, offY, offRight, offBottom } from 'Constants/BallRun.constants';
import { User } from 'Entities/User.entity';
import { UserId } from 'Entities/UserId.entity';

import { useLoadGame } from 'Hooks/useLoadGame';
import { useUpdateGame } from 'Hooks/useUpdateGame';

import { Circle } from 'Utils/BallRun/Circle';
import { Elastic } from 'Utils/BallRun/Elastic';
import { PlayerBall } from 'Utils/BallRun/PlayerBall';
import { Rect } from 'Utils/BallRun/Rect';
import { Scorer } from 'Utils/BallRun/Scorer';

import styles from './BallRunGame.screen.module.css';
import { BottomWall } from 'Utils/BallRun/BottomWall';
import { CreateMouse } from 'Utils/BallRun/CreateMouse';
import { CreateRender } from 'Utils/BallRun/CreateRender';
import { EnableCollisionEvents } from 'Utils/BallRun/EnableCollisionEvents';

export const BallRunGameScreen: FC = () => {
  const { query } = useRouter();

  const $gameArea = useRef<HTMLDivElement>(null);
  const $canvas = useRef<HTMLCanvasElement>(null);

  const game = useAtomValue(currentGameAtom);
  // const game = useAtomValue(ballRunGameAtom);
  const send = useSetAtom(wsAtom);
  const user = useAtomValue(userAtom);
  const { selectedUser } = useAtomValue(userPopupAtom);
  // const { status, currentRound, currentRoundIndex, isHost, userArray } = useAtomValue(ballRunGameHelpersAtom);
  // const { isGuesser, myAnswer } = useAtomValue(ballRunGameHelpersAtom);

  // useLoadGame(query.ballRunGameId as string | undefined);
  // useUpdateGame(query.ballRunGameId as string | undefined);

  console.log({ game, status });

  // const leaveGame = () => send({ action: 'leaveGame', gameId: game!.id, userId: user.id });
  // const startGame = () => send({ action: 'createBallRunRound', gameId: game!.id, userId: user.id });
  // const addBlock = ({ x, y }: any) => send({ action: 'addBlock', gameId: game!.id, userId: user.id, x, y });
  // const clearBallRun = ({ x, y }: any) => send({ action: 'clearBallRun', gameId: game!.id, userId: user.id, x, y });

  useEffect(() => {
    if (!$gameArea.current || !$canvas.current) return;

    const engine = Engine.create();
    const render = CreateRender($gameArea.current, $canvas.current, engine);
    const world = engine.world;

    const player = PlayerBall();

    const walls = [
      Rect('topWall', offX(), offTop(-20), WALL_WIDTH, WALL_LENGTH, Math.PI / 2, undefined, { fillStyle: '#00000000' }),
      Rect('leftWall', offLeft(-20), offY(), WALL_WIDTH, WALL_LENGTH, 0, undefined, { fillStyle: '#00000000' }),
      Rect('rightWall', offRight(-20), offY(), WALL_WIDTH, WALL_LENGTH, 0, undefined, { fillStyle: '#00000000' }),
      BottomWall(),
    ];

    const objects = [
      Rect('', offX(80), offTop(30), 15, 200, Math.PI / 3, undefined, { fillStyle: 'gold' }),
      Rect('', offX(-80), offTop(30), 15, 200, Math.PI / -3, undefined, { fillStyle: 'gold' }),

      Rect('', offX(-45), offY(90), 15, 150, Math.PI / -50, undefined, { fillStyle: '#8B0000' }),
      Rect('', offX(45), offY(90), 15, 150, Math.PI / 50, undefined, { fillStyle: '#8B0000' }),
    ];

    const bouncers = [
      Scorer(offX(-60), offY(-100), 15),
      Scorer(offX(60), offY(-100), 15),
      Scorer(offX(150), offY(-30), 15),
      Scorer(offX(-150), offY(-30), 15),
    ];

    const allBodies = [player, Elastic(player), ...objects, ...bouncers, ...walls];
    Composite.add(world, allBodies);

    const [mouse, mouseConstraint] = CreateMouse(render.canvas, engine);
    Composite.add(world, mouseConstraint);
    render.mouse = mouse;

    Events.on(engine, 'afterUpdate', function () {
      const player = Composite.allBodies(engine.world).find((body) => body.label === 'player');
      const elastic = Composite.allConstraints(engine.world).find((body) => body.label === 'elastic');
  
      if (!elastic || !player) return;
  
      // if (player.speed > 2) {
      //   console.log({ player }, player.speed);
      // }
  
      if (player.velocity.y < -10 && player.position.y > 451) {
        Composite.remove(engine.world, elastic);
        // @ts-expect-error
        elastic.bodyB = null;
      }
    });

    EnableCollisionEvents(engine, world);

  
    // run the renderer
    Render.run(render);
    Render.lookAt(render, { min: { x: 0, y: 0 }, max: { x: 500, y: 600 } });

    var runner = Runner.create();
    Runner.run(runner, engine);

    // Matter.Events.on(runner, "tick", event => {
    //   console.log('mc runner', mouseConstraint.body);
    // });

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
    };
  }, [$gameArea.current]);

  // if (!game) return <LoadingGame />;

  return (
    <>
      {/* <InfoOverlay /> */}
      <div className="darkScreen">
        <div className="darkScreenOverlay" />
        <DynamicBackground floaterCount={100} isDark />

        <div className="darkScreenContent">
          <UserPopup />

          <div className={styles.gameArea} ref={$gameArea}>
            <canvas ref={$canvas} />
          </div>

          {/* {status === 'lobby' && (
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
          )} */}
        </div>
      </div>
    </>
  );
};

export const PlayerList: FC<{ users: User[]; game: BallRunGame }> = ({ users, game }) => {
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
