import { FC } from 'react';

import { useAtom, useAtomValue } from 'jotai';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { connectionStatusAtom } from 'Atoms/ConnectionStatus.atom';
import { isMenuOpenAtom } from 'Atoms/IsMenuOpen.atom';
import { wsAtom } from 'Atoms/Ws.atom';

import styles from './TopBar.module.css';

export const TopBar: FC = () => {
  const [ws, send] = useAtom(wsAtom);
  const connectionStatus = useAtomValue(connectionStatusAtom);
  const [isMenuActive, setIsMenuActive] = useAtom(isMenuOpenAtom);
  const { back, asPath } = useRouter();

  const isSplash = asPath === '/';

  const reconnect = () => send({ action: 'reconnect' });


  return (
    <div className={styles.topBar}>
      {/* {!isSplash && ( */}
      <div className={styles.connectionStatus} data-status={connectionStatus} onClick={reconnect}>
        <i className="fas fa-circle"></i>
      </div>
      {/* )} */}
      <Link href="/" className={styles.title}>
        {!isSplash && 'Grouperb'}
      </Link>
      <div className={styles.menu} onClick={() => setIsMenuActive(true)}>
        <i className="fal fa-bars"></i>
      </div>
    </div>
  );
};
