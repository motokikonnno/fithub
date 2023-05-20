import { User } from "@/mock/mockUser";
import React, { FC, useCallback, useEffect, useState } from "react";
import styles from "../../styles/components/pages/MyProfile.module.scss";
import { Header } from "../Header";
import { Tabs } from "../Tabs";
import Image from "next/image";
import { mockTeams } from "@/mock/mockTeams";
import Link from "next/link";
import ReactCalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Footer } from "../Footer";
import { useRouter } from "next/router";
import { RepositoryCard } from "../card/RepositoryCard";
import { RepositoryList } from "../list/RepositoryList";

export type itemType = {
  id: string;
  name: string;
};

export type repositoriesType = {
  name: string;
  type: string;
  updatedAt: string;
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

  const repositories: repositoriesType[] = [
    {
      name: "fithub",
      type: "public",
      updatedAt: "2 days ago",
    },
    {
      name: "git",
      type: "private",
      updatedAt: "3 days ago",
    },
    {
      name: "google",
      type: "public",
      updatedAt: "3 days ago",
    },
    {
      name: "google",
      type: "public",
      updatedAt: "4 days ago",
    },
    {
      name: "google",
      type: "public",
      updatedAt: "5 days ago",
    },
    {
      name: "google",
      type: "public",
      updatedAt: "1 weeks ago",
    },
  ];

  const router = useRouter();
  const query = router.query.tab;
  const [currentTab, setCurrentTab] = useState("Overview");
  const [isToggle, setIsToggle] = useState(false);

  useEffect(() => {
    if (query === "Repositories") {
      setCurrentTab("Repositories");
    } else {
      setCurrentTab("Overview");
    }
  }, [query]);

  const handleCurrentTab = useCallback(
    (name: string) => {
      setCurrentTab(name);
      router.push(`/mypage/${name === "Repositories" ? `?tab=${name}` : ""}`);
    },
    [router]
  );

  const handleIsToggle = () => {
    setIsToggle(!isToggle);
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
            {isToggle && (
              <Image
                src={"/icons/edit.svg"}
                width={25}
                height={25}
                alt="edit-icon"
                className={styles.editIcon}
              />
            )}
          </div>
          {!isToggle && (
            <>
              <h1 className={styles.userName}>{user.name}</h1>
              <div className={styles.userBio}>{user.bio}</div>
              <button className={styles.editButton} onClick={handleIsToggle}>
                Edit profile
              </button>
            </>
          )}
          {isToggle && (
            <>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Name</label>
                <input className={styles.inputForm} />
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Bio</label>
                <textarea className={styles.inputForm} />
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Social accounts</label>
                <div className={styles.snsLinkContainer}>
                  <Image
                    src={"/icons/sns-link.svg"}
                    width={16}
                    height={16}
                    alt="sns-link-icon"
                  />
                  <input className={styles.snsLinkInputForm} />
                </div>
                <div className={styles.snsLinkContainer}>
                  <Image
                    src={"/icons/sns-link.svg"}
                    width={16}
                    height={16}
                    alt="sns-link-icon"
                  />
                  <input className={styles.snsLinkInputForm} />
                </div>
                <div className={styles.snsLinkContainer}>
                  <Image
                    src={"/icons/sns-link.svg"}
                    width={16}
                    height={16}
                    alt="sns-link-icon"
                  />
                  <input className={styles.snsLinkInputForm} />
                </div>
                <div className={styles.snsLinkContainer}>
                  <Image
                    src={"/icons/sns-link.svg"}
                    width={16}
                    height={16}
                    alt="sns-link-icon"
                  />
                  <input className={styles.snsLinkInputForm} />
                </div>
              </div>
              <div className={styles.updateButtonContainer}>
                <button className={styles.updateButton}>Save</button>
                <button
                  className={styles.cancelButton}
                  onClick={handleIsToggle}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
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
        {currentTab === "Overview" ? (
          <Overview repositories={repositories} />
        ) : (
          <div className={styles.repositoryComponentWrapper}>
            <RepositoryList repositories={repositories} />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
});

export type ProfileProps = {
  repositories: repositoriesType[];
};

const Overview: FC<ProfileProps> = ({ repositories }) => {
  return (
    <div className={styles.rightContainer}>
      <h2 className={styles.title}>Recent repositories</h2>
      <div className={styles.repositoriesContainer}>
        {repositories.map((repository, index) => (
          <RepositoryCard index={index} repository={repository} key={index} />
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
  );
};
