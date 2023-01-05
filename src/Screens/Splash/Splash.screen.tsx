import { FC } from "react";

import styles from "./Splash.screen.module.css";

export const SplashScreen: FC = () => {
  return (
    <>
      <div className="darkScreen">
        <div className={styles.title}>GROUPERB</div>

        <div className={styles.bottomCircle}></div>
        <div className={styles.img}>
          <img src="/nazzanuk_abstract_watercolor_picture_of_a_trophy_black_yellow_o_ecb5504a-4b7c-43e7-b80d-14cf1f248c37-removebg.png" alt="" />

          {/* <div className={styles.bottomSvg}>
            <svg
              viewBox="0 0 615 288"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M265 0C198 0 218 48 106 49C95 49.2848 11 68 0.999992 216C-9.00001 364 204 231 333 256C462 281 602 142 613 78C624 14 554 0 512 13C483.341 21.8705 444 30.1739 402 32C310 36 332 0 265 0Z"
                fill="white"
              />
            </svg>
          </div> */}
        </div>
      </div>
    </>
  );
};
