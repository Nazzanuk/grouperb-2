import { FC } from 'react';

import styles from './Home.screen.module.css';

import { useEffect } from 'react';
import { useSetAtom, useAtom } from 'jotai';
import { wsAtom } from 'Atoms/Ws.atom';

export const HomeScreen: FC = () => {

  return (
    <>
      <div className="darkScreen"></div>
    </>
  );
};
