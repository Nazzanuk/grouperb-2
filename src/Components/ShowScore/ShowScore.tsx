import { animated, useSpring } from '@react-spring/web';

import { useAtom } from 'jotai';

import { showScoreAtom } from 'Atoms/ShowScore.atom';

import styles from './ShowScore.module.css';

export const ShowScore = () => {
  const [scores, setScores] = useAtom(showScoreAtom);
  // const [animations, setAnimations] = useSpring(() => ({ total: 0 }));

  return (
    <>
      {scores.map(({ id, score }, i) => (
        <div className={styles.score} key={id}>
          +{score}
        </div>
      ))}
      {/* <animated.div className={styles.total}>{to(animations.total, value => parseInt(value))}</animated.div> */}
    </>
  );
};
