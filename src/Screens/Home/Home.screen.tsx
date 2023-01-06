import { FC, useState } from 'react';

import { useEffect } from 'react';

import { useSetAtom, useAtom, useAtomValue } from 'jotai';

import { useRouter } from 'next/router';

import { gameCodeAtom } from 'Atoms/GameCodeAtom';
import { userAtom } from 'Atoms/User.atom';
import { wsAtom } from 'Atoms/Ws.atom';

import styles from './Home.screen.module.css';

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const HomeScreen: FC = () => {
  const user = useAtomValue(userAtom);
  const { push } = useRouter();
  const [code, setCode] = useAtom(gameCodeAtom);

  const handleKeyPress = (number: number | 'delete' | 'clear') => {
    if (number === 'clear') return setCode('');
    setCode(number === 'delete' ? code.slice(0, -1) : code.length < 5 ? code + number : code);
  };

  useEffect(() => {
    if (!user.username) push('/select-user');
  }, []);

  // Define an array of numbers for the keys

  return (
    <>
      <div className="darkScreen" style={{ backgroundImage: `url('/img/backgrounds/b12.jpeg')` }}>
        <div className="darkScreenOverlay" />
        <div className="darkScreenContent">
          <div className="label">Enter game code</div>

          <div className="input">{code}</div>
          <div className={styles.keypad}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <button key={number} className={styles.key} onClick={() => handleKeyPress(number)}>
                {number}
              </button>
            ))}
            <button className={styles.del} onClick={() => handleKeyPress('delete')}>
              <i className="fal fa-angle-left" />
            </button>
            <button className={styles.zero} onClick={() => handleKeyPress(0)}>
              0
            </button>
            <button className={styles.clear} onClick={() => handleKeyPress('clear')}>
              <i className="fal fa-times" />
            </button>
          </div>
          <div className="blurb">Game codes have 5 numbers</div>
        </div>
      </div>
    </>
  );
};
