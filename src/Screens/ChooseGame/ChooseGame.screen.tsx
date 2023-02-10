import { FC, useState } from 'react';

import { useEffect } from 'react';

import { useSetAtom, useAtom, useAtomValue } from 'jotai';

import { useRouter } from 'next/router';

import { gameCodeAtom } from 'Atoms/GameCodeAtom';
import { userAtom } from 'Atoms/User.atom';
import { wsAtom } from 'Atoms/Ws.atom';

import styles from './ChooseGame.screen.module.css';

export const ChooseGameScreen: FC = () => {
  const user = useAtomValue(userAtom);
  const send = useSetAtom(wsAtom);

  const hostVoteGame = () => send({ action: 'hostGame', type: 'vote', user });
  const hostDefuseGame = () => send({ action: 'hostGame', type: 'defuse', user });
  const hostCharlatanGame = () => send({ action: 'hostGame', type: 'charlatan', user });
  const hostBlocksGame = () => send({ action: 'hostGame', type: 'blocks', user });

  return (
    <>
      <div className="darkScreen" style={{ backgroundImage: `url('/img/backgrounds/b11.jpeg')` }}>
        <div className="darkScreenOverlay" />
        <div className="darkScreenContent">
          <div className={styles.game} onClick={hostVoteGame}>
            <div className={styles.background} style={{ backgroundImage: `url('/img/question-2.png')` }} />
            <div className={styles.title}>Vote</div>
            <div className={styles.subtitle}>What do they really think about you?</div>
          </div>

          <div className={styles.game} onClick={hostDefuseGame}>
            <div className={styles.background} style={{ backgroundImage: `url('/img/bomb-2.png')` }} />
            <div className={styles.title}>Defuse</div>
            <div className={styles.subtitle}>Use teamwork to defuse the bomb!</div>
          </div>

          <div className={styles.game} onClick={hostCharlatanGame}>
            <div className={styles.background} style={{ backgroundImage: `url('/img/charlatan-1.png')` }} />
            <div className={styles.title}>Charlatan</div>
            <div className={styles.subtitle}>A game of big bluffing</div>
          </div>

          <div className={styles.game} onClick={hostBlocksGame}>
            <div className={styles.background} style={{ backgroundImage: `url('/img/charlatan-1.png')` }} />
            <div className={styles.title}>Blocks</div>
            <div className={styles.subtitle}>A shape-shifting team game</div>
          </div>
        </div>
      </div>
    </>
  );
};
