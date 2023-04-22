import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "../../styles/components/pages/TeamList.module.scss";
import { AppLayout } from "../AppLayout";
import { Footer } from "../Footer";

export const TeamList = React.memo(() => {
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

  const user = {
    name: "motoki",
    icon: "/logo.png",
  };

  return (
    <>
      <AppLayout>
        <div className={styles.layoutContainer}>
          <div className={styles.userLinkContainer}>
            <div className={styles.userDetailContainer}>
              <Image
                src={user.icon}
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
