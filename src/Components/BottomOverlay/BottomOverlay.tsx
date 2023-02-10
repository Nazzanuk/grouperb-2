import { FC, useEffect } from 'react';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { showBottomOverlayAtom } from 'Atoms/ShowBottomOverlay.atom';

import { userAtom } from 'Atoms/User.atom';
import { voteGameAtom } from 'Atoms/VoteGame.atom';
import { wsAtom } from 'Atoms/Ws.atom';

import styles from './BottomOverlay.module.css';
import { voteGameHelpersAtom } from 'Atoms/VoteGameHelpers.atom';
import { useRouter } from 'next/router';
import { CharlatanBottomOverlay } from 'Components/BottomOverlay/views/CharlatanBottomOverlay';

export const BottomOverlay: FC = () => {
  const { asPath } = useRouter();
  const [showBottomOverlay, setShowBottomOverlay] = useAtom(showBottomOverlayAtom);

  const game = useAtomValue(voteGameAtom);
  const send = useSetAtom(wsAtom);
  const user = useAtomValue(userAtom);
  const { isObserver, isHost, myWinningQuestions, usersSortedByScore } = useAtomValue(voteGameHelpersAtom);

  const leaveGame = () => send({ action: 'leaveGame', gameId: game!.id, userId: user.id });
  const joinGame = () => send({ action: 'joinGame', gameId: game!.id, user });
  const getGame = () => send({ action: 'getGame', gameId: game!.id });

  useEffect(() => {
    setShowBottomOverlay(null);
  }, [asPath]);

  console.log({ showBottomOverlay });

  return (
    <>
      <div
        className={styles.bottomOverlayBackground}
        data-is-open={!!showBottomOverlay}
        onClick={() => setShowBottomOverlay(null)}
      />
      <div className={styles.bottomOverlay} data-is-open={!!showBottomOverlay}>
        <CharlatanBottomOverlay />
        {showBottomOverlay === 'voteGameOptions' && (
          <>
            <div className={styles.title}>Options</div>
            {isObserver && (
              <div className="button" onClick={joinGame}>
                Join game
              </div>
            )}
            {!isObserver && (
              <div className="button" onClick={leaveGame}>
                Leave Game
              </div>
            )}
            {!isHost && (
              <div className="button" data-disabled={true}>
                Kick player
              </div>
            )}
          </>
        )}

        {showBottomOverlay === 'voteGameFavs' && (
          <>
            <div className={styles.title}>The truth about {user.username}</div>
            <div className={styles.list}>
              {myWinningQuestions.map((question) => (
                <div className={styles.listItem} data-highlight key={question}>
                  <i className="fal fa-star"></i> {user.username} {question}
                </div>
              ))}
            </div>
          </>
        )}

        {showBottomOverlay === 'voteGameInfo' && (
          <>
            <div className={styles.title}>Info</div>
            <div className={styles.list}>
              <div className={styles.listItem} data-highlight>
                Game Code: <strong>{game?.id}</strong>
              </div>
              <div className={styles.listItem} data-highlight>
                Game Link: <strong>{window.location.href}</strong>
                <div className={styles.copy} onClick={() => navigator.clipboard.writeText(window.location.href)}>
                  <i className="fal fa-copy"></i>
                </div>
              </div>
            </div>
          </>
        )}

        {showBottomOverlay === 'voteGameLeaderboard' && (
          <>
            <div className={styles.title}>Leaderboard</div>
            <div className={styles.list}>
              {usersSortedByScore.map((user) => (
                <div className={styles.listItem} key={user.id} data-highlight>
                  <img className={styles.playerIcon} src={`/img/avatars/${user.avatar}`} alt="avatar" />
                  {user.username}
                  <div className={styles.score}> {user.score}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};
