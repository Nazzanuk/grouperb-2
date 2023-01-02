/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { FC, useState } from 'react';

import { useEffect } from 'react';

import { useSetAtom, useAtomValue } from 'jotai';
import Link from 'next/link';

import { avatarsAtom } from 'Atoms/Avatars.atom';
import { updateUserAtom } from 'Atoms/UpdateUser.atom';
import { userAtom } from 'Atoms/User.atom';

import styles from './SelectUser.screen.module.css';

export const SelectUserScreen: FC = () => {
  const user = useAtomValue(userAtom);
  const updateUser = useSetAtom(updateUserAtom);
  const avatars = useAtomValue(avatarsAtom);

  const index = avatars.findIndex((avatar) => avatar === user.avatar);

  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(0);

  // console.log({ index, currentAvatarIndex, avatars });

  const prevAvatar = () => {
    const prevIndex = currentAvatarIndex === 0 ? avatars.length - 1 : currentAvatarIndex - 1;
    setCurrentAvatarIndex(prevIndex);
  };

  const nextAvatar = () => {
    const nextIndex = currentAvatarIndex === avatars.length - 1 ? 0 : currentAvatarIndex + 1;
    setCurrentAvatarIndex(nextIndex);
  };

  const handleUsernameChange = (e: any) => updateUser({ ...user, username: e.target.value.trim() });

  useEffect(() => {
    console.log('weirdavatars', { avatars, user });
    if (!avatars.length) return;
    console.log('__a', avatars[0]);

    setCurrentAvatarIndex(index === -1 ? Math.round(Math.random() * avatars.length) : index);
  }, [!!avatars.length]);

  useEffect(() => {
    if (!avatars.length) return;

    updateUser({ ...user, avatar: avatars[currentAvatarIndex] });
  }, [currentAvatarIndex, avatars]);

  const currentAvatarUrl = `/img/avatars/${user.avatar}`;

  return (
    <div className="darkScreen">
      <div className={styles.selectuser}>
        <div className="label">User ID</div>
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
