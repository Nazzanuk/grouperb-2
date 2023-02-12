import { FC } from 'react';

import random from 'lodash/random';

import sample from 'lodash/sample';
import times from 'lodash/times';
import Link from 'next/link';

import { DynamicBackground } from 'Components/DynamicBackground/DynamicBackground';


import styles from './Splash.screen.module.css';

export const SplashScreen: FC = () => {
  return (
    <div className="darkScreen">
      <div className="darkScreenOverlay" />

      <DynamicBackground floaterCount={200} />

      <div className="darkScreenContent">
        <div className={styles.splash}>
          <div className={styles.title}>GROUPERB</div>
          <div className="blurb">Group games for any occasion</div>
          {/* <div className={styles.img}>
            <img
              src="/nazzanuk_abstract_watercolor_picture_of_a_trophy_black_yellow_o_ecb5504a-4b7c-43e7-b80d-14cf1f248c37-removebg.png"
              alt=""
            />

          </div> */}

          {/* <div className={styles.buttons}> */}
          <Link href="/home" className="button" data-variant="light">
            Start
          </Link>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};
