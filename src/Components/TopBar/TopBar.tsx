import { FC } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './TopBar.module.css';

export const TopBar: FC = () => {
  const { back, asPath } = useRouter();

  const isSplash = asPath === '/';

  return (
    <div className={styles.topBar}>
      {/* {!isSplash && ( */}
        <div className={styles.menu}>
          {/* <i className="fal fa-angle-left"></i> */}
        </div>
      {/* )} */}
      <Link href="/" className={styles.title}>{!isSplash && 'Grouperb'}</Link>
      <div className={styles.menu}>
        <i className="fal fa-bars"></i>
      </div>
    </div>
  );
};
