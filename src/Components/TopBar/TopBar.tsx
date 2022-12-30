import { FC } from "react";

import styles from "./TopBar.module.css";

import { Jost } from '@next/font/google';
// get an object with font styles:
const jost = Jost();
// define them in your component:

export const TopBar: FC = () => {
  return <div className={styles.topBar}>

    <div className={styles.menu}><i className="fal fa-bars"></i></div>
    {/* <div className={styles.title}>Grouperb</div> */}

  </div>;
};
