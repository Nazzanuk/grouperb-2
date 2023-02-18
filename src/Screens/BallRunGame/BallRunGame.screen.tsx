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

import {
  offX,
  offTop,
  WALL_WIDTH,
  WALL_LENGTH,
  offLeft,
  offY,
  offRight,
  offBottom,
  WIDTH,
  HEIGHT,
} from 'Constants/BallRun.constants';
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
  const $points = useRef<HTMLDivElement>(null);
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

  const [gameSize, setGameSize] = useState({ x: 0, y: 0 });
  const [points, _setPoints] = useState({ x: 0, y: 0 });
  const [total, setTotal] = useState(0);
  const [pointsText, setPointsText] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  console.log({ points });

  const setPoints = ({ x, y }, amount) => {
    _setPoints({ x, y });
    anim();
    setTotal((total) => total + amount);
    setPointsText(amount);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 200);
  };

  const anim = () => {
    const effect = new KeyframeEffect(
      $points.current!, // Element to animate
      [
        // Keyframes
        { transform: 'translateY(0)', opacity: 1 },
        { transform: 'translateY(-30px) scale(2)', opacity: 0 },
      ],
      { duration: 1000, direction: 'alternate', easing: 'linear' }, // Keyframe settings
    );

    const animation = new Animation(effect, document.timeline);

    animation.play();
  };

  useEffect(() => {
    if (!$gameArea.current || !$canvas.current) return;

    const engine = Engine.create();
    const render = CreateRender($gameArea.current, $canvas.current, engine);
    const world = engine.world;

    const player = PlayerBall();

    const walls = [
      Rect('topWall', offX(), offTop(-20), WALL_WIDTH, WALL_LENGTH, Math.PI / 2, undefined, {
        fillStyle: '#00000000',
        lineWidth: 0,
      }),
      Rect('leftWall', offLeft(-20), offY(), WALL_WIDTH, WALL_LENGTH, 0, undefined, {
        fillStyle: '#00000000',
        lineWidth: 0,
      }),
      Rect('rightWall', offRight(-20), offY(), WALL_WIDTH, WALL_LENGTH, 0, undefined, {
        fillStyle: '#00000000',
        lineWidth: 0,
      }),
      BottomWall(),
    ];

    const objects = [
      Rect(
        'gameArea',
        offX(0),
        offTop(160),
        WIDTH,
        HEIGHT,
        Math.PI,
        {
          isSensor: true,
        },
        { fillStyle: 'transparent', lineWidth: 0, },
      ),

      Rect('', offX(0), offTop(-30), 200, 200, Math.PI / 4, undefined, { fillStyle: 'gold' }),
      Rect('', offX(200), offTop(-60), 200, 200, Math.PI / 4, undefined, { fillStyle: 'gold' }),
      Rect('', offX(-200), offTop(-60), 200, 200, Math.PI / 4, undefined, { fillStyle: 'gold' }),

      Rect('', offX(-120), offY(120), 20, 100, Math.PI / 4, undefined, { fillStyle: 'grey' }),
      Rect('', offX(120), offY(120), 20, 100, Math.PI / -4, undefined, { fillStyle: 'grey' }),

      Rect('', offX(90), offTop(250), 20, 50, Math.PI / 2.1, undefined, { fillStyle: 'grey' }),
      Rect('', offX(-90), offTop(250), 20, 50, Math.PI / -2.1, undefined, { fillStyle: 'grey' }),

      Rect('', offX(250), offTop(250), 20, 50, Math.PI / 2.4, undefined, { fillStyle: 'grey' }),
      Rect('', offX(-250), offTop(250), 20, 50, Math.PI / -2.4, undefined, { fillStyle: 'grey' }),

      Rect('', offX(-230), offTop(450), 20, 50, Math.PI / -2.6, undefined, { fillStyle: 'grey' }),
      Rect('', offX(230), offTop(450), 20, 50, Math.PI / 2.6, undefined, { fillStyle: 'grey' }),
      // Rect('', offX(-80), offTop(30), 15, 200, Math.PI / -3, undefined, { fillStyle: 'gold' }),

      // Rect('', offX(-45), offY(250), 15, 200, Math.PI / -50, undefined, { fillStyle: '#8B3333' }),
      // Rect('', offX(45), offY(250), 15, 200, Math.PI / 50, undefined, { fillStyle: '#8B3333' }),
    ];

    const bouncers = [
      Scorer(offX(-90), offY(-100), 10, setPoints, 50),
      Scorer(offX(90), offY(-100), 10, setPoints, 50),
      Scorer(offX(150), offY(-30), 10, setPoints, 50),
      Scorer(offX(-150), offY(-30), 10, setPoints, 50),

      Scorer(offX(-200), offY(60), 5, setPoints, 100),
      Scorer(offX(200), offY(60), 5, setPoints, 100),

      Scorer(offX(110), offY(60), 5, setPoints, 100),
      Scorer(offX(-110), offY(60), 5, setPoints, 100),
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
        player.isFree = true;
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

    setGameSize({ x: $canvas.current.clientWidth, y: $canvas.current.clientHeight });

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
    };
  }, [$gameArea.current]);

  // if (!game) return <LoadingGame />;

  console.log('$canvas.current', {
    x: $canvas.current?.clientWidth,
    y: $canvas.current?.clientHeight,
  });

  console.log('$canvas.2', {
    side: (points.x / WIDTH) * $canvas.current?.clientWidth,
    y: $canvas.current?.clientHeight,
  });
  return (
    <>
      {/* <InfoOverlay /> */}
      <div className="darkScreen">
        <div className="darkScreenOverlay" />
        <DynamicBackground floaterCount={100} isDark />

        <div className="darkScreenContent">
          <UserPopup />

          <div className={styles.gameArea} ref={$gameArea} data-is-shaking={isShaking}>
            <div className={styles.total} ref={$gameArea}>
              {total}
            </div>
            <div
              ref={$points}
              className={styles.points}
              style={{
                left: (points.x / WIDTH) * $canvas.current?.clientWidth,
                top: (points.y / HEIGHT) * $canvas.current?.clientHeight,
              }}
            >
              +{pointsText}
            </div>
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
