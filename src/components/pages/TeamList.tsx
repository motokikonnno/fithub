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
  console.log(user);
  const teams = [
    {
      name: "FitHub",
      icon: "/logo.png",
    },
    {
      name: "hoge",
      icon: "/logo.png",
    },
    {
      name: "huga",
      icon: "/logo.png",
    },
  ];

  return (
    <>
      <AppLayout>
        <div className={styles.layoutContainer}>
          <div className={styles.userLinkContainer}>
            <div className={styles.userDetailContainer}>
              <Image
                src={user.image}
                width={48}
                height={48}
                alt="user-icon"
                className={styles.userIcon}
              />
              <Link href={"/mypage"} className={styles.userName}>
                {user.name}
              </Link>
            </div>
            <Link href={"/mypage"}>
              <button className={styles.profileButton}>
                Go to your profile
              </button>
            </Link>
          </div>
          <div className={styles.teamListContainer}>
            <h1 className={styles.pageTitle}>Teams</h1>
            <Link href={"/team/new"}>
              <button className={styles.newTeamButton}>New team</button>
            </Link>
          </div>
          {teams.map((team, index) => (
            <div
              key={index}
              className={`${styles.teamContainer} ${
                teams.length - 1 === index && styles.lastItem
              } ${index === 0 && styles.firstItem}`}
            >
              <div className={styles.teamDetailContainer}>
                <Image src={team.icon} width={20} height={20} alt="team-icon" />
                <Link href={`team/${team.name}`} className={styles.teamName}>
                  {team.name}
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
