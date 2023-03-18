import { useEffect } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';
import capitalize from 'lodash/capitalize';
import Link from 'next/link';

import { gemRushGameAtom } from 'Atoms/GemRushGame.atom';
import { gemRushGameHelpersAtom } from 'Atoms/GemRushGameHelpers.atom';
import { showScoreAtom } from 'Atoms/ShowScore.atom';
import { DynamicBackground } from 'Components/DynamicBackground/DynamicBackground';
import { InfoOverlay } from 'Components/InfoOverlay/InfoOverlay';
import { LoadingGame } from 'Components/LoadingGame/LoadingGame';
import { PlayerList } from 'Components/PlayerList/PlayerList';
import { ShowScore } from 'Components/ShowScore/ShowScore';
import { WinnerBroadcast } from 'Components/WinnerBroadcast/WinnerBroadcast';

import { useGemRushActions } from 'Screens/GemRushGame/useGemRushActions';

import styles from './GemRushGame.screen.module.css';
import mapValues from 'lodash/mapValues';
import map from 'lodash/map';
import { UserId } from 'Entities/UserId.entity';

export function GemRushGameScreen() {
  const game = useAtomValue(gemRushGameAtom);
  const { status, userArray, isHost, myCards, mySelectedCard, isMySelectedCard } = useAtomValue(gemRushGameHelpersAtom);
  const { gems, allMyCardsMatch, somebodyHasGem, isGemSelected, myGem } = useAtomValue(gemRushGameHelpersAtom);
  const { myRoundPoints, currentRoundIndex, canChooseGem, currentRound } = useAtomValue(gemRushGameHelpersAtom);
  const { leaveGame, startRound, selectCard, selectGem } = useGemRushActions();

  const setScore = useSetAtom(showScoreAtom);

  useEffect(() => {
    if (status !== 'playing') return;
    if (!myGem?.points) return;

    setScore(myGem?.points);
  }, [myGem?.points]);

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
              <WinnerBroadcast text={`Round ${currentRoundIndex}`} duration={'2s'} bits={10} />

              <div className="label">Round {currentRoundIndex}</div>
              <div className={styles.displayArea} data-alert={canChooseGem}>
                <div className={styles.displayText}>
                  {!canChooseGem && (
                    <>{mySelectedCard ? `${capitalize(mySelectedCard.color)} card selected` : 'Select a card'}</>
                  )}
                  {canChooseGem && <>Grab a gem!</>}
                </div>
              </div>

              <div className={styles.gems}>
                {gems.map((gem, index) => (
                  <div
                    className={styles.gem}
                    style={{ '--color': gem.color }}
                    key={gem.color}
                    data-is-active={!myGem && (allMyCardsMatch || somebodyHasGem)}
                    data-is-selected={isGemSelected(gem)}
                    onClick={() => selectGem(gem)}
                  >
                    <span>+{gem.points}</span>
                  </div>
                ))}
              </div>

              <div className={styles.cards}>
                {myCards.map((card, index) => (
                  <div
                    className={styles.card}
                    key={card.id}
                    style={{ '--color': card.color, '--index': index }}
                    onClick={() => selectCard(card)}
                    data-is-selected={isMySelectedCard(card)}
                  />
                ))}
              </div>
            </>
          )}

          {status === 'results' && (
            <>
            <WinnerBroadcast text={`Round over!`} subText={`+${myRoundPoints} points!`} duration={'4s'} bits={10} />
              <div className="label">Round {currentRoundIndex} results</div>
              
              <div className="table">
                <div className="cell w50 heading">Player</div>
                <div className="cell heading">Total points</div>
                {map(game.points, (points: number, userId: UserId) => (
                  <>
                    <div className="cell w50">{game.users[userId].username}</div>
                    <div className="cell big">{points}</div>
                  </>
                ))}
              </div>

              <div className={styles.buttons}>
                <div className="button" data-variant="orange" onClick={startRound}>
                  Next round
                </div>
              </div>
            </>
          )}

          {status === 'lobby' && (
            <div className={styles.buttons}>
              {!isHost && <div className={styles.blurb}>Waiting for host to start game...</div>}

              {!(userArray.length >= 3) && (
                <div className={styles.blurb}>At least 3 players are needed to start the game</div>
              )}

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
