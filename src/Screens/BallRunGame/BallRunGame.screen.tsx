/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useMemo, useRef, useState } from 'react';

import Matter from 'matter-js';

import { ballRunGameAtom } from 'Atoms/BallRunGame.atom';
import { ballRunGameHelpersAtom } from 'Atoms/BallRunGameHelpers.atom';
import { BallRunGame } from 'Entities/BallRunGame.entity';
import { Block } from 'Entities/BallRunRound.entity';
import { useBallRunTimer } from 'Hooks/BallRun/useBallRunTimer';
import { useAtomValue, useSetAtom } from 'jotai';

import random from 'lodash/random';
import startCase from 'lodash/startCase';

import times from 'lodash/times';
import Link from 'next/link';

import { useRouter } from 'next/router';
import { useLongPress } from 'use-long-press';

import { userAtom } from 'Atoms/User.atom';

import { showUserPopupAtom, userPopupAtom } from 'Atoms/UserPopup.atom';
import { wsAtom } from 'Atoms/Ws.atom';
import { BombBroadcast } from 'Components/BombBroadcast/BombBroadcast';
import { DynamicBackground } from 'Components/DynamicBackground/DynamicBackground';
import { InfoOverlay } from 'Components/InfoOverlay/InfoOverlay';

import { LoadingGame } from 'Components/LoadingGame/LoadingGame';
import { UserPopup } from 'Components/UserPopup/UserPopup';
import { WinnerBroadcast } from 'Components/WinnerBroadcast/WinnerBroadcast';

import { User } from 'Entities/User.entity';
import { UserId } from 'Entities/UserId.entity';

import { useLoadGame } from 'Hooks/useLoadGame';
import { useUpdateGame } from 'Hooks/useUpdateGame';

import styles from './BallRunGame.screen.module.css';
import { currentGameAtom } from 'Atoms/CurrentGame.atom';

const mouseCategory = 0x0001,
  defaultCategory = 0x0002,
  greenCategory = 0x0004,
  blueCategory = 0x0008;

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

  useLoadGame(query.ballRunGameId as string | undefined);
  useUpdateGame(query.ballRunGameId as string | undefined);

  console.log({ game, status });

  // const leaveGame = () => send({ action: 'leaveGame', gameId: game!.id, userId: user.id });
  // const startGame = () => send({ action: 'createBallRunRound', gameId: game!.id, userId: user.id });
  // const addBlock = ({ x, y }: any) => send({ action: 'addBlock', gameId: game!.id, userId: user.id, x, y });
  // const clearBallRun = ({ x, y }: any) => send({ action: 'clearBallRun', gameId: game!.id, userId: user.id, x, y });

  useEffect(() => {
    if (!$gameArea.current || !$canvas.current) return;
    console.log('rendering game');

    const { Mouse, MouseConstraint, Render, Engine, Runner, Body, Bodies, Composite, Constraint, Events } = Matter;

    // create an engine
    var engine = Engine.create();
    const world = engine.world;

    // create a renderer
    var render = Render.create({
      element: $gameArea.current,
      canvas: $canvas.current,
      engine: engine,
      options: {
        width: 500,
        height: 600,
        wireframes: false,
        background: 'red',
      },
    });

    // create two boxes and a ground
    var boxA = Bodies.rectangle(400, 400, 80, 80, {
      label: 'boxA',
      collisionFilter: { category: mouseCategory },
      render: { fillStyle: 'green' },
    });
    var boxB = Bodies.rectangle(450, 50, 80, 80, { collisionFilter: { mask: defaultCategory } });
    var circleB = Bodies.circle(450, 50, 30, { collisionFilter: { mask: defaultCategory | mouseCategory } });

    var ground = Bodies.rectangle(250, 600, 500, 10, {
      isStatic: true,
      collisionFilter: { category: defaultCategory },
    });
    var top = Bodies.rectangle(250, 0, 500, 10, { isStatic: true, collisionFilter: { category: defaultCategory } });
    var left = Bodies.rectangle(0, 300, 10, 600, { isStatic: true, collisionFilter: { category: defaultCategory } });
    var right = Bodies.rectangle(500, 300, 10, 600, { isStatic: true, collisionFilter: { category: defaultCategory } });

    let rock = Bodies.circle(250, 450, 20, { density: 0.004 });
    const elastic = Constraint.create({
      pointA: { x: 250, y: 450 },
      bodyB: rock,
      length: 0.0001,
      damping: 0.1,
      stiffness: 0.1,
    });

    var controlArea = Bodies.rectangle(250, 150, 500, 300, {
      label: 'controlArea',
      isStatic: true,
      isSensor: true,
      render: { fillStyle: 'blue', opacity: 0.1 },
    });
    // const bounds = Matter.Bounds.create([0, 0, 500, 600]);

    // add mouse control
    var mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        // body: controlArea,

        collisionFilter: { mask: mouseCategory },
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      });

    render.mouse = mouse;

    Events.on(engine, 'afterUpdate', function () {
      if (rock.speed > 5) {
        console.log({ rock }, rock.speed)
      }
      if (rock.velocity.y < -10 && (rock.position.y > 455)) {
        // Limit maximum speed of current rock.
        // if (rock.speed > 45) {
        //   Body.setVelocity(rock, rock.velocity);
        // }

        // Release current rock and add a new one.
        rock = Bodies.circle(250, 450, 20, { density: 0.004, velocity: rock.velocity });
        const newRock = Bodies.circle(250, 450, 20, { density: 0.004, velocity: rock.velocity });
        // const newRock = Bodies.polygon(250, 450, 7, 20, { density: 0.004 });
        Composite.add(engine.world, newRock);
        elastic.bodyB = newRock;
        rock = newRock;
      }
    });

    // Mouse.setElement(mouse, render.canvas);

    // add all of the bodies to the world
    Composite.add(engine.world, [boxA, boxB, ground, top, left, right, controlArea, circleB, rock, elastic]);

    Composite.add(world, mouseConstraint);

    // mouseConstraint.collisionFilter.mask = mouseCategory;

    console.log('boxA.collisionFilter', boxA.collisionFilter);
    console.log('boxB.collisionFilter', boxB.collisionFilter);
    console.log('mouseConstraint.collisionFilter', mouseConstraint.collisionFilter);

    Matter.Events.on(engine, 'collisionStart', function (event) {
      let a = event.pairs[0].bodyA;
      let b = event.pairs[0].bodyB;

      if (b.label === 'controlArea') {
        console.log('controlArea', {
          // mouseConstraint,
          // mouse,
          // a,
          // b,
          // event,
          body: mouseConstraint.body,
        });

        console.log({ mouseConstraint, mouse });
        // Matter.Mouse.clearSourceEvents(mouse);
        // mouseConstraint.mouse?.mouseup?.()
        // Matter.Events.trigger(mouseConstraint, 'enddrag', { mouse: mouse, body:a});
        // Matter.Events.trigger(mouseConstraint, 'mouseup', { mouse: mouse, body:a});

        // Matter.Events.trigger(mouseConstraint, 'mouseup', { mouse: mouse });
        // mouseConstraint.mouse.mouseup({...event, body:a})
      }
    });

    // run the renderer
    Render.run(render);

    // create runner
    var runner = Runner.create();

    // Matter.Events.on(runner, "tick", event => {
    //   console.log('mc runner', mouseConstraint.body);
    // });

    // run the engine
    Runner.run(runner, engine);

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
