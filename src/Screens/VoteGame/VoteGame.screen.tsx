/* eslint-disable @next/next/no-img-element */
import { FC, useEffect, useRef, useState } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';
import random from 'lodash/random';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { userAtom } from 'Atoms/User.atom';
import { showUserPopupAtom, userPopupAtom } from 'Atoms/UserPopup.atom';
import { voteGameAtom } from 'Atoms/VoteGame.atom';
import { voteGameHelpersAtom } from 'Atoms/VoteGameHelpers.atom';
import { wsAtom } from 'Atoms/Ws.atom';
import { DynamicBackground } from 'Components/DynamicBackground/DynamicBackground';
import { InfoOverlay } from 'Components/InfoOverlay/InfoOverlay';
import { LoadingGame } from 'Components/LoadingGame/LoadingGame';
import { UserPopup } from 'Components/UserPopup/UserPopup';
import { WinnerBroadcast } from 'Components/WinnerBroadcast/WinnerBroadcast';
import { User } from 'Entities/User.entity';
import { UserId } from 'Entities/UserId.entity';
import { VoteGame } from 'Entities/VoteGame.entity';

import { useLoadGame } from 'Hooks/useLoadGame';
import { useUpdateGame } from 'Hooks/useUpdateGame';

import styles from './VoteGame.screen.module.css';

