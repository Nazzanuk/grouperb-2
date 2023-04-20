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

import styles from './CodenamesGame.screen.module.css';
import { codenamesGameAtom } from 'Atoms/CodenamesGame.atom';
import { useCodenamesActions } from 'Screens/CodenamesGame/useCodenamesActions';
import { codenamesGameHelpersAtom } from 'Atoms/CodenamesGameHelpers.atom';
import { userAtom } from 'Atoms/User.atom';
import random from 'lodash/random';
import { WinnerBroadcast } from 'Components/WinnerBroadcast/WinnerBroadcast';
import upperFirst from 'lodash/upperFirst';

export function CodenamesGameScreen() {
  const game = useAtomValue(codenamesGameAtom);
  const user = useAtomValue(userAtom);
  const { status, userArray, isHost, users } = useAtomValue(codenamesGameHelpersAtom);
  // const { myAnswer, currentRound, user, usersWithoutMe } = useAtomValue(emojiTaleGameHelpersAtom);
  const { leaveGame, startGame, revealCard, resetGame, setMaxGuessesForTurn } = useCodenamesActions();

  console.log('CodenamesGame', { game });

  if (!game) return <LoadingGame />;

  return (
    <>
      <div className="darkScreen">
        <div className="darkScreenOverlay" />
        <DynamicBackground floaterCount={10} />

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
              {game.isUserTurn(user.id) && (
                <WinnerBroadcast
                  key={String(game.isUserTurn(user.id))}
                  user={user}
                  subText={`Your Turn!`}
                  text={`${upperFirst(game.getPlayerRole(user.id)!)}`}
                  duration={'2s'}
                  bits={5}
                />
              )}
            </>
          )}

          {status === 'finished' && (
            <>
              {/* <WinnerBroadcast
                user={users[game.winner!]}
                text={`${users[game.winner!].username} wins!`}
                // subText={`with ${currentRound.userPoints[currentRound?.winnerId]} points`}
                duration={'5s'}
                bits={50}
              /> */}
            </>
          )}

          {(status === 'playing' || status === 'finished') && (
            <>
              <WinnerBroadcast
                subText={`You are on team ${game.getPlayerTeam(user.id)}!`}
                user={user}
                text={`${upperFirst(game.getPlayerRole(user.id)!)}`}
                duration={'6s'}
                bits={5}
              />
              <div
                className="actionArea"
                data-background={game.getCurrentPlayer()}
                data-is-flashing={game.isUserTurn(user.id)}
              >
                <h3>
                  {game.isUserTurn(user.id)
                    ? 'Your Turn!'
                    : `${upperFirst(game.currentPlayer)} ${game.getCurrentUserRoleTurn()} to play!`}
                </h3>
                <p>{game.getPlayerInstructions(user.id)}</p>
              </div>
              <div className="label">
                You are a team {game.getPlayerTeam(user.id)} {game.getPlayerRole(user.id)}
              </div>
              <div className={styles.grid}>
                {game.grid.map((card, index) => (
                  <div
                    className={styles.card}
                    key={card.id}
                    data-type={card.type}
                    data-is-revealed={card.revealed}
                    data-is-spymaster={game.getPlayerRole(user.id) === 'spymaster'}
                    onClick={() => revealCard(card.id)}
                  >
                    <div className={styles.cardText}>{card.word}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {status === 'playing' && (
            <>
              {game.isUserSpymaster(user.id) && game.isUsersTurn(user.id) && game.maxGuessesForCurrentTurn === 0 && (
                <>
                  <div className="label">Say the clue out loud and choose the amount of guesses</div>
                  <div className={styles.guesses}>
                    {[1, 2, 3, 4, 5].map((guess) => (
                      <div className={styles.guess} onClick={() => setMaxGuessesForTurn(guess)}>
                        {guess}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {game.isUserOperative(user.id) && game.isUsersTurn(user.id) && game.maxGuessesForCurrentTurn > 1 && (
                <div className="buttons">
                  <div className="button" data-variant="light" onClick={() => game.switchTurn()}>
                    End turn early
                  </div>
                </div>
              )}
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

const Dropdown = ({ options, selectedOption, onOptionSelected }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleOptionClick = (option) => {
    onOptionSelected(option);
    setShowDropdown(false);
  };

  return (
    <div className={styles.dropdownContainer}>
      <button className={styles.dropdownBtn} onClick={() => setShowDropdown(!showDropdown)}>
        {selectedOption}
      </button>
      {showDropdown && (
        <div className={styles.dropdowContent}>
          {options.map((option, index) => (
            <a key={index} onClick={() => handleOptionClick(option)}>
              {option}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
