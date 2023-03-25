import { FC, useEffect } from 'react';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { useRouter } from 'next/router';

import { showBottomOverlayAtom } from 'Atoms/ShowBottomOverlay.atom';

import { userAtom } from 'Atoms/User.atom';
import { voteGameAtom } from 'Atoms/VoteGame.atom';
import { voteGameHelpersAtom } from 'Atoms/VoteGameHelpers.atom';
import { wsAtom } from 'Atoms/Ws.atom';

import styles from './../BottomOverlay.module.css';
import { emojiTaleGameHelpersAtom } from 'Atoms/EmojiTaleGameHelpers.atom';
import { emojiTaleGameAtom } from 'Atoms/EmojiTaleGame.atom';

export const EmojiTaleBottomOverlay: FC = () => {
  const { asPath } = useRouter();
  const [showBottomOverlay, setShowBottomOverlay] = useAtom(showBottomOverlayAtom);

  const game = useAtomValue(emojiTaleGameAtom);
  const send = useSetAtom(wsAtom);
  const user = useAtomValue(userAtom);
  const { isObserver, userGameScores, usersSortedByScore, currentRound } = useAtomValue(emojiTaleGameHelpersAtom);

  useEffect(() => {
    setShowBottomOverlay(null);
  }, [asPath]);

  console.log({ showBottomOverlay });

  return (
    <>
      {showBottomOverlay === 'emojiTaleGameInfo' && (
        <>
          <div className={styles.title}>Info</div>
          <div className={styles.list}>
            <div className={styles.listItem} data-highlight>
              Game Code: <strong>{game?.id}</strong>
            </div>
            {/* <div className={styles.listItem} data-highlight>
              Game Link: <strong>{window.location.href}</strong>
              <div className={styles.copy} onClick={() => navigator.clipboard.writeText(window.location.href)}>
                <i className="fal fa-copy"></i>
              </div>
            </div> */}
          </div>
        </>
      )}

      {showBottomOverlay === 'emojiTaleGameLeaderboard' && (
        <>
          <div className={styles.title}>Leaderboard</div>
          <div className={styles.list}>
            {usersSortedByScore.map((user) => (
              <div className={styles.listItem} key={user.id} data-highlight>
                <img className={styles.playerIcon} src={`/img/avatars/${user.avatar}`} alt="avatar" />
                {user.username}
                <div className={styles.score}> {userGameScores[user.id]}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};
