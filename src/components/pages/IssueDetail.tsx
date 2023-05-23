import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import styles from "../../styles/components/pages/IssueDetail.module.scss";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { Tabs } from "../Tabs";
import { Tiptap } from "../Tiptap";
import { items } from "./RepositoryDetail";

export const IssueDetail = React.memo(() => {
  const issueData = {
    id: "1",
    title: "記事が投稿されたら通知がいくようにする",
    createdAt: "July 11",
    createdUser: "motoki",
    type: "To do",
    assignUser: "satoshi",
    icon: "/example.png",
  };

  const teamMember = [
    {
      name: "スダリオ",
      icon: "/example.png",
    },
    {
      name: "hit",
      icon: "/example.png",
    },
    {
      name: "猗窩座",
      icon: "/example.png",
    },
    {
      name: "海",
      icon: "/example.png",
    },
  ];

  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("Issue");
  const [assignUser, setAssignUser] = useState(issueData.assignUser);
  const [toggleSelectUser, setToggleSelectUser] = useState(false);

  const handleCurrentTab = useCallback(
    (name: string) => {
      setCurrentTab(name);
      router.push(`/motoki/fithub/${name === "Issue" ? "issue/1" : ""}`);
    },
    [router]
  );

  const handleAssignUser = (name: string) => {
    setAssignUser(name);
    setToggleSelectUser(false);
  };

  return (
    <>
      <Header />
      <div className={styles.backgroundColor}>
        <div className={styles.teamDetailContainer}>
          <span className={styles.teamNameHeader}>motoki</span>
          <span className={styles.sectionLine}>/</span>
          <span className={styles.teamNameHeader}>FitHub</span>
        </div>
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
      </div>
      <div className={styles.layoutContainer}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>
            {issueData.title}
            <span className={styles.issueNumber}>#{issueData.id}</span>
          </h1>
          <div className={styles.actionButtonContainer}>
            <button className={styles.editButton}>Edit</button>
            <Link
              href={`/motoki/fithub/issue/new`}
              className={styles.newIssueButton}
            >
              New issue
            </Link>
          </div>
        </div>
        <div className={styles.issueDetailContainer}>
          <div
            className={`${styles.issueTypeContainer} ${
              issueData.type === "Done" ? styles.purple : styles.green
            }`}
          >
            <Image
              src={
                issueData.type === "Done"
                  ? "/icons/circle-check-white.svg"
                  : "/icons/circle-dot-white.svg"
              }
              width={16}
              height={16}
              alt="issue-type-icon"
            />
            <span className={styles.issueType}>{issueData.type}</span>
          </div>
          <Link href={"/"} className={styles.createdUser}>
            {issueData.createdUser}
          </Link>
          <span className={styles.createdAt}>
            opened this issue on {issueData.createdAt}
          </span>
        </div>
        <div className={styles.tiptapContainer}>
          {issueData.assignUser === "" ? (
            <div className={styles.assignUser}>no assigned</div>
          ) : (
            <div className={styles.assignUser}>
              <span className={styles.assignUserName}>{assignUser}</span>
              is assigned
            </div>
          )}

          <Tiptap />
        </div>
        <div className={styles.selectNameContainer}>
          <div
            className={styles.selectName}
            onClick={() => setToggleSelectUser(!toggleSelectUser)}
          >
            <Image
              src={issueData.icon}
              width={16}
              height={16}
              alt="user-icon"
              className={styles.memberIcon}
            />
            {assignUser === "" ? "Select user" : assignUser}
          </div>
          <div className={styles.assignButton}>Assign user</div>
        </div>
        {toggleSelectUser && (
          <div className={styles.memberNameWrapper}>
            {teamMember.map((member, index) => (
              <div
                className={styles.memberName}
                onClick={() => handleAssignUser(member.name)}
                key={index}
              >
                <Image
                  src={member.icon}
                  width={16}
                  height={16}
                  alt="member-icon"
                  className={styles.memberIcon}
                />
                {member.name}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
});
