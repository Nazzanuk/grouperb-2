/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { FC, useState } from 'react';

import styles from './SelectUser.screen.module.css';

import { useEffect } from 'react';
import { useSetAtom, useAtom, useAtomValue } from 'jotai';
import { userAtom } from 'Atoms/User.atom';
import { avatarsAtom } from 'Atoms/Avatars.atom';
import Link from 'next/link';

export const SelectUserScreen: FC = () => {
  const [user, setUser] = useAtom(userAtom);
  const avatars = useAtomValue(avatarsAtom);

  const index = avatars.findIndex((avatar) => avatar === user.avatar);

  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(0);

  console.log({ index, currentAvatarIndex, avatars });

  const prevAvatar = () => {
    const prevIndex = currentAvatarIndex === 0 ? avatars.length - 1 : currentAvatarIndex - 1;
    setCurrentAvatarIndex(prevIndex);
  };

  const nextAvatar = () => {
    const nextIndex = currentAvatarIndex === avatars.length - 1 ? 0 : currentAvatarIndex + 1;
    setCurrentAvatarIndex(nextIndex);
  };

  const handleUsernameChange = (e: any) => setUser({ ...user, username: e.target.value.trim() });

  useEffect(() => {
    if (!avatars.length) return;

    setCurrentAvatarIndex(index === -1 ? Math.round(Math.random() * avatars.length) : index);
  }, [!!avatars.length]);

  useEffect(() => {
    if (!avatars.length) return;
    setUser({ ...user, avatar: avatars[currentAvatarIndex] });
  }, [currentAvatarIndex, avatars]);

  const currentAvatarUrl = `/img/avatars/${user.avatar}`;

  return (
    <div className="darkScreen">
      <div className={styles.selectuser}>
        <div className="label">User id</div>
        <div className="textOutput">{user.id}</div>

        <div className="label">Username</div>
        <input
          type="text"
          id="username"
          className="input"
          autoComplete="off"
          value={user.username}
          onChange={handleUsernameChange}
        />

        <div className="label">Avatar</div>
        <div className={styles.avatarSelect}>
          <div className={styles.avatarArrow} onClick={prevAvatar}>
            <i className="fal fa-chevron-left"></i>
          </div>

          <img className={styles.avatar} src={currentAvatarUrl} alt="avatar" />
          <div className={styles.avatarArrow} onClick={nextAvatar}>
            <i className="fal fa-chevron-right"></i>
          </div>
        </div>

        <Link href="/home" className="button" data-variant="light">
          Done
        </Link>
      </div>
    </div>
  );
};
