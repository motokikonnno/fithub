import { SideBar } from "./SideBar";
import styles from "../../styles/components/layouts/AppLayout.module.scss";
import { Header } from "./Header";
import React from "react";

type AppLayoutProps = {
  children: React.ReactNode;
};

export const AppLayout: React.FC<AppLayoutProps> = React.memo(
  ({ children }) => {
    return (
      <>
        <Header />
        <div className={styles.mainContents}>
          <SideBar />
          <div className={styles.layoutRight}>{children}</div>
        </div>
      </>
    );
  }
);