export const VoteGameScreen: FC = () => {
  const { query } = useRouter();
  const i = useRef<NodeJS.Timer>(null);
  const [trophyIndex, setTrophyIndex] = useState(1);
  const [isNextRoundEnabled, setIsNextRoundEnabled] = useState(false);
  const [isVoteButtonsEnabled, setIsVoteButtonsEnabled] = useState(false);
  const game = useAtomValue(voteGameAtom);
  const send = useSetAtom(wsAtom);
  const user = useAtomValue(userAtom);
  const { selectedUser } = useAtomValue(userPopupAtom);
  const showUserPopup = useSetAtom(showUserPopupAtom);

  const {
    status,
    currentQuestion,
    currentRound,
    currentRoundIndex,
    isHost,
    userArray,
    usersThatHaveVoted,
    usersThatHaveNotVoted,
    usersWithoutMe,
    IHaveVoted,
    isObserver,
    have3Users,
    winnersArray,
    isWinner,
    allAreWinners,
    winnersString,
    usersSortedByScore,
    topScorer,
    mostQuestionsAssignedUser,
    leastQuestionsAssignedUser,
    mostSelfVotesUser,
    stalkers,
    didGuessCorrectly,
    hasManyWinners,
  } = useAtomValue(voteGameHelpersAtom);

  useLoadGame(query.voteGameId as string | undefined);
  useUpdateGame(query.voteGameId as string | undefined);

  console.log({ game, status });

  const leaveGame = () => send({ action: 'leaveGame', gameId: game!.id, userId: user.id });
  const startGame = () => send({ action: 'startVoteGame', gameId: game!.id, userId: user.id });
  const startRound = () => send({ action: 'startVoteRound', gameId: game!.id, userId: user.id });
  // const castVote = (voteUserId: UserId) =>
  //   send({ action: 'castVote', gameId: game!.id, userId: user.id, vote: voteUserId });

  useEffect(() => {
    if (game?.status !== 'results') return setIsNextRoundEnabled(false);
    setTimeout(() => setIsNextRoundEnabled(true), 4000);
  }, [game?.status === 'results']);

  useEffect(() => {
    if (game?.status !== 'voting') return setIsVoteButtonsEnabled(false);
    setTimeout(() => setIsVoteButtonsEnabled(true), 2000);
  }, [game?.status === 'voting']);

  useEffect(() => {
    setTrophyIndex(random(1, 3));
  }, [game?.rounds.length]);

  useEffect(() => {
    if (game?.status !== 'voting') return;
    if (!!currentRound.votes[user.id]) return;

    showUserPopup({ title: `Who ${currentQuestion}?` });
  }, [game?.status]);

  useEffect(() => {
    console.log({ selectedUser });
    if (!selectedUser) return;

    send({ action: 'castVote', gameId: game!.id, userId: user.id, vote: selectedUser.id });
  }, [selectedUser]);

  if (!game) return <LoadingGame />;

  return (
    <>
      <div className="darkScreen">
        <div className="darkScreenOverlay" />
        <DynamicBackground floaterCount={40} isDark />
        <div className="darkScreenContent">
          <UserPopup />

          {status === 'lobby' && (
            <>
              <InfoOverlay />
              <div className="label">Game code</div>
              <div className="textOutput">{game.id}</div>

              <div className="label">Players</div>
              <PlayerList users={userArray} game={game} />
            </>
          )}

          {status === 'voting' && (
            <>
              <WinnerBroadcast text={`Round ${currentRoundIndex}`} duration={'1.5s'} bits={5} />
              <div className="label">
                Round {currentRoundIndex} of {game.maxRoundsIndex}
              </div>

              <div className="shout">Who {currentQuestion}?</div>

              {/* <div className="label">Voted</div>
            <PlayerList users={usersThatHaveVoted} game={game} /> */}

              <div className="label">Still pondering</div>
              <PlayerList users={usersThatHaveNotVoted} game={game} />
            </>
          )}

          {status === 'finished' && (
            <>
              <WinnerBroadcast
                user={topScorer}
                text={`${topScorer.username} wins!`}
                subText={`Game Over`}
                duration={'10s'}
                bits={50}
              />
              {/* <div className="label">Round {currentRoundIndex} of {game.maxRoundsIndex}</div> */}

              <div className="shout">Game over</div>

              <div className="label">leaderboard</div>

              <div className={styles.list}>
                {usersSortedByScore.map((user, i) => (
                  <div className={styles.listItem} key={user.id} data-highlight>
                    <img className={styles.playerIcon} src={`/img/avatars/${user.avatar}`} alt="avatar" />
                    {i + 1}. {user.username}
                    <div className={styles.score}> {user.score}</div>
                  </div>
                ))}
              </div>

              <div className="label">Awards</div>
              <div className={styles.list}>
                <div className={styles.listItem} data-highlight>
                  <img
                    className={styles.playerIcon}
                    src={`/img/avatars/${mostQuestionsAssignedUser?.avatar}`}
                    alt="avatar"
                  />
                  Popular - {mostQuestionsAssignedUser?.username} had the most questions assigned to them
                </div>
                <div className={styles.listItem} data-highlight>
                  <img
                    className={styles.playerIcon}
                    src={`/img/avatars/${leastQuestionsAssignedUser?.avatar}`}
                    alt="avatar"
                  />
                  Nobody - {leastQuestionsAssignedUser?.username} had the fewest questions assigned to them
                </div>
                <div className={styles.listItem} data-highlight>
                  <img className={styles.playerIcon} src={`/img/avatars/${mostSelfVotesUser?.avatar}`} alt="avatar" />
                  Narcissist - {mostSelfVotesUser?.username} voted for themself the most
                </div>
                <div className={styles.listItem} data-highlight>
                  <img className={styles.playerIcon} src={`/img/avatars/${stalkers?.[0]?.avatar}`} alt="avatar" />
                  Stalker - {stalkers?.[0]?.username} voted for {stalkers?.[1]?.username} a record amount of times
                </div>
              </div>

              {/* <div className={styles.singlePlayer}>
                <div className={styles.playerName}>Game over</div>
              </div> */}
            </>
          )}

          {status === 'results' && (
            <>
              <div className={styles.actionArea}>
                {didGuessCorrectly && (
                  <>
                    <h3>+1</h3>
                    <p>You were right!</p>
                  </>
                )}
                {!didGuessCorrectly && (
                  <>
                    <h3>+0</h3>
                    <p>You were wrong!</p>
                  </>
                )}
              </div>

              <div className="label">Round {currentRoundIndex}</div>
              <div className="shout">Who {currentQuestion}?</div>

              <>
                <WinnerBroadcast
                  img={
                    hasManyWinners
                      ? `/img/trophies/trophy-${trophyIndex}.jpeg`
                      : `/img/avatars/${winnersArray[0].avatar}`
                  }
                  subText={`Who ${currentQuestion}?...`}
                  text={allAreWinners ? 'All of You!' : winnersString}
                />
                <div className={styles.singlePlayer} data-animate key="winner">
                  <img className={styles.playerImage} src={`/img/avatars/${winnersArray[0].avatar}`} alt="avatar" />

                  <div className={styles.playerName}>{winnersString}</div>
                </div>
              </>

              {/* {isWinner && (
                <>
                  <WinnerBroadcast
                    img={`/img/trophies/trophy-${trophyIndex}.jpeg`}
                    text={allAreWinners ? 'All of You!' : winnersString}
                    subText={`Who ${currentQuestion}?...`}
                  />
                  <div className={styles.singlePlayer} data-animate key="winner">
                    <img className={styles.playerImage} src={`/img/trophies/trophy-${trophyIndex}.jpeg`} alt="trophy" />

                    <div className={styles.playerName}>{allAreWinners ? 'All of You!' : winnersString}</div>
                  </div>
                </>
              )} */}

              <div className={styles.buttons}>
                <>
                  {!isObserver && (
                    <div
                      className="button"
                      data-variant="light"
                      onClick={startRound}
                      data-disabled={!isNextRoundEnabled}
                    >
                      Next round
                    </div>
                  )}
                </>
              </div>
            </>
          )}

          {status === 'lobby' && (
            <div className={styles.buttons}>
              <>
                {!have3Users && <div className={styles.blurb}>At least 3 players are needed to start the game</div>}

                {!isHost && have3Users && <div className={styles.blurb}>Waiting for host to start game...</div>}

                {isHost && userArray.length > 2 && (
                  <div className="button" data-variant="orange" onClick={startGame}>
                    Start game
                  </div>
                )}

                <Link href="/home" className="button" onClick={leaveGame} data-variant="light">
                  Leave game
                </Link>
              </>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const PlayerList: FC<{ users: User[]; game: VoteGame }> = ({ users, game }) => {
  return (
    <div className={styles.playerList}>
      {users.map((user) => (
        <div className={styles.player} key={user.id}>
          <img className={styles.playerImage} src={`/img/avatars/${user.avatar}`} alt="avatar" />
          <div className={styles.playerName}>
            {game.hostId === user.id && <i className="fas fa-star" />} {user.username}
          </div>
        </div>
      ))}
    </div>
  );
};
