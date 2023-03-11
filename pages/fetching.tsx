import Head from 'next/head';

import { DynamicBackground } from 'Components/DynamicBackground/DynamicBackground';
import { ChooseGameScreen } from 'Screens/ChooseGame/ChooseGame.screen';

import { HomeScreen } from 'Screens/Home/Home.screen';

const FetchingGame = () => (
  <div className="darkScreen">
    <div className="darkScreenOverlay" />

    <DynamicBackground floaterCount={20} />
    <div className="darkScreenContent">
      <div className="label">Fetching game details...</div>
    </div>
  </div>
);

export default FetchingGame;
