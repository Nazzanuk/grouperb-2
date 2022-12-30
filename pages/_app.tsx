import type { AppProps } from "next/app";
import Head from "next/head";

import { BottomBar } from "Components/BottomBar/BottomBar";
import { TopBar } from "Components/TopBar/TopBar";

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
  return (
    <>
      <Head>
        <title>GROUPERB</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
