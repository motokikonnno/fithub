import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import styles from "../../styles/components/pages/CreateIssue.module.scss";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { Tabs } from "../Tabs";
import { items } from "./RepositoryDetail";

export const CreateIssue = React.memo(() => {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("Issue");

  const handleCurrentTab = useCallback(
    (name: string) => {
      setCurrentTab(name);
      router.push(`/motoki/fithub/${name === "Issue" ? "issue/new" : ""}`);
    },
    [router]
  );

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
      <div className={styles.createIssueContainer}>
        <div className={styles.inputWrapper}>
          <input
            placeholder="Title"
            type={"text"}
            className={styles.titleInput}
          />
        </div>
        <div className={styles.submitButtonContainer}>
          <button className={styles.submitIssueButton}>Submit new issue</button>
        </div>
      </div>
      <Footer />
    </>
  );
});
