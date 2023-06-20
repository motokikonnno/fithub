import { SideBar } from "./SideBar";
import styles from "../../styles/components/layouts/AppLayout.module.scss";
import { Header } from "./Header";
import React from "react";
import { UserBelongsToTeam } from "@/models/User";

type AppLayoutProps = {
  children: React.ReactNode;
  user: UserBelongsToTeam;
};

export const AppLayout: React.FC<AppLayoutProps> = React.memo(
  ({ children, user }) => {
    return (
      <div className={styles.wrapper}>
        <Header />
        <div className={styles.mainContents}>
          <SideBar user={user} />
          <div className={styles.layoutRight}>{children}</div>
        </div>
      </div>
    );
  }
);
