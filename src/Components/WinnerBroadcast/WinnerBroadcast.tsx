import { User } from 'Entities/User.entity';
import { FC, useState } from 'react';
import times from 'lodash/times';
import random from 'lodash/random';
import sample from 'lodash/sample';

import styles from './WinnerBroadcast.module.css';

type WinnerBroadcastProps = {
  user?: User;
  img?: string;
  text?: string;
  question?: string;
  subText?: string;
  duration?: string;
  bits?: number;
};

const genLines = (bits:number) =>
  times(bits / 2, () => ({
    '--top': `${random(0, 100)}vh`,
    '--left': `${random(0, 100)}vw`,
    '--width': `${random(20, 140)}vw`,
    '--speedMultiplier': random(0.5, 3.5),
  }));

const genSquares = (bits:number) =>
  times(bits, () => ({
    '--top': `${random(0, 100)}vh`,
    '--left': `${random(0, 100)}vw`,
    '--size': `${random(50, 300)}px`,
    '--speedMultiplier': random(-0.5, 1.5),
    '--color': sample(['#e9771d', '#f7bb07', '#f49504', '#e4590e', '#f4d8d1', '#000']),
  }));

export const WinnerBroadcast: FC<WinnerBroadcastProps> = ({
  user,
  img,
  text,
  question,
  subText,
  duration,
  bits = 20,
}) => {
  const [squares, setSquares] = useState(genSquares(bits));
  const [lines, setLines] = useState(genLines(bits));

  return (
    <>
      <div className={styles.broadcastBackground} style={{ '--duration': duration }} />
      <div className={styles.broadcast} style={{ '--duration': duration }}>
        <div className={styles.broadCastBoxAngle} style={{ '--angle': '-2deg' }}>
          <div className={styles.broadCastBox}>
            {squares.map((square, i) => (
              <div key={i} className={styles.square} style={square} />
            ))}
            {/* <div className={styles.square} /> */}
          </div>
        </div>

        <div className={styles.broadCastBoxAngle} style={{ '--angle': '2deg' }}>
          <div className={styles.broadCastBox}>
            {lines.map((line, i) => (
              <div key={i} className={styles.line} style={line} />
            ))}
            {/* <div className={styles.line} />
            <div className={styles.line} style={{ '--top': '60vh' }} /> */}
          </div>
        </div>

        <div className={styles.broadCastBoxAngle} style={{ '--angle': '5deg' }}>
          <div className={styles.broadCastBox}>
            {(img || user) && (
              <img
                className={styles.avatar}
                src={img ?? `/img/avatars/${user?.avatar}`}
                style={{}}
              />
            )}
          </div>
        </div>

        <div className={styles.broadCastBoxAngle} style={{ '--angle': '-5deg' }}>
          <div className={styles.broadCastBox}>
            <div className={styles.user} style={{}}>
              {user?.username ?? text}
            </div>
          </div>
        </div>

        {subText && (
          <div className={styles.broadCastBoxAngle} style={{ '--angle': '-5deg' }}>
            <div className={styles.broadCastBox}>
              <div className={styles.subText} style={{}}>
                Who {subText}?...
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
