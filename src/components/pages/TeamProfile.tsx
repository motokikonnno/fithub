import { User } from "@/mock/mockUser";
import React, { FC, useCallback, useEffect, useState } from "react";
import styles from "../../styles/components/pages/TeamProfile.module.scss";
import { Header } from "../Header";
import { Tabs } from "../Tabs";
import Image from "next/image";
import { mockTeams } from "@/mock/mockTeams";
import Link from "next/link";
import { Footer } from "../Footer";
import { useRouter } from "next/router";
import { RepositoryCard } from "../RepositoryCard";
import { itemType, ProfileProps, repositoriesType } from "./MyProfile";
import { RepositoryList } from "../RepositoryList";
import { InputSearch } from "../InputSearch";
import { PeopleList } from "../PeopleLIst";

export type currentTabType = "Overview" | "Repositories" | "People";

export const TeamProfile = React.memo(() => {
  const items: itemType[] = [
    {
      id: "1",
      name: "Overview",
    },
    {
      id: "2",
      name: "Repositories",
    },
    {
      id: "3",
      name: "People",
    },
  ];

  const user: User = {
    name: "FitHub",
    bio: "これはチームの説明欄です",
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
    {
      name: "google",
      type: "public",
      updatedAt: "1 weeks ago",
    },
    {
      name: "google",
      type: "public",
      updatedAt: "1 weeks ago",
    },
    {
      name: "google",
      type: "public",
      updatedAt: "1 weeks ago",
    },
    {
      name: "google",
      type: "public",
      updatedAt: "1 weeks ago",
    },
  ];

  const peopleDetail = [
    {
      name: "motoki",
      icon: "/logo.png",
      teamNumber: "1",
    },
    {
      name: "motoki",
      icon: "/logo.png",
      teamNumber: "2",
    },
    {
      name: "motoki",
      icon: "/logo.png",
      teamNumber: "1",
    },
    {
      name: "motoki",
      icon: "/logo.png",
      teamNumber: "2",
    },
    {
      name: "motoki",
      icon: "/logo.png",
      teamNumber: "1",
    },
    {
      name: "motoki",
      icon: "/logo.png",
      teamNumber: "2",
    },
  ];

  const router = useRouter();
  const query = String(router.query.tab);
  const [currentTab, setCurrentTab] = useState("Overview");
  const [isToggle, setIsToggle] = useState(false);
  const teamId = 1;

  useEffect(() => {
    const switchCurrentTab = (query: string) => {
      switch (query) {
        case "Repositories":
          return setCurrentTab("Repositories");
        case "People":
          return setCurrentTab("People");
        default:
          return setCurrentTab("Overview");
      }
    };
    switchCurrentTab(query);
  }, [query]);

  const handleCurrentTab = useCallback(
    (name: string) => {
      setCurrentTab(name);
      router.push(
        `/team/${teamId}/${name === "Overview" ? "" : `?tab=${name}`}`
      );
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
      <div
        className={
          currentTab === "Overview"
            ? styles.layoutContainer
            : styles.tabRepositoryContainer
        }
      >
        {currentTab === "Overview" && (
          <>
            <div className={styles.leftContainer}>
              <div className={styles.teamIcon}>
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
                  <h1 className={styles.teamName}>{user.name}</h1>
                  <div className={styles.teamBio}>{user.bio}</div>
                  <button
                    className={styles.editButton}
                    onClick={handleIsToggle}
                  >
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
              <h2 className={styles.profileSection}>Members</h2>
              <div className={styles.memberIconContainer}>
                {mockTeams.map(({ image }, index) => (
                  <Link href={"/"} key={index}>
                    <Image
                      src={image}
                      width={32}
                      height={32}
                      className={styles.memberIcon}
                      alt="member-icon"
                    />
                  </Link>
                ))}
              </div>
            </div>
            <Overview repositories={repositories} />
          </>
        )}
        {currentTab === "Repositories" && (
          <RepositoryList repositories={repositories} />
        )}
        {currentTab === "People" && (
          <div className={styles.tabPeopleContainer}>
            <div className={styles.inputSearchContainer}>
              <InputSearch
                placeholder={"Find a member..."}
                backgroundColor={"#fff"}
                color={"#656d76"}
                borderColor={"#d0d7de"}
              />
            </div>
            <div className={styles.peopleListWrapper}>
              <div className={styles.peopleNumber}>41 people</div>
              {peopleDetail.map((people, index) => (
                <PeopleList
                  people={people}
                  index={index}
                  peoples={peopleDetail}
                  key={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
});

const Overview: FC<ProfileProps> = ({ repositories }) => {
  return (
    <div className={styles.rightContainer}>
      <h2 className={styles.title}>Recent repositories</h2>
      <div className={styles.repositoriesContainer}>
        {repositories.map((repository, index) => (
          <RepositoryCard index={index} repository={repository} key={index} />
        ))}
      </div>
    </div>
  );
};
