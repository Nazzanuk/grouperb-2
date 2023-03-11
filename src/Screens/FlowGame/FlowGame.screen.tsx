import { FC, useEffect, useState } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';

import { useRouter } from 'next/router';

import { currentGameAtom } from 'Atoms/CurrentGame.atom';
import { userAtom } from 'Atoms/User.atom';
import { wsAtom } from 'Atoms/Ws.atom';
import { DynamicBackground } from 'Components/DynamicBackground/DynamicBackground';
import { InfoOverlay } from 'Components/InfoOverlay/InfoOverlay';
import { PlayerList } from 'Components/PlayerList/PlayerList';

import { useOnce } from 'Utils/UseOnce';

import styles from './FlowGame.screen.module.css';
import times from 'lodash/times';
import random from 'lodash/random';
import sample from 'lodash/sample';

const sequence = times(100, (i) => ({
  delay: i,
  index: i,
  speed: random(2, 6),
  color: sample(['purple', 'blue', 'green', 'gold']),
}));

export function FlowGameScreen() {
  const { query } = useRouter();

  const game = useAtomValue(currentGameAtom);
  const send = useSetAtom(wsAtom);
  const user = useAtomValue(userAtom);

  return (
    <>
      {/* <InfoOverlay /> */}
      <div className="darkScreen">
        <div className="darkScreenOverlay" />
        <DynamicBackground floaterCount={30} />

        <div className="darkScreenContent" style={{ overflow: 'hidden' }}>
          <div className={styles.boops}>
            {[0, 1, 2,3].map((i) => (
              <div className={styles.boopBox} key={i}>
                {sequence
                  .filter((s) => s.index % 4 === i)
                  .map(({ speed, delay, index, color }) => (
                    <Boop delay={delay} speed={speed} key={index} color={color} />
                  ))}
              </div>
            ))}
          </div>
          {/* {status === 'lobby' && (
            <>
              <div className="label">Game code</div>
              <div className="textOutput">{game.id}</div>

              <div className="label">Players</div>
              <PlayerList users={userArray} game={game} />
            </>
          )} */}
        </div>
      </div>
    </>
  );
}

const Boop = ({ delay = 0, speed = 5, color }) => {
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [init, setInit] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [wasTapped, setWasTapped] = useState(false);

  let points = 0;
  if (endTime) {
    const difference = endTime - startTime;
    points = 400 - Math.abs(speed * 1000 - difference);
  }

  console.log({ points });

  useOnce(() => {
    setTimeout(() => {
      setStartTime(new Date().getTime());
      setIsActive(true);
    }, delay * 1000);
  });

  const tap = () => {
    if (wasTapped) return;

    setWasTapped(true);
    setEndTime(new Date().getTime());
  };

  return (
    <div
      className={styles.boop}
      onClick={tap}
      style={{ '--delay': `${delay}s`, '--speed': `${speed}s`, '--color': color }}
      data-tapped={wasTapped}
      data-fail={points < 0}
    />
  );
};
