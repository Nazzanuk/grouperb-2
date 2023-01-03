import { FC, useState } from 'react';


import { useEffect } from 'react';

import { useSetAtom, useAtom, useAtomValue } from 'jotai';

import { gameCodeAtom } from 'Atoms/GameCodeAtom';
import { wsAtom } from 'Atoms/Ws.atom';

import styles from './Home.screen.module.css';
import { useRouter } from 'next/router';
import { userAtom } from 'Atoms/User.atom';

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const HomeScreen: FC = () => {
  const user = useAtomValue(userAtom);
  const { push } = useRouter();
  const [code, setCode] = useAtom(gameCodeAtom);

  const handleKeyPress = (number: number | 'delete') => {
    setCode(number === 'delete' ? code.slice(0, -1) : code.length < 5 ? code + number : code);
  };

  useEffect(() => {
    if (!user.username) push('/select-user');
  },[])


  // Define an array of numbers for the keys

  return (
    <>
      <div className="darkScreen">
        <div className="label">Enter game id</div>

        <div className="input">{code}</div>
        <div className={styles.keypad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <button key={number} className={styles.key} onClick={() => handleKeyPress(number)}>
              {number}
            </button>
          ))}
          <div className={styles.gap}></div>
          <button className={styles.zero} onClick={() => handleKeyPress(0)}>
            0
          </button>
          <button className={styles.del} onClick={() => handleKeyPress('delete')}>
            <i className="fal fa-angle-left"/>
          </button>
        </div>

      </div>
    </>
  );
};
