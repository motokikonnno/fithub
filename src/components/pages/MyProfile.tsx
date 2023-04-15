import { User } from "@/mock/mockUser";
import React, { useState } from "react";
import styles from "../../styles/components/pages/MyProfile.module.scss";
import { Header } from "../Header";
import { Tabs } from "../Tabs";
import Image from "next/image";
import { mockTeams } from "@/mock/mockTeams";
import Link from "next/link";
import ReactCalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

export type itemType = {
  name: string;
  id: string;
};

export const MyProfile = React.memo(() => {
  const items: itemType[] = [
    {
      id: "1",
      name: "Overview",
    },
    {
      id: "2",
      name: "Repositories",
    },
  ];

  const user: User = {
    name: "motoki",
    bio: "これはユーザーの説明欄です",
    icon: "/logo.png",
    socialLink: [
      "https://youtube.com",
      "https://twitter.com",
      "https://google.com",
      "https://instagram.com",
    ],
  };

  const repositories = [
    {
      name: "fithub",
      type: "public",
    },
    {
      name: "git",
      type: "private",
    },
    {
      name: "google",
      type: "public",
    },
    {
      name: "google",
      type: "public",
    },
    {
      name: "google",
      type: "public",
    },
    {
      name: "google",
      type: "public",
    },
  ];

  const [currentTab, setCurrentTab] = useState("1");

  const handleCurrentTab = (id: string) => {
    setCurrentTab(id);
  };

  return (
    <>
      <Header />
      <div className={styles.tabsContainer}>
        {items.map((item, index) => (
          <Tabs
            item={item}
            handleCurrentTab={handleCurrentTab}
            currentTab={currentTab}
            key={index}
          />
        ))}
      </div>
      <div className={styles.layoutContainer}>
        <div className={styles.leftContainer}>
          <div className={styles.userIcon}>
            <Image
              src={user.icon}
              width={296}
              height={296}
              alt="user-icon"
              className={styles.icon}
            />
          </div>
          <h1 className={styles.userName}>{user.name}</h1>
          <div className={styles.userBio}>{user.bio}</div>
          <button className={styles.editButton}>Edit profile</button>
          <h2 className={styles.profileSection}>Teams</h2>
          <div className={styles.teamIconContainer}>
            {mockTeams.map(({ image }, index) => (
              <Link href={"/"} key={index}>
                <Image
                  src={image}
                  width={32}
                  height={32}
                  className={styles.teamIcon}
                  alt="team-icon"
                />
              </Link>
            ))}
          </div>
        </div>
        <div className={styles.rightContainer}>
          <h2 className={styles.title}>Recent repositories</h2>
          <div className={styles.repositoriesContainer}>
            {repositories.map((repository, index) => (
              <Link className={styles.repositoryName} href={"/"} key={index}>
                <div className={styles.repositoryWrapper}>
                  {repository.name}
                  <span className={styles.repositoryType}>
                    {repository.type}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <h2 className={styles.title}>317 contributions</h2>
          <div className={styles.calendarContainer}>
            <ReactCalendarHeatmap
              startDate={new Date("2023-01-01")}
              endDate={new Date("2023-12-31")}
              values={[
                { date: "2023-05-22", count: 12 },
                { date: "2023-07-24", count: 12 },
                { date: "2023-11-10", count: 12 },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
});
