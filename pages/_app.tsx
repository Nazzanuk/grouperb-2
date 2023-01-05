import { useEffect } from 'react';

import { Bebas_Neue, Teko } from '@next/font/google';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NoSSR from 'react-no-ssr';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { routerAtom } from 'Atoms/Router.atom';
import { userAtom } from 'Atoms/User.atom';
import { initWebSocketAtom, wsAtom } from 'Atoms/Ws.atom';
import { BottomBar } from 'Components/BottomBar/BottomBar';
import { TopBar } from 'Components/TopBar/TopBar';

import 'Global/normalize.css';
import 'Global/app.css';
import '../public/fontawesome/css/all.min.css';

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
  const [, send] = useAtom(wsAtom);
  const [, connect] = useAtom(initWebSocketAtom);
  const user = useAtomValue(userAtom);
  const setRouter = useSetAtom(routerAtom);
  const router = useRouter();

  useEffect(() => {
    send({ action: 'updateUser', user });
    connect(user);
  }, []);

  useEffect(() => {
    console.log('router changed');
    setRouter(router);
  }, [router]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('VISIBLE');
        connect(user);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.onfocus = () => {
      console.log('FOCUS');
      connect(user);
    };

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.onfocus = null;
    };
  }, []);

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

        <link rel="icon" href="favicon.ico" />

        <meta name="theme-color" content="#3a3a42"></meta>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest"></link>
      </Head>

      {/* <style jsx global>{`
        html {
          font-family: ${bebasNeue.style.fontFamily};
        }
      `}</style> */}
      <NoSSR>
        <main className={`app ${bebasNeue.variable} ${teko.variable}`}>
          <ToastContainer
            position="top-left"
            autoClose={2000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            limit={4}
            progressStyle={{ background: 'orange', color: 'orange' }}
            closeButton={false}
          />
          <TopBar />
          <Component {...pageProps} />
          <BottomBar />
        </main>
      </NoSSR>
    </>
  );
}
