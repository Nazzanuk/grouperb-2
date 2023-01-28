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

  const hostVoteGame = () => {
    send({ action: 'hostGame', type: 'vote', user });
  };
  const hostDefuseGame = () => {
    send({ action: 'hostGame', type: 'defuse', user });
  };

  return (
    <>
      <div className="darkScreen" style={{ backgroundImage: `url('/img/backgrounds/b11.jpeg')` }}>
        <div className="darkScreenOverlay" />
        <div className="darkScreenContent">
          <div className={styles.game} onClick={hostVoteGame}>
            <div className={styles.background} style={{ backgroundImage: `url('/img/question-2.png')` }}/>
            <div className={styles.title}>Vote</div>
            <div className={styles.subtitle}>Unleash the laughter and discover the comedic side of your friendships </div>
          </div>
          
            <div className={styles.game} onClick={hostDefuseGame}>
              <div className={styles.background} style={{ backgroundImage: `url('/img/bomb-2.png')` }}/>
              <div className={styles.title}>Defuse</div>
              <div className={styles.subtitle}>Use teamwork to defuse the bomb!</div>
            </div>
        </div>
      </div>
    </>
  );
};
