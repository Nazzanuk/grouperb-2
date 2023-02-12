import random from 'lodash/random';
import sample from 'lodash/sample';
import times from 'lodash/times';
import { useState } from 'react';

import styles from './DynamicBackground.module.css';

const colors = ['#0a0c11', '#ffc907', '#fb5a05', '#8c421f', '#2f242f', '#e23d05'];
const darkColors = ['#0a0c11', '#8c421f', '#2f242f'];

export const DynamicBackground = ({ floaterCount = 10, isDark = false, noLines = false }) => {
  const [floaters] = useState(
    times(floaterCount, (i) => ({
      id: i,
      '--top': `${random(0, 100)}%`,
      '--speed': `${random(5, 15)}s`,
      '--size': `${random(0.1, 30)}px`,
      '--color': sample(isDark ? darkColors : colors),
      '--delay': `${random(0, -15)}s`,
      shape: sample(['line', 'square']),
      noLines,
    })),
  );

  return (
    <>
      <div className={styles.bck}>
        <div className={styles.bckBox}>
          {floaters.map((floater) => (
            <div
              key={floater.id}
              className={styles.floater}
              style={floater}
              data-shape={floater.shape}
              data-no-lines={floater.noLines}
            />
          ))}
        </div>
      </div>
    </>
  );
};
