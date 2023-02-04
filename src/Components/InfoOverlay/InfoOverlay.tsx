import { currentGameAtom } from 'Atoms/CurrentGame.atom';
import { GAME_INFO } from 'Constants/GameInfo';
import { useAtom, useAtomValue } from 'jotai';
import { FC, useState } from 'react';

import styles from './InfoOverlay.module.css';

export const InfoOverlay: FC = () => {
  const [showInfoOverlay, setShowInfoOverlay] = useState(true);
  const game = useAtomValue(currentGameAtom);

  const gameType = game?.type;

  return (
    <>
      <div className={styles.infoOverlayBackground} data-is-open={!!showInfoOverlay}>
        <div className={styles.infoOverlay} data-is-open={!!showInfoOverlay}>
          {GAME_INFO[gameType!]}
          <p />

          <div className="button" data-variant="orange" onClick={() => setShowInfoOverlay(false)}>
            Got it
          </div>
        </div>
      </div>
    </>
  );
};
