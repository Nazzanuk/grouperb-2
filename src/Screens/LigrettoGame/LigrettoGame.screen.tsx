import { useEffect, useRef, useState } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';
import capitalize from 'lodash/capitalize';
import toArray from 'lodash/toArray';
import Link from 'next/link';

import { DynamicBackground } from 'Components/DynamicBackground/DynamicBackground';
import { InfoOverlay } from 'Components/InfoOverlay/InfoOverlay';
import { LoadingGame } from 'Components/LoadingGame/LoadingGame';
import { PlayerList } from 'Components/PlayerList/PlayerList';
import { ShowScore } from 'Components/ShowScore/ShowScore';

import styles from './LigrettoGame.screen.module.css';
import { ligrettoGameAtom } from 'Atoms/LigrettoGame.atom';
import { useLigrettoActions } from 'Screens/LigrettoGame/useLigrettoActions';
import { ligrettoGameHelpersAtom } from 'Atoms/LigrettoGameHelpers.atom';
import { userAtom } from 'Atoms/User.atom';
import random from 'lodash/random';
import { WinnerBroadcast } from 'Components/WinnerBroadcast/WinnerBroadcast';

export function LigrettoGameScreen() {
  const game = useAtomValue(ligrettoGameAtom);
  const user = useAtomValue(userAtom);
  const { status, userArray, isHost, users } = useAtomValue(ligrettoGameHelpersAtom);
  // const { myAnswer, currentRound, user, usersWithoutMe } = useAtomValue(emojiTaleGameHelpersAtom);
  const { leaveGame, startGame, playCard, resetGame, drawPileCard } = useLigrettoActions();

  console.log('LigrettoGame', { game });

  if (!game) return <LoadingGame />;

  return (
    <>
      <div className="darkScreen">
        <div className="darkScreenOverlay" />
        <DynamicBackground floaterCount={20} />

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
              <WinnerBroadcast
                text={`Lets go!`}
                // user={game.users[currentRound?.guesser]}
                subText={`Match colors and numbers fast!`}
                duration={'3s'}
                bits={5}
              />
            </>
          )}

          {status === 'finished' && (
            <>
              <WinnerBroadcast
                user={users[game.winner!]}
                text={`${users[game.winner!].username} wins!`}
                // subText={`with ${currentRound.userPoints[currentRound?.winnerId]} points`}
                duration={'5s'}
                bits={50}
              />
            </>
          )}

          {(status === 'playing' || status === 'finished') && (
            <>
              <div className={styles.groupCards}>
                {game.getTablePiles().map((pile, index) => (
                  <div
                    key={pile.topCard?.id}
                    className={styles.myCard}
                    style={{ '--color': pile.color }}
                    // onClick={() => playCard(card)}
                  >
                    {pile.topCard?.value}
                  </div>
                ))}
              </div>

              {status === 'playing' && <div className="buttons">
                <div className="button" data-variant="light" onClick={() => drawPileCard()}>
                  Draw Card
                </div>
              </div>}

              {/* <div className="label">Game code</div> */}
              {/* <div className="textOutput">5 cards left</div> */}
              <div className={styles.myCards}>
                {game.getUserFaceUpCards(user.id)?.map((card, index) => (
                  <div
                    className={styles.myCard}
                    key={card.id}
                    style={{ '--color': card.color }}
                    onClick={() => playCard(card)}
                  >
                    {card.value}

                    {index === 3 && (
                      <>
                        {[...Array(game.getRemainingCardsToWin(user.id) ?? 0)].map((x, i) =>
                          i <= 3 ? <div className={styles.phantomCard} style={{ '--i': i }} /> : <></>,
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {status === 'finished' && (
            <div className="buttons">
              <div className="button" data-variant="orange" onClick={() => resetGame()}>
                Reset game
              </div>
            </div>
          )}

          {status === 'lobby' && (
            <div className="buttons">
              {!isHost && <div className={styles.blurb}>Waiting for host to start game...</div>}

              {isHost && (
                <div className="button" data-variant="orange" onClick={startGame}>
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

type IndexTuple<T extends number[]> = {
  [K in keyof T]: number;
};

function loopThrough<T extends number[]>(
  maxValues: T,
  callback: (indices: IndexTuple<T>) => JSX.Element,
): JSX.Element[] {
  const results: JSX.Element[] = [];
  const loop = (indices: number[]): void => {
    if (indices.length === maxValues.length) {
      results.push(callback(indices as IndexTuple<T>));
    } else {
      for (let i = 0; i < maxValues[indices.length]; i++) {
        loop([...indices, i]);
      }
    }
  };
  loop([]);
  return results;
}
