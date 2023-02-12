import { FC, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';

import { useAtomValue, useSetAtom } from 'jotai';

import { currentGameAtom } from 'Atoms/CurrentGame.atom';
import { sharedGameHelpersAtom } from 'Atoms/SharedGameHelpers.atom';
import { selectUserPopupAtom, showUserPopupAtom, userPopupAtom } from 'Atoms/UserPopup.atom';

import styles from './UserPopup.module.css';

export const UserPopup: FC = () => {
  const game = useAtomValue(currentGameAtom);
  const { userArray } = useAtomValue(sharedGameHelpersAtom);
  const { isActive, selectedUser, userIds, title } = useAtomValue(userPopupAtom);
  const selectUserPopup = useSetAtom(selectUserPopupAtom);

  const [currentIndex, setCurrentIndex] = useState(0);

  const users = userIds.map((userId) => game!.users[userId]);

  return (
    <>
      <div className={styles.userPopupBackground} data-is-visible={isActive} />
      <div className={styles.userPopup} data-is-visible={isActive}>
        <div className={styles.title}>{title}</div>
        <Swiper
          loop
          slidesPerView={1}
          onClick={(swiper) => swiper.slideNext()}
          onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
        >
          {users.map((user) => (
            <SwiperSlide key={user.id}>
              <div className={styles.user}>
                <img className={styles.avatar} src={`/img/avatars/${user.avatar}`} alt="avatar" />
                <div className={styles.username}>{user?.username}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="buttons" onClick={() => selectUserPopup(users[currentIndex])}>
          <div className="button" data-variant="orange">
            Choose
          </div>
        </div>
      </div>
    </>
  );
};
