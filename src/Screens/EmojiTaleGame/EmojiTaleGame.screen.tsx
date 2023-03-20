import { useEffect, useState } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';
import capitalize from 'lodash/capitalize';
import Link from 'next/link';

import { emojiTaleGameAtom } from 'Atoms/EmojiTaleGame.atom';
import { emojiTaleGameHelpersAtom } from 'Atoms/EmojiTaleGameHelpers.atom';
import { showScoreAtom } from 'Atoms/ShowScore.atom';
import { DynamicBackground } from 'Components/DynamicBackground/DynamicBackground';
import { InfoOverlay } from 'Components/InfoOverlay/InfoOverlay';
import { LoadingGame } from 'Components/LoadingGame/LoadingGame';
import { PlayerList } from 'Components/PlayerList/PlayerList';
import { ShowScore } from 'Components/ShowScore/ShowScore';
import { WinnerBroadcast } from 'Components/WinnerBroadcast/WinnerBroadcast';

import { orderedEmojis } from 'Constants/EmojiTale.constants';
import { useEmojiTaleActions } from 'Screens/EmojiTaleGame/useEmojiTaleActions';

import styles from './EmojiTaleGame.screen.module.css';
import toArray from 'lodash/toArray';
import { compareEmojis } from 'Utils/EmojiTale/CompareEmojis';

export function EmojiTaleGameScreen() {
  const game = useAtomValue(emojiTaleGameAtom);
  const { status, userArray, isHost, currentRoundIndex, story, tale } = useAtomValue(emojiTaleGameHelpersAtom);
  const { leaveGame, startRound, selectCard, selectGem } = useEmojiTaleActions();

  const [answer, setAnswer] = useState<string[]>([]);

  const addToAnswer = (emoji: string) => {
    if (answer.length < 10) {
      setAnswer([...answer, emoji]);
    }
  };

  const removeFromAnswer = (emojiIndex: number) => {
    const newAnswer = [...answer];
    newAnswer.splice(emojiIndex, 1);
    setAnswer(newAnswer);
  };

  const setScore = useSetAtom(showScoreAtom);

  if (!game) return <LoadingGame />;

  return (
    <>
      <div className="darkScreen">
        <div className="darkScreenOverlay" />
        <DynamicBackground floaterCount={30} />

        <div className="darkScreenContent">
          <ShowScore />

          {status === 'lobby' && (
            <>
              <InfoOverlay />
              <div className="label">Game code</div>
              <div className="textOutput">{game.id}</div>

              <div className="label">Players</div>
              <PlayerList users={userArray} game={game} />
            </>
          )}

          {status === 'playing' && (
            <>
              <div className="label">Round {currentRoundIndex}</div>

              <div className="label">Story</div>
              {/* <div className="label">Match: {compareEmojis(toArray(tale?.solution), answer)}</div> */}
              <div className={styles.story}>{story!.replace(/\n/g, '<br />')}</div>

              <div className={styles.gap} />
              <div className="label">Your answer</div>
              <div className={styles.answer}>
                {answer.map((emoji, i) => (
                  <div
                    key={emoji + i}
                    data-key={emoji}
                    className={styles.answerEmoji}
                    onClick={() => removeFromAnswer(i)}
                  >
                    {emoji}
                  </div>
                ))}
              </div>

              <div className={styles.gap} />
              <div className="label">Emojis</div>
              <div className={styles.emojiGridBox}>
                <div className={styles.emojiGrid}>
                  {[...orderedEmojis].reverse().map((emoji, i) => (
                    <div key={emoji + i} data-key={emoji} className={styles.gridEmoji} onClick={() => addToAnswer(emoji)}>
                      {emoji}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {status === 'lobby' && (
            <div className="buttons">
              {!isHost && <div className={styles.blurb}>Waiting for host to start game...</div>}

              {/* {!(userArray.length >= 2) && ( */}
              <div className={styles.blurb}>At least 2 players are needed to start the game</div>
              {/* )} */}

              {isHost && (
                <div className="button" data-variant="orange" onClick={startRound}>
                  Start game
                </div>
              )}

              <Link href="/home" className="button" onClick={leaveGame} data-variant="light">
                Leave game
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
