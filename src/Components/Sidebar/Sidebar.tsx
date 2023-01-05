import { FC, useState } from 'react';

import { useAtom, useAtomValue } from 'jotai';

import Link from 'next/link';

import { isMenuOpenAtom } from 'Atoms/IsMenuOpen.atom';
import { userAtom } from 'Atoms/User.atom';


import styles from './Sidebar.module.css';

export const Sidebar: FC = () => {
  const [isActive, setIsActive] = useAtom(isMenuOpenAtom);
  const user = useAtomValue(userAtom);

  return (
    <>
      <div
        className={styles.sidebarOverlay}
        data-is-active={isActive}
        onClick={() => setIsActive(false)}
      />{' '}
      <div className={styles.sidebar} data-is-active={isActive} onClick={() => setIsActive(false)}>
        <div className={styles.topPart}>
        <Link href="/select-user" legacyBehavior>
            <img className={styles.profile} src={`/img/avatars/${user.avatar}`} alt="avatar" />
            </Link>
          <div className={styles.menu} onClick={() => setIsActive(false)}>
            <i className="fal fa-times"></i>
          </div>
        </div>

        <Link href="/home" className={styles.menuItem}>
          Home
        </Link>
        <Link href="/select-user" className={styles.menuItem}>
          Profile
        </Link>
      </div>
    </>
  );
};
