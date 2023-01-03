import { FC } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';
import Link from 'next/link';

import { useRouter } from 'next/router';

import { gameCodeAtom } from 'Atoms/GameCodeAtom';
import { userAtom } from 'Atoms/User.atom';
import { wsAtom } from 'Atoms/Ws.atom';

import styles from './BottomBar.module.css';
import { voteGameHelpersAtom } from 'Atoms/VoteGameHelpers.atom';

export const BottomBar: FC = () => {
  const { asPath, push, query } = useRouter();
  const send = useSetAtom(wsAtom);
  const user = useAtomValue(userAtom);
  const gameCode = useAtomValue(gameCodeAtom);

  const isHome = asPath === '/home';
  const isSplash = asPath === '/';
  const isVoteGame = asPath.includes('/vote-game');

  const { isHost, isObserver } = useAtomValue(voteGameHelpersAtom);

  const hostGame = () => {
    send({ action: 'hostGame', type: 'vote', user });
    // push('/vote-game');
  };

  const joinGame = () => {
    send({ action: 'joinGame', gameId: query.voteGameId ?? gameCode, user });
  };

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
              <div className="button" onClick={joinGame} data-disabled={gameCode.length < 5}>
                Join game
              </div>

              <div className="button" onClick={hostGame}>
                Host game
              </div>
            </>
          )}

          {isSplash && <div className={styles.blurb}>Group games for any occasion</div>}

          {isVoteGame && (
            <>
              {isObserver && (
                <div className="button" onClick={joinGame}>
                  Join game
                </div>
              )}
              <div className={styles.icons}>
                <div className={styles.icon}>
                  <i className="fas fa-trophy"></i>
                </div>
                <div className={styles.icon}>
                  <i className="fas fa-star"></i>
                </div>
                <div className={styles.icon}>
                  <i className="fas fa-info"></i>
                </div>
                <div className={styles.icon}>
                  <i className="fas fa-cog"></i>
                </div>
              </div>
            </>
          )}
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
