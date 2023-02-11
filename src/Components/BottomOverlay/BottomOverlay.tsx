import { FC, useEffect } from 'react';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/router';

import { currentGameAtom } from 'Atoms/CurrentGame.atom';
import { showBottomOverlayAtom } from 'Atoms/ShowBottomOverlay.atom';
import { CharlatanBottomOverlay } from 'Components/BottomOverlay/views/CharlatanBottomOverlay';
import { VoteBottomOverlay } from 'Components/BottomOverlay/views/VoteBottomOverlay';

import styles from './BottomOverlay.module.css';

export const BottomOverlay: FC = () => {
  const { asPath } = useRouter();
  const [showBottomOverlay, setShowBottomOverlay] = useAtom(showBottomOverlayAtom);

  const game = useAtomValue(currentGameAtom);

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
        {game?.type === 'charlatan' && <CharlatanBottomOverlay />}
        {game?.type === 'vote' && <VoteBottomOverlay />}
      </div>
    </>
  );
};
