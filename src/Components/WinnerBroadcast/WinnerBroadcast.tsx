import { User } from 'Entities/User.entity';
import { FC } from 'react';
import times from 'lodash/times';
import random from 'lodash/random';
import sample from 'lodash/sample';

import styles from './WinnerBroadcast.module.css';

type WinnerBroadcastProps = {
  user?: User;
};

const lines = times(20, () => ({
  '--top': `${random(0, 100)}vh`,
  '--left': `${random(0, 100)}vw`,
  '--width': `${random(20, 140)}vw`,
  '--speedMultiplier': random(0.5, 3.5),
}));

const squares = times(20, () => ({
  '--top': `${random(0, 100)}vh`,
  '--left': `${random(0, 100)}vw`,
  '--size': `${random(50, 300)}px`,
  '--speedMultiplier': random(-0.5, 1.5),
  '--color': sample(['#e9771d', '#f7bb07', '#f49504', '#e4590e', '#f4d8d1', '#000']),
}));

export const WinnerBroadcast: FC<WinnerBroadcastProps> = ({ user, img, text, question, subText }) => {

  // const [squares, setSquares] = useState(squares);
  return (
    <>
      <div className={styles.broadcastBackground}/>
      <div className={styles.broadcast}>
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
            <img
              className={styles.avatar}
              src={img ?? `/img/avatars/${user?.avatar}`}
              style={{}}
            />
          </div>
        </div>

        <div className={styles.broadCastBoxAngle} style={{ '--angle': '-5deg' }}>
          <div className={styles.broadCastBox}>
            <div className={styles.user} style={{}}>
              {user?.username ?? text}
            </div>
          </div>
        </div>

        <div className={styles.broadCastBoxAngle} style={{ '--angle': '-5deg' }}>
          <div className={styles.broadCastBox}>
            <div className={styles.subText} style={{}}>
              Who {subText}?...
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
