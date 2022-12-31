import { FC } from 'react';
import Link from 'next/link';

import styles from './BottomBar.module.css';
import { useRouter } from 'next/router';

export const BottomBar: FC = () => {
  const { asPath } = useRouter();

  const isHome = asPath === '/home';
  const isSplash = asPath === '/';

  return (
    <>
      <div className={styles.bottomBar}>
        <div className={styles.buttons}>
          {isSplash && (
            <Link href="/select-user" className="button">
              Start
            </Link>
          )}

          {isHome && (
            <>
              <Link href="/home" className="button">
                Join game
              </Link>

              <Link href="/home" className="button">
                Host game
              </Link>
            </>
          )}

          {isSplash && <div className={styles.blurb}>Group games for any occasion</div>}
        </div>

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
    </>
  );
};
