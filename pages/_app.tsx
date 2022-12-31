import type { AppProps } from "next/app";
import Head from "next/head";
import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";

import { BottomBar } from "Components/BottomBar/BottomBar";
import { TopBar } from "Components/TopBar/TopBar";
import { wsAtom } from "Atoms/Ws.atom";

import { Bebas_Neue, Teko } from "@next/font/google";

import "Global/normalize.css";
import "Global/app.css";
import "../public/fontawesome/css/all.min.css";

// const inter = Inter({ subsets: ["latin"] });
const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--bebasNeue",
  subsets: ["latin"],
});

const teko = Teko({
  weight: ["300", "400"],
  variable: "--teko",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  const [ws, send] = useAtom(wsAtom);

  useEffect(() => {
    send({ action: 'connect'});
  }, []);
  
  return (
    <>
      <Head>
        <title>GROUPERB</title>
        <meta name="description" content="" />

        <meta name="apple-mobile-web-app-capable" content="yes" /> 

        <meta name="viewport" content="minimal-ui, width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>

        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      {/* <style jsx global>{`
        html {
          font-family: ${bebasNeue.style.fontFamily};
        }
      `}</style> */}
      <main className={`app ${bebasNeue.variable} ${teko.variable}`}>
        <TopBar />
        <Component {...pageProps} />
        <BottomBar />
      </main>
    </>
  );
}
