import { FC, useEffect } from 'react';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { useRouter } from 'next/router';

import { charlatanGameAtom } from 'Atoms/CharlatanGame.atom';
import { charlatanGameHelpersAtom } from 'Atoms/CharlatanGameHelpers.atom';
import { showBottomOverlayAtom } from 'Atoms/ShowBottomOverlay.atom';

import { userAtom } from 'Atoms/User.atom';
import { voteGameAtom } from 'Atoms/VoteGame.atom';
import { voteGameHelpersAtom } from 'Atoms/VoteGameHelpers.atom';
import { wsAtom } from 'Atoms/Ws.atom';

import styles from './../BottomOverlay.module.css';

export const CharlatanBottomOverlay: FC = () => {
  const { asPath } = useRouter();
  const [showBottomOverlay, setShowBottomOverlay] = useAtom(showBottomOverlayAtom);

  const game = useAtomValue(charlatanGameAtom);
  const send = useSetAtom(wsAtom);
  const user = useAtomValue(userAtom);
  const { isObserver, sortedTotalScoresArray } = useAtomValue(charlatanGameHelpersAtom);

  const leaveGame = () => send({ action: 'leaveGame', gameId: game!.id, userId: user.id });
  const joinGame = () => send({ action: 'joinGame', gameId: game!.id, user });
  const getGame = () => send({ action: 'getGame', gameId: game!.id });

  useEffect(() => {
    setShowBottomOverlay(null);
  }, [asPath]);

  console.log({ showBottomOverlay });

  return (
    <>
      {showBottomOverlay === 'charlatanGameOptions' && (
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
          {/* {!isHost && (
            <div className="button" data-disabled={true}>
              Kick player
            </div>
          )} */}
        </>
      )}

      {showBottomOverlay === 'charlatanGameInfo' && (
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

      {showBottomOverlay === 'charlatanGameLeaderboard' && (
        <>
          <div className={styles.title}>Leaderboard</div>
          <div className={styles.list}>
            {sortedTotalScoresArray.map(([user, score]) => (
              <div className={styles.listItem} key={user.id} data-highlight>
                <img className={styles.playerIcon} src={`/img/avatars/${user.avatar}`} alt="avatar" />
                {user.username}
                <div className={styles.score}> {score}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};
