import { FC } from "react";

import styles from "./Sidebar.module.css";

export const Sidebar: FC = () => {
  return (
    <>
      <div className={styles.sidebarOverlay}/>
      <div className={styles.sidebar}>
      </div>
    </>
  );
};