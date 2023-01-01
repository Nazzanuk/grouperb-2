import { useEffect } from 'react';

import { Bebas_Neue, Teko } from '@next/font/google';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NoSSR from 'react-no-ssr';

import { routerAtom } from 'Atoms/Router.atom';
import { userAtom } from 'Atoms/User.atom';
import { wsAtom } from 'Atoms/Ws.atom';
import { BottomBar } from 'Components/BottomBar/BottomBar';
import { TopBar } from 'Components/TopBar/TopBar';


import 'Global/normalize.css';
import 'Global/app.css';
import '../public/fontawesome/css/all.min.css';


// const inter = Inter({ subsets: ["latin"] });
const bebasNeue = Bebas_Neue({
  weight: '400',
  variable: '--bebasNeue',
  subsets: ['latin'],
});

const teko = Teko({
  weight: ['300', '400'],
  variable: '--teko',
  subsets: ['latin'],
});

export default function App({ Component, pageProps }: AppProps) {
  const [ws, send] = useAtom(wsAtom);
  const user = useAtomValue(userAtom);
  const setRouter = useSetAtom(routerAtom);
  const router = useRouter();

  useEffect(() => {
    send({ action: 'connect' });
    send({ action: 'updateUser', user });
  }, []);

  useEffect(() => {
    console.log('router changed');
    setRouter(router);
  }, [router]);

  return (
    <>
      <Head>
        <title>GROUPERB</title>
        <meta name="description" content="" />

        <meta name="apple-mobile-web-app-capable" content="yes" />

        <meta
          name="viewport"
          content="minimal-ui, width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />

        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      {/* <style jsx global>{`
        html {
          font-family: ${bebasNeue.style.fontFamily};
        }
      `}</style> */}
      <NoSSR>
        <main className={`app ${bebasNeue.variable} ${teko.variable}`}>
          <TopBar />
          <Component {...pageProps} />
          <BottomBar />
        </main>
      </NoSSR>
    </>
  );
}
