import { FC, useEffect } from 'react';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { showBottomOverlayAtom } from 'Atoms/ShowBottomOverlay.atom';

import { userAtom } from 'Atoms/User.atom';
import { voteGameAtom } from 'Atoms/VoteGame.atom';
import { wsAtom } from 'Atoms/Ws.atom';

import styles from './BottomOverlay.module.css';
import { voteGameHelpersAtom } from 'Atoms/VoteGameHelpers.atom';
import { useRouter } from 'next/router';

export const BottomOverlay: FC = () => {
  const { asPath } = useRouter();
  const [showBottomOverlay, setShowBottomOverlay] = useAtom(showBottomOverlayAtom);

  const game = useAtomValue(voteGameAtom);
  const send = useSetAtom(wsAtom);
  const user = useAtomValue(userAtom);
  const { isObserver, isHost } = useAtomValue(voteGameHelpersAtom);

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
        {showBottomOverlay === 'voteGameOptions' && (
          <>
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
      </div>
    </>
  );
};
