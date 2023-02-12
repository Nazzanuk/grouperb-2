/* eslint-disable @next/next/no-img-element */
import { FC, useEffect, useRef, useState } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';
import startCase from 'lodash/startCase';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { charlatanGameAtom } from 'Atoms/CharlatanGame.atom';
import { charlatanGameHelpersAtom } from 'Atoms/CharlatanGameHelpers.atom';

import { userAtom } from 'Atoms/User.atom';

import { showUserPopupAtom, userPopupAtom } from 'Atoms/UserPopup.atom';
import { wsAtom } from 'Atoms/Ws.atom';
import { BombBroadcast } from 'Components/BombBroadcast/BombBroadcast';
import { InfoOverlay } from 'Components/InfoOverlay/InfoOverlay';

import { LoadingGame } from 'Components/LoadingGame/LoadingGame';
import { UserPopup } from 'Components/UserPopup/UserPopup';
import { WinnerBroadcast } from 'Components/WinnerBroadcast/WinnerBroadcast';
import { CharlatanGame } from 'Entities/CharlatanGame.entity';
import { User } from 'Entities/User.entity';
import { UserId } from 'Entities/UserId.entity';
import { useAnsweringTime } from 'Hooks/Charlatan/useAnsweringTimer';
import { useDiscussTime } from 'Hooks/Charlatan/useDiscussTime';
import { useThinkingTime } from 'Hooks/Charlatan/useThinkingTimer';
import { useLoadGame } from 'Hooks/useLoadGame';
import { useUpdateGame } from 'Hooks/useUpdateGame';

import styles from './CharlatanGame.screen.module.css';
import { DynamicBackground } from 'Components/DynamicBackground/DynamicBackground';

export const CharlatanGameScreen: FC = () => {
  const { query } = useRouter();

  const game = useAtomValue(charlatanGameAtom);
  const send = useSetAtom(wsAtom);
  const user = useAtomValue(userAtom);
  const { selectedUser } = useAtomValue(userPopupAtom);
  const { status, currentRound, currentRoundIndex, isHost, userArray } = useAtomValue(charlatanGameHelpersAtom);
  const { usersWithoutMe, isObserver, usersThatHaveNotVoted } = useAtomValue(charlatanGameHelpersAtom);

  useLoadGame(query.charlatanGameId as string | undefined);
  useUpdateGame(query.charlatanGameId as string | undefined);
  const { thinkingTimer } = useThinkingTime();
  const { answeringTimer, answeringTotalTimer, answeringUser } = useAnsweringTime();
  const { discussTimer } = useDiscussTime();

  console.log({ game, status });

  const leaveGame = () => send({ action: 'leaveGame', gameId: game!.id, userId: user.id });
  const startGame = () => send({ action: 'createCharlatanRound', gameId: game!.id, userId: user.id });

  useEffect(() => {
    console.log({ selectedUser });
    if (!selectedUser) return;

    send({ action: 'voteCharlatan', gameId: game!.id, userId: user.id, vote: selectedUser.id });
  }, [selectedUser]);

  // const restartGame = () => send({ action: 'restartCharlatanGame', gameId: game!.id, userId: user.id });
  // const startRound = () => send({ action: 'startCharlatanRound', gameId: game!.id, userId: user.id });
  // const timeUp = () => send({ action: 'charlatanTimeUp', gameId: game!.id, userId: user.id });

  if (!game) return <LoadingGame />;

  return (
    <>
      <InfoOverlay />
      <div className="darkScreen" >
        <div className="darkScreenOverlay" />
        <DynamicBackground floaterCount={20} />
        <div className="darkScreenContent">
          <UserPopup />

          {status === 'lobby' && (
            <>
              <div className="label">Game code</div>
              <div className="textOutput">{game.id}</div>

              <div className="label">Players</div>
              <PlayerList users={userArray} game={game} />
            </>
          )}

          {status === 'lobby' && (
            <div className={styles.buttons}>
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

          {status === 'results' && (
            <>
              <WinnerBroadcast
                text={`${game.users[currentRound.bluffer].username}`}
                user={game.users[currentRound.bluffer]}
                subText={'The Charlatan is'}
                duration={'8s'}
                bits={100}
              />

              <div className={styles.actionArea}>
                <h3>{game.users[currentRound.bluffer].username} is the Charlatan</h3>
                <p>You were right!</p>
              </div>

              <div className="label">Topic</div>
              <div className="textOutput">{startCase(currentRound.topic)}</div>

              <div className="label">Answers</div>
              <div className={styles.answers}>
                {currentRound.answers.map((answer) => (
                  <div
                    className={styles.answer}
                    key={answer}
                    data-is-answer={currentRound.answer === answer}
                  >
                    {answer}
                  </div>
                ))}
              </div>
              

            <div className={styles.buttons}>
              {!isHost && <div className={styles.blurb}>Waiting for host to start the next round...</div>}

              {isHost && (
                <div className="button" data-variant="orange" onClick={startGame}>
                  Next round
                </div>
              )}
            </div>
            </>
          )}

          {status === 'voting' && (
            <>
              <WinnerBroadcast text={`Time to vote`} subText={'Who is the Charlatan?'} duration={'3s'} bits={25} />

              <div className={styles.actionArea}>
                <h3>Voting time...</h3>
              </div>

              <div className="label">Still pondering</div>
              <PlayerList users={usersThatHaveNotVoted} game={game} />
            </>
          )}

          {status === 'discuss' && (
            <>
              <WinnerBroadcast text={`Time to discuss`} subText={'Who is the Charlatan?'} duration={'3s'} bits={25} />

              <div className={styles.actionArea}>
                <h3>Discussion time: {discussTimer}s</h3>
                <p>Interrogate each other and find the Charlatan</p>
              </div>
            </>
          )}

          {status === 'thinking' && (
            <>
              <WinnerBroadcast
                text={`Round ${currentRoundIndex}`}
                subText={'Think of a related word'}
                duration={'1.5s'}
                bits={5}
              />

              <div className={styles.actionArea}>
                <h3>Thinking time: {thinkingTimer}s</h3>
                <p>Think of a word that describes the answer but doesn't give it away</p>
              </div>
            </>
          )}

          {status === 'answering' && (
            <>
              <WinnerBroadcast text={`Time to talk`} duration={'1.5s'} bits={15} />

              <div className={styles.actionArea}>
                <h3>{answeringUser?.username}, say your related word!</h3>
                <p>{answeringTimer}s</p>
              </div>
            </>
          )}

          {(status === 'thinking' || status === 'answering' || status === 'discuss') && (
            <>
              <div className="label">Topic</div>
              <div className="textOutput">{startCase(currentRound.topic)}</div>

              <div className="label">Possible answers</div>
              <div className={styles.answers}>
                {currentRound.answers.map((answer) => (
                  <div
                    className={styles.answer}
                    key={answer}
                    data-is-answer={currentRound.answer === answer && currentRound.bluffer !== user.id}
                  >
                    {answer}
                  </div>
                ))}
              </div>

              {currentRound.bluffer === user.id && (
                <>
                  <div className="textOutput">You are the Charlatan</div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export const PlayerList: FC<{ users: User[]; game: CharlatanGame }> = ({ users, game }) => {
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
