import { User } from 'Entities/User.entity';
import { FC, useState } from 'react';
import times from 'lodash/times';
import random from 'lodash/random';
import sample from 'lodash/sample';

import styles from './BombBroadcast.module.css';

type BombBroadcastProps = {
  user?: User;
  img?: string;
  text?: string;
  question?: string;
  subText?: string;
  duration?: string;
  bits?: number;
};

const genLines = (bits: number) =>
  times(bits / 2, () => ({
    '--top': `${random(0, 0)}vh`,
    '--left': `${random(0, 0)}vw`,
    '--width': `${random(1, 20)}vw`,
    '--angle': `${random(0, 360)}deg`,
    '--speedMultiplier': random(0.5, 3.5),
  }));

const genSquares = (bits: number) =>
  times(bits, () => ({
    '--top': `${random(-5, 5)}vh`,
    '--left': `${random(0, 20)}vw`,
    '--size': `${random(10, 100)}px`,
    '--speedMultiplier': random(-0.5, 1.5),
    '--angle': `${random(0, 360)}deg`,
    '--color': sample(['#e9771d', '#f7bb07', '#f49504', '#e4590e', '#dfcd68']),
  }));

export const BombBroadcast: FC<BombBroadcastProps> = ({ user, img, text, question, subText, duration, bits = 100 }) => {
  const [squares, setSquares] = useState(genSquares(bits));
  const [lines, setLines] = useState(genLines(bits));

  return (
    <>
      <div className={styles.broadcastBackground} style={{ '--duration': duration }} />
      <div className={styles.broadcast} style={{ '--duration': duration }}>
        <div className={styles.broadCastBoxAngle} style={{ '--angle': '-2deg' }}>
          <div className={styles.broadCastBox}>
            {squares.map((square, i) => (
            <div key={i} className={styles.lineBox} style={{ '--angle': square['--angle'] }}>
                <div key={i} className={styles.square} style={square} />
                </div>
            ))}
            {/* <div className={styles.square} /> */}
          </div>
        </div>

        {/* <div className={styles.broadCastBoxAngle} style={{ '--angle': '2deg' }}> */}
        <div className={styles.broadCastBox}>
          {lines.map((line, i) => (
            <div key={i} className={styles.lineBox} style={{ '--angle': line['--angle'] }}>
              <div key={i} className={styles.line} style={line} />
            </div>
          ))}
          {/* <div className={styles.line} />
            <div className={styles.line} style={{ '--top': '60vh' }} /> */}
        </div>
        {/* </div> */}

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
              {text ?? user?.username}
            </div>
          </div>
        </div>

        {subText && (
          <div className={styles.broadCastBoxAngle} style={{ '--angle': '-5deg', '--speedMultiplier': -0.1 }}>
            <div className={styles.broadCastBox}>
              <div className={styles.subText} style={{ '--angle': '-5deg', '--speedMultiplier': -0.5 }}>
                {subText}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
