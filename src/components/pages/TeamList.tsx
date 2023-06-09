import { UserBelongsToTeam } from "@/models/User";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import styles from "../../styles/components/pages/TeamList.module.scss";
import { AppLayout } from "../layouts/AppLayout";
import { Footer } from "../layouts/Footer";

export type TeamListProps = {
  user: UserBelongsToTeam;
};

export const TeamList: FC<TeamListProps> = React.memo(({ user }) => {
  return (
    <>
      <AppLayout user={user}>
        <div className={styles.layoutContainer}>
          <div className={styles.userLinkContainer}>
            <div className={styles.userDetailContainer}>
              {user.image && (
                <Image
                  src={user.image}
                  width={48}
                  height={48}
                  alt="user-icon"
                  className={styles.userIcon}
                />
              )}
              <Link href={`/user/${user.id}`} className={styles.userName}>
                {user.name}
              </Link>
            </div>
            <Link href={`/user/${user.id}`}>
              <button className={styles.profileButton}>
                Go to your profile
              </button>
            </Link>
          </div>
          <div className={styles.teamListContainer}>
            <h1 className={styles.pageTitle}>Teams</h1>
            <Link href={"/team/new"} className={styles.newTeamButton}>
              New team
            </Link>
          </div>
          {user.team_members &&
            user.team_members.map((team, index) => (
              <div
                key={index}
                className={`${styles.teamContainer} ${
                  user.team_members &&
                  user.team_members.length - 1 === index &&
                  styles.lastItem
                } ${index === 0 && styles.firstItem}`}
              >
                <div className={styles.teamDetailContainer}>
                  <Image
                    src={team.team.image}
                    width={20}
                    height={20}
                    alt="team-icon"
                    className={styles.teamImage}
                  />
                  <Link
                    href={`team/${team.team.id}`}
                    className={styles.teamName}
                  >
                    {team.team.name}
                  </Link>
                </div>
                <button className={styles.leaveButton}>Leave</button>
              </div>
            ))}
        </div>
        <Footer />
      </AppLayout>
    </>
  );
});
