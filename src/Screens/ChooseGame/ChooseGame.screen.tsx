import { FC, useState } from 'react';

import { useEffect } from 'react';

import { useSetAtom, useAtom, useAtomValue } from 'jotai';

import { useRouter } from 'next/router';

import { gameCodeAtom } from 'Atoms/GameCodeAtom';
import { userAtom } from 'Atoms/User.atom';
import { wsAtom } from 'Atoms/Ws.atom';

import styles from './ChooseGame.screen.module.css';
import { DynamicBackground } from 'Components/DynamicBackground/DynamicBackground';
import { Game } from 'Entities/Game.entity';

export const ChooseGameScreen: FC = () => {
  const { asPath, push, query } = useRouter();
  const user = useAtomValue(userAtom);
  const send = useSetAtom(wsAtom);

  const hostGame = (type: Game['type']) => () => {
    setTimeout(() => {
      send({ action: 'hostGame', type, user });
    }, 1000);
    push(`/fetching`);
  };

  return (
    <>
      <div className="darkScreen">
        <div className="darkScreenOverlay" />

        <DynamicBackground floaterCount={20} />
        <div className="darkScreenContent">
          <div className={styles.game} onClick={hostGame('vote')}>
            <div className={styles.background} style={{ backgroundImage: `url('/img/question-2.png')` }} />
            <div className={styles.title}>Vote</div>
            <div className={styles.subtitle}>What do they really think about you?</div>
          </div>

          <div className={styles.game} onClick={hostGame('flow')}>
            <div className={styles.background} style={{ backgroundImage: `url('/img/flow-2.jpg')` }} />
            <div className={styles.title}>Flow</div>
            <div className={styles.subtitle}>A game of timing</div>
          </div>

          <div className={styles.game} onClick={hostGame('defuse')}>
            <div className={styles.background} style={{ backgroundImage: `url('/img/bomb-2.png')` }} />
            <div className={styles.title}>Defuse</div>
            <div className={styles.subtitle}>Use teamwork to defuse the bomb!</div>
          </div>

          <div className={styles.game} onClick={hostGame('blocks')}>
            <div className={styles.background} style={{ backgroundImage: `url('/img/blocks-1.png')` }} />
            <div className={styles.title}>Blocks</div>
            <div className={styles.subtitle}>A shape-shifting team game</div>
          </div>

          <div className={styles.game} onClick={hostGame('gemRush')}>
            <div className={styles.background} style={{ backgroundImage: `url('/img/gems-1.jpeg')` }} />
            <div className={styles.title}>Gem Rush
            </div>
            <div className={styles.subtitle}>The great gem scramble</div>
          </div>

          <div className={styles.game} onClick={hostGame('charlatan')}>
            <div className={styles.background} style={{ backgroundImage: `url('/img/charlatan-1.png')` }} />
            <div className={styles.title}>Charlatan (Alpha)</div>
            <div className={styles.subtitle}>A game of big bluffing</div>
          </div>
        </div>
      </div>
    </>
  );
};
