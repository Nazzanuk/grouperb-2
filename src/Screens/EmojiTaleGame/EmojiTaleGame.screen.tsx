import { useEffect, useRef, useState } from 'react';

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

const useTimeSince = (startTime = 0) => {
  const interval = useRef<any>(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    interval.current = setInterval(() => {
      setTime(new Date().getTime() - startTime);
    }, 1000);

    return () => clearInterval(interval.current);
  }, [startTime]);

  return { ms: time, s: Math.floor(time / 1000), m: Math.floor(time / 1000 / 60) };
};

export function EmojiTaleGameScreen() {
  const game = useAtomValue(emojiTaleGameAtom);
  const { status, userArray, isHost, currentRoundIndex, story } = useAtomValue(emojiTaleGameHelpersAtom);
  const { myAnswer, currentRound, user } = useAtomValue(emojiTaleGameHelpersAtom);
  const { leaveGame, startRound, updateAnswer, timeUp } = useEmojiTaleActions();

  const { s: timeSince } = useTimeSince(currentRound?.startTime);
  const timeRemaining = 30 - timeSince;

  useEffect(() => {
    if (game?.status !== 'playing') return;
    if (timeRemaining <= 0) timeUp();
  }, [timeRemaining > 0]);

  const addToAnswer = (emoji: string) => {
    if (myAnswer.includes(emoji)) return;
    if (myAnswer.length < 10) updateAnswer([...myAnswer, emoji]);
  };

  const removeFromAnswer = (emojiIndex: number) => {
    const newAnswer = [...myAnswer];
    newAnswer.splice(emojiIndex, 1);
    updateAnswer(newAnswer);
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

          {status === 'results' && (
            <>
              <div className="label">Round {currentRoundIndex}</div>

              <div className="label">Story</div>
              <div className={styles.story}>{story!.replace(/\n/g, '<br />')}</div>

              {currentRound?.winnerId && (
                <>
                  <div className="label">
                    Winning answer ({game.users[currentRound?.winnerId].username}: {' '}
                    +{currentRound.userPoints[currentRound?.winnerId]} points)
                  </div>
                  <div className={styles.answer}>
                    {currentRound?.userSolutions[currentRound.winnerId].map((emoji, i) => (
                      <div key={emoji + i} data-key={emoji} className={styles.answerEmoji}>
                        {emoji}
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="label">Your answer</div>
              <div className={styles.answer}>
                {myAnswer.map((emoji, i) => (
                  <div key={emoji + i} data-key={emoji} className={styles.answerEmoji}>
                    {emoji}
                  </div>
                ))}
              </div>
              <div className="label">Your points</div>
              <div className="table">
                <div className="cell squashed w50 small">Accuracy</div>
                <div className="cell squashed">
                  +{compareEmojis(toArray(currentRound?.tale.solution), currentRound?.userSolutions[user.id] ?? [])}
                </div>
                <div className="cell squashed w50 small">Votes</div>
                <div className="cell squashed">
                  +{Object.values(currentRound?.userVotes ?? {}).filter((v) => v === user.id).length * 10}
                </div>
              </div>

              {/* <div className="label">Leaderboard</div>
              <div className="table">
                {userArray.map((user) => (
                  <div className="row" key={user.id}>
                    <div className="cell  w50">{user.username}</div>
                    <div className="cell big">{currentRound?.userPoints[user.id]}</div>
                  </div>
                ))}
              </div> */}
            </>
          )}

          {status === 'playing' && (
            <>
              <div className="label">Time left: {timeRemaining}</div>
              <div className="label">Round {currentRoundIndex}</div>

              <div className="label">Story</div>
              {/* <div className="label">Match: {compareEmojis(toArray(tale?.solution), answer)}</div> */}
              <div className={styles.story}>{story!.replace(/\n/g, '<br />')}</div>

              <div className={styles.gap} />
              <div className="label">Your answer</div>
              <div className={styles.answer} data-is-complete={myAnswer.length === 10}>
                {myAnswer.map((emoji, i) => (
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
                {/* <div className={styles.emojiDoneBox} data-is-complete={myAnswer.length === 10}>
                  <div className="buttons">
                    <div className="button" data-variant="orange" onClick={startRound}>
                      Submit
                    </div>
                  </div>
                </div> */}
                <div className={styles.emojiGrid} data-is-complete={myAnswer.length === 10}>
                  {[...orderedEmojis].reverse().map((emoji, i) => (
                    <div
                      key={emoji + i}
                      data-key={emoji}
                      className={styles.gridEmoji}
                      onClick={() => addToAnswer(emoji)}
                    >
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

          {status === 'results' && (
            <div className="buttons">
              <div className="button" data-variant="orange" onClick={startRound}>
                Next round
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
